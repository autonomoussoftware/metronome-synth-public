// SPDX-License-Identifier: MIT

pragma solidity 0.8.9;

import "../interface/IDebtToken.sol";

abstract contract DebtTokenStorageV1 is IDebtToken {
    /**
     * @notice The total amount of minted tokens
     * @dev This value changes within the mint and burn operations
     */
    mapping(address => uint256) internal principalOf;

    /**
     * @notice The `debtIndex` "snapshot" of the account's latest `principalOf` update (i.e. mint/burn)
     */
    mapping(address => uint256) internal debtIndexOf;

    uint256 internal totalSupply_;
    uint8 public decimals;
    string public name;
    string public symbol;

    ISyntheticAsset public syntheticAsset;

    /**
     * @notice The block when interest accrual was calculated for the last time
     */
    uint256 public lastBlockAccrued;

    /**
     * @notice Accumulator of the total earned interest rate since the beginning
     */
    uint256 public debtIndex;
}
