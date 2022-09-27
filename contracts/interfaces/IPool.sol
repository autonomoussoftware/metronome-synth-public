// SPDX-License-Identifier: MIT

pragma solidity 0.8.9;

import "./external/IMasterOracle.sol";
import "./IPausable.sol";
import "./ISyntheticToken.sol";
import "./IDepositToken.sol";
import "./ITreasury.sol";
import "./IRewardsDistributor.sol";
import "./IPoolRegistry.sol";

/**
 * @notice Pool interface
 */
interface IPool is IPausable {
    function debtFloorInUsd() external returns (uint256);

    function depositFee() external returns (uint256);

    function issueFee() external returns (uint256);

    function withdrawFee() external returns (uint256);

    function repayFee() external returns (uint256);

    function feeCollector() external view returns (address);

    function isSyntheticTokenExists(ISyntheticToken _syntheticToken) external view returns (bool);

    function isDebtTokenExists(IDebtToken _debtToken) external view returns (bool);

    function isDepositTokenExists(IDepositToken _depositToken) external view returns (bool);

    function depositTokenOf(IERC20 _underlying) external view returns (IDepositToken);

    function debtTokenOf(ISyntheticToken _syntheticToken) external view returns (IDebtToken);

    function getDepositTokens() external view returns (address[] memory);

    function getDebtTokens() external view returns (address[] memory);

    function getRewardsDistributors() external view returns (IRewardsDistributor[] memory);

    function debtOf(address _account) external view returns (uint256 _debtInUsd);

    function depositOf(address _account) external view returns (uint256 _depositInUsd, uint256 _issuableLimitInUsd);

    function debtPositionOf(address _account)
        external
        view
        returns (
            bool _isHealthy,
            uint256 _depositInUsd,
            uint256 _debtInUsd,
            uint256 _issuableLimitInUsd,
            uint256 _issuableInUsd
        );

    function addDebtToken(IDebtToken _debtToken) external;

    function removeDebtToken(IDebtToken _debtToken) external;

    function addDepositToken(address _depositToken) external;

    function removeDepositToken(IDepositToken _depositToken) external;

    function liquidate(
        ISyntheticToken _syntheticToken,
        address _account,
        uint256 _amountToRepay,
        IDepositToken _depositToken
    ) external;

    function updateDebtFloor(uint256 _newDebtFloorInUsd) external;

    function updateDepositFee(uint256 _newDepositFee) external;

    function updateIssueFee(uint256 _newIssueFee) external;

    function updateWithdrawFee(uint256 _newWithdrawFee) external;

    function updateRepayFee(uint256 _newRepayFee) external;

    function updateLiquidatorLiquidationFee(uint256 _newLiquidatorLiquidationFee) external;

    function updateProtocolLiquidationFee(uint256 _newProtocolLiquidationFee) external;

    function updateMaxLiquidable(uint256 _newMaxLiquidable) external;

    function updateTreasury(ITreasury _newTreasury) external;

    function treasury() external view returns (ITreasury);

    function masterOracle() external view returns (IMasterOracle);

    function poolRegistry() external view returns (IPoolRegistry);

    function addToDepositTokensOfAccount(address _account) external;

    function removeFromDepositTokensOfAccount(address _account) external;

    function addToDebtTokensOfAccount(address _account) external;

    function removeFromDebtTokensOfAccount(address _account) external;

    function getDepositTokensOfAccount(address _account) external view returns (address[] memory);

    function getDebtTokensOfAccount(address _account) external view returns (address[] memory);

    function addRewardsDistributor(IRewardsDistributor _distributor) external;
}