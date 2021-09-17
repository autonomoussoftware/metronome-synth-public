import {BigNumber} from '@ethersproject/bignumber'
import {parseEther} from '@ethersproject/units'
import {MBox, SyntheticAsset} from '../../typechain'

export const WETH = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'

/**
 * sCR = synthetic's collateralization ratio
 * D = debt with collateralization value in USD
 * C = collateral value in USD
 * L = liquidation fee
 * Calculates USD value needed = (C - D)/(L - sCR - 1)
 * Note: This should be used when collateral:debit >= 1
 */
export const getMinLiquidationAmountInUsd = async function (
  mBOX: MBox,
  accountAddress: string,
  mAsset: SyntheticAsset
): Promise<BigNumber> {
  const {_debtInUsdWithCollateralization, _depositInUsd} = await mBOX.debtPositionOf(accountAddress)
  const mAssetCR = await mAsset.collateralizationRatio()
  const liquidatorFee = await mBOX.liquidatorFee()

  const numerator = _depositInUsd.sub(_debtInUsdWithCollateralization)
  const denominator = liquidatorFee.sub(mAssetCR.sub(parseEther('1')))

  return numerator.mul(parseEther('1')).div(denominator)
}

/**
 * C = collateral value in USD
 * L = liquidation fee
 * Calculates USD value needed = C/(1 + L)
 */
export const getMaxLiquidationAmountInUsd = async function (mBOX: MBox, accountAddress: string): Promise<BigNumber> {
  const {_depositInUsd} = await mBOX.debtPositionOf(accountAddress)
  const liquidatorFee = await mBOX.liquidatorFee()

  const numerator = _depositInUsd
  const denominator = parseEther('1').add(liquidatorFee)

  return numerator.mul(parseEther('1')).div(denominator)
}
