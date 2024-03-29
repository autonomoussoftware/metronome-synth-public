// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "./CrossChains.t.sol";

contract CrossChainFlashRepay_Test is CrossChains_Test {
    using stdStorage for StdStorage;
    using WadRayMath for uint256;
    using BytesLib for bytes;

    function _depositAndIssue(uint256 depositAmount_, uint256 issueAmount_) private {
        _depositAndIssue({
            depositToken_: msdVaUSDC_optimism,
            depositAmount_: depositAmount_,
            debtToken_: msUSDDebt_optimism,
            issueAmount_: issueAmount_
        });
    }

    function _depositAndIssue(
        DepositToken depositToken_,
        uint256 depositAmount_,
        DebtToken debtToken_,
        uint256 issueAmount_
    ) private {
        vm.selectFork(optimismFork);

        vm.startPrank(alice);
        deal(address(depositToken_.underlying()), alice, depositAmount_);
        depositToken_.underlying().approve(address(depositToken_), type(uint256).max);
        depositToken_.deposit(depositAmount_, alice);
        debtToken_.issue(issueAmount_, alice);
        vm.stopPrank();
    }

    function _crossChainFlashRepay(
        uint256 withdrawAmount_,
        uint256 swapAmountOutMin_,
        uint256 repayAmountMin_
    ) private {
        _crossChainFlashRepay(msdVaUSDC_optimism, usdc_optimism, withdrawAmount_, swapAmountOutMin_, repayAmountMin_);
    }

    function _crossChainFlashRepay(
        DepositToken depositToken_,
        uint256 withdrawAmount_,
        uint256 swapAmountOutMin_,
        uint256 repayAmountMin_
    ) private {
        _crossChainFlashRepay(depositToken_, usdc_optimism, withdrawAmount_, swapAmountOutMin_, repayAmountMin_);
    }

    function _crossChainFlashRepay(
        DepositToken depositToken_,
        IERC20 bridgeToken_,
        uint256 withdrawAmount_,
        uint256 swapAmountOutMin_,
        uint256 repayAmountMin_
    ) private {
        vm.recordLogs();

        vm.selectFork(mainnetFork);
        bytes memory _lzArgs = poolRegistry_mainnet.quoter().getFlashRepaySwapAndCallbackLzArgs({
            srcChainId_: LZ_OP_CHAIN_ID,
            dstChainId_: LZ_MAINNET_CHAIN_ID
        });

        vm.selectFork(optimismFork);
        uint256 fee = poolRegistry_optimism.quoter().quoteCrossChainFlashRepayNativeFee(
            proxyOFT_msUSD_optimism,
            _lzArgs
        );
        deal(alice, fee);

        vm.startPrank(alice);
        smartFarmingManager_optimism.crossChainFlashRepay{value: fee}({
            syntheticToken_: msUSD_optimism,
            depositToken_: depositToken_,
            withdrawAmount_: withdrawAmount_,
            bridgeToken_: bridgeToken_,
            bridgeTokenAmountMin_: 0,
            repayAmountMin_: repayAmountMin_,
            swapAmountOutMin_: swapAmountOutMin_,
            lzArgs_: _lzArgs
        });
        vm.stopPrank();

        assertEq(alice.balance, 0, "fee-estimation-is-not-accurate");
    }

    function _executeSwapAndTriggerCallbackWithoutAirdrop(
        Vm.Log memory Swap,
        Vm.Log memory Packet,
        Vm.Log memory RelayerParams
    ) internal {
        _executeSgSwapArrivalTx(Swap, Packet, RelayerParams, false);
    }

    function _executeSwapAndTriggerCallback(
        Vm.Log memory Swap,
        Vm.Log memory Packet,
        Vm.Log memory RelayerParams
    ) internal {
        _executeSgSwapArrivalTx(Swap, Packet, RelayerParams);
    }

    function _executeCallback(Vm.Log memory SendToChain, Vm.Log memory Packet, Vm.Log memory RelayerParams) internal {
        _executeOftTransferArrivalTx(SendToChain, Packet, RelayerParams);
    }

    function test_crossChainFlashRepay() external {
        //
        // given
        //
        _depositAndIssue({depositAmount_: 2000e18, issueAmount_: 500e18});
        (, uint256 _depositInUsdBefore, uint256 _debtInUsdBefore, , ) = pool_optimism.debtPositionOf(alice);
        assertApproxEqAbs(_depositInUsdBefore, 2000e18, 1e18);
        assertApproxEqAbs(_debtInUsdBefore, 500e18, 1e18);

        //
        // when
        //

        // tx1
        _crossChainFlashRepay({withdrawAmount_: 500e18, swapAmountOutMin_: 0, repayAmountMin_: 0});
        (Vm.Log memory Swap, Vm.Log memory Packet, Vm.Log memory RelayerParams) = _getSgSwapEvents();

        // tx2
        _executeSwapAndTriggerCallback(Swap, Packet, RelayerParams);
        (Vm.Log memory SendToChain, Vm.Log memory PacketTx2, Vm.Log memory RelayerParamsTx2) = _getOftTransferEvents();

        // tx3
        _executeCallback(SendToChain, PacketTx2, RelayerParamsTx2);

        //
        // then
        //
        (, uint256 _depositInUsdAfter, uint256 _debtInUsdAfter, , ) = pool_optimism.debtPositionOf(alice);
        assertApproxEqAbs(_depositInUsdAfter, 1500e18, 1e18);
        assertApproxEqAbs(_debtInUsdAfter, 0, 1e18);
        assertEq(address(proxyOFT_msUSD_mainnet).balance, 0, "fee-estimation-is-not-accurate");
    }

    function test_crossChainFlashRepay_with_nakedCollateral() external {
        //
        // given
        //
        _depositAndIssue({
            depositToken_: msdUSDC_optimism,
            depositAmount_: 2000e6,
            debtToken_: msUSDDebt_optimism,
            issueAmount_: 500e18
        });
        (, uint256 _depositInUsdBefore, uint256 _debtInUsdBefore, , ) = pool_optimism.debtPositionOf(alice);
        assertApproxEqAbs(_depositInUsdBefore, 2000e18, 1e18);
        assertApproxEqAbs(_debtInUsdBefore, 500e18, 1e18);

        //
        // when
        //

        // tx1
        _crossChainFlashRepay({
            depositToken_: msdUSDC_optimism,
            withdrawAmount_: 500e6,
            swapAmountOutMin_: 0,
            repayAmountMin_: 0
        });
        (Vm.Log memory Swap, Vm.Log memory Packet, Vm.Log memory RelayerParams) = _getSgSwapEvents();

        // tx2
        _executeSwapAndTriggerCallback(Swap, Packet, RelayerParams);
        (Vm.Log memory SendToChain, Vm.Log memory PacketTx2, Vm.Log memory RelayerParamsTx2) = _getOftTransferEvents();

        // tx3
        _executeCallback(SendToChain, PacketTx2, RelayerParamsTx2);

        //
        // then
        //
        (, uint256 _depositInUsdAfter, uint256 _debtInUsdAfter, , ) = pool_optimism.debtPositionOf(alice);
        assertApproxEqAbs(_depositInUsdAfter, 1500e18, 1e18);
        assertApproxEqAbs(_debtInUsdAfter, 0, 1e18);
        assertEq(address(proxyOFT_msUSD_mainnet).balance, 0, "fee-estimation-is-not-accurate");
    }

    function test_crossChainFlashRepay_with_weth() external {
        //
        // given
        //
        _depositAndIssue({
            depositToken_: msdVaETH_optimism,
            depositAmount_: 1e18,
            debtToken_: msUSDDebt_optimism,
            issueAmount_: 500e18
        });
        (, uint256 _depositInUsdBefore, uint256 _debtInUsdBefore, , ) = pool_optimism.debtPositionOf(alice);
        assertApproxEqAbs(_depositInUsdBefore, 2000e18, 1e18);
        assertApproxEqAbs(_debtInUsdBefore, 500e18, 1e18);

        //
        // when
        //

        // tx1
        _crossChainFlashRepay({
            depositToken_: msdVaETH_optimism,
            bridgeToken_: weth_optimism,
            withdrawAmount_: 0.25e18,
            swapAmountOutMin_: 0,
            repayAmountMin_: 0
        });
        (Vm.Log memory Swap, Vm.Log memory Packet, Vm.Log memory RelayerParams) = _getSgSwapEvents();

        // tx2
        _executeSwapAndTriggerCallback(Swap, Packet, RelayerParams);
        (Vm.Log memory SendToChain, Vm.Log memory PacketTx2, Vm.Log memory RelayerParamsTx2) = _getOftTransferEvents();

        // tx3
        _executeCallback(SendToChain, PacketTx2, RelayerParamsTx2);

        //
        // then
        //
        (, uint256 _depositInUsdAfter, uint256 _debtInUsdAfter, , ) = pool_optimism.debtPositionOf(alice);
        assertApproxEqAbs(_depositInUsdAfter, 1500e18, 1e18);
        assertApproxEqAbs(_debtInUsdAfter, 0, 1e18);
        assertEq(address(proxyOFT_msUSD_mainnet).balance, 0, "fee-estimation-is-not-accurate");
    }

    function test_failedTx2_whenUnderlyingTransferReverted() external {
        //
        // given
        //

        vm.selectFork(mainnetFork);
        uint256 amountInUsdc = usdc_mainnet.balanceOf(SG_MAINNET_USDC_POOL) * 4;
        vm.selectFork(optimismFork);
        // Making amount to bridge from L2 to mainnet be higher than the SG Pool liquidity
        _addSgLiquidity(SG_OP_USDC_POOL, amountInUsdc);
        uint256 amountInVaUSDC = masterOracle_optimism.quote(
            address(usdc_optimism),
            address(vaUSDC_optimism),
            amountInUsdc
        );
        uint256 amountInMsUSD = masterOracle_optimism.quote(
            address(usdc_optimism),
            address(msUSD_optimism),
            amountInUsdc
        );
        _depositAndIssue({depositAmount_: amountInVaUSDC, issueAmount_: amountInMsUSD / 3});
        uint256 debtInUsdBefore = pool_optimism.debtOf(alice);

        //
        // when
        //

        // tx1
        _crossChainFlashRepay({withdrawAmount_: amountInVaUSDC / 5, swapAmountOutMin_: 0, repayAmountMin_: 0});
        (Vm.Log memory Swap, Vm.Log memory Packet, Vm.Log memory RelayerParams) = _getSgSwapEvents();

        // tx2 - fail
        _executeSwapAndTriggerCallback(Swap, Packet, RelayerParams);
        (, , Vm.Log memory Revert, ) = _getSgSwapErrorEvents();
        assertGt(Revert.data.length, 0); // Emitted `Revert` event
        (uint16 chainId, bytes memory srcAddress, uint256 nonce) = _decodeRevertEvent(Revert);

        // tx2 - fail
        // Same state, retry will fail too
        sgRouter_mainnet.retryRevert(chainId, srcAddress, nonce);
        (, , Revert, ) = _getSgSwapErrorEvents();
        assertGt(Revert.data.length, 0); // Emitted `Revert` event

        // tx2
        // Retry will work after adding liquidity to the SG Pool
        _addSgLiquidity(SG_MAINNET_USDC_POOL, amountInUsdc);
        sgRouter_mainnet.retryRevert(chainId, srcAddress, nonce);
        (
            Vm.Log memory SendToChain,
            Vm.Log memory Packet_Tx2,
            Vm.Log memory RelayerParams_Tx2
        ) = _getOftTransferEvents();

        // tx3
        _executeCallback(SendToChain, Packet_Tx2, RelayerParams_Tx2);

        //
        // then
        //
        vm.selectFork(optimismFork);
        uint256 debtInUsdAfter = pool_optimism.debtOf(alice);
        assertLt(debtInUsdAfter, debtInUsdBefore);
    }

    function test_failedTx2_whenSgReceiveReverted() external {
        //
        // given
        //
        _depositAndIssue({depositAmount_: 2000e18, issueAmount_: 500e18});
        (, uint256 _depositInUsdBefore, uint256 _debtInUsdBefore, , ) = pool_optimism.debtPositionOf(alice);
        assertApproxEqAbs(_depositInUsdBefore, 2000e18, 1e18);
        assertApproxEqAbs(_debtInUsdBefore, 500e18, 1e18);

        //
        // when
        //

        // tx1
        // `swapAmountOutMin_` too high
        _crossChainFlashRepay({withdrawAmount_: 500e18, swapAmountOutMin_: 500e18, repayAmountMin_: 0});
        (Vm.Log memory Swap, Vm.Log memory Packet, Vm.Log memory RelayerParams) = _getSgSwapEvents();

        // tx2 - fail
        _executeSwapAndTriggerCallback(Swap, Packet, RelayerParams);
        (, Vm.Log memory CachedSwapSaved, , Vm.Log memory SwapRemote) = _getSgSwapErrorEvents();
        assertGt(CachedSwapSaved.data.length, 0); // Emitted `Revert` event
        (uint16 chainId, bytes memory srcAddress, , uint256 nonce, ) = _decodeCachedSwapSavedSgComposerEvent(
            CachedSwapSaved,
            SwapRemote
        );

        // tx2
        // Retry will work after amending slippage
        (, , uint256 _amount, , uint256 dstPoolId, , , bytes memory sgPayload) = _decodeSgSwapEvents(Swap, Packet);
        address _token = IStargatePool(IStargateFactory(sgComposer_mainnet.factory()).getPool(dstPoolId)).token();

        vm.prank(alice);
        crossChainDispatcher_mainnet.retrySwapAndTriggerFlashRepayCallback(
            chainId,
            srcAddress,
            uint64(nonce),
            _token,
            _amount,
            sgPayload.slice(40, sgPayload.length - 40),
            480e18 // Correct slippage
        );

        (Vm.Log memory SendToChain, Vm.Log memory PacketTx2, Vm.Log memory RelayerParamsTx2) = _getOftTransferEvents();

        // tx3
        _executeCallback(SendToChain, PacketTx2, RelayerParamsTx2);

        //
        // then
        //
        (, uint256 _depositInUsdAfter, uint256 _debtInUsdAfter, , ) = pool_optimism.debtPositionOf(alice);
        assertApproxEqAbs(_depositInUsdAfter, 1500e18, 1e18);
        assertApproxEqAbs(_debtInUsdAfter, 0, 1e18);
        assertEq(address(crossChainDispatcher_mainnet).balance, 0, "fee-estimation-is-not-accurate");
    }

    function test_failedTx3_whenSynthTransferReverted() external {
        //
        // given
        //

        // It will make OP's bridge minting to fail
        vm.selectFork(optimismFork);
        msUSD_optimism.updateMaxBridgedInSupply(0);

        _depositAndIssue({depositAmount_: 2000e18, issueAmount_: 500e18});

        //
        // when
        //

        // tx1
        _crossChainFlashRepay({withdrawAmount_: 500e18, swapAmountOutMin_: 0, repayAmountMin_: 0});
        (Vm.Log memory Swap, Vm.Log memory Packet, Vm.Log memory RelayerParams) = _getSgSwapEvents();

        // tx2
        _executeSwapAndTriggerCallback(Swap, Packet, RelayerParams);
        (
            Vm.Log memory SendToChain,
            Vm.Log memory Packet_Tx2,
            Vm.Log memory RelayerParams_Tx2
        ) = _getOftTransferEvents();

        // tx3 - fail
        _executeCallback(SendToChain, Packet_Tx2, RelayerParams_Tx2);
        (Vm.Log memory MessageFailed, , ) = _getOftTransferErrorEvents();
        (uint16 _srcChainId, bytes memory _srcAddress, uint64 _nonce, bytes memory _payload, bytes memory reason) = abi
            .decode(MessageFailed.data, (uint16, bytes, uint64, bytes, bytes));
        assertEq(reason, abi.encodeWithSignature("SurpassMaxBridgingSupply()"));

        // tx3 - fail
        // Same state, retry will fail too
        vm.expectRevert();
        proxyOFT_msUSD_optimism.retryMessage(_srcChainId, _srcAddress, _nonce, _payload);

        // tx3
        // Retry will work after amending state
        msUSD_optimism.updateMaxBridgedInSupply(type(uint256).max);
        proxyOFT_msUSD_optimism.retryMessage(_srcChainId, _srcAddress, _nonce, _payload);

        //
        // then
        //
        assertApproxEqAbs(pool_optimism.debtOf(alice), 0, 1e18);
    }

    function test_failedTx3_whenOnOFTReceivedReverted() external {
        //
        // given
        //
        _depositAndIssue({depositAmount_: 2000e18, issueAmount_: 500e18});

        //
        // when
        //

        // tx1
        // Using too high `repayAmountMin_`
        _crossChainFlashRepay({withdrawAmount_: 500e18, swapAmountOutMin_: 0, repayAmountMin_: 500e18});
        (Vm.Log memory Swap, Vm.Log memory Packet, Vm.Log memory RelayerParams) = _getSgSwapEvents();

        // tx2
        _executeSwapAndTriggerCallback(Swap, Packet, RelayerParams);
        (
            Vm.Log memory SendToChain,
            Vm.Log memory Packet_Tx2,
            Vm.Log memory RelayerParams_Tx2
        ) = _getOftTransferEvents();

        // tx3 - fail
        _executeCallback(SendToChain, Packet_Tx2, RelayerParams_Tx2);
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
        assertEq(reason, abi.encodeWithSignature("FlashRepaySlippageTooHigh()"));

        // tx3 - fail
        // Same state, retry will fail too
        vm.expectRevert();
        smartFarmingManager_optimism.retryCrossChainFlashRepayCallback(
            srcChainId,
            srcAddress,
            nonce,
            amount,
            payload,
            500e18 // wrong slippage
        );

        // tx3
        // Retry will work after fix slippage
        vm.prank(alice);
        smartFarmingManager_optimism.retryCrossChainFlashRepayCallback(
            srcChainId,
            srcAddress,
            nonce,
            amount,
            payload,
            490e18 // correct slippage
        );

        //
        // then
        //
        assertApproxEqAbs(pool_optimism.debtOf(alice), 0, 1e18);
    }

    function test_failedTx2_whenOOG() external {
        //
        // given
        //
        _depositAndIssue({depositAmount_: 2000e18, issueAmount_: 500e18});
        (, uint256 _depositInUsdBefore, uint256 _debtInUsdBefore, , ) = pool_optimism.debtPositionOf(alice);
        assertApproxEqAbs(_depositInUsdBefore, 2000e18, 1e18);
        assertApproxEqAbs(_debtInUsdBefore, 500e18, 1e18);
        vm.selectFork(mainnetFork);
        crossChainDispatcher_mainnet.updateFlashRepaySwapTxGasLimit(100_000);

        //
        // when
        //

        // tx1
        _crossChainFlashRepay({withdrawAmount_: 500e18, swapAmountOutMin_: 0, repayAmountMin_: 0});
        (Vm.Log memory Swap, Vm.Log memory Packet, Vm.Log memory RelayerParams) = _getSgSwapEvents();

        // tx2 - fail
        _executeSwapAndTriggerCallback(Swap, Packet, RelayerParams);
        (, Vm.Log memory CachedSwapSaved, , Vm.Log memory SwapRemote) = _getSgSwapErrorEvents();
        (
            uint16 chainId,
            bytes memory srcAddress,
            ,
            uint256 nonce,
            bytes memory reason
        ) = _decodeCachedSwapSavedSgComposerEvent(CachedSwapSaved, SwapRemote);
        assertEq(reason, ""); // OOG

        // tx2
        (, , uint256 amount, , uint256 dstPoolId, , , bytes memory sgPayload) = _decodeSgSwapEvents(Swap, Packet);
        address token = IStargatePool(IStargateFactory(sgComposer_mainnet.factory()).getPool(dstPoolId)).token();
        bytes memory payload = sgPayload.slice(40, sgPayload.length - 40);
        crossChainDispatcher_mainnet.retrySwapAndTriggerFlashRepayCallback(
            chainId,
            srcAddress,
            uint64(nonce),
            token,
            amount,
            payload,
            0
        );
        (Vm.Log memory SendToChain, Vm.Log memory PacketTx2, Vm.Log memory RelayerParamsTx2) = _getOftTransferEvents();

        // tx3
        _executeCallback(SendToChain, PacketTx2, RelayerParamsTx2);

        //
        // then
        //
        (, uint256 _depositInUsdAfter, uint256 _debtInUsdAfter, , ) = pool_optimism.debtPositionOf(alice);
        assertApproxEqAbs(_depositInUsdAfter, 1500e18, 1e18);
        assertApproxEqAbs(_debtInUsdAfter, 0, 1e18);
    }

    function test_failedTx3_whenOOG() external {
        //
        // given
        //
        _depositAndIssue({depositAmount_: 2000e18, issueAmount_: 500e18});
        (, uint256 _depositInUsdBefore, uint256 _debtInUsdBefore, , ) = pool_optimism.debtPositionOf(alice);
        assertApproxEqAbs(_depositInUsdBefore, 2000e18, 1e18);
        assertApproxEqAbs(_debtInUsdBefore, 500e18, 1e18);
        vm.selectFork(mainnetFork);
        crossChainDispatcher_mainnet.updateFlashRepayCallbackTxGasLimit(50_000);

        //
        // when
        //

        // tx1
        _crossChainFlashRepay({withdrawAmount_: 500e18, swapAmountOutMin_: 0, repayAmountMin_: 0});
        (Vm.Log memory Swap, Vm.Log memory Packet, Vm.Log memory RelayerParams) = _getSgSwapEvents();

        // tx2
        _executeSwapAndTriggerCallback(Swap, Packet, RelayerParams);
        (Vm.Log memory SendToChain, Vm.Log memory PacketTx2, Vm.Log memory RelayerParamsTx2) = _getOftTransferEvents();

        // tx3 - fail
        _executeCallback(SendToChain, PacketTx2, RelayerParamsTx2);
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
        assertEq(reason, ""); // OOG

        // tx3
        smartFarmingManager_optimism.retryCrossChainFlashRepayCallback(
            srcChainId,
            srcAddress,
            nonce,
            amount,
            payload,
            0
        );

        //
        // then
        //
        (, uint256 _depositInUsdAfter, uint256 _debtInUsdAfter, , ) = pool_optimism.debtPositionOf(alice);
        assertApproxEqAbs(_depositInUsdAfter, 1500e18, 1e18);
        assertApproxEqAbs(_debtInUsdAfter, 0, 1e18);
    }

    function test_failedTx2_whenLowAirdrop() external {
        //
        // given
        //
        _depositAndIssue({depositAmount_: 2000e18, issueAmount_: 500e18});
        (, uint256 _depositInUsdBefore, uint256 _debtInUsdBefore, , ) = pool_optimism.debtPositionOf(alice);
        assertApproxEqAbs(_depositInUsdBefore, 2000e18, 1e18);
        assertApproxEqAbs(_debtInUsdBefore, 500e18, 1e18);
        vm.selectFork(mainnetFork);

        //
        // when
        //

        // tx1
        _crossChainFlashRepay({withdrawAmount_: 500e18, swapAmountOutMin_: 0, repayAmountMin_: 0});
        (Vm.Log memory Swap, Vm.Log memory Packet, Vm.Log memory RelayerParams) = _getSgSwapEvents();

        // tx2 - fail
        _executeSwapAndTriggerCallbackWithoutAirdrop(Swap, Packet, RelayerParams);
        (, Vm.Log memory CachedSwapSaved, , Vm.Log memory SwapRemote) = _getSgSwapErrorEvents();
        (
            uint16 chainId,
            bytes memory srcAddress,
            ,
            uint256 nonce,
            bytes memory reason
        ) = _decodeCachedSwapSavedSgComposerEvent(CachedSwapSaved, SwapRemote);
        assertEq(reason, ""); // OOF

        // tx2
        (, , uint256 amount, , uint256 dstPoolId, , , bytes memory sgPayload_) = _decodeSgSwapEvents(Swap, Packet);
        address token = IStargatePool(IStargateFactory(sgComposer_mainnet.factory()).getPool(dstPoolId)).token();
        bytes memory payload = sgPayload_.slice(40, sgPayload_.length - 40);
        crossChainDispatcher_mainnet.retrySwapAndTriggerFlashRepayCallback{value: 1 ether}(
            chainId,
            srcAddress,
            uint64(nonce),
            token,
            amount,
            payload,
            0
        );
        (Vm.Log memory SendToChain, Vm.Log memory PacketTx2, Vm.Log memory RelayerParamsTx2) = _getOftTransferEvents();

        // tx3
        _executeCallback(SendToChain, PacketTx2, RelayerParamsTx2);

        //
        // then
        //
        (, uint256 _depositInUsdAfter, uint256 _debtInUsdAfter, , ) = pool_optimism.debtPositionOf(alice);
        assertApproxEqAbs(_depositInUsdAfter, 1500e18, 1e18);
        assertApproxEqAbs(_debtInUsdAfter, 0, 1e18);
    }

    function test_failedTx3_whenSwapOutIsTooHigh() external {
        //
        // given
        //
        _depositAndIssue({depositAmount_: 2000e18, issueAmount_: 500e18});
        (, uint256 _depositInUsdBefore, uint256 _debtInUsdBefore, , ) = pool_optimism.debtPositionOf(alice);
        assertApproxEqAbs(_depositInUsdBefore, 2000e18, 1e18);
        assertApproxEqAbs(_debtInUsdBefore, 500e18, 1e18);
        uint256 msUSD_before = msUSD_optimism.balanceOf(alice);

        //
        // when
        //

        // tx1
        _crossChainFlashRepay({
            withdrawAmount_: 600e18, // $100 in excess
            swapAmountOutMin_: 0,
            repayAmountMin_: 0
        });
        (Vm.Log memory Swap, Vm.Log memory Packet, Vm.Log memory RelayerParams) = _getSgSwapEvents();

        // tx2
        _executeSwapAndTriggerCallback(Swap, Packet, RelayerParams);
        (Vm.Log memory SendToChain, Vm.Log memory PacketTx2, Vm.Log memory RelayerParamsTx2) = _getOftTransferEvents();

        // tx3
        _executeCallback(SendToChain, PacketTx2, RelayerParamsTx2);

        //
        // then
        //
        (, uint256 _depositInUsdAfter, uint256 _debtInUsdAfter, , ) = pool_optimism.debtPositionOf(alice);
        assertApproxEqAbs(_depositInUsdAfter, 1400e18, 1e18);
        assertApproxEqAbs(_debtInUsdAfter, 0, 1e18);
        assertApproxEqAbs(msUSD_optimism.balanceOf(alice), msUSD_before + 100e18, 1e18); // refunded excess amount
    }
}
