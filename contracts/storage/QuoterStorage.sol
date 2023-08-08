// SPDX-License-Identifier: MIT

pragma solidity 0.8.9;

import "../interfaces/IPoolRegistry.sol";
import "../interfaces/IQuoter.sol";

abstract contract QuoterStorageV1 is IQuoter {
    IPoolRegistry public poolRegistry;
}
