/* eslint-disable camelcase */
import {HardhatRuntimeEnvironment} from 'hardhat/types'
import {DeployFunction} from 'hardhat-deploy/types'
import {UpgradableContracts, deployUpgradable, updateParamIfNeeded} from '../../../helpers'
import Address from '../../../../helpers/address'

const {
  PoolRegistry: {alias: PoolRegistry},
  Pool2: {alias: Pool2},
  FeeProvider_Pool2: {alias: FeeProvider_Pool2},
} = UpgradableContracts

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const {deployments} = hre
  const {get} = deployments

  const {address: poolRegistryAddress} = await get(PoolRegistry)

  const {address: feeProviderAddress} = await deployUpgradable({
    hre,
    contractConfig: UpgradableContracts.FeeProvider_Pool2,
    initializeArgs: [poolRegistryAddress, Address.ESMET],
  })

  await updateParamIfNeeded(hre, {
    contractAlias: Pool2,
    readMethod: 'feeProvider',
    writeMethod: 'updateFeeProvider',
    writeArgs: [feeProviderAddress],
  })
}

export default func
func.tags = [FeeProvider_Pool2]
func.dependencies = [Pool2]