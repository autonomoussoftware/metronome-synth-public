import {HardhatRuntimeEnvironment} from 'hardhat/types'
import {DeployFunction} from 'hardhat-deploy/types'
import {parseEther} from 'ethers/lib/utils'
import {UpgradableContracts, deterministic} from '../helpers'

const {alias: MEth} = UpgradableContracts.MEth
const {alias: MEthDebtToken} = UpgradableContracts.MEthDebtToken
const Oracle = 'Oracle'

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const {getNamedAccounts, deployments} = hre
  const {get, execute} = deployments
  const {deployer, governor} = await getNamedAccounts()

  const oracle = await get(Oracle)

  const {address: issuerAddress} = await deterministic(hre, UpgradableContracts.Issuer)
  const {address: mEthDebtTokenAddress} = await deterministic(hre, UpgradableContracts.MEthDebtToken)
  const {deploy} = await deterministic(hre, UpgradableContracts.MEth)

  await deploy()

  await execute(
    MEth,
    {from: deployer, log: true},
    'initialize',
    'Metronome ETH',
    'mETH',
    18,
    issuerAddress,
    mEthDebtTokenAddress,
    parseEther('1.5'), // CR = 150%
    oracle.address
  )

  await execute(MEth, {from: deployer, log: true}, 'transferGovernorship', governor)
}

export default func
func.tags = [MEth]
func.dependencies = [MEthDebtToken]
