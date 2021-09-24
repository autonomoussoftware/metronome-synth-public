/* eslint-disable camelcase */
import {parseEther} from '@ethersproject/units'
import {SignerWithAddress} from '@nomiclabs/hardhat-ethers/signers'
import {expect} from 'chai'
import {ethers} from 'hardhat'
import {DebtToken, DebtToken__factory} from '../typechain'

describe('DebtToken', function () {
  let mBoxMock: SignerWithAddress
  let user: SignerWithAddress
  let debtToken: DebtToken
  const name = 'mETH Debt'
  const symbol = 'mEth-Debt'

  beforeEach(async function () {
    // eslint-disable-next-line @typescript-eslint/no-extra-semi
    ;[mBoxMock, user] = await ethers.getSigners()

    const debtTokenFactory = new DebtToken__factory(mBoxMock)
    debtToken = await debtTokenFactory.deploy(name, symbol)
    await debtToken.deployed()

    await debtToken.setMBox(mBoxMock.address)
  })

  it('default values', async function () {
    expect(await debtToken.totalSupply()).to.eq(0)
    expect(await debtToken.name()).to.eq(name)
    expect(await debtToken.symbol()).to.eq(symbol)
    expect(await debtToken.decimals()).to.eq(18)
  })

  describe('mint', function () {
    it('should mint', async function () {
      expect(await debtToken.balanceOf(user.address)).to.eq(0)
      const amount = parseEther('100')
      await debtToken.mint(user.address, amount)
      expect(await debtToken.balanceOf(user.address)).to.eq(amount)
    })

    it('should revert if not mbox', async function () {
      const tx = debtToken.connect(user).mint(user.address, parseEther('10'))
      await expect(tx).to.revertedWith('not-mbox')
    })
  })

  describe('when some token was minted', function () {
    const amount = parseEther('100')

    beforeEach('should mint', async function () {
      await debtToken.mint(user.address, amount)
    })

    describe('burn', function () {
      it('should burn', async function () {
        expect(await debtToken.balanceOf(user.address)).to.eq(amount)
        await debtToken.burn(user.address, amount)
        expect(await debtToken.balanceOf(user.address)).to.eq(0)
      })

      it('should revert if not mbox', async function () {
        const tx = debtToken.connect(user).mint(user.address, parseEther('10'))
        await expect(tx).to.revertedWith('not-mbox')
      })
    })

    describe('transfer', function () {
      it('should revert when transfering', async function () {
        const tx = debtToken.transfer(mBoxMock.address, parseEther('1'))
        await expect(tx).to.revertedWith('non-transferable-token')
      })

      it('should revert when transfering to 0x0 address', async function () {
        const tx = debtToken.transfer(ethers.constants.AddressZero, parseEther('1'))
        await expect(tx).to.revertedWith('ERC20: transfer to the zero address')
      })
    })
  })
})
