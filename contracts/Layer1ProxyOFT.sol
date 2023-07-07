// SPDX-License-Identifier: MIT

pragma solidity 0.8.9;

import "./ProxyOFT.sol";

contract Layer1ProxyOFT is ProxyOFT {
    using SafeERC20 for IERC20;
    using SafeERC20 for ISyntheticToken;
    using WadRayMath for uint256;
    using BytesLib for bytes;

    ISwapper public swapper; // TODO: Use from SFM

    mapping(uint256 => uint256) swapAmountOutMin;

    // TODO: Move to `SmartFarmManager`, `Pool` or `PoolRegistry`?
    uint64 public flashRepayCallbackTxGasLimit = 750_000;
    uint64 public flashRepaySwapTxGasLimit = 500_000;
    uint64 public leverageCallbackTxGasLimit = 750_000;
    uint64 public leverageSwapTxGasLimit = 500_000;

    constructor(address _lzEndpoint, ISyntheticToken syntheticToken_) ProxyOFT(_lzEndpoint, syntheticToken_) {
        if (block.chainid != 1) revert NotAvailableOnThisChain();
    }

    function getLeverageSwapAndCallbackLzArgs(uint16 dstChainId_) external view returns (bytes memory lzArgs_) {
        return
            abi.encode(
                _quoteLeverageCallbackNativeFee(dstChainId_),
                leverageSwapTxGasLimit,
                leverageCallbackTxGasLimit
            );
    }

    function getFlashRepaySwapAndCallbackLzArgs(uint16 dstChainId_) external view returns (bytes memory lzArgs_) {
        return
            abi.encode(
                _quoteFlashRepayCallbackNativeFee(dstChainId_),
                flashRepaySwapTxGasLimit,
                flashRepayCallbackTxGasLimit
            );
    }

    function onOFTReceived(
        uint16 srcChainId_,
        bytes calldata /*srcAddress_*/,
        uint64 /*nonce_*/,
        bytes calldata from_,
        uint amount_,
        bytes calldata payload_
    ) external override {
        if (from_.toAddress(0) != _getProxyOftOf(srcChainId_)) revert InvalidFromAddress();
        if (msg.sender != address(this)) revert InvalidMsgSender();

        IStargateRouter _stargateRouter = stargateRouter;

        // 1. Swap synthetic token from L2 for underlying
        address _smartFarmingManager;
        uint256 _requestId;
        address _underlying;
        uint256 _amountOut;
        {
            address _account;
            uint256 _amountOutMin;
            uint256 _underlyingPoolId;
            (_smartFarmingManager, _requestId, _underlyingPoolId, _account, _amountOutMin) = abi.decode(
                payload_,
                (address, uint256, uint256, address, uint256)
            );

            _underlying = IStargatePool(IStargateFactory(_stargateRouter.factory()).getPool(_underlyingPoolId)).token();

            _amountOut = _swap({
                requestId_: _requestId,
                swapper_: swapper,
                tokenIn_: address(syntheticToken),
                tokenOut_: _underlying,
                amountIn_: amount_,
                amountOutMin_: _amountOutMin
            });
        }

        // 2. Transfer underlying to L2 using Stargate
        uint16 _dstChainId = srcChainId_;
        uint256 _poolId = poolIdOf[_underlying];
        // Note: The amount  isn't needed here because it's part of the message
        bytes memory _payload = abi.encode(_smartFarmingManager, _requestId); // Stack too deep
        IERC20(_underlying).safeApprove(address(_stargateRouter), 0);
        IERC20(_underlying).safeApprove(address(_stargateRouter), _amountOut);
        _stargateRouter.swap{value: _quoteLeverageCallbackNativeFee(_dstChainId)}({
            _dstChainId: _dstChainId,
            _srcPoolId: _poolId,
            _dstPoolId: _poolId,
            // Note: We can do a further swap (i.e. routerETH.swapETH) to refund the end user directly
            _refundAddress: payable(address(this)),
            _amountLD: _amountOut,
            _minAmountLD: _getSgAmountOutMin(_amountOut),
            _lzTxParams: IStargateRouter.lzTxObj({
                dstGasForCall: leverageCallbackTxGasLimit,
                dstNativeAmount: 0,
                dstNativeAddr: "0x"
            }),
            _to: abi.encodePacked(_getProxyOftOf(_dstChainId)),
            _payload: _payload
        });
    }

    function sgReceive(
        uint16 srcChainId_,
        bytes memory srcAddress_,
        uint256 /*nonce_*/,
        address token_,
        uint256 amount_,
        bytes memory payload_
    ) external override {
        if (abi.decode(srcAddress_, (address)) != _getProxyOftOf(srcChainId_)) revert InvalidFromAddress();

        // 1. Swap underlying from L2 for synthetic token
        address _smartFarmingManager;
        uint256 _requestId;
        uint256 _amountOut;
        {
            address _account;
            uint256 _amountOutMin;

            (_smartFarmingManager, _requestId, _account, _amountOutMin) = abi.decode(
                payload_,
                (address, uint256, address, uint256)
            );

            _amountOut = _swap({
                requestId_: _requestId,
                swapper_: swapper,
                tokenIn_: token_,
                tokenOut_: address(syntheticToken),
                amountIn_: amount_,
                amountOutMin_: _amountOutMin
            });
        }

        // 2. Transfer synthetic token to L2 using LayerZero
        uint16 _dstChainId = srcChainId_;
        uint64 _flashRepayCallbackTxGasLimit = flashRepayCallbackTxGasLimit;

        this.sendAndCall{value: _quoteFlashRepayCallbackNativeFee(_dstChainId)}({
            _from: address(this),
            _dstChainId: _dstChainId,
            _toAddress: abi.encodePacked(_getProxyOftOf(_dstChainId)),
            _amount: _amountOut,
            // Note: The amount isn't needed here because it's part of the message
            _payload: abi.encode(_smartFarmingManager, _requestId),
            // Note: `_dstGasForCall` is the extra gas for the further call triggered from the destination
            _dstGasForCall: _flashRepayCallbackTxGasLimit,
            // Note: We can do a further swap (i.e. routerETH.swapETH) to refund the end user directly
            _refundAddress: payable(address(this)),
            _zroPaymentAddress: address(0),
            _adapterParams: abi.encodePacked(
                LZ_ADAPTER_PARAMS_VERSION,
                uint256(_flashRepayCallbackTxGasLimit),
                uint256(0),
                address(0)
            )
        });
    }

    function _quoteFlashRepayCallbackNativeFee(uint16 dstChainId_) public view returns (uint256 _callbackTxNativeFee) {
        (_callbackTxNativeFee, ) = this.estimateSendAndCallFee({
            _dstChainId: dstChainId_,
            _toAddress: abi.encodePacked(_getProxyOftOf(dstChainId_)),
            _amount: type(uint256).max,
            _payload: abi.encode(
                address(type(uint160).max), // smart farming manager
                bytes32(type(uint256).max) // requestId
            ),
            // Note: `_dstGasForCall` is the extra gas for the further call triggered from the destination
            _dstGasForCall: flashRepayCallbackTxGasLimit,
            _useZro: false,
            _adapterParams: abi.encodePacked(
                LZ_ADAPTER_PARAMS_VERSION,
                uint256(flashRepayCallbackTxGasLimit),
                uint256(0),
                address(0)
            )
        });
    }

    function _quoteLeverageCallbackNativeFee(uint16 dstChainId_) private view returns (uint256 _callbackTxNativeFee) {
        (_callbackTxNativeFee, ) = stargateRouter.quoteLayerZeroFee({
            _dstChainId: dstChainId_,
            _functionType: SG_TYPE_SWAP_REMOTE,
            _toAddress: abi.encodePacked(_getProxyOftOf(dstChainId_)),
            _transferAndCallPayload: abi.encodePacked(
                address(type(uint160).max), // smart farming manager
                bytes32(type(uint256).max) // requestId
            ),
            _lzTxParams: IStargateRouter.lzTxObj({
                dstGasForCall: leverageCallbackTxGasLimit,
                dstNativeAmount: 0,
                dstNativeAddr: "0x"
            })
        });
    }

    function _swap(
        uint256 requestId_,
        ISwapper swapper_,
        address tokenIn_,
        address tokenOut_,
        uint256 amountIn_,
        uint256 amountOutMin_
    ) private returns (uint256 _amountOut) {
        // 1. Use updated slippage if exist
        uint256 _storedAmountOutMin = swapAmountOutMin[requestId_];

        if (_storedAmountOutMin > 0) {
            amountOutMin_ = _storedAmountOutMin;
        }

        // 2. Perform swap
        IERC20(tokenIn_).safeApprove(address(swapper_), 0);
        IERC20(tokenIn_).safeApprove(address(swapper_), amountIn_);
        _amountOut = swapper_.swapExactInput({
            tokenIn_: tokenIn_,
            tokenOut_: tokenOut_,
            amountIn_: amountIn_,
            amountOutMin_: amountOutMin_,
            receiver_: address(this)
        });

        // 3. Clear stored slippage if swap succeeds
        _storedAmountOutMin = 0;
    }

    // TODO: Comment
    // TODO: We may change OFT implementation to make it store message params same as SG `cachedSwapLookup` mapping does
    function retrySwapSynthAndTriggerCallback(
        uint16 srcChainId_,
        bytes calldata srcAddress_,
        uint64 nonce_,
        uint amount_,
        bytes calldata payload_,
        uint256 newAmountOutMin_
    ) public {
        (, uint256 _requestId, , address _account, ) = abi.decode(
            payload_,
            (address, uint256, address, address, uint256)
        );
        if (msg.sender != _account) revert InvalidMsgSender();

        swapAmountOutMin[_requestId] = newAmountOutMin_;

        // Note: `retryOFTReceived` has checks to ensure that the args are consistent
        bytes memory _from = abi.encodePacked(_getProxyOftOf(srcChainId_));
        address _to = address(this);
        this.retryOFTReceived(srcChainId_, srcAddress_, nonce_, _from, _to, amount_, payload_);
    }

    // TODO: Comment
    function retrySwapUnderlyingAndTriggerCallback(
        uint16 srcChainId_,
        bytes calldata srcAddress_,
        uint256 nonce_,
        uint256 newAmountOutMin_
    ) public {
        IStargateRouter _stargateRouter = stargateRouter;

        (, , , bytes memory _payload) = _stargateRouter.cachedSwapLookup(srcChainId_, srcAddress_, nonce_);
        (, uint256 _requestId, address _account, ) = abi.decode(_payload, (address, uint256, address, uint256));

        if (msg.sender != _account) revert InvalidMsgSender();

        swapAmountOutMin[_requestId] = newAmountOutMin_;

        _stargateRouter.clearCachedSwap(srcChainId_, srcAddress_, nonce_);
    }

    // TODO:
    // - only owner/governor
    // - emit event
    function updateSwapper(ISwapper swapper_) public {
        swapper = swapper_;
    }
}
