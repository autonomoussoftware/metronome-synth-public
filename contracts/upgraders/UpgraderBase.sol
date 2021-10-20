// SPDX-License-Identifier: MIT

pragma solidity 0.8.9;

import "../dependencies/openzeppelin/proxy/transparent/ProxyAdmin.sol";
import "../dependencies/openzeppelin//proxy/transparent/TransparentUpgradeableProxy.sol";
import "../interface/multicall/IMulticall.sol";

abstract contract UpgraderBase is ProxyAdmin {
    address public multicall;

    constructor(address) {
        // Note: hardhat-deploy doesn't support passings args to a custom ProxyAdmin contract
        // There is an open PR to address this: https://github.com/wighawag/hardhat-deploy/pull/142
        // TODO: If take too long for their to support it, we could deploy using DefaultProxyAdmin and transfer ownership to upgraders manually
        // multicall = _multicall;
        multicall = 0xeefBa1e63905eF1D7ACbA5a8513c70307C1cE441;
    }

    function upgrade(TransparentUpgradeableProxy _proxy, address _implementation) public override onlyOwner {
        bytes[] memory calls = _calls();
        bytes[] memory beforeResults = _aggregate(_proxy, calls);

        _proxy.upgradeTo(_implementation);

        bytes[] memory afterResults = _aggregate(_proxy, calls);
        _checkResults(beforeResults, afterResults);
    }

    function upgradeAndCall(
        TransparentUpgradeableProxy _proxy,
        address _implementation,
        bytes memory _data
    ) public payable override onlyOwner {
        bytes[] memory calls = _calls();
        bytes[] memory beforeResults = _aggregate(_proxy, calls);

        TransparentUpgradeableProxy(payable(_proxy)).upgradeToAndCall{value: msg.value}(_implementation, _data);

        bytes[] memory afterResults = _aggregate(_proxy, calls);
        _checkResults(beforeResults, afterResults);
    }

    function _aggregate(TransparentUpgradeableProxy _proxy, bytes[] memory _callDatas)
        internal
        returns (bytes[] memory results)
    {
        IMulticall.Call[] memory calls = new IMulticall.Call[](_callDatas.length);
        for (uint256 i = 0; i < _callDatas.length; i++) {
            calls[i].target = address(_proxy);
            calls[i].callData = _callDatas[i];
        }
        (, results) = IMulticall(multicall).aggregate(calls);
    }

    function _calls() internal virtual returns (bytes[] memory calls);

    function _checkResults(bytes[] memory _beforeResults, bytes[] memory _afterResults) internal virtual;

    function _checkStringResults(
        bytes[] memory _beforeResults,
        bytes[] memory _afterResults,
        uint256 _from,
        uint256 _to
    ) internal pure {
        for (uint256 i = _from; i <= _to; ++i) {
            string memory _before = abi.decode(_beforeResults[i], (string));
            string memory _after = abi.decode(_afterResults[i], (string));
            require(keccak256(bytes(_before)) == keccak256(bytes(_after)), "an-string-simple-field-failed");
        }
    }

    function _checkUint256Results(
        bytes[] memory _beforeResults,
        bytes[] memory _afterResults,
        uint256 _from,
        uint256 _to
    ) internal pure {
        for (uint256 i = _from; i <= _to; ++i) {
            uint256 _before = abi.decode(_beforeResults[i], (uint256));
            uint256 _after = abi.decode(_afterResults[i], (uint256));
            require(_before == _after, "an-uint256-simple-field-failed");
        }
    }

    function _checkAddress256Results(
        bytes[] memory _beforeResults,
        bytes[] memory _afterResults,
        uint256 _from,
        uint256 _to
    ) internal pure {
        for (uint256 i = _from; i <= _to; ++i) {
            address _before = abi.decode(_beforeResults[i], (address));
            address _after = abi.decode(_afterResults[i], (address));
            require(_before == _after, "an-address-simple-field-failed");
        }
    }
}