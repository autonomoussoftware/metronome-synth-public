import {parseEther} from 'ethers/lib/utils'
import {buildDebtTokenDeployFunction, UpgradableContracts} from '../../../helpers'

const {
  Pool1: {alias: Pool1},
} = UpgradableContracts

const func = buildDebtTokenDeployFunction({
  poolAlias: Pool1,
  name: 'Metronome Synth BTC',
  symbol: 'msBTC',
  interestRate: parseEther('0.01'), // 1%
  maxTotalSupply: parseEther('16'),
})

export default func
