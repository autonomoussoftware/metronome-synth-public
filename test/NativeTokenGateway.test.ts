import {SignerWithAddress} from '@nomiclabs/hardhat-ethers/signers'
import chai, {expect} from 'chai'
import {parseEther} from 'ethers/lib/utils'
import {ethers} from 'hardhat'
import {DepositToken, ERC20Mock, PoolMock, IWETH, MasterOracleMock, NativeTokenGateway, Treasury} from '../typechain'
import {disableForking, enableForking} from './helpers'
import Address from '../helpers/address'
import {toUSD} from '../helpers'
import {FakeContract, smock} from '@defi-wonderland/smock'
import {setStorageAt, setCode} from '@nomicfoundation/hardhat-network-helpers'

chai.use(smock.matchers)

const {NATIVE_TOKEN_ADDRESS} = Address

const {MaxUint256} = ethers.constants

describe('NativeTokenGateway', function () {
  let deployer: SignerWithAddress
  let user: SignerWithAddress
  let nativeToken: IWETH
  let msdNativeToken: DepositToken
  let treasury: Treasury
  let masterOracleMock: MasterOracleMock
  let poolRegistryMock: FakeContract
  let poolMock: PoolMock
  let nativeTokenGateway: NativeTokenGateway
  let tokenMock: ERC20Mock

  before(enableForking)

  after(disableForking)

  beforeEach(async function () {
    // eslint-disable-next-line @typescript-eslint/no-extra-semi
    ;[deployer, user] = await ethers.getSigners()

    nativeToken = await ethers.getContractAt('IWETH', NATIVE_TOKEN_ADDRESS, deployer)

    const masterOracleMockFactory = await ethers.getContractFactory('MasterOracleMock', deployer)
    masterOracleMock = await masterOracleMockFactory.deploy()
    await masterOracleMock.deployed()

    const depositTokenFactory = await ethers.getContractFactory('DepositToken', deployer)
    msdNativeToken = await depositTokenFactory.deploy()
    await msdNativeToken.deployed()
    await setStorageAt(msdNativeToken.address, 0, 0) // Undo initialization made by constructor

    const treasuryFactory = await ethers.getContractFactory('Treasury', deployer)
    treasury = await treasuryFactory.deploy()
    await treasury.deployed()
    await setStorageAt(treasury.address, 0, 0) // Undo initialization made by constructor

    poolRegistryMock = await smock.fake('PoolRegistry')
    await setCode(poolRegistryMock.address, '0x01') // Workaround "function call to a non-contract account" error
    poolRegistryMock.isPoolRegistered.returns(true)

    const esMET = await smock.fake('IESMET')

    const feeProviderFactory = await ethers.getContractFactory('FeeProvider', deployer)
    const feeProvider = await feeProviderFactory.deploy()
    await feeProvider.deployed()
    await setStorageAt(feeProvider.address, 0, 0) // Undo initialization made by constructor
    await feeProvider.initialize(poolRegistryMock.address, esMET.address)

    const poolMockFactory = await ethers.getContractFactory('PoolMock', deployer)
    poolMock = await poolMockFactory.deploy(
      msdNativeToken.address,
      masterOracleMock.address,
      ethers.constants.AddressZero,
      ethers.constants.AddressZero,
      ethers.constants.AddressZero,
      feeProvider.address
    )
    await poolMock.deployed()

    const nativeTokenGatewayFactory = await ethers.getContractFactory('NativeTokenGateway', deployer)
    nativeTokenGateway = await nativeTokenGatewayFactory.deploy(poolRegistryMock.address, NATIVE_TOKEN_ADDRESS)
    await nativeTokenGateway.deployed()

    await msdNativeToken.initialize(
      NATIVE_TOKEN_ADDRESS,
      poolMock.address,
      'Metronome Synth WETH-Deposit',
      'msdWETH',
      18,
      parseEther('0.5'),
      MaxUint256
    )

    const erc20MockFactory = await ethers.getContractFactory('ERC20Mock', deployer)
    tokenMock = await erc20MockFactory.deploy('Name', 'SYMBOL', 18)
    await tokenMock.deployed()

    await poolMock.updateTreasury(treasury.address)
    await masterOracleMock.updatePrice(NATIVE_TOKEN_ADDRESS, toUSD('1'))
    await treasury.initialize(poolMock.address)
  })

  it('should not receive ETH if sender is not WETH contract', async function () {
    const tx = deployer.sendTransaction({to: nativeTokenGateway.address, value: parseEther('1')})
    await expect(tx).reverted
  })

  describe('deposit', function () {
    it('should revert if pool is not registered', async function () {
      // given
      poolRegistryMock.isPoolRegistered.returns(false)

      // when
      const value = parseEther('1')
      const tx = nativeTokenGateway.connect(user).deposit(poolMock.address, {value})

      // then
      await expect(tx).revertedWithCustomError(nativeTokenGateway, 'UnregisteredPool')
    })

    it('should deposit ETH to Pool', async function () {
      // when
      const value = parseEther('1')
      const tx = () => nativeTokenGateway.connect(user).deposit(poolMock.address, {value})

      // then
      // Note: Each expect below re-runs the transaction (Refs: https://github.com/EthWorks/Waffle/issues/569)
      await expect(tx).changeEtherBalances([user, nativeToken], [value.mul('-1'), value])
      await expect(tx).changeTokenBalance(nativeToken, treasury, value)
      await expect(tx).changeTokenBalance(msdNativeToken, user, value)
    })

    it('should allow N deposits', async function () {
      // given
      const before = await ethers.provider.getBalance(user.address)

      // when
      const value = parseEther('1')
      await nativeTokenGateway.connect(user).deposit(poolMock.address, {value})
      await nativeTokenGateway.connect(user).deposit(poolMock.address, {value})

      // then
      const after = await ethers.provider.getBalance(user.address)
      expect(after).closeTo(before.sub(value.mul('2')), parseEther('0.1'))
    })
  })

  describe('withdraw', function () {
    beforeEach(async function () {
      const value = parseEther('100')
      await nativeTokenGateway.connect(user).deposit(poolMock.address, {value})
      await msdNativeToken.connect(user).approve(nativeTokenGateway.address, value)
    })

    it('should revert if pool is not registered', async function () {
      // given
      poolRegistryMock.isPoolRegistered.returns(false)

      // when
      const amount = parseEther('1')
      const tx = nativeTokenGateway.connect(user).withdraw(poolMock.address, amount)

      // then
      await expect(tx).revertedWithCustomError(nativeTokenGateway, 'UnregisteredPool')
    })

    it('should withdraw ETH from Pool', async function () {
      // when
      const amount = parseEther('1')
      const tx = () => nativeTokenGateway.connect(user).withdraw(poolMock.address, amount)

      // then
      // Note: Each expect below re-runs the transaction (Refs: https://github.com/EthWorks/Waffle/issues/569)
      await expect(tx).changeEtherBalances([nativeToken, user], [amount.mul('-1'), amount])
      await expect(tx).changeTokenBalance(nativeToken, treasury, amount.mul('-1'))
      await expect(tx).changeTokenBalance(msdNativeToken, user, amount.mul('-1'))
    })
  })
})
