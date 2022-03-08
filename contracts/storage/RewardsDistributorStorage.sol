// SPDX-License-Identifier: MIT

pragma solidity 0.8.9;

import "../interface/IRewardsDistributor.sol";

abstract contract RewardsDistributorStorageV1 is IRewardsDistributor {
    /**
     * @notice The token to reward
     */
    IERC20 public rewardToken;

    struct TokenState {
        uint224 index; // The last updated index
        uint32 block; // The block number the index was last updated at
    }

    /**
     * @notice Track tokens for reward
     */
    IERC20[] public tokens;

    /**
     * @notice The amount of token distribuited for each token per block
     */
    mapping(IERC20 => uint256) public tokenSpeeds;

    /**
     * @notice The reward state for each token
     */
    mapping(IERC20 => TokenState) public tokenStates;

    /**
     * @notice The supply index for each token for each account as of the last time they accrued token
     */
    mapping(IERC20 => mapping(address => uint256)) public accountIndexOf;

    /**
     * @notice The token accrued but not yet transferred to each user
     */
    mapping(address => uint256) public tokensAccruedOf;
}