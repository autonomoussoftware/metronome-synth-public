// SPDX-License-Identifier: MIT

pragma solidity 0.8.9;

import "../dependencies/openzeppelin/token/ERC20/IERC20.sol";
import "./IDebtToken.sol";

interface ISyntheticAsset is IERC20 {
    function underlying() external view returns (address);

    function debtToken() external view returns (IDebtToken);

    function collateralizationRatio() external view returns (uint256);

    function mint(address _to, uint256 amount) external;

    function burn(address _from, uint256 amount) external;

    function setCollateralizationRatio(uint256 _newCollateralizationRatio) external;
}
