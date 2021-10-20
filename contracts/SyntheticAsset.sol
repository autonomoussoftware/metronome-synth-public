// SPDX-License-Identifier: MIT

pragma solidity 0.8.9;

import "./access/Manageable.sol";
import "./interface/ISyntheticAsset.sol";
import "./interface/IDebtToken.sol";

contract SyntheticAssetStorageV1 {
    mapping(address => uint256) internal _balances;

    mapping(address => mapping(address => uint256)) internal _allowances;

    string internal _name;
    string internal _symbol;

    uint256 internal _totalSupply;

    uint256 internal _maxTotalSupply;

    /**
     * @notice Collaterization ration for the synthetic asset
     * @dev Use 18 decimals (e.g. 15e17 = 150%)
     */
    uint128 internal _collateralizationRatio;

    /**
     * @notice Non-transferable token that represents users' debts
     */
    IDebtToken internal _debtToken;

    /**
     * @notice If a mAsset isn't active, it disables minting new tokens
     */
    bool internal _active;
}

/**
 * @title Synthetic Asset contract
 */
contract SyntheticAsset is ISyntheticAsset, Manageable, SyntheticAssetStorageV1 {
    string public constant VERSION = "1.0.0";

    function initialize(
        string memory name_,
        string memory symbol_,
        IMBox mBox_,
        IDebtToken debtToken_,
        uint128 collateralizationRatio_
    ) public initializer {
        require(address(debtToken_) != address(0), "debt-token-is-null");

        __Manageable_init(mBox_);

        _name = name_;
        _symbol = symbol_;
        _debtToken = debtToken_;
        _maxTotalSupply = type(uint256).max;
        _active = true;
        updateCollateralizationRatio(collateralizationRatio_);
    }

    /// @notice Emitted when CR is updated
    event CollateralizationRatioUpdated(uint256 oldCollateralizationRatio, uint256 newCollateralizationRatio);

    /// @notice Emitted when max total supply is updated
    event MaxTotalSupplyUpdated(uint256 oldMaxTotalSupply, uint256 newMaxTotalSupply);

    /// @notice Emitted when active flag is updated
    event SyntheticAssetActiveUpdated(bool oldActive, bool newActive);

    function debtToken() external view returns (IDebtToken) {
        return _debtToken;
    }

    function collateralizationRatio() public view returns (uint256) {
        return _collateralizationRatio;
    }

    function name() public view virtual override returns (string memory) {
        return _name;
    }

    function symbol() public view virtual override returns (string memory) {
        return _symbol;
    }

    function decimals() public view virtual override returns (uint8) {
        return 18;
    }

    function totalSupply() public view virtual override returns (uint256) {
        return _totalSupply;
    }

    function maxTotalSupply() public view virtual override returns (uint256) {
        return _maxTotalSupply;
    }

    function isActive() public view virtual override returns (bool) {
        return _active;
    }

    function balanceOf(address account) public view virtual override returns (uint256) {
        return _balances[account];
    }

    function transfer(address recipient, uint256 amount) public virtual override returns (bool) {
        _transfer(_msgSender(), recipient, amount);
        return true;
    }

    function allowance(address owner, address spender) public view virtual override returns (uint256) {
        return _allowances[owner][spender];
    }

    function approve(address spender, uint256 amount) public virtual override returns (bool) {
        _approve(_msgSender(), spender, amount);
        return true;
    }

    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) public virtual override returns (bool) {
        _transfer(sender, recipient, amount);

        uint256 currentAllowance = _allowances[sender][_msgSender()];
        require(currentAllowance >= amount, "amount-exceeds-allowance");
        unchecked {
            _approve(sender, _msgSender(), currentAllowance - amount);
        }

        return true;
    }

    function increaseAllowance(address spender, uint256 addedValue) public virtual returns (bool) {
        _approve(_msgSender(), spender, _allowances[_msgSender()][spender] + addedValue);
        return true;
    }

    function decreaseAllowance(address spender, uint256 subtractedValue) public virtual returns (bool) {
        uint256 currentAllowance = _allowances[_msgSender()][spender];
        require(currentAllowance >= subtractedValue, "decreased-allowance-below-zero");
        unchecked {
            _approve(_msgSender(), spender, currentAllowance - subtractedValue);
        }

        return true;
    }

    function _transfer(
        address sender,
        address recipient,
        uint256 amount
    ) internal virtual {
        require(sender != address(0), "transfer-from-the-zero-address");
        require(recipient != address(0), "transfer-to-the-zero-address");

        _beforeTokenTransfer(sender, recipient, amount);

        uint256 senderBalance = _balances[sender];
        require(senderBalance >= amount, "transfer-amount-exceeds-balance");
        unchecked {
            _balances[sender] = senderBalance - amount;
        }
        _balances[recipient] += amount;

        emit Transfer(sender, recipient, amount);

        _afterTokenTransfer(sender, recipient, amount);
    }

    function _mint(address account, uint256 amount) internal virtual {
        require(account != address(0), "mint-to-the-zero-address");

        _beforeTokenTransfer(address(0), account, amount);

        _totalSupply += amount;
        _balances[account] += amount;
        emit Transfer(address(0), account, amount);

        _afterTokenTransfer(address(0), account, amount);
    }

    function _burn(address account, uint256 amount) internal virtual {
        require(account != address(0), "burn-from-the-zero-address");

        _beforeTokenTransfer(account, address(0), amount);

        uint256 accountBalance = _balances[account];
        require(accountBalance >= amount, "burn-amount-exceeds-balance");
        unchecked {
            _balances[account] = accountBalance - amount;
        }
        _totalSupply -= amount;

        emit Transfer(account, address(0), amount);

        _afterTokenTransfer(account, address(0), amount);
    }

    function _approve(
        address owner,
        address spender,
        uint256 amount
    ) internal virtual {
        require(owner != address(0), "approve-from-the-zero-address");
        require(spender != address(0), "approve-to-the-zero-address");

        _allowances[owner][spender] = amount;
        emit Approval(owner, spender, amount);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount // solhint-disable-next-line no-empty-blocks
    ) internal virtual {}

    function _afterTokenTransfer(
        address from,
        address to,
        uint256 amount // solhint-disable-next-line no-empty-blocks
    ) internal virtual {}

    /**
     * @notice Mint synthetic asset
     * @param _to The account to mint to
     * @param _amount The amount to mint
     */
    function mint(address _to, uint256 _amount) public override onlyMBox {
        require(_active, "synthetic-asset-is-inactive");
        require(_totalSupply + _amount <= _maxTotalSupply, "surpass-max-total-supply");
        _mint(_to, _amount);
    }

    /**
     * @notice Burn synthetic asset
     * @param _from The account to burn from
     * @param _amount The amount to burn
     */
    function burn(address _from, uint256 _amount) public override onlyMBox {
        _burn(_from, _amount);
    }

    /**
     * @notice Update collateralization ratio
     * @param _newCollateralizationRatio The new CR value
     */
    function updateCollateralizationRatio(uint128 _newCollateralizationRatio) public override onlyGovernor {
        require(_newCollateralizationRatio >= 1e18, "collaterization-ratio-lt-100%");
        emit CollateralizationRatioUpdated(_collateralizationRatio, _newCollateralizationRatio);
        _collateralizationRatio = _newCollateralizationRatio;
    }

    /**
     * @notice Update max total supply
     * @param _newMaxTotalSupply The new max total supply
     */
    function updateMaxTotalSupply(uint256 _newMaxTotalSupply) public override onlyGovernor {
        emit MaxTotalSupplyUpdated(_maxTotalSupply, _newMaxTotalSupply);
        _maxTotalSupply = _newMaxTotalSupply;
    }

    /**
     * @notice Enable/Disable the Synthetic Asset
     * @param _newActive Whether the synthetic asset is enabled or not
     */
    function updateIsActive(bool _newActive) public override onlyGovernor {
        emit SyntheticAssetActiveUpdated(_active, _newActive);
        _active = _newActive;
    }
}
