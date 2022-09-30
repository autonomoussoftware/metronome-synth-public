// SPDX-License-Identifier: MIT

pragma solidity 0.8.9;

import "../interfaces/IDebtToken.sol";

abstract contract DebtTokenStorageV1 is IDebtToken {
    /**
     * @notice The name of the token
     */
    string public name;

    /**
     * @notice The symbol of the token
     */
    string public symbol;

    /**
     * @notice The mapping of the users' minted tokens
     * @dev This value changes within the mint and burn operations
     */
    mapping(address => uint256) internal principalOf;

    /**
     * @notice The `debtIndex` "snapshot" of the account's latest `principalOf` update (i.e. mint/burn)
     */
    mapping(address => uint256) internal debtIndexOf;

    /**
     * @notice The supply cap (in USD)
     */
    uint256 public maxTotalSupplyInUsd;

    /**
     * @notice The total amount of minted tokens
     */
    uint256 internal totalSupply_;

    /**
     * @notice The timestamp when interest accrual was calculated for the last time
     */
    uint256 public lastTimestampAccrued;

    /**
     * @notice Accumulator of the total earned interest rate since the beginning
     */
    uint256 public override debtIndex;

    /**
     * @notice Interest rate
     * @dev Use 0.1e18 for 10% APR
     */
    uint256 public interestRate;

    /**
     * @notice The Synthetic token
     */
    ISyntheticToken public syntheticToken;

    /**
     * @notice If true, disables msAsset minting on this pool
     */
    bool public isActive;

    /**
     * @notice The decimals of the token
     */
    uint8 public decimals;
}
