// SPDX-License-Identifier: MIT

pragma solidity 0.8.9;

import "../dependencies/openzeppelin/utils/structs/EnumerableSet.sol";
import "../interface/IController.sol";
import "../interface/ITreasury.sol";

abstract contract ControllerStorageV1 is IController {
    /**
     * @notice The debt floor (in USD) for each synthetic asset
     * This parameters is used to keep incentive for liquidators (i.e. cover gas and provide enough profit)
     */
    uint256 public debtFloorInUsd;

    /**
     * @notice The fee charged when depositing collateral
     * @dev Use 18 decimals (e.g. 1e16 = 1%)
     */
    uint256 public depositFee;

    /**
     * @notice The fee charged when minting a synthetic asset
     * @dev Use 18 decimals (e.g. 1e16 = 1%)
     */
    uint256 public mintFee;

    /**
     * @notice The fee charged when withdrawing collateral
     * @dev Use 18 decimals (e.g. 1e16 = 1%)
     */
    uint256 public withdrawFee;

    /**
     * @notice The fee charged when repaying debt
     * @dev Use 18 decimals (e.g. 1e16 = 1%)
     */
    uint256 public repayFee;

    /**
     * @notice The fee charged when swapping synthetic assets
     * @dev Use 18 decimals (e.g. 1e16 = 1%)
     */
    uint256 public swapFee;

    /**
     * @notice The fee charged from liquidated deposit that goes to the liquidator
     * @dev Use 18 decimals (e.g. 1e16 = 1%)
     */
    uint256 public liquidatorFee;

    /**
     * @notice The fee charged when liquidating a position
     * @dev Use 18 decimals (e.g. 1e16 = 1%)
     */
    uint256 public liquidateFee;

    /**
     * @notice The max percent of the debt allowed to liquidate
     * @dev Use 18 decimals (e.g. 1e16 = 1%)
     */
    uint256 public maxLiquidable;

    /**
     * @notice Prices oracle
     */
    IOracle public oracle;

    /**
     * @notice Treasury contract
     */
    ITreasury public treasury;

    /**
     * @notice Represents collateral's deposits
     */
    EnumerableSet.AddressSet internal depositTokens;

    /**
     * @notice Get the deposit token's address from given underlying asset
     */
    mapping(IERC20 => IDepositToken) public depositTokenOf;

    /**
     * @notice Avaliable synthetic assets
     */
    EnumerableSet.AddressSet internal syntheticAssets;
}
