// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./ComposableOFT.sol";

contract ComposableBasedOFT is ComposableOFT {
    constructor(
        string memory _name,
        string memory _symbol,
        address _lzEndpoint
    ) ComposableOFT(_name, _symbol, _lzEndpoint) {}

    function circulatingSupply() public view virtual override returns (uint) {
        unchecked {
            return totalSupply() - balanceOf(address(this));
        }
    }

    function _debitFrom(address _from, uint16, bytes memory, uint _amount) internal virtual override returns (uint) {
        address spender = _msgSender();
        if (_from != spender) _spendAllowance(_from, spender, _amount);
        _transfer(_from, address(this), _amount);
        return _amount;
    }

    function _creditTo(uint16, address _toAddress, uint _amount) internal virtual override returns (uint) {
        _transfer(address(this), _toAddress, _amount);
        return _amount;
    }
}
