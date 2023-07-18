// SPDX-License-Identifier: MIT

pragma solidity 0.8.9;

import "./IPoolRegistry.sol";
import "./IProxyOFT.sol";

interface IQuoter {
    function quoteLayer2FlashRepayNativeFee(
        IProxyOFT proxyOFT_,
        bytes calldata lzArgs_
    ) external view returns (uint256 _nativeFee);

    function quoteLayer2LeverageNativeFee(
        IProxyOFT proxyOFT_,
        bytes calldata lzArgs_
    ) external view returns (uint256 _nativeFee);

    function quoteLeverageCallbackNativeFee(uint16 dstChainId_) external view returns (uint256 _callbackTxNativeFee);

    function quoteFlashRepayCallbackNativeFee(uint16 dstChainId_) external view returns (uint256 _callbackTxNativeFee);

    function getFlashRepaySwapAndCallbackLzArgs(uint16 dstChainId_) external view returns (bytes memory lzArgs_);

    function getLeverageSwapAndCallbackLzArgs(uint16 dstChainId_) external view returns (bytes memory lzArgs_);
}
