/* eslint-disable camelcase */
import {parseEther} from '@ethersproject/units'
import {SignerWithAddress} from '@nomiclabs/hardhat-ethers/signers'
import chai, {expect} from 'chai'
import {ethers} from 'hardhat'
import {
  DepositToken__factory,
  DepositToken,
  ERC20Mock__factory,
  ERC20Mock,
  OracleMock__factory,
  OracleMock,
} from '../typechain'
import {HOUR, setEtherBalance} from './helpers'
import {FakeContract, smock} from '@defi-wonderland/smock'

chai.use(smock.matchers)

describe('DepositToken', function () {
  let deployer: SignerWithAddress
  let governor: SignerWithAddress
  let user: SignerWithAddress
  let met: ERC20Mock
  let controllerMock: FakeContract
  let metDepositToken: DepositToken
  let oracle: OracleMock

  const metRate = parseEther('4') // 1 MET = $4

  // Note: I was not able to use an async function in order to return dynamic value
  // As workaround I've created this function to avoid duplication
  // See more: https://github.com/defi-wonderland/smock/issues/107
  const buildReturn_debtPositionOf = async (account: string) => {
    const deposit = await metDepositToken.balanceOf(account)
    const _depositInUsd = await oracle.convertToUsd(metDepositToken.address, deposit)

    return () => {
      const _isHealth = true
      const _lockedDepositInUsd = 0
      const _unlockedDepositInUsd = _depositInUsd.sub(_lockedDepositInUsd)
      return [_isHealth, _lockedDepositInUsd, _depositInUsd, _unlockedDepositInUsd]
    }
  }

  beforeEach(async function () {
    // eslint-disable-next-line @typescript-eslint/no-extra-semi
    ;[deployer, governor, user] = await ethers.getSigners()

    const oracleMock = new OracleMock__factory(deployer)
    oracle = <OracleMock>await oracleMock.deploy()
    await oracle.deployed()

    const metMockFactory = new ERC20Mock__factory(deployer)
    met = await metMockFactory.deploy('Metronome', 'MET', 18)
    await met.deployed()

    const depositTokenFactory = new DepositToken__factory(deployer)
    metDepositToken = await depositTokenFactory.deploy()
    await metDepositToken.deployed()

    controllerMock = await smock.fake('Controller')
    await setEtherBalance(controllerMock.address, parseEther('10'))
    controllerMock.oracle.returns(oracle.address)
    controllerMock.governor.returns(governor.address)

    await metDepositToken.initialize(met.address, controllerMock.address, 'vSynth-MET', 18)
    metDepositToken = metDepositToken.connect(governor)

    await oracle.updateRate(metDepositToken.address, metRate)
  })

  describe('mint', function () {
    it('should mint', async function () {
      // given
      expect(await metDepositToken.balanceOf(user.address)).eq(0)
      expect(await metDepositToken.lastDepositOf(user.address)).eq(0)

      // when
      const amount = parseEther('100')
      await metDepositToken.connect(controllerMock.wallet).mint(user.address, amount)

      // then
      expect(await metDepositToken.balanceOf(user.address)).eq(amount)
      const lastBlock = await ethers.provider.getBlock('latest')
      expect(await metDepositToken.lastDepositOf(user.address)).eq(lastBlock.timestamp)
    })

    it('should add deposit token to user array only if balance was 0 before mint', async function () {
      // given
      controllerMock.addToDepositTokensOfAccount.reset()
      expect(await metDepositToken.balanceOf(user.address)).eq(0)

      // when
      // Note: Set `gasLimit` prevents messing up the calls counter
      // See more: https://github.com/defi-wonderland/smock/issues/99
      const gasLimit = 250000
      await metDepositToken.connect(controllerMock.wallet).mint(user.address, parseEther('1'), {gasLimit})
      await metDepositToken.connect(controllerMock.wallet).mint(user.address, parseEther('1'), {gasLimit})
      await metDepositToken.connect(controllerMock.wallet).mint(user.address, parseEther('1'), {gasLimit})

      // then
      expect(controllerMock.addToDepositTokensOfAccount).callCount(1)
    })

    it('should revert if surpass max total supply', async function () {
      // given
      expect(await metDepositToken.totalSupply()).eq(0)
      const maxInUsd = parseEther('400') // 100 MET
      await metDepositToken.updateMaxTotalSupplyInUsd(maxInUsd)

      // when
      const amount = parseEther('101') // $404
      const tx = metDepositToken.connect(controllerMock.wallet).mint(user.address, amount)

      // then
      await expect(tx).revertedWith('surpass-max-total-supply')
    })

    it('should revert if not controller', async function () {
      const tx = metDepositToken.connect(user).mint(user.address, parseEther('10'))
      await expect(tx).revertedWith('not-controller')
    })
  })

  describe('when user has some balance', function () {
    const amount = parseEther('100')

    beforeEach(async function () {
      await metDepositToken.connect(controllerMock.wallet).mint(user.address, amount)
      expect(await metDepositToken.balanceOf(user.address)).eq(amount)
    })

    describe('burnForWithdraw', function () {
      it('should revert if not controller', async function () {
        const tx = metDepositToken.connect(user).burnForWithdraw(user.address, parseEther('10'))
        await expect(tx).revertedWith('not-controller')
      })

      it('should revert if minimum deposit time have not passed', async function () {
        // given
        await metDepositToken.connect(governor).updateMinDepositTime(HOUR)

        // when
        controllerMock.debtPositionOf.returns(await buildReturn_debtPositionOf(user.address))
        const tx = metDepositToken.connect(controllerMock.wallet).burnForWithdraw(user.address, parseEther('10'))

        // then
        await expect(tx).revertedWith('min-deposit-time-have-not-passed')
      })

      it('should revert if amount > free amount', async function () {
        // given
        controllerMock.debtPositionOf.returns(await buildReturn_debtPositionOf(user.address))
        const {_unlockedDepositInUsd} = await controllerMock.debtPositionOf(user.address)
        const _unlockedDeposit = await oracle.convertFromUsd(metDepositToken.address, _unlockedDepositInUsd)

        // when
        const tx = metDepositToken
          .connect(controllerMock.wallet)
          .burnForWithdraw(user.address, _unlockedDeposit.add('1'))

        // then
        await expect(tx).revertedWith('not-enough-free-balance')
      })

      it('should burn if amount <= free amount', async function () {
        // given
        controllerMock.debtPositionOf.returns(await buildReturn_debtPositionOf(user.address))
        const {_unlockedDepositInUsd} = await controllerMock.debtPositionOf(user.address)
        const _unlockedDeposit = await oracle.convertFromUsd(metDepositToken.address, _unlockedDepositInUsd)
        expect(await metDepositToken.balanceOf(user.address)).eq(amount)

        // when
        await metDepositToken.connect(controllerMock.wallet).burnForWithdraw(user.address, _unlockedDeposit)

        // then
        expect(await metDepositToken.balanceOf(user.address)).eq(amount.sub(_unlockedDeposit))
      })
    })

    describe('burn', function () {
      it('should burn', async function () {
        await metDepositToken.connect(controllerMock.wallet).burn(user.address, amount)
        expect(await metDepositToken.balanceOf(user.address)).eq(0)
      })

      it('should revert if not controller', async function () {
        const tx = metDepositToken.connect(user).burn(user.address, parseEther('10'))
        await expect(tx).revertedWith('not-controller')
      })

      it('should remove deposit token from user array only if burning all', async function () {
        // given
        controllerMock.removeFromDepositTokensOfAccount.reset()
        expect(await metDepositToken.balanceOf(user.address)).eq(amount)

        // when
        // Note: Set `gasLimit` prevents messing up the calls counter
        // See more: https://github.com/defi-wonderland/smock/issues/99
        const gasLimit = 250000
        await metDepositToken.connect(controllerMock.wallet).burn(user.address, amount.div('4'), {gasLimit})
        await metDepositToken.connect(controllerMock.wallet).burn(user.address, amount.div('4'), {gasLimit})
        await metDepositToken.connect(controllerMock.wallet).burn(user.address, amount.div('4'), {gasLimit})
        await metDepositToken.connect(controllerMock.wallet).burn(user.address, amount.div('4'), {gasLimit})

        // then
        expect(await metDepositToken.balanceOf(user.address)).eq(0)
        expect(controllerMock.removeFromDepositTokensOfAccount).callCount(1)
      })
    })

    describe('transfer', function () {
      it('should transfer if amount <= free amount', async function () {
        controllerMock.debtPositionOf.returns(await buildReturn_debtPositionOf(user.address))
        const {_unlockedDepositInUsd} = await controllerMock.debtPositionOf(user.address)
        const _unlockedDeposit = await oracle.convertFromUsd(metDepositToken.address, _unlockedDepositInUsd)
        expect(await metDepositToken.balanceOf(user.address)).eq(amount)
        await metDepositToken.connect(user).transfer(deployer.address, _unlockedDeposit)
        expect(await metDepositToken.balanceOf(user.address)).eq(amount.sub(_unlockedDeposit))
      })

      it('should revert if minimum deposit time have not passed', async function () {
        // given
        await metDepositToken.connect(governor).updateMinDepositTime(HOUR)

        // when
        controllerMock.debtPositionOf.returns(await buildReturn_debtPositionOf(user.address))
        const {_unlockedDepositInUsd} = await controllerMock.debtPositionOf(user.address)
        const _unlockedDeposit = await oracle.convertFromUsd(metDepositToken.address, _unlockedDepositInUsd)
        const tx = metDepositToken.connect(user).transfer(deployer.address, _unlockedDeposit)

        // then
        await expect(tx).revertedWith('min-deposit-time-have-not-passed')
      })

      it('should revert if amount > free amount', async function () {
        controllerMock.debtPositionOf.returns(await buildReturn_debtPositionOf(user.address))
        const {_unlockedDepositInUsd} = await controllerMock.debtPositionOf(user.address)
        const _unlockedDeposit = await oracle.convertFromUsd(metDepositToken.address, _unlockedDepositInUsd)
        const tx = metDepositToken.connect(user).transfer(deployer.address, _unlockedDeposit.add('1'))
        await expect(tx).revertedWith('not-enough-free-balance')
      })

      // eslint-disable-next-line quotes
      it("should add and remove deposit token from users' arrays only once", async function () {
        // given
        controllerMock.addToDepositTokensOfAccount.reset()
        controllerMock.removeFromDepositTokensOfAccount.reset()
        expect(await metDepositToken.balanceOf(deployer.address)).eq(0)
        expect(await metDepositToken.balanceOf(user.address)).eq(amount)

        // when
        // Note: Set `gasLimit` prevents messing up the calls counter
        // See more: https://github.com/defi-wonderland/smock/issues/99
        const gasLimit = 250000

        controllerMock.debtPositionOf.returns(await buildReturn_debtPositionOf(user.address))
        await metDepositToken.connect(user).transfer(deployer.address, amount.div('4'), {gasLimit})

        controllerMock.debtPositionOf.returns(await buildReturn_debtPositionOf(user.address))
        await metDepositToken.connect(user).transfer(deployer.address, amount.div('4'), {gasLimit})

        controllerMock.debtPositionOf.returns(await buildReturn_debtPositionOf(user.address))
        await metDepositToken.connect(user).transfer(deployer.address, amount.div('4'), {gasLimit})

        controllerMock.debtPositionOf.returns(await buildReturn_debtPositionOf(user.address))
        await metDepositToken.connect(user).transfer(deployer.address, amount.div('4'), {gasLimit})

        // then
        expect(await metDepositToken.balanceOf(user.address)).eq(0)
        expect(await metDepositToken.balanceOf(deployer.address)).eq(amount)
        expect(controllerMock.addToDepositTokensOfAccount).callCount(1)
        expect(controllerMock.addToDepositTokensOfAccount).calledWith(deployer.address)

        expect(controllerMock.removeFromDepositTokensOfAccount).callCount(1)
        expect(controllerMock.removeFromDepositTokensOfAccount).calledWith(user.address)
      })
    })

    describe('transferFrom', function () {
      beforeEach(async function () {
        await metDepositToken.connect(user).approve(deployer.address, ethers.constants.MaxUint256)
      })

      it('should transfer if amount <= free amount', async function () {
        controllerMock.debtPositionOf.returns(await buildReturn_debtPositionOf(user.address))
        const {_unlockedDepositInUsd} = await controllerMock.debtPositionOf(user.address)
        const _unlockedDeposit = await oracle.convertFromUsd(metDepositToken.address, _unlockedDepositInUsd)
        expect(await metDepositToken.balanceOf(user.address)).eq(amount)
        await metDepositToken.connect(deployer).transferFrom(user.address, deployer.address, _unlockedDeposit)
        expect(await metDepositToken.balanceOf(user.address)).eq(amount.sub(_unlockedDeposit))
      })

      it('should revert if minimum deposit time have not passed', async function () {
        // given
        await metDepositToken.connect(governor).updateMinDepositTime(HOUR)

        // when
        controllerMock.debtPositionOf.returns(await buildReturn_debtPositionOf(user.address))
        const {_unlockedDepositInUsd} = await controllerMock.debtPositionOf(user.address)
        const _unlockedDeposit = await oracle.convertFromUsd(metDepositToken.address, _unlockedDepositInUsd)
        const tx = metDepositToken.connect(deployer).transferFrom(user.address, deployer.address, _unlockedDeposit)

        // then
        await expect(tx).revertedWith('min-deposit-time-have-not-passed')
      })

      it('should revert if amount > free amount', async function () {
        controllerMock.debtPositionOf.returns(await buildReturn_debtPositionOf(user.address))
        const {_unlockedDepositInUsd} = await controllerMock.debtPositionOf(user.address)
        const _unlockedDeposit = await oracle.convertFromUsd(metDepositToken.address, _unlockedDepositInUsd)
        const tx = metDepositToken
          .connect(deployer)
          .transferFrom(user.address, deployer.address, _unlockedDeposit.add('1'))
        await expect(tx).revertedWith('not-enough-free-balance')
      })
    })

    describe('seize', function () {
      it('should revert if not controller', async function () {
        const tx = metDepositToken.connect(user).seize(user.address, deployer.address, parseEther('10'))
        await expect(tx).revertedWith('not-controller')
      })

      it('should seize tokens', async function () {
        const amountToSeize = parseEther('10')

        const tx = () =>
          metDepositToken.connect(controllerMock.wallet).seize(user.address, deployer.address, amountToSeize)

        await expect(tx).changeTokenBalances(
          metDepositToken,
          [user, deployer],
          [amountToSeize.mul('-1'), amountToSeize]
        )
      })
    })
  })
})
