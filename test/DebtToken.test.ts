/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable camelcase */
import {parseEther} from '@ethersproject/units'
import {SignerWithAddress} from '@nomiclabs/hardhat-ethers/signers'
import chai, {expect} from 'chai'
import {ethers} from 'hardhat'
import {
  DebtToken,
  DepositToken,
  ERC20Mock,
  MasterOracleMock,
  SyntheticToken,
  PoolMock__factory,
  FeeProvider,
  PoolMock,
} from '../typechain'
import {FakeContract, MockContract, smock} from '@defi-wonderland/smock'
import {BigNumber} from 'ethers'
import {toUSD} from '../helpers'
import {setBalance, time, loadFixture, setStorageAt} from '@nomicfoundation/hardhat-network-helpers'

chai.use(smock.matchers)

const {MaxUint256} = ethers.constants

let SECONDS_PER_YEAR: BigNumber

describe('DebtToken', function () {
  let deployer: SignerWithAddress
  let governor: SignerWithAddress
  let user1: SignerWithAddress
  let user2: SignerWithAddress
  let treasury: SignerWithAddress
  let feeCollector: SignerWithAddress
  let poolRegistryMock: FakeContract
  let poolMock: MockContract<PoolMock>
  let msUSD: SyntheticToken
  let met: ERC20Mock
  let msdMET: DepositToken
  let msUSDDebt: DebtToken
  let masterOracleMock: MasterOracleMock
  let rewardsDistributorMock: MockContract
  let feeProvider: FeeProvider

  const metCF = parseEther('0.5') // 50%
  const name = 'msETH Debt'
  const symbol = 'msETH-Debt'
  const interestRate = parseEther('0')

  async function fixture() {
    // eslint-disable-next-line @typescript-eslint/no-extra-semi
    ;[deployer, governor, user1, user2, treasury, feeCollector] = await ethers.getSigners()

    poolRegistryMock = await smock.fake('PoolRegistry')

    const syntheticTokenFactory = await ethers.getContractFactory('SyntheticToken', deployer)
    msUSD = await syntheticTokenFactory.deploy()
    await msUSD.deployed()
    // Note: Undo initialization made by constructor
    await setStorageAt(msUSD.address, 0, 0)

    const masterOracleMockFactory = await ethers.getContractFactory('MasterOracleMock', deployer)
    masterOracleMock = await masterOracleMockFactory.deploy()
    await masterOracleMock.deployed()

    const erc20MockFactory = await ethers.getContractFactory('ERC20Mock', deployer)
    met = await erc20MockFactory.deploy('Metronome', 'MET', 18)
    await met.deployed()

    const depositTokenFactory = await ethers.getContractFactory('DepositToken', deployer)
    msdMET = await depositTokenFactory.deploy()
    await msdMET.deployed()
    await setStorageAt(msdMET.address, 0, 0) // Undo initialization made by constructor

    const debtTokenFactory = await ethers.getContractFactory('DebtToken', deployer)
    msUSDDebt = await debtTokenFactory.deploy()
    await msUSDDebt.deployed()
    await setStorageAt(msUSDDebt.address, 0, 0) // Undo initialization made by constructor

    const esMET = await smock.fake('IESMET')

    const feeProviderFactory = await ethers.getContractFactory('FeeProvider', deployer)
    feeProvider = await feeProviderFactory.deploy()
    await feeProvider.deployed()
    await setStorageAt(feeProvider.address, 0, 0) // Undo initialization made by constructor
    await feeProvider.initialize(poolRegistryMock.address, esMET.address)

    const poolMockFactory = await smock.mock<PoolMock__factory>('PoolMock')
    poolMock = await poolMockFactory.deploy(
      msdMET.address,
      masterOracleMock.address,
      msUSD.address,
      msUSDDebt.address,
      poolRegistryMock.address,
      feeProvider.address
    )
    await poolMock.deployed()
    await poolMock.updateTreasury(treasury.address)
    await setBalance(poolMock.address, parseEther('10'))

    await msdMET.initialize(
      met.address,
      poolMock.address,
      'Metronome Synth MET-Deposit',
      'msdMET',
      18,
      metCF,
      MaxUint256
    )
    await msUSD.initialize('Metronome Synth ETH', 'msETH', 18, poolRegistryMock.address)
    await msUSDDebt.initialize(name, symbol, poolMock.address, msUSD.address, interestRate, MaxUint256)

    // eslint-disable-next-line new-cap
    SECONDS_PER_YEAR = await msUSDDebt.SECONDS_PER_YEAR()

    await masterOracleMock.updatePrice(msUSD.address, toUSD('1'))
    await masterOracleMock.updatePrice(met.address, toUSD('1'))

    poolRegistryMock.isPoolRegistered.returns((address: string) => address == poolMock.address)
    poolRegistryMock.governor.returns(governor.address)
    poolRegistryMock.feeCollector.returns(feeCollector.address)

    const rewardsDistributorMockFactory = await smock.mock('RewardsDistributor')
    rewardsDistributorMock = await rewardsDistributorMockFactory.deploy()
    rewardsDistributorMock.pool.returns(poolMock.address)

    poolMock.getRewardsDistributors.returns([rewardsDistributorMock.address])
  }

  beforeEach(async function () {
    await loadFixture(fixture)
  })

  it('default values', async function () {
    expect(await msUSDDebt.totalSupply()).eq(0)
    expect(await msUSDDebt.name()).eq(name)
    expect(await msUSDDebt.symbol()).eq(symbol)
    expect(await msUSDDebt.decimals()).eq(18)
  })

  describe('issue', function () {
    const depositAmount = parseEther('100')

    beforeEach(async function () {
      await met.mint(user1.address, parseEther('1000'))
      await met.connect(user1).approve(msdMET.address, ethers.constants.MaxUint256)
      await msdMET.connect(user1).deposit(depositAmount, user1.address)
    })

    it('should not revert if paused', async function () {
      // given
      await poolMock.pause()

      // when
      const toIssue = parseEther('0.1')
      const tx = msUSDDebt.connect(user1).issue(toIssue, user1.address)

      // then
      await expect(tx).emit(msUSDDebt, 'SyntheticTokenIssued')
    })

    it('should revert if shutdown', async function () {
      // given
      await poolMock.shutdown()

      // when
      const toIssue = parseEther('0.1')
      const tx = msUSDDebt.connect(user1).issue(toIssue, user1.address)

      // then
      await expect(tx).revertedWithCustomError(msUSDDebt, 'IsShutdown')
    })

    it('should revert if surpass max supply in usd', async function () {
      // given
      await msUSDDebt.updateMaxTotalSupply(parseEther('10'))

      // when
      const tx = msUSDDebt.connect(user1).issue(parseEther('11'), user1.address)

      // then
      await expect(tx).revertedWithCustomError(msUSDDebt, 'SurpassMaxDebtSupply')
    })

    it('should revert if synthetic does not exist', async function () {
      // given
      const syntheticTokenFactory = await ethers.getContractFactory('SyntheticToken', deployer)
      const notListedSynthetic = await syntheticTokenFactory.deploy()
      await notListedSynthetic.deployed()
      await setStorageAt(notListedSynthetic.address, 0, 0) // Undo initialization made by constructor
      await notListedSynthetic.initialize(name, symbol, 18, poolMock.address)

      const debtTokenFactory = await ethers.getContractFactory('DebtToken', deployer)
      const notListedDebtToken = await debtTokenFactory.deploy()
      await notListedDebtToken.deployed()
      await setStorageAt(notListedDebtToken.address, 0, 0) // Undo initialization made by constructor
      await notListedDebtToken.initialize(
        name,
        symbol,
        poolMock.address,
        notListedSynthetic.address,
        interestRate,
        MaxUint256
      )

      // when
      const toIssue = parseEther('1')
      const tx = notListedDebtToken.issue(toIssue, user1.address)

      // then
      await expect(tx).revertedWithCustomError(notListedDebtToken, 'SyntheticDoesNotExist')
    })

    it('should revert if synthetic is not active', async function () {
      // given
      await msUSD.connect(governor).toggleIsActive()

      // when
      const toIssue = parseEther('1')
      const tx = msUSDDebt.connect(user1).issue(toIssue, user1.address)

      // then
      await expect(tx).revertedWithCustomError(msUSDDebt, 'SyntheticIsInactive')
    })

    it('should revert if debt token is not active', async function () {
      // given
      await msUSDDebt.toggleIsActive()

      // when
      const toIssue = parseEther('1')
      const tx = msUSDDebt.connect(user1).issue(toIssue, user1.address)

      // then
      await expect(tx).revertedWithCustomError(msUSDDebt, 'DebtTokenInactive')
    })

    it('should revert if user1 has not enough collateral deposited', async function () {
      // when
      const toIssue = parseEther('1000000000000000')
      const tx = msUSDDebt.connect(user1).issue(toIssue, user1.address)

      // then
      await expect(tx).revertedWithCustomError(msUSDDebt, 'NotEnoughCollateral')
    })

    it('should revert if amount to issue is 0', async function () {
      // when
      const toIssue = 0
      const tx = msUSDDebt.connect(user1).issue(toIssue, user1.address)

      // then
      await expect(tx).revertedWithCustomError(msUSDDebt, 'AmountIsZero')
    })

    it('should revert if new debt < debt floor', async function () {
      // given
      await poolMock.updateDebtFloor(parseEther('10000')) // $10,000

      // when
      const toIssue = parseEther('1') // $4,000
      const tx = msUSDDebt.connect(user1).issue(toIssue, user1.address)

      // then
      await expect(tx).revertedWithCustomError(msUSDDebt, 'DebtLowerThanTheFloor')
    })

    it('should issue msAsset (issueFee == 0)', async function () {
      // when
      const toIssue = parseEther('1')
      const tx = () => msUSDDebt.connect(user1).issue(toIssue, user1.address)

      // then
      await expect(tx).changeTokenBalances(msUSDDebt, [user1], [toIssue])

      // Note: the calls below will make additional transfers
      await expect(tx).changeTokenBalances(msUSDDebt, [user1], [toIssue])
      await expect(tx).changeTokenBalances(met, [poolMock], [0])
      await expect(tx())
        .emit(msUSDDebt, 'SyntheticTokenIssued')
        .withArgs(user1.address, user1.address, toIssue, toIssue, 0)
    })

    it('should issue msAsset (issueFee > 0)', async function () {
      // given
      const issueFee = parseEther('0.1') // 10%
      await feeProvider.connect(governor).updateIssueFee(issueFee)

      // when
      const amount = parseEther('1')
      const {_amountToIssue, _fee: expectedFee} = await msUSDDebt.quoteIssueOut(amount)
      const {_amount} = await msUSDDebt.quoteIssueIn(_amountToIssue)
      expect(amount).eq(_amount)
      const tx = () => msUSDDebt.connect(user1).issue(amount, user1.address)
      await expect(tx).changeTokenBalances(msUSD, [user1, feeCollector], [_amountToIssue, expectedFee])

      // then
      // Note: the calls below will make additional transfers
      // See: https://github.com/EthWorks/Waffle/issues/569
      await expect(tx).changeTokenBalances(msUSDDebt, [user1], [amount])
      await expect(tx())
        .emit(msUSDDebt, 'SyntheticTokenIssued')
        .withArgs(user1.address, user1.address, amount, _amountToIssue, expectedFee)
    })

    it('should issue max issuable amount (issueFee == 0)', async function () {
      const {_issuableInUsd} = await poolMock.debtPositionOf(user1.address)
      const amount = await masterOracleMock.quoteUsdToToken(msUSD.address, _issuableInUsd)
      const {_amountToIssue} = await msUSDDebt.quoteIssueOut(amount)
      const {_amount} = await msUSDDebt.quoteIssueIn(_amountToIssue)
      expect(amount).eq(_amount)
      const tx = msUSDDebt.connect(user1).issue(amount, user1.address)
      await expect(tx).emit(msUSDDebt, 'SyntheticTokenIssued').withArgs(user1.address, user1.address, amount, amount, 0)
    })

    it('should issue max issuable amount (issueFee > 0)', async function () {
      // given
      const issueFee = parseEther('0.1') // 10%
      await feeProvider.connect(governor).updateIssueFee(issueFee)
      expect(await msUSDDebt.balanceOf(user1.address)).eq(0)

      const {_issuableInUsd} = await poolMock.debtPositionOf(user1.address)
      const amount = await masterOracleMock.quoteUsdToToken(msUSD.address, _issuableInUsd)
      const {_amountToIssue, _fee: expectedFee} = await msUSDDebt.quoteIssueOut(amount)
      const {_amount, _fee} = await msUSDDebt.quoteIssueIn(_amountToIssue)
      expect(amount).eq(_amount)
      expect(expectedFee).eq(_fee)

      const tx = msUSDDebt.connect(user1).issue(amount, user1.address)
      await expect(tx)
        .emit(msUSDDebt, 'SyntheticTokenIssued')
        .withArgs(user1.address, user1.address, amount, _amountToIssue, expectedFee)
      expect(await msUSD.balanceOf(user1.address)).eq(_amountToIssue)
    })

    describe('when user1 issue some msETH', function () {
      const userMintAmount = parseEther('1')

      beforeEach(async function () {
        await msUSDDebt.connect(user1).issue(userMintAmount, user1.address)
      })

      describe('repay', function () {
        it('should not revert if paused', async function () {
          // given
          await poolMock.pause()
          const amount = await msUSDDebt.balanceOf(user1.address)

          // when
          const tx = msUSDDebt.connect(user1).repay(user1.address, amount)

          // then
          await expect(tx).emit(msUSDDebt, 'DebtRepaid')
        })

        it('should revert if shutdown', async function () {
          // given
          await poolMock.shutdown()
          const amount = await msUSDDebt.balanceOf(user1.address)

          // when
          const tx = msUSDDebt.connect(user1).repay(user1.address, amount)

          // then
          await expect(tx).revertedWithCustomError(msUSDDebt, 'IsShutdown')
        })

        it('should revert if amount is 0', async function () {
          // when
          const tx = msUSDDebt.connect(user1).repay(user1.address, 0)

          // then
          await expect(tx).revertedWithCustomError(msUSDDebt, 'AmountIsZero')
        })

        it('should revert if amount > unlocked collateral amount', async function () {
          // given
          const amount = await msUSDDebt.balanceOf(user1.address)

          // when
          const tx = msUSDDebt.connect(user1).repay(user1.address, amount.add('1'))

          // then
          await expect(tx).revertedWithCustomError(msUSDDebt, 'BurnAmountExceedsBalance')
        })

        it('should revert if new debt < debt floor', async function () {
          // given
          await poolMock.updateDebtFloor(toUSD('3,000'))

          const amount = await msUSDDebt.balanceOf(user1.address)
          expect(amount).eq(parseEther('1'))

          // when
          const toRepay = amount.div('2')
          const tx = msUSDDebt.connect(user1).repay(user1.address, toRepay)

          // then
          await expect(tx).revertedWithCustomError(msUSDDebt, 'RemainingDebtIsLowerThanTheFloor')
        })

        it('should allow repay if new debt == 0', async function () {
          // given
          await poolMock.updateDebtFloor(toUSD('3,000'))
          const amount = await msUSDDebt.balanceOf(user1.address)

          // when
          await msUSDDebt.connect(user1).repay(user1.address, amount)

          // then
          const debtAfter = await poolMock.debtOf(user1.address)
          expect(debtAfter).eq(0)
        })

        it('should allow repay if new debt > debt floor', async function () {
          // given
          await poolMock.updateDebtFloor(toUSD('0.5'))
          expect(await msUSDDebt.balanceOf(user1.address)).eq(toUSD('1'))

          // when
          await msUSDDebt.connect(user1).repay(user1.address, toUSD('0.4'))

          // then
          expect(await poolMock.debtOf(user1.address)).eq(toUSD('0.6'))
        })

        it('should repay all debt (repayFee == 0)', async function () {
          // given
          const lockedCollateralBefore = await msdMET.lockedBalanceOf(user1.address)
          expect(lockedCollateralBefore).gt(0)
          const debtBefore = await msUSDDebt.balanceOf(user1.address)

          // when
          const {_amount: amountIn} = await msUSDDebt.quoteRepayIn(debtBefore)
          const tx = msUSDDebt.connect(user1).repay(user1.address, amountIn)
          await expect(tx).emit(msUSDDebt, 'DebtRepaid').withArgs(user1.address, user1.address, amountIn, amountIn, 0)

          // then
          const debtAfter = await msUSDDebt.balanceOf(user1.address)
          expect(debtAfter).eq(0)
          const lockedCollateralAfter = await msdMET.lockedBalanceOf(user1.address)
          expect(lockedCollateralAfter).eq(0)
        })

        it('should repay if amount < debt (repayFee == 0)', async function () {
          // given
          const lockedCollateralBefore = await msdMET.lockedBalanceOf(user1.address)
          expect(lockedCollateralBefore).gt(0)

          // when
          const amount = (await msUSDDebt.balanceOf(user1.address)).div('2')
          const tx = msUSDDebt.connect(user1).repay(user1.address, amount)
          await expect(tx).emit(msUSDDebt, 'DebtRepaid').withArgs(user1.address, user1.address, amount, amount, 0)

          // then
          expect(await msUSDDebt.balanceOf(user1.address)).eq(amount)
          const lockedDepositAfter = await msdMET.lockedBalanceOf(user1.address)
          expect(lockedDepositAfter).eq(lockedCollateralBefore.div('2'))
        })

        it('should repay if amount == debt (repayFee > 0)', async function () {
          // given
          const repayFee = parseEther('0.1') // 10%
          await feeProvider.connect(governor).updateRepayFee(repayFee)
          const {_debtInUsd: debtInUsdBefore} = await poolMock.debtPositionOf(user1.address)
          const msUsdBefore = await msUSD.balanceOf(user1.address)
          expect(msUsdBefore).eq(debtInUsdBefore)

          // when
          const amount = msUsdBefore
          const {_amountToRepay} = await msUSDDebt.quoteRepayOut(amount)
          const {_amount: amountIn, _fee: expectedFee} = await msUSDDebt.quoteRepayIn(_amountToRepay)
          expect(amount).eq(amountIn)

          const tx = msUSDDebt.connect(user1).repay(user1.address, amount)
          await expect(tx)
            .emit(msUSDDebt, 'DebtRepaid')
            .withArgs(user1.address, user1.address, amount, _amountToRepay, expectedFee)

          // then
          expect(await msUSD.balanceOf(user1.address)).eq(0)
          const {_debtInUsd: debtInUsdAfter} = await poolMock.debtPositionOf(user1.address)
          expect(debtInUsdAfter).eq(expectedFee)
        })

        it('should repay if amount < debt (repayFee > 0)', async function () {
          // given
          const repayFee = parseEther('0.1') // 10%
          await feeProvider.connect(governor).updateRepayFee(repayFee)
          const {_debtInUsd: debtInUsdBefore} = await poolMock.debtPositionOf(user1.address)
          const msUsdBefore = await msUSDDebt.balanceOf(user1.address)
          expect(msUsdBefore).eq(debtInUsdBefore)

          // when
          const halfBalance = msUsdBefore.div('2')
          const amount = halfBalance
          const {_amountToRepay} = await msUSDDebt.quoteRepayOut(amount)
          const {_amount: amountIn} = await msUSDDebt.quoteRepayIn(_amountToRepay)
          expect(amount).eq(amountIn)
          const expectedFee = amount.sub(_amountToRepay)
          const tx = msUSDDebt.connect(user1).repay(user1.address, amount)
          await expect(tx)
            .emit(msUSDDebt, 'DebtRepaid')
            .withArgs(user1.address, user1.address, amount, _amountToRepay, expectedFee)

          // then
          const msUsdAfter = await msUSD.balanceOf(user1.address)
          expect(msUsdAfter).eq(halfBalance)
          const {_debtInUsd: debtInUsdAfter} = await poolMock.debtPositionOf(user1.address)
          expect(debtInUsdAfter).eq(halfBalance.add(expectedFee))
        })

        it('should repay all debt (repayFee > 0)', async function () {
          // given
          const repayFee = parseEther('0.1') // 10%
          await feeProvider.connect(governor).updateRepayFee(repayFee)

          // sending extra msUSD to cover fee
          await met.mint(user2.address, parseEther('1000'))
          await met.connect(user2).approve(msdMET.address, ethers.constants.MaxUint256)
          await msdMET.connect(user2).deposit(depositAmount, user2.address)
          await msUSDDebt.connect(user2).issue(parseEther('1'), user1.address)

          const {_debtInUsd: debtBefore} = await poolMock.debtPositionOf(user1.address)
          expect(debtBefore).gt(0)

          // when
          const {_amount: amountIn} = await msUSDDebt.quoteRepayIn(debtBefore)
          await msUSDDebt.connect(user1).repay(user1.address, amountIn)

          // then
          const {_debtInUsd: debtAfter} = await poolMock.debtPositionOf(user1.address)
          expect(debtAfter).eq(0)
        })
      })

      describe('repayAll', function () {
        it('should not revert if paused', async function () {
          // given
          await poolMock.pause()

          // when
          const tx = msUSDDebt.connect(user1).repayAll(user1.address)

          // then
          await expect(tx).emit(msUSDDebt, 'DebtRepaid')
        })

        it('should revert if shutdown', async function () {
          // given
          await poolMock.shutdown()

          // when
          const tx = msUSDDebt.connect(user1).repayAll(user1.address)

          // then
          await expect(tx).revertedWithCustomError(msUSDDebt, 'IsShutdown')
        })

        it('should repay all debt (repayFee == 0)', async function () {
          // given
          const lockedCollateralBefore = await msdMET.lockedBalanceOf(user1.address)
          expect(lockedCollateralBefore).gt(0)

          // when
          const amount = await msUSDDebt.balanceOf(user1.address)
          const tx = msUSDDebt.connect(user1).repayAll(user1.address)
          await expect(tx).emit(msUSDDebt, 'DebtRepaid').withArgs(user1.address, user1.address, amount, amount, 0)

          // then
          expect(await msUSDDebt.balanceOf(user1.address)).eq(0)
          const lockedCollateralAfter = await msdMET.lockedBalanceOf(user1.address)
          expect(lockedCollateralAfter).eq(0)
        })

        it('should repay all debt (repayFee > 0)', async function () {
          // given
          const repayFee = parseEther('0.1') // 10%
          await feeProvider.connect(governor).updateRepayFee(repayFee)

          // sending extra msUSD to cover fee
          await met.mint(user2.address, parseEther('1000'))
          await met.connect(user2).approve(msdMET.address, ethers.constants.MaxUint256)
          await msdMET.connect(user2).deposit(depositAmount, user2.address)
          await msUSDDebt.connect(user2).issue(parseEther('1'), user1.address)

          const {_debtInUsd: debtBefore} = await poolMock.debtPositionOf(user1.address)
          expect(debtBefore).gt(0)

          // when
          await msUSDDebt.connect(user1).repayAll(user1.address)

          // then
          const {_debtInUsd: debtAfter} = await poolMock.debtPositionOf(user1.address)
          expect(debtAfter).eq(0)
        })
      })
    })
  })

  describe('when some synth was issued', function () {
    const amount = parseEther('100')

    beforeEach('should issue', async function () {
      const depositAmount = parseEther('1000')
      await met.mint(user1.address, depositAmount)
      await met.connect(user1).approve(msdMET.address, ethers.constants.MaxUint256)
      await msdMET.connect(user1).deposit(depositAmount, user1.address)
      await msUSDDebt.connect(user1).issue(amount, user1.address)
    })

    describe('burn', function () {
      it('should burn', async function () {
        expect(await msUSDDebt.balanceOf(user1.address)).eq(amount)

        await msUSDDebt.connect(poolMock.wallet).burn(user1.address, amount)

        expect(await msUSDDebt.balanceOf(user1.address)).eq(0)
      })

      it('should revert if not authorized', async function () {
        const tx = msUSDDebt.connect(user1).burn(user1.address, parseEther('10'))
        await expect(tx).revertedWithCustomError(msUSDDebt, 'SenderIsNotPool')
      })

      it('should not add address(0) to the users array', async function () {
        // given
        poolMock.addToDebtTokensOfAccount.reset()
        expect(await msUSDDebt.balanceOf(user1.address)).eq(amount)
        expect(await msUSDDebt.balanceOf(ethers.constants.AddressZero)).eq(0)

        // when
        // Note: Set `gasLimit` prevents messing up the calls counter
        // See more: https://github.com/defi-wonderland/smock/issues/99
        const gasLimit = 250000
        await msUSDDebt.connect(poolMock.wallet).burn(user1.address, amount, {gasLimit})

        // then
        expect(poolMock.addToDebtTokensOfAccount).callCount(0)
      })

      it('should remove debt token from user1 array only if burning all', async function () {
        // given
        poolMock.removeFromDebtTokensOfAccount.reset()
        expect(await msUSDDebt.balanceOf(user1.address)).eq(amount)

        // when
        // Note: Set `gasLimit` prevents messing up the calls counter
        // See more: https://github.com/defi-wonderland/smock/issues/99
        const gasLimit = 250000
        await msUSDDebt.connect(poolMock.wallet).burn(user1.address, amount.div('4'), {gasLimit})
        await msUSDDebt.connect(poolMock.wallet).burn(user1.address, amount.div('4'), {gasLimit})
        await msUSDDebt.connect(poolMock.wallet).burn(user1.address, amount.div('4'), {gasLimit})
        await msUSDDebt.connect(poolMock.wallet).burn(user1.address, amount.div('4'), {gasLimit})

        // then
        expect(await msUSDDebt.balanceOf(user1.address)).eq(0)
        expect(poolMock.removeFromDebtTokensOfAccount).callCount(1)
      })

      it('should trigger rewards update', async function () {
        // given
        rewardsDistributorMock.updateBeforeMintOrBurn.reset()

        // when
        await msUSDDebt.connect(poolMock.wallet).burn(user1.address, amount)

        // then
        // Note: Use `callCount` instead (Refs: https://github.com/defi-wonderland/smock/issues/85)
        expect(rewardsDistributorMock.updateBeforeMintOrBurn).called
        expect(rewardsDistributorMock.updateBeforeMintOrBurn.getCall(0).args[1]).eq(user1.address)
      })
    })

    describe('transfer', function () {
      it('should revert when transferring', async function () {
        const tx = msUSDDebt.transfer(user2.address, parseEther('1'))
        await expect(tx).revertedWithCustomError(msUSDDebt, 'TransferNotSupported')
      })
    })

    describe('transferFrom', function () {
      it('should revert when transferring', async function () {
        const tx = msUSDDebt.connect(user2).transferFrom(user1.address, user2.address, parseEther('1'))
        await expect(tx).revertedWithCustomError(msUSDDebt, 'TransferNotSupported')
      })
    })

    describe('allowance', function () {
      it('should revert when calling allowance', async function () {
        const call = msUSDDebt.connect(user2).allowance(user1.address, user2.address)
        await expect(call).revertedWithCustomError(msUSDDebt, 'AllowanceNotSupported')
      })
    })

    describe('approve', function () {
      it('should revert when approving', async function () {
        const tx = msUSDDebt.connect(user1).approve(user2.address, parseEther('1'))
        await expect(tx).revertedWithCustomError(msUSDDebt, 'ApprovalNotSupported')
      })
    })
  })

  describe('balanceOf & totalSupply - get updated values without calling accrueInterest()', function () {
    const principal = parseEther('100')

    beforeEach(async function () {
      const depositAmount = parseEther('1000')
      await met.mint(user1.address, depositAmount)
      await met.connect(user1).approve(msdMET.address, ethers.constants.MaxUint256)
      await msdMET.connect(user1).deposit(depositAmount, user1.address)
      // given
      await msUSDDebt.connect(user1).issue(principal, user1.address)
    })

    it('should get updated balance', async function () {
      // when
      await msUSDDebt.updateInterestRate(parseEther('0.02')) // 2%

      await time.increase(SECONDS_PER_YEAR)

      // then
      const debtOfUser = await msUSDDebt.balanceOf(user1.address)
      const totalDebt = await msUSDDebt.totalSupply()

      expect(debtOfUser).closeTo(parseEther('102'), parseEther('0.0001'))
      expect(totalDebt).eq(debtOfUser)
    })

    it('should not accrue interest if rate is 0', async function () {
      expect(await msUSDDebt.interestRate()).eq(0)

      // when
      await time.increase(SECONDS_PER_YEAR)

      // then
      const debtOfUser = await msUSDDebt.balanceOf(user1.address)
      const totalDebt = await msUSDDebt.totalSupply()

      expect(debtOfUser).eq(principal)
      expect(totalDebt).eq(debtOfUser)
    })

    it('should accrue interest after changing interest rate', async function () {
      // when
      // 1st year 10% interest + 2nd year 50% interest
      await msUSDDebt.updateInterestRate(parseEther('0.1')) // 10%
      await time.increase(SECONDS_PER_YEAR)

      await msUSDDebt.updateInterestRate(parseEther('0.5')) // 50%
      await time.increase(SECONDS_PER_YEAR)

      // then
      const debtOfUser = await msUSDDebt.balanceOf(user1.address)
      const totalDebt = await msUSDDebt.totalSupply()
      expect(debtOfUser).closeTo(parseEther('165'), parseEther('0.001'))
      expect(totalDebt).closeTo(debtOfUser, parseEther('0.00000001'))
    })

    it('should stop accruing interest after changing interest rate to 0', async function () {
      // when
      // 1st year 10% interest + 2nd year 0% interest
      await msUSDDebt.updateInterestRate(parseEther('0.1')) // 10%

      await time.increase(SECONDS_PER_YEAR)

      await msUSDDebt.updateInterestRate(parseEther('0'))

      await time.increase(SECONDS_PER_YEAR)

      // then
      const debtOfUser = await msUSDDebt.balanceOf(user1.address)
      const totalDebt = await msUSDDebt.totalSupply()

      expect(debtOfUser).closeTo(parseEther('110'), parseEther('0.1'))
      expect(totalDebt).eq(debtOfUser)
    })
  })

  describe('accrueInterest', function () {
    const principal = parseEther('100')

    beforeEach(async function () {
      const depositAmount = parseEther('5000')
      await met.mint(user1.address, depositAmount)
      await met.connect(user1).approve(msdMET.address, ethers.constants.MaxUint256)
      await msdMET.connect(user1).deposit(depositAmount, user1.address)
      // given
      await msUSDDebt.connect(user1).issue(principal, user1.address)
    })

    it('should accrue interest', async function () {
      // when
      await msUSDDebt.updateInterestRate(parseEther('0.02')) // 2%
      await time.increase(SECONDS_PER_YEAR)
      await msUSDDebt.accrueInterest()

      // then
      const totalDebt = await msUSDDebt.totalSupply()
      expect(totalDebt).closeTo(parseEther('102'), parseEther('0.0001'))
    })

    it('should not accrue interest if rate is 0', async function () {
      // given
      expect(await msUSDDebt.interestRate()).eq(0)

      // when
      await time.increase(SECONDS_PER_YEAR)
      await msUSDDebt.accrueInterest()

      // then
      const totalDebt = await msUSDDebt.totalSupply()
      expect(totalDebt).eq(principal)
    })

    it('should accrue interest after changing interest rate', async function () {
      // when
      // 1st year 10% interest + 2nd year 50% interest
      await msUSDDebt.updateInterestRate(parseEther('0.1')) // 10%
      await time.increase(SECONDS_PER_YEAR)
      await msUSDDebt.accrueInterest()

      await msUSDDebt.updateInterestRate(parseEther('0.5')) // 50%
      await time.increase(SECONDS_PER_YEAR)
      await msUSDDebt.accrueInterest()

      // then
      const totalDebt = await msUSDDebt.totalSupply()
      expect(totalDebt).closeTo(parseEther('165'), parseEther('0.001'))
    })

    it('should stop accruing interest after changing interest rate to 0', async function () {
      // when
      // 1st year 10% interest + 2nd year 0% interest
      await msUSDDebt.updateInterestRate(parseEther('0.1')) // 10%
      await time.increase(SECONDS_PER_YEAR)
      await msUSDDebt.accrueInterest()

      await msUSDDebt.updateInterestRate(parseEther('0'))
      await time.increase(SECONDS_PER_YEAR)
      await msUSDDebt.accrueInterest()

      // then
      const totalDebt = await msUSDDebt.totalSupply()
      expect(totalDebt).closeTo(parseEther('110'), parseEther('0.1'))
    })

    it('should not accrue interest backwards after changing interest rate from 0', async function () {
      // given
      expect(await msUSDDebt.interestRate()).eq(0)

      // when
      // 1st year 0% interest + 2nd year 10% interest
      await time.increase(SECONDS_PER_YEAR)
      await msUSDDebt.accrueInterest()

      await msUSDDebt.updateInterestRate(parseEther('0.1')) // 10%
      await time.increase(SECONDS_PER_YEAR)
      await msUSDDebt.accrueInterest()

      // then
      const totalDebt = await msUSDDebt.totalSupply()
      expect(totalDebt).closeTo(parseEther('110'), parseEther('0.1'))
    })

    it('should mint accrued fee to feeCollector', async function () {
      // given
      await msUSDDebt.updateInterestRate(parseEther('0.1')) // 10%
      await time.increase(SECONDS_PER_YEAR)
      // when
      await msUSDDebt.accrueInterest()

      // then
      const totalCredit = await msUSD.totalSupply()
      const totalDebt = await msUSDDebt.totalSupply()
      const debtOfUser = await msUSDDebt.balanceOf(user1.address)
      const creditOfUser = await msUSD.balanceOf(user1.address)
      const creditOfFeeCollector = await msUSD.balanceOf(feeCollector.address)
      expect(totalDebt).closeTo(parseEther('110'), parseEther('0.01'))
      expect(totalCredit).eq(totalDebt)
      expect(totalDebt).closeTo(debtOfUser, parseEther('0.000001'))
      expect(creditOfUser).eq(principal)
      expect(totalCredit).eq(creditOfUser.add(creditOfFeeCollector))
    })

    describe('when synthetic token minting fails', function () {
      beforeEach(async function () {
        // given
        await msUSDDebt.updateInterestRate(parseEther('0.02')) // 2%
        await time.increase(SECONDS_PER_YEAR)
      })

      it('should accumulate pending fee when synthetic token is inactive', async function () {
        // given
        await msUSD.connect(governor).toggleIsActive()
        expect(await msUSD.isActive()).false
        expect(await msUSDDebt.pendingInterestFee()).eq(0)

        // when
        await msUSDDebt.accrueInterest()

        // then
        expect(await msUSDDebt.pendingInterestFee()).gt(0)
        const totalDebt = await msUSDDebt.totalSupply()
        expect(totalDebt).closeTo(parseEther('102'), parseEther('0.0001'))
      })

      it('should accumulate pending fee when synthetic token supply reached max', async function () {
        // given
        await msUSD.connect(governor).updateMaxTotalSupply(0)
        expect(await msUSD.maxTotalSupply()).eq(0)
        expect(await msUSDDebt.pendingInterestFee()).eq(0)

        // when
        await msUSDDebt.accrueInterest()

        // then
        expect(await msUSDDebt.pendingInterestFee()).gt(0)
        const totalDebt = await msUSDDebt.totalSupply()
        expect(totalDebt).closeTo(parseEther('102'), parseEther('0.0001'))
      })
    })

    describe('should accrue correctly when issuing/repaying successively', function () {
      const dust = '1000'

      beforeEach(async function () {
        expect(await msUSD.balanceOf(user1.address)).eq(parseEther('100'))
        expect(await msUSDDebt.balanceOf(user1.address)).eq(parseEther('100'))
        await msUSDDebt.updateInterestRate(parseEther('0.1')) // 10%
      })

      it('calling accrueInterest', async function () {
        // given
        await time.increase(time.duration.years(1))
        await msUSDDebt.accrueInterest()
        expect(await msUSD.balanceOf(user1.address)).eq(parseEther('100'))
        expect(await msUSDDebt.balanceOf(user1.address)).closeTo(parseEther('110'), parseEther('1'))
        expect(await msUSDDebt.totalSupply()).eq(await msUSDDebt.balanceOf(user1.address))

        // when
        // 2nd issuance
        await msUSDDebt.connect(user1).issue(parseEther('100'), user1.address)
        expect(await msUSD.balanceOf(user1.address)).eq(parseEther('200'))
        expect(await msUSDDebt.balanceOf(user1.address)).closeTo(parseEther('210'), parseEther('1'))
        expect(await msUSDDebt.totalSupply()).closeTo(await msUSDDebt.balanceOf(user1.address), dust)
        await time.increase(time.duration.years(1))
        await msUSDDebt.accrueInterest()
        expect(await msUSD.balanceOf(user1.address)).eq(parseEther('200'))
        expect(await msUSDDebt.balanceOf(user1.address)).closeTo(parseEther('231'), parseEther('1'))
        expect(await msUSDDebt.totalSupply()).closeTo(await msUSDDebt.balanceOf(user1.address), dust)
        // 1st repayment
        await msUSDDebt.connect(user1).repay(user1.address, parseEther('100'))
        expect(await msUSD.balanceOf(user1.address)).eq(parseEther('100'))
        expect(await msUSDDebt.balanceOf(user1.address)).closeTo(parseEther('131'), parseEther('1'))
        expect(await msUSDDebt.totalSupply()).closeTo(await msUSDDebt.balanceOf(user1.address), dust)
        await time.increase(time.duration.years(1))
        await msUSDDebt.accrueInterest()
        expect(await msUSD.balanceOf(user1.address)).eq(parseEther('100'))
        expect(await msUSDDebt.balanceOf(user1.address)).closeTo(parseEther('144'), parseEther('1'))
        expect(await msUSDDebt.totalSupply()).closeTo(await msUSDDebt.balanceOf(user1.address), dust)
        // 2nd repayment
        await msUSDDebt.connect(user1).repay(user1.address, parseEther('50'))
        expect(await msUSD.balanceOf(user1.address)).eq(parseEther('50'))
        expect(await msUSDDebt.balanceOf(user1.address)).closeTo(parseEther('94'), parseEther('1'))
        expect(await msUSDDebt.totalSupply()).closeTo(await msUSDDebt.balanceOf(user1.address), dust)
        await time.increase(time.duration.years(1))
        await msUSDDebt.accrueInterest()
        expect(await msUSD.balanceOf(user1.address)).eq(parseEther('50'))
        expect(await msUSDDebt.balanceOf(user1.address)).closeTo(parseEther('103'), parseEther('1'))
        expect(await msUSDDebt.totalSupply()).closeTo(await msUSDDebt.balanceOf(user1.address), dust)
        // 3rd repayment (all)
        const {_amount: repayAllAmount} = await msUSDDebt.quoteRepayIn(await msUSDDebt.balanceOf(user1.address))
        await met.mint(user2.address, parseEther('1000'))
        await met.connect(user2).approve(msdMET.address, ethers.constants.MaxUint256)
        await msdMET.connect(user2).deposit(parseEther('1000'), user2.address)

        await msUSDDebt.connect(user2).issue(repayAllAmount, user1.address)
        await msUSDDebt.connect(user1).repayAll(user1.address)
        expect(await msUSDDebt.balanceOf(user1.address)).eq(0)
        expect(await msUSDDebt.totalSupply()).closeTo(await msUSDDebt.balanceOf(user2.address), dust)
      })

      it('without calling accrueInterest', async function () {
        // given
        await time.increase(time.duration.years(1))
        await msUSDDebt.accrueInterest()
        expect(await msUSD.balanceOf(user1.address)).eq(parseEther('100'))
        expect(await msUSDDebt.balanceOf(user1.address)).closeTo(parseEther('110'), parseEther('1'))
        expect(await msUSDDebt.totalSupply()).eq(await msUSDDebt.balanceOf(user1.address))

        // when
        // 2nd issuance
        await msUSDDebt.connect(user1).issue(parseEther('100'), user1.address)
        expect(await msUSD.balanceOf(user1.address)).eq(parseEther('200'))
        expect(await msUSDDebt.balanceOf(user1.address)).closeTo(parseEther('210'), parseEther('1'))
        expect(await msUSDDebt.totalSupply()).closeTo(await msUSDDebt.balanceOf(user1.address), dust)
        await time.increase(time.duration.years(1))
        expect(await msUSD.balanceOf(user1.address)).eq(parseEther('200'))
        expect(await msUSDDebt.balanceOf(user1.address)).closeTo(parseEther('231'), parseEther('1'))
        expect(await msUSDDebt.totalSupply()).closeTo(await msUSDDebt.balanceOf(user1.address), dust)
        // 1st repayment
        await msUSDDebt.connect(user1).repay(user1.address, parseEther('100'))
        expect(await msUSD.balanceOf(user1.address)).eq(parseEther('100'))
        expect(await msUSDDebt.balanceOf(user1.address)).closeTo(parseEther('131'), parseEther('1'))
        expect(await msUSDDebt.totalSupply()).closeTo(await msUSDDebt.balanceOf(user1.address), dust)
        await time.increase(time.duration.years(1))
        expect(await msUSD.balanceOf(user1.address)).eq(parseEther('100'))
        expect(await msUSDDebt.balanceOf(user1.address)).closeTo(parseEther('144'), parseEther('1'))
        expect(await msUSDDebt.totalSupply()).closeTo(await msUSDDebt.balanceOf(user1.address), dust)
        // 2nd repayment
        await msUSDDebt.connect(user1).repay(user1.address, parseEther('50'))
        expect(await msUSD.balanceOf(user1.address)).eq(parseEther('50'))
        expect(await msUSDDebt.balanceOf(user1.address)).closeTo(parseEther('94'), parseEther('1'))
        expect(await msUSDDebt.totalSupply()).closeTo(await msUSDDebt.balanceOf(user1.address), dust)
        await time.increase(time.duration.years(1))
        expect(await msUSD.balanceOf(user1.address)).eq(parseEther('50'))
        expect(await msUSDDebt.balanceOf(user1.address)).closeTo(parseEther('103'), parseEther('1'))
        expect(await msUSDDebt.totalSupply()).closeTo(await msUSDDebt.balanceOf(user1.address), dust)
        // 3rd repayment (all)
        const {_amount: repayAllAmount} = await msUSDDebt.quoteRepayIn(await msUSDDebt.balanceOf(user1.address))
        await met.mint(user2.address, parseEther('1000'))
        await met.connect(user2).approve(msdMET.address, ethers.constants.MaxUint256)
        await msdMET.connect(user2).deposit(parseEther('1000'), user2.address)
        await msUSDDebt.connect(user2).issue(repayAllAmount, user1.address)
        await msUSDDebt.connect(user1).repayAll(user1.address)
        expect(await msUSDDebt.balanceOf(user1.address)).eq(0)
        expect(await msUSDDebt.totalSupply()).closeTo(await msUSDDebt.balanceOf(user2.address), dust)
      })
    })
  })

  describe('updateMaxTotalSupply', function () {
    it('should update collateral factor', async function () {
      const before = await msUSDDebt.maxTotalSupply()
      const after = before.div('2')
      const tx = msUSDDebt.updateMaxTotalSupply(after)
      await expect(tx).emit(msUSDDebt, 'MaxTotalSupplyUpdated').withArgs(before, after)
      expect(await msUSDDebt.maxTotalSupply()).eq(after)
    })

    it('should revert if using the current value', async function () {
      const currentMaxTotalSupply = await msUSDDebt.maxTotalSupply()
      const tx = msUSDDebt.updateMaxTotalSupply(currentMaxTotalSupply)
      await expect(tx).revertedWithCustomError(msUSDDebt, 'NewValueIsSameAsCurrent')
    })

    it('should revert if not governor', async function () {
      const tx = msUSDDebt.connect(user1).updateMaxTotalSupply(parseEther('10'))
      await expect(tx).revertedWithCustomError(msUSDDebt, 'SenderIsNotGovernor')
    })
  })

  describe('updateInterestRate', function () {
    it('should update interest rate', async function () {
      const before = await msUSDDebt.interestRate()
      const after = parseEther('0.5')
      const tx = msUSDDebt.updateInterestRate(after)
      await expect(tx).emit(msUSDDebt, 'InterestRateUpdated').withArgs(before, after)
      expect(await msUSDDebt.interestRate()).eq(after)
    })

    it('should revert if using the current value', async function () {
      const currentInterestRate = await msUSDDebt.interestRate()
      const tx = msUSDDebt.updateInterestRate(currentInterestRate)
      await expect(tx).revertedWithCustomError(msUSDDebt, 'NewValueIsSameAsCurrent')
    })

    it('should revert if not governor', async function () {
      const tx = msUSDDebt.connect(user1).updateInterestRate(parseEther('0.12'))
      await expect(tx).revertedWithCustomError(msUSDDebt, 'SenderIsNotGovernor')
    })
  })

  describe('toggleIsActive', function () {
    it('should toggle isActive flag', async function () {
      const before = await msUSDDebt.isActive()
      const after = !before
      const tx = msUSDDebt.toggleIsActive()
      await expect(tx).emit(msUSDDebt, 'DebtTokenActiveUpdated').withArgs(after)
      expect(await msUSDDebt.isActive()).eq(after)
    })

    it('should revert if not governor', async function () {
      const tx = msUSDDebt.connect(user1).toggleIsActive()
      await expect(tx).revertedWithCustomError(msUSDDebt, 'SenderIsNotGovernor')
    })
  })
})
