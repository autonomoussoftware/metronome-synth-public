// SPDX-License-Identifier: MIT

pragma solidity 0.8.9;

import "./UpgraderBase.sol";

contract SyntheticTokenUpgrader is UpgraderBase {
    constructor(address _owner) {
        transferOwnership(_owner);
    }

    function _calls() internal pure override returns (bytes[] memory calls) {
        calls = new bytes[](8);
        calls[0] = abi.encodeWithSignature("name()");
        calls[1] = abi.encodeWithSignature("symbol()");
        calls[2] = abi.encodeWithSignature("decimals()");
        calls[3] = abi.encodeWithSignature("totalSupply()");
        calls[4] = abi.encodeWithSignature("maxTotalSupplyInUsd()");
        calls[5] = abi.encodeWithSignature("interestRate()");
        calls[6] = abi.encodeWithSignature("debtToken()");
        calls[7] = abi.encodeWithSignature("isActive()");
    }

    function _checkResults(bytes[] memory _beforeResults, bytes[] memory _afterResults) internal pure override {
        _checkStringResults(_beforeResults, _afterResults, 0, 1);
        _checkUint8Results(_beforeResults, _afterResults, 2, 2);
        _checkUint256Results(_beforeResults, _afterResults, 3, 5);
        _checkAddressResults(_beforeResults, _afterResults, 6, 6);
        _checkBooleanResults(_beforeResults, _afterResults, 7, 7);
    }
}
