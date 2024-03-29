import {buildDepositDeployFunction} from '../../helpers'
import Address from '../../../helpers/address'
import {parseEther} from 'ethers/lib/utils'

const {VACBETH_ADDRESS} = Address

const func = buildDepositDeployFunction({
  underlyingAddress: VACBETH_ADDRESS,
  underlyingSymbol: 'vaCBETH',
  underlyingDecimals: 18,
  collateralFactor: parseEther('0.75'), // 75%
  maxTotalSupply: parseEther('60'),
})

export default func
