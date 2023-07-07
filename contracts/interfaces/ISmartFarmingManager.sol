// SPDX-License-Identifier: MIT

pragma solidity 0.8.9;

import "./IManageable.sol";
import "./IDepositToken.sol";
import "./IDebtToken.sol";
import "./external/ISwapper.sol";

/**
 * @notice SmartFarmingManager interface
 */
interface ISmartFarmingManager {
    // TODO: Move to poolRegistry?
    function swapper() external view returns (ISwapper);

    function flashRepay(
        ISyntheticToken syntheticToken_,
        IDepositToken depositToken_,
        uint256 withdrawAmount_,
        uint256 repayAmountMin_
    ) external returns (uint256 _withdrawn, uint256 _repaid);

    function layer2FlashRepay(
        ISyntheticToken syntheticToken_,
        IDepositToken depositToken_,
        uint256 withdrawAmount_,
        IERC20 underlying_,
        uint256 underlyingAmountMin_,
        uint256 layer1SwapAmountOutMin_,
        uint256 repayAmountMin_,
        bytes calldata lzArgs_
    ) external payable;

    function layer2Leverage(
        IERC20 underlying_,
        IDepositToken depositToken_,
        ISyntheticToken syntheticToken_,
        uint256 amountIn_,
        uint256 leverage_,
        uint256 layer1SwapAmountOutMin_,
        uint256 depositAmountMin_,
        bytes calldata lzArgs_
    ) external payable;

    function layer2LeverageCallback(uint256 id_, uint256 swapAmountOut_) external returns (uint256 _deposited);

    function layer2FlashRepayCallback(uint256 id_, uint256 swapAmountOut_) external returns (uint256 _repaid);

    function leverage(
        IERC20 tokenIn_,
        IDepositToken depositToken_,
        ISyntheticToken syntheticToken_,
        uint256 amountIn_,
        uint256 leverage_,
        uint256 depositAmountMin_
    ) external returns (uint256 _deposited, uint256 _issued);
}
