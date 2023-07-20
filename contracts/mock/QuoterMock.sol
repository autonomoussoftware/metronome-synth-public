// SPDX-License-Identifier: MIT

pragma solidity 0.8.9;

import "../Quoter.sol";

contract QuoterMock is Quoter {
    uint256 chainId;

    constructor() {
        chainId = block.chainid;
    }

    function _chainId() internal view override returns (uint256) {
        return chainId;
    }

    function updateChainId(uint256 chainId_) external {
        chainId = chainId_;
    }
}
