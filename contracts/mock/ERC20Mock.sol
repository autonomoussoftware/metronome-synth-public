// SPDX-License-Identifier: MIT

// Note: Minimalist ERC20 based on https://github.com/maple-labs/erc20

pragma solidity 0.8.9;

import "../dependencies/openzeppelin/token/ERC20/extensions/IERC20Metadata.sol";

contract ERC20Mock is IERC20Metadata {
    string public override name;
    string public override symbol;

    uint8 public immutable override decimals;

    uint256 public override totalSupply;

    mapping(address => uint256) public override balanceOf;

    mapping(address => mapping(address => uint256)) public override allowance;

    uint256 public fee;

    constructor(string memory name_, string memory symbol_, uint8 decimals_) {
        name = name_;
        symbol = symbol_;
        decimals = decimals_;
    }

    /**************************/
    /*** External Functions ***/
    /**************************/

    function approve(address spender_, uint256 amount_) external override returns (bool success_) {
        _approve(msg.sender, spender_, amount_);
        return true;
    }

    function transfer(address recipient_, uint256 amount_) external override returns (bool success_) {
        _transfer(msg.sender, recipient_, amount_);
        return true;
    }

    function transferFrom(
        address owner_,
        address recipient_,
        uint256 amount_
    ) external override returns (bool success_) {
        _approve(owner_, msg.sender, allowance[owner_][msg.sender] - amount_);
        _transfer(owner_, recipient_, amount_);
        return true;
    }

    function mint(address _to, uint256 _amount) external {
        _mint(_to, _amount);
    }

    function burn(address _to, uint256 _amount) external {
        _burn(_to, _amount);
    }

    function updateFee(uint256 _fee) external {
        fee = _fee;
    }

    /**************************/
    /*** Internal Functions ***/
    /**************************/

    function _approve(address owner_, address spender_, uint256 amount_) internal {
        emit Approval(owner_, spender_, allowance[owner_][spender_] = amount_);
    }

    function _transfer(address owner_, address recipient_, uint256 amount_) internal {
        uint256 feeAmount = fee > 0 ? (amount_ * fee) / 1e18 : 0;
        balanceOf[owner_] -= amount_;
        balanceOf[recipient_] += amount_ - feeAmount;

        if (feeAmount > 0) {
            balanceOf[address(0)] = feeAmount;
        }

        emit Transfer(owner_, recipient_, amount_);
    }

    function _mint(address recipient_, uint256 amount_) internal {
        totalSupply += amount_;
        balanceOf[recipient_] += amount_;

        emit Transfer(address(0), recipient_, amount_);
    }

    function _burn(address owner_, uint256 amount_) internal {
        balanceOf[owner_] -= amount_;
        totalSupply -= amount_;

        emit Transfer(owner_, address(0), amount_);
    }
}
