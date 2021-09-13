/* eslint-disable camelcase */
import {parseEther} from '@ethersproject/units'
import {SignerWithAddress} from '@nomiclabs/hardhat-ethers/signers'
import {expect} from 'chai'
import {ethers} from 'hardhat'
import {Collateral__factory, Collateral, METMock__factory, METMock} from '../typechain'

describe('Collateral', function () {
  let deployer: SignerWithAddress
  let user: SignerWithAddress
  let met: METMock
  let collateral: Collateral

  beforeEach(async function () {
    // eslint-disable-next-line @typescript-eslint/no-extra-semi
    ;[deployer, user] = await ethers.getSigners()

    const metMockFactory = new METMock__factory(deployer)
    met = await metMockFactory.deploy()
    await met.deployed()

    const collateralFactory = new Collateral__factory(deployer)
    collateral = await collateralFactory.deploy(met.address)
    await collateral.deployed()
  })

  describe('mint', function () {
    it('should mint', async function () {
      expect(await collateral.balanceOf(user.address)).to.eq(0)
      const amount = parseEther('100')
      await collateral.mint(user.address, amount)
      expect(await collateral.balanceOf(user.address)).to.eq(amount)
    })

    it('should revert if not owner', async function () {
      const tx = collateral.connect(user).mint(user.address, parseEther('10'))
      await expect(tx).to.revertedWith('Ownable: caller is not the owner')
    })
  })

  describe('when user has some balance', function () {
    const amount = parseEther('100')

    beforeEach(async function () {
      await collateral.mint(user.address, amount)
      expect(await collateral.balanceOf(user.address)).to.eq(amount)
    })

    describe('burn', function () {
      it('should burn', async function () {
        await collateral.burn(user.address, amount)
        expect(await collateral.balanceOf(user.address)).to.eq(0)
      })

      it('should revert if not owner', async function () {
        const tx = collateral.connect(user).burn(user.address, parseEther('10'))
        await expect(tx).to.revertedWith('Ownable: caller is not the owner')
      })
    })
  })
})
