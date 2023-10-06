// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "./CrossChains.t.sol";

contract CrossChainLeverage_Test is CrossChains_Test {
    using stdStorage for StdStorage;
    using WadRayMath for uint256;
    using BytesLib for bytes;

    function _crossChainLeverage(
        uint256 amountIn_,
        uint256 swapAmountOutMin_,
        uint256 leverage_,
        uint256 depositAmountMin_
    ) private {
        vm.selectFork(mainnetFork);
        bytes memory _lzArgs = poolRegistry_mainnet.quoter().getLeverageSwapAndCallbackLzArgs({
            srcChainId_: LZ_OP_CHAIN_ID,
            dstChainId_: LZ_MAINNET_CHAIN_ID
        });

        _crossChainLeverage({
            underlying_: usdc_optimism,
            depositToken_: msdVaUSDC_optimism,
            amountIn_: amountIn_,
            swapAmountOutMin_: swapAmountOutMin_,
            leverage_: leverage_,
            depositAmountMin_: depositAmountMin_,
            lzArgs_: _lzArgs
        });
    }

    function _crossChainLeverage(
        IERC20 underlying_,
        DepositToken depositToken_,
        uint256 amountIn_,
        uint256 swapAmountOutMin_,
        uint256 leverage_,
        uint256 depositAmountMin_
    ) private {
        vm.selectFork(mainnetFork);
        bytes memory _lzArgs = poolRegistry_mainnet.quoter().getLeverageSwapAndCallbackLzArgs({
            srcChainId_: LZ_OP_CHAIN_ID,
            dstChainId_: LZ_MAINNET_CHAIN_ID
        });

        _crossChainLeverage({
            underlying_: underlying_,
            depositToken_: depositToken_,
            amountIn_: amountIn_,
            swapAmountOutMin_: swapAmountOutMin_,
            leverage_: leverage_,
            depositAmountMin_: depositAmountMin_,
            lzArgs_: _lzArgs
        });
    }

    function _crossChainLeverage(
        uint256 amountIn_,
        uint256 swapAmountOutMin_,
        uint256 leverage_,
        uint256 depositAmountMin_,
        bytes memory lzArgs_
    ) private {
        _crossChainLeverage({
            underlying_: usdc_optimism,
            depositToken_: msdVaUSDC_optimism,
            amountIn_: amountIn_,
            swapAmountOutMin_: swapAmountOutMin_,
            leverage_: leverage_,
            depositAmountMin_: depositAmountMin_,
            lzArgs_: lzArgs_
        });
    }

    function _crossChainLeverage(
        IERC20 underlying_,
        DepositToken depositToken_,
        uint256 amountIn_,
        uint256 swapAmountOutMin_,
        uint256 leverage_,
        uint256 depositAmountMin_,
        bytes memory lzArgs_
    ) private {
        vm.recordLogs();

        vm.selectFork(optimismFork);
        uint256 fee = poolRegistry_optimism.quoter().quoteCrossChainLeverageNativeFee({
            proxyOFT_: proxyOFT_msUSD_optimism,
            lzArgs_: lzArgs_
        });

        deal(alice, fee);
        deal(address(underlying_), alice, amountIn_);

        vm.startPrank(alice);
        underlying_.approve(address(smartFarmingManager_optimism), type(uint256).max);
        smartFarmingManager_optimism.crossChainLeverage{value: fee}({
            tokenIn_: underlying_,
            depositToken_: depositToken_,
            syntheticToken_: msUSD_optimism,
            amountIn_: amountIn_,
            leverage_: leverage_,
            depositAmountMin_: depositAmountMin_,
            swapAmountOutMin_: swapAmountOutMin_,
            lzArgs_: lzArgs_
        });
        vm.stopPrank();

        assertEq(alice.balance, 0, "fee-estimation-is-not-accurate");
    }

    function _executeSwapAndTriggerCallbackWithoutAirdrop(
        Vm.Log memory SendToChain,
        Vm.Log memory Packet,
        Vm.Log memory RelayerParams
    ) internal {
        _executeOftTransferArrivalTx(SendToChain, Packet, RelayerParams, false);
    }

    function _executeSwapAndTriggerCallback(
        Vm.Log memory SendToChain,
        Vm.Log memory Packet,
        Vm.Log memory RelayerParams
    ) internal {
        _executeOftTransferArrivalTx(SendToChain, Packet, RelayerParams);
    }

    function _executeCallback(Vm.Log memory Swap, Vm.Log memory Packet, Vm.Log memory RelayerParams) internal {
        _executeSgSwapArrivalTx(Swap, Packet, RelayerParams);
    }

    function test_crossChainLeverage() external {
        //
        // given
        //
        vm.selectFork(optimismFork);
        (, uint256 _depositInUsdBefore, uint256 _debtInUsdBefore, , ) = pool_optimism.debtPositionOf(alice);
        assertEq(_depositInUsdBefore, 0);
        assertEq(_debtInUsdBefore, 0);

        //
        // when
        //

        // tx1
        _crossChainLeverage({amountIn_: 1000e6, swapAmountOutMin_: 0, leverage_: 1.5e18, depositAmountMin_: 1450e18});
        (Vm.Log memory SendToChain, Vm.Log memory Packet, Vm.Log memory RelayerParams) = _getOftTransferEvents();

        // tx2
        _executeSwapAndTriggerCallback(SendToChain, Packet, RelayerParams);
        (Vm.Log memory Swap, Vm.Log memory Packet_Tx2, Vm.Log memory RelayerParams_Tx2) = _getSgSwapEvents();
        assertEq(address(proxyOFT_msUSD_mainnet).balance, 0, "fee-estimation-is-not-accurate");

        // tx3
        _executeCallback(Swap, Packet_Tx2, RelayerParams_Tx2);

        //
        // then
        //
        (, uint256 _depositInUsdAfter, uint256 _debtInUsdAfter, , ) = pool_optimism.debtPositionOf(alice);
        assertApproxEqAbs(_depositInUsdAfter, 1500e18, 1e18);
        assertEq(_debtInUsdAfter, 500e18);
    }

    function test_crossChainLeverage_with_weth() external {
        //
        // given
        //
        vm.selectFork(optimismFork);
        (, uint256 _depositInUsdBefore, uint256 _debtInUsdBefore, , ) = pool_optimism.debtPositionOf(alice);
        assertEq(_depositInUsdBefore, 0);
        assertEq(_debtInUsdBefore, 0);

        //
        // when
        //

        // tx1
        _crossChainLeverage({
            underlying_: weth_optimism,
            depositToken_: msdVaETH_optimism,
            amountIn_: 0.5e18,
            swapAmountOutMin_: 0,
            leverage_: 1.5e18,
            depositAmountMin_: 0.70e18
        });
        (Vm.Log memory SendToChain, Vm.Log memory Packet, Vm.Log memory RelayerParams) = _getOftTransferEvents();

        // tx2
        _executeSwapAndTriggerCallback(SendToChain, Packet, RelayerParams);
        (Vm.Log memory Swap, Vm.Log memory Packet_Tx2, Vm.Log memory RelayerParams_Tx2) = _getSgSwapEvents();
        assertEq(address(proxyOFT_msUSD_mainnet).balance, 0, "fee-estimation-is-not-accurate");

        // tx3
        _executeCallback(Swap, Packet_Tx2, RelayerParams_Tx2);

        //
        // then
        //
        (, uint256 _depositInUsdAfter, uint256 _debtInUsdAfter, , ) = pool_optimism.debtPositionOf(alice);
        assertApproxEqAbs(_depositInUsdAfter, 1500e18, 1.5e18);
        assertEq(_debtInUsdAfter, 500e18);
    }

    function test_failedTx2_whenSynthTransferReverted() external {
        //
        // given
        //
        vm.selectFork(mainnetFork);
        // It will make mainnet's bridge minting to fail
        msUSD_mainnet.updateMaxBridgedInSupply(0);

        //
        // when
        //

        // tx1
        _crossChainLeverage({amountIn_: 1000e6, swapAmountOutMin_: 0, leverage_: 1.5e18, depositAmountMin_: 1450e18});
        (Vm.Log memory SendToChain, Vm.Log memory Packet, Vm.Log memory RelayerParams) = _getOftTransferEvents();

        // tx2 - fail
        _executeSwapAndTriggerCallback(SendToChain, Packet, RelayerParams);
        (Vm.Log memory MessageFailed, , ) = _getOftTransferErrorEvents();
        (uint16 _srcChainId, bytes memory _srcAddress, uint64 _nonce, bytes memory _payload, bytes memory reason) = abi
            .decode(MessageFailed.data, (uint16, bytes, uint64, bytes, bytes));
        assertEq(reason, abi.encodeWithSignature("SurpassMaxBridgingSupply()"));

        // tx2 - fail
        // Same state, retry will fail too
        vm.expectRevert();
        proxyOFT_msUSD_mainnet.retryMessage(_srcChainId, _srcAddress, _nonce, _payload);

        // tx2
        // Retry will work after amending state
        msUSD_mainnet.updateMaxBridgedInSupply(type(uint256).max);
        proxyOFT_msUSD_mainnet.retryMessage(_srcChainId, _srcAddress, _nonce, _payload);
        (Vm.Log memory Swap, Vm.Log memory PacketEventTx2, Vm.Log memory RelayerParamsTx2) = _getSgSwapEvents();

        // tx3
        _executeCallback(Swap, PacketEventTx2, RelayerParamsTx2);

        //
        // then
        //
        (, uint256 _depositInUsdAfter, uint256 _debtInUsdAfter, , ) = pool_optimism.debtPositionOf(alice);
        assertApproxEqAbs(_depositInUsdAfter, 1500e18, 1e18);
        assertEq(_debtInUsdAfter, 500e18);
    }

    function test_failedTx2_whenOnOFTReceivedReverted() external {
        //
        // when
        //

        // tx1
        _crossChainLeverage({
            amountIn_: 1000e6,
            swapAmountOutMin_: 501e6, // Wrong slippage
            leverage_: 1.5e18,
            depositAmountMin_: 1450e18
        });
        (Vm.Log memory SendToChain, Vm.Log memory Packet, Vm.Log memory RelayerParams) = _getOftTransferEvents();

        // tx2 - fail
        _executeSwapAndTriggerCallback(SendToChain, Packet, RelayerParams);
        (, Vm.Log memory CallOFTReceivedFailure, ) = _getOftTransferErrorEvents();
        (
            uint16 srcChainId,
            address to,
            bytes memory srcAddress,
            uint64 nonce,
            bytes memory from,
            uint amount,
            bytes memory payload,
            bytes memory reason
        ) = _decodeCallOFTReceivedFailureEvent(CallOFTReceivedFailure);
        assertEq(reason.slice(4, reason.length - 4), abi.encode("swapper-mock-slippage"));

        // tx2 - fail
        // Same state, retry will fail too
        vm.expectRevert();
        proxyOFT_msUSD_mainnet.retryOFTReceived(srcChainId, srcAddress, nonce, from, to, amount, payload);

        // tx2
        // Retry will work with right slippage
        vm.prank(alice);
        crossChainDispatcher_mainnet.retrySwapAndTriggerLeverageCallback(
            srcChainId,
            srcAddress,
            nonce,
            amount,
            payload,
            500e6 // Correct slippage
        );
        (Vm.Log memory SwapTx2, Vm.Log memory PacketTx2, Vm.Log memory RelayerParamsTx2) = _getSgSwapEvents();

        // tx3
        _executeCallback(SwapTx2, PacketTx2, RelayerParamsTx2);

        //
        // then
        //
        (, uint256 _depositInUsdAfter, uint256 _debtInUsdAfter, , ) = pool_optimism.debtPositionOf(alice);
        assertApproxEqAbs(_depositInUsdAfter, 1500e18, 1e18);
        assertEq(_debtInUsdAfter, 500e18);
    }

    function test_failedTx3_whenUnderlyingTransferReverted() external {
        //
        // given
        //

        vm.selectFork(optimismFork);
        // Making amount to bridge from mainnet to L2 be higher than the SG Pool liquidity
        uint256 opSgLiquidity = usdc_optimism.balanceOf(SG_OP_USDC_POOL);
        uint256 amountIn = opSgLiquidity * 3;
        // Adding enough liquidity to mainnet SG Pool
        vm.selectFork(mainnetFork);
        _addSgLiquidity(SG_MAINNET_USDC_POOL, amountIn);

        //
        // when
        //

        // tx1
        _crossChainLeverage({amountIn_: amountIn, swapAmountOutMin_: 0, leverage_: 1.5e18, depositAmountMin_: 0});
        (Vm.Log memory SendToChain, Vm.Log memory Packet, Vm.Log memory RelayerParams) = _getOftTransferEvents();

        // tx2
        _executeSwapAndTriggerCallback(SendToChain, Packet, RelayerParams);
        (Vm.Log memory Swap, Vm.Log memory PacketTx2, Vm.Log memory RelayerParamsTx2) = _getSgSwapEvents();

        // tx2 - fail
        _executeCallback(Swap, PacketTx2, RelayerParamsTx2);
        (, Vm.Log memory Revert) = _getSgSwapErrorEvents();
        assertGt(Revert.data.length, 0);
        (uint16 chainId, bytes memory srcAddress, uint256 nonce) = _decodeRevertEvent(Revert);

        // tx2 - fail
        // Same state, retry will fail too
        sgRouter_optimism.retryRevert(chainId, srcAddress, nonce);
        (, Revert) = _getSgSwapErrorEvents();
        assertGt(Revert.data.length, 0); // Emitted `Revert` event

        // tx3
        // Retry will work after adding liquidity to the SG Pool
        vm.selectFork(optimismFork);
        _addSgLiquidity(SG_OP_USDC_POOL, amountIn);
        sgRouter_optimism.retryRevert(chainId, srcAddress, nonce);

        //
        // then
        //
        (, uint256 _depositInUsdAfter, uint256 _debtInUsdAfter, , ) = pool_optimism.debtPositionOf(alice);
        assertGt(_depositInUsdAfter, 0);
        assertGt(_debtInUsdAfter, 0);
    }

    function test_failedTx3_whenSgReceiveReverted() external {
        //
        // given
        //
        vm.selectFork(optimismFork);

        //
        // when
        //

        // tx1
        _crossChainLeverage({
            amountIn_: 1000e6,
            swapAmountOutMin_: 500e6,
            leverage_: 1.5e18,
            depositAmountMin_: 9999e18 // Wrong slippage
        });
        (Vm.Log memory SendToChain, Vm.Log memory Packet, Vm.Log memory RelayerParams) = _getOftTransferEvents();

        // tx2
        _executeSwapAndTriggerCallback(SendToChain, Packet, RelayerParams);
        (Vm.Log memory Swap, Vm.Log memory PacketTx2, Vm.Log memory RelayerParamsTx2) = _getSgSwapEvents();

        // tx3 - fail
        _executeCallback(Swap, PacketTx2, RelayerParamsTx2);
        (Vm.Log memory CachedSwapSaved, ) = _getSgSwapErrorEvents();
        (
            uint16 chainId,
            bytes memory srcAddress,
            uint256 nonce,
            ,
            ,
            ,
            bytes memory sgPayload,
            bytes memory reason
        ) = abi.decode(CachedSwapSaved.data, (uint16, bytes, uint256, address, uint256, address, bytes, bytes));
        assertEq(reason, abi.encodeWithSignature("LeverageSlippageTooHigh()"));
        // Even if `sgReceive` fails, the collateral amount is sent
        assertGt(usdc_optimism.balanceOf(address(crossChainDispatcher_optimism)), 0);

        // tx3 - fail
        // Same state, retry will fail too
        vm.expectRevert();
        sgRouter_optimism.clearCachedSwap(chainId, srcAddress, nonce);

        // tx3
        // Retry will work with right slippage
        bytes memory _payload = sgPayload.slice(40, sgPayload.length - 40);
        (, uint256 _requestId) = CrossChainLib.decodeLeverageCallbackPayload(_payload);
        vm.prank(alice);
        smartFarmingManager_optimism.retryCrossChainLeverageCallback(
            _requestId,
            1450e18, // Correct slippage
            chainId,
            srcAddress,
            nonce
        );

        //
        // then
        //
        (, uint256 _depositInUsdAfter, uint256 _debtInUsdAfter, , ) = pool_optimism.debtPositionOf(alice);
        assertApproxEqAbs(_depositInUsdAfter, 1500e18, 1e18);
        assertEq(_debtInUsdAfter, 500e18);
    }

    function test_failedTx2_whenAirdropIsNotEnough() external {
        //
        // given
        //
        vm.selectFork(optimismFork);
        uint256 _debtBefore = pool_optimism.debtOf(alice);
        assertEq(_debtBefore, 0);

        //
        // when
        //
        vm.selectFork(mainnetFork);
        bytes memory _lzArgs = poolRegistry_mainnet.quoter().getLeverageSwapAndCallbackLzArgs({
            srcChainId_: LZ_OP_CHAIN_ID,
            dstChainId_: LZ_MAINNET_CHAIN_ID
        });

        uint256 missingFee = 0.0001e18;

        {
            (uint16 _dstChainId, uint256 _callbackTxNativeFee, uint64 _leverageSwapTxGasLimit) = CrossChainLib
                .decodeLzArgs(_lzArgs);

            // Setting lower fee than the needed
            _lzArgs = CrossChainLib.encodeLzArgs(
                _dstChainId,
                _callbackTxNativeFee - missingFee,
                _leverageSwapTxGasLimit
            );
        }

        // tx1
        _crossChainLeverage({
            amountIn_: 1000e6,
            swapAmountOutMin_: 0,
            leverage_: 1.5e18,
            depositAmountMin_: 1450e18,
            lzArgs_: _lzArgs
        });
        (Vm.Log memory SendToChain, Vm.Log memory Packet, Vm.Log memory RelayerParams) = _getOftTransferEvents();

        // tx2 - fail
        _executeSwapAndTriggerCallback(SendToChain, Packet, RelayerParams);
        (, Vm.Log memory CallOFTReceivedFailure, ) = _getOftTransferErrorEvents();
        assertGt(CallOFTReceivedFailure.data.length, 0);
        (
            uint16 srcChainId,
            address to,
            bytes memory srcAddress,
            uint64 nonce,
            bytes memory from,
            uint amount,
            bytes memory payload,
            bytes memory reason
        ) = _decodeCallOFTReceivedFailureEvent(CallOFTReceivedFailure);
        assertEq(reason.length, 0); // "EvmError: OutOfFund"

        // tx2
        // Works after top-up with enough ether
        deal(address(crossChainDispatcher_mainnet), address(crossChainDispatcher_mainnet).balance + (2 * missingFee)); // Sending more than needed
        proxyOFT_msUSD_mainnet.retryOFTReceived(srcChainId, srcAddress, nonce, from, to, amount, payload);
        assertEq(address(crossChainDispatcher_mainnet).balance, missingFee); // Should refund excess

        (Vm.Log memory Swap, Vm.Log memory Packet_Tx2, Vm.Log memory RelayerParams_Tx2) = _getSgSwapEvents();

        // tx3
        _executeCallback(Swap, Packet_Tx2, RelayerParams_Tx2);

        //
        // then
        //
        uint256 _debtAfter = pool_optimism.debtOf(alice);
        assertGt(_debtAfter, 0);
    }

    function test_failedTx2_whenSgSlippageIsTooHigh() external {
        //
        // given
        //
        vm.selectFork(mainnetFork);
        // It will make mainnet's stargate call to fail
        crossChainDispatcher_mainnet.updateStargateSlippage(0);

        //
        // when
        //

        // tx1
        _crossChainLeverage({amountIn_: 1000e6, swapAmountOutMin_: 0, leverage_: 1.5e18, depositAmountMin_: 1450e18});
        (Vm.Log memory SendToChain, Vm.Log memory Packet, Vm.Log memory RelayerParams) = _getOftTransferEvents();

        // tx2 - fail
        _executeSwapAndTriggerCallback(SendToChain, Packet, RelayerParams);
        (, Vm.Log memory CallOFTReceivedFailure, ) = _getOftTransferErrorEvents();
        (
            uint16 srcChainId,
            ,
            bytes memory srcAddress,
            uint64 nonce,
            ,
            uint amount,
            bytes memory payload,
            bytes memory reason
        ) = _decodeCallOFTReceivedFailureEvent(CallOFTReceivedFailure);
        assertEq(reason.slice(4, reason.length - 4), abi.encode("Stargate: slippage too high"));

        // tx2
        // Retry will work after amending state
        crossChainDispatcher_mainnet.updateStargateSlippage(20);
        vm.prank(alice);
        crossChainDispatcher_mainnet.retrySwapAndTriggerLeverageCallback(
            srcChainId,
            srcAddress,
            nonce,
            amount,
            payload,
            500e6 // Correct slippage
        );
        (Vm.Log memory SwapTx2, Vm.Log memory PacketTx2, Vm.Log memory RelayerParamsTx2) = _getSgSwapEvents();

        // tx3
        _executeCallback(SwapTx2, PacketTx2, RelayerParamsTx2);

        //
        // then
        //
        (, uint256 _depositInUsdAfter, uint256 _debtInUsdAfter, , ) = pool_optimism.debtPositionOf(alice);
        assertApproxEqAbs(_depositInUsdAfter, 1500e18, 1e18);
        assertEq(_debtInUsdAfter, 500e18);
    }

    function test_failedTx2_whenOOG() external {
        //
        // given
        //
        vm.selectFork(optimismFork);
        (, uint256 _depositInUsdBefore, uint256 _debtInUsdBefore, , ) = pool_optimism.debtPositionOf(alice);
        assertEq(_depositInUsdBefore, 0);
        assertEq(_debtInUsdBefore, 0);
        vm.selectFork(mainnetFork);
        crossChainDispatcher_mainnet.updateLeverageSwapTxGasLimit(100_000);

        //
        // when
        //

        // tx1
        _crossChainLeverage({amountIn_: 1000e6, swapAmountOutMin_: 0, leverage_: 1.5e18, depositAmountMin_: 1450e18});
        (Vm.Log memory SendToChain, Vm.Log memory Packet, Vm.Log memory RelayerParams) = _getOftTransferEvents();

        // tx2 - fail
        _executeSwapAndTriggerCallback(SendToChain, Packet, RelayerParams);
        (, Vm.Log memory CallOFTReceivedFailure, ) = _getOftTransferErrorEvents();
        (
            uint16 srcChainId,
            address to,
            bytes memory srcAddress,
            uint64 nonce,
            bytes memory from,
            uint amount,
            bytes memory payload,
            bytes memory reason
        ) = _decodeCallOFTReceivedFailureEvent(CallOFTReceivedFailure);
        assertEq(reason, ""); // OOG

        // tx2
        proxyOFT_msUSD_mainnet.retryOFTReceived(srcChainId, srcAddress, nonce, from, to, amount, payload);
        (Vm.Log memory Swap, Vm.Log memory Packet_Tx2, Vm.Log memory RelayerParams_Tx2) = _getSgSwapEvents();

        // tx3
        _executeCallback(Swap, Packet_Tx2, RelayerParams_Tx2);

        //
        // then
        //
        (, uint256 _depositInUsdAfter, uint256 _debtInUsdAfter, , ) = pool_optimism.debtPositionOf(alice);
        assertApproxEqAbs(_depositInUsdAfter, 1500e18, 1e18);
        assertEq(_debtInUsdAfter, 500e18);
    }

    function test_failedTx3_whenOOG() external {
        //
        // given
        //
        vm.selectFork(optimismFork);
        (, uint256 _depositInUsdBefore, uint256 _debtInUsdBefore, , ) = pool_optimism.debtPositionOf(alice);
        assertEq(_depositInUsdBefore, 0);
        assertEq(_debtInUsdBefore, 0);
        vm.selectFork(mainnetFork);
        crossChainDispatcher_mainnet.updateLeverageCallbackTxGasLimit(100_000);

        //
        // when
        //

        // tx1
        _crossChainLeverage({amountIn_: 1000e6, swapAmountOutMin_: 0, leverage_: 1.5e18, depositAmountMin_: 1450e18});
        (Vm.Log memory SendToChain, Vm.Log memory Packet, Vm.Log memory RelayerParams) = _getOftTransferEvents();

        // tx2
        _executeSwapAndTriggerCallback(SendToChain, Packet, RelayerParams);
        (Vm.Log memory Swap, Vm.Log memory Packet_Tx2, Vm.Log memory RelayerParams_Tx2) = _getSgSwapEvents();

        // tx3 - fail
        _executeCallback(Swap, Packet_Tx2, RelayerParams_Tx2);
        (Vm.Log memory CachedSwapSaved, ) = _getSgSwapErrorEvents();
        (uint16 chainId, bytes memory srcAddress, uint256 nonce, , , , , bytes memory reason) = abi.decode(
            CachedSwapSaved.data,
            (uint16, bytes, uint256, address, uint256, address, bytes, bytes)
        );
        assertEq(reason, ""); // OOG

        // tx3
        sgRouter_optimism.clearCachedSwap(chainId, srcAddress, nonce);

        //
        // then
        //
        (, uint256 _depositInUsdAfter, uint256 _debtInUsdAfter, , ) = pool_optimism.debtPositionOf(alice);
        assertApproxEqAbs(_depositInUsdAfter, 1500e18, 1e18);
        assertEq(_debtInUsdAfter, 500e18);
    }

    function test_failedTx2_whenLowAirdrop() external {
        //
        // given
        //
        vm.selectFork(optimismFork);
        (, uint256 _depositInUsdBefore, uint256 _debtInUsdBefore, , ) = pool_optimism.debtPositionOf(alice);
        assertEq(_depositInUsdBefore, 0);
        assertEq(_debtInUsdBefore, 0);

        //
        // when
        //

        // tx1
        _crossChainLeverage({amountIn_: 1000e6, swapAmountOutMin_: 0, leverage_: 1.5e18, depositAmountMin_: 1450e18});
        (Vm.Log memory SendToChain, Vm.Log memory Packet, Vm.Log memory RelayerParams) = _getOftTransferEvents();

        // tx2 - fail
        _executeSwapAndTriggerCallbackWithoutAirdrop(SendToChain, Packet, RelayerParams);
        (, Vm.Log memory CallOFTReceivedFailure, ) = _getOftTransferErrorEvents();
        (
            uint16 srcChainId,
            address to,
            bytes memory srcAddress,
            uint64 nonce,
            bytes memory from,
            uint amount,
            bytes memory payload,
            bytes memory reason
        ) = _decodeCallOFTReceivedFailureEvent(CallOFTReceivedFailure);
        assertEq(reason, ""); // OOF

        // tx2
        deal(address(crossChainDispatcher_mainnet), 1 ether);
        proxyOFT_msUSD_mainnet.retryOFTReceived(srcChainId, srcAddress, nonce, from, to, amount, payload);
        (Vm.Log memory Swap, Vm.Log memory Packet_Tx2, Vm.Log memory RelayerParams_Tx2) = _getSgSwapEvents();

        // tx3
        _executeCallback(Swap, Packet_Tx2, RelayerParams_Tx2);

        //
        // then
        //
        (, uint256 _depositInUsdAfter, uint256 _debtInUsdAfter, , ) = pool_optimism.debtPositionOf(alice);
        assertApproxEqAbs(_depositInUsdAfter, 1500e18, 1e18);
        assertEq(_debtInUsdAfter, 500e18);
    }
}
