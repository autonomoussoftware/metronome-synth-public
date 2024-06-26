import {HardhatRuntimeEnvironment} from 'hardhat/types'
import {DeployFunction} from 'hardhat-deploy/types'
import {UpgradableContracts, deployUpgradable} from '../../../helpers'
import Address from '../../../../helpers/address'
const {MET_ADDRESS} = Address

const {
  Pool1: {alias: Pool1},
  MetRewardsDistributor: {alias: RewardsDistributor},
} = UpgradableContracts

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const {deployments} = hre
  const {get} = deployments
  const pool = await get(Pool1)

  await deployUpgradable({
    hre,
    contractConfig: UpgradableContracts.MetRewardsDistributor,
    initializeArgs: [pool.address, MET_ADDRESS],
  })
}

export default func
func.tags = [RewardsDistributor]
func.dependencies = [Pool1]
