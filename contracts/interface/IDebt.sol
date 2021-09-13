// SPDX-License-Identifier: MIT

pragma solidity 0.8.3;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IDebt is IERC20 {
    function mint(address _to, uint256 amount) external;

    function burn(address _from, uint256 amount) external;
}
