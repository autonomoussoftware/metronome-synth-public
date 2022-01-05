// SPDX-License-Identifier: MIT

pragma solidity 0.8.9;

import "./dependencies/openzeppelin/token/ERC20/IERC20.sol";
import "./dependencies/openzeppelin/token/ERC20/utils/SafeERC20.sol";
import "./dependencies/openzeppelin/security/ReentrancyGuard.sol";
import "./access/Manageable.sol";
import "./interface/IIssuer.sol";
import "./lib/WadRayMath.sol";
import "./interface/ITreasury.sol";

contract IssuerStorageV1 {
    /**
     * @notice Prices oracle
     */
    IOracle public oracle;

    /**
     * @notice Treasury contract
     */
    ITreasury public treasury;

    /**
     * @notice Represents collateral's deposits (e.g. vSynth-MET token)
     */
    IDepositToken[] public depositTokens;
    mapping(address => IDepositToken) public depositTokenByAddress;

    /**
     * @notice Avaliable synthetic assets
     * @dev The syntheticAssets[0] is vsETH
     */
    ISyntheticAsset[] public syntheticAssets;
    mapping(address => ISyntheticAsset) public syntheticAssetByAddress;
}

/**
 * @title Issuer main contract
 */
contract Issuer is IIssuer, ReentrancyGuard, Manageable, IssuerStorageV1 {
    using SafeERC20 for IERC20;
    using WadRayMath for uint256;

    string public constant VERSION = "1.0.0";

    /// @notice Emitted when synthetic asset is enabled
    event SyntheticAssetAdded(ISyntheticAsset indexed syntheticAsset);

    /// @notice Emitted when synthetic asset is disabled
    event SyntheticAssetRemoved(ISyntheticAsset indexed syntheticAsset);

    /// @notice Emitted when deposit token is enabled
    event DepositTokenAdded(IDepositToken indexed depositToken);

    /// @notice Emitted when deposit token is disabled
    event DepositTokenRemoved(IDepositToken indexed depositToken);

    /// @notice Emitted when oracle contract is updated
    event OracleUpdated(IOracle indexed oldOracle, IOracle indexed newOracle);

    /// @notice Emitted when treasury contract is updated
    event TreasuryUpdated(ITreasury indexed oldTreasury, ITreasury indexed newTreasury);

    /**
     * @dev Throws if synthetic asset isn't enabled
     */
    modifier onlyIfSyntheticAssetExists(ISyntheticAsset _syntheticAsset) {
        require(isSyntheticAssetExists(_syntheticAsset), "synthetic-asset-does-not-exists");
        _;
    }

    /**
     * @dev Throws if synthetic asset isn't enabled
     */
    modifier onlyIfSyntheticAssetIsActive(ISyntheticAsset _syntheticAsset) {
        require(_syntheticAsset.isActive(), "synthetic-asset-is-not-active");
        _;
    }

    /**
     * @dev Throws if synthetic asset isn't enabled
     */
    modifier onlyIfDepositTokenExists(IDepositToken _depositToken) {
        require(isDepositTokenExists(_depositToken), "deposit-token-does-not-exists");
        _;
    }

    /**
     * @dev Throws if synthetic asset isn't enabled
     */
    modifier onlyIfDepositTokenIsActive(IDepositToken _depositToken) {
        require(_depositToken.isActive(), "deposit-token-is-not-active");
        _;
    }

    /**
     * @dev Update prices of assets that are used by the account (checks synthetic assets and deposit tokens)
     */
    modifier updatePricesOfAssetsUsedBy(address _account) {
        for (uint256 i = 0; i < syntheticAssets.length; ++i) {
            ISyntheticAsset _syntheticAsset = syntheticAssets[i];
            accrueInterest(_syntheticAsset);
            if (_syntheticAsset.debtToken().balanceOf(_account) > 0) {
                oracle.update(_syntheticAsset);
            }
        }

        for (uint256 i = 0; i < depositTokens.length; ++i) {
            if (depositTokens[i].balanceOf(_account) > 0) {
                oracle.update(depositTokens[i].underlying());
            }
        }

        _;
    }

    /**
     * @dev Update a specific asset's price (also updates the deposit tokens prices)
     */
    modifier updatePriceOfAsset(ISyntheticAsset _syntheticAsset) {
        _syntheticAsset.debtToken().accrueInterest();
        oracle.update(_syntheticAsset);

        for (uint256 i = 0; i < depositTokens.length; ++i) {
            oracle.update(depositTokens[i].underlying());
        }
        _;
    }

    function initialize(
        IDepositToken depositToken_,
        ISyntheticAsset vsETH_,
        IOracle oracle_,
        ITreasury treasury_,
        IVSynth vSynth_
    ) public initializer {
        require(address(treasury_) != address(0), "treasury-address-is-null");
        require(address(depositToken_) != address(0), "deposit-token-is-null");
        require(address(oracle_) != address(0), "oracle-is-null");

        __ReentrancyGuard_init();
        __Manageable_init();

        setVSynth(vSynth_);
        oracle = oracle_;
        treasury = treasury_;

        // Ensuring that vsETH is the syntheticAssets[0]
        addSyntheticAsset(vsETH_);

        // Ensuring that vSynth-MET is the depositTokens[0]
        addDepositToken(depositToken_);
    }

    /**
     * @notice Get deposit tokens
     */
    function getDepositTokens() public view override returns (IDepositToken[] memory) {
        return depositTokens;
    }

    /**
     * @notice Get treasury
     */
    function getTreasury() public view override returns (ITreasury) {
        return treasury;
    }

    /**
     * @notice Get MET
     */
    function met() public view override returns (IERC20) {
        return depositTokens[0].underlying();
    }

    /**
     * @notice Get the vsETH synthetic asset (can't be removed)
     */
    function vsEth() public view override returns (ISyntheticAsset) {
        return syntheticAssets[0];
    }

    /**
     * @notice Check if token is part of the synthetic offerings
     * @param _syntheticAsset Asset to check
     * @return true if exist
     */
    function isSyntheticAssetExists(ISyntheticAsset _syntheticAsset) public view returns (bool) {
        return syntheticAssetByAddress[address(_syntheticAsset)] != ISyntheticAsset(address(0));
    }

    /**
     * @notice Check if collateral is supported
     * @param _depositToken Asset to check
     * @return true if exist
     */
    function isDepositTokenExists(IDepositToken _depositToken) public view returns (bool) {
        return depositTokenByAddress[address(_depositToken)] != IDepositToken(address(0));
    }

    /**
     * @notice Get account's synthetic assets that user has debt accounted in (i.e. synthetic assets that the user has minted)
     * @dev This is a helper function for external users (e.g. liquidators)
     * @dev This function is not used internally because its cost is twice against simply sweep all synthetic assets
     * @dev We could replace this by having such a list and update it whenever a debt token is minted or burned,
     * but right now - with small amount of synthetic assets - the overhead cost and code complexity wouldn't payoff.
     */
    function syntheticAssetsMintedBy(address _account)
        external
        view
        override
        returns (ISyntheticAsset[] memory _syntheticAssets)
    {
        uint256 _length = 0;

        for (uint256 i = 0; i < syntheticAssets.length; ++i) {
            if (syntheticAssets[i].debtToken().balanceOf(_account) > 0) {
                _length++;
            }
        }

        _syntheticAssets = new ISyntheticAsset[](_length);

        for (uint256 i = 0; i < syntheticAssets.length; ++i) {
            if (syntheticAssets[i].debtToken().balanceOf(_account) > 0) {
                _syntheticAssets[--_length] = syntheticAssets[i];
            }
        }
    }

    /**
     * @notice Get account's debt by querying latest prices from oracles
     * @dev We can optimize this function by storing an array of which synthetics the account minted avoiding looping all
     * @param _account The account to check
     * @return _debtInUsd The debt value in USD
     * @return _lockedDepositInUsd The USD amount that's covering the debt (considering collateralization ratios)
     * @return _anyPriceInvalid Returns true if any price is invalid
     */
    function debtOfUsingLatestPrices(address _account)
        public
        view
        override
        returns (
            uint256 _debtInUsd,
            uint256 _lockedDepositInUsd,
            bool _anyPriceInvalid
        )
    {
        for (uint256 i = 0; i < syntheticAssets.length; ++i) {
            uint256 _amount = syntheticAssets[i].debtToken().balanceOf(_account);
            if (_amount > 0) {
                (uint256 _amountInUsd, bool _priceInvalid) = oracle.convertToUsdUsingLatestPrice(
                    syntheticAssets[i],
                    _amount
                );

                if (_priceInvalid) _anyPriceInvalid = true;

                _debtInUsd += _amountInUsd;
                _lockedDepositInUsd += _amountInUsd.wadMul(syntheticAssets[i].collateralizationRatio());
            }
        }
    }

    /**
     * @notice Get account's total collateral deposited by querying latest prices from oracles
     * @dev We can optimize this function by storing an array of which deposit toekns the account deposited avoiding looping all
     * @param _account The account to check
     * @return _depositInUsd The total deposit value in USD among all collaterals
     * @return _anyPriceInvalid Returns true if any price is invalid
     */
    function depositOfUsingLatestPrices(address _account)
        public
        view
        override
        returns (uint256 _depositInUsd, bool _anyPriceInvalid)
    {
        for (uint256 i = 0; i < depositTokens.length; ++i) {
            uint256 _amount = depositTokens[i].balanceOf(_account);
            if (_amount > 0) {
                (uint256 _amountInUsd, bool _priceInvalid) = oracle.convertToUsdUsingLatestPrice(
                    depositTokens[i].underlying(),
                    _amount
                );

                if (_priceInvalid) _anyPriceInvalid = true;

                _depositInUsd += _amountInUsd;
            }
        }
    }

    /**
     * @notice Get debt position from an account
     * @param _account The account to check
     * @return _isHealthy Whether the account's position is healthy
     * @return _lockedDepositInUsd The amount of deposit (is USD) that's covering all debt (considering collateralization ratios)
     * @return _depositInUsd The total collateral deposited in USD
     * @return _unlockedDepositInUsd The amount of deposit (is USD) that isn't covering the account's debt
     * @return _anyPriceInvalid Returns true if any price is invalid
     */
    function debtPositionOfUsingLatestPrices(address _account)
        public
        view
        override
        returns (
            bool _isHealthy,
            uint256 _lockedDepositInUsd,
            uint256 _depositInUsd,
            uint256 _unlockedDepositInUsd,
            bool _anyPriceInvalid
        )
    {
        (, _lockedDepositInUsd, _anyPriceInvalid) = debtOfUsingLatestPrices(_account);

        bool _depositPriceInvalid;

        (_depositInUsd, _depositPriceInvalid) = depositOfUsingLatestPrices(_account);

        _unlockedDepositInUsd = _depositInUsd > _lockedDepositInUsd ? _depositInUsd - _lockedDepositInUsd : 0;

        _isHealthy = _depositInUsd >= _lockedDepositInUsd;
        _anyPriceInvalid = _anyPriceInvalid || _depositPriceInvalid;
    }

    /**
     * @notice Get debt position from an account
     * @param _account The account to check
     * @return _isHealthy Whether the account's position is healthy
     * @return _lockedDepositInUsd The amount of deposit (is USD) that's covering all debt (considering collateralization ratios)
     * @return _depositInUsd The total collateral deposited in USD
     * @return _unlockedDepositInUsd The amount of deposit (is USD) that isn't covering the account's debt
     */
    function debtPositionOf(address _account)
        external
        override
        updatePricesOfAssetsUsedBy(_account)
        returns (
            bool _isHealthy,
            uint256 _lockedDepositInUsd,
            uint256 _depositInUsd,
            uint256 _unlockedDepositInUsd
        )
    {
        bool _anyPriceInvalid;
        (
            _isHealthy,
            _lockedDepositInUsd,
            _depositInUsd,
            _unlockedDepositInUsd,
            _anyPriceInvalid
        ) = debtPositionOfUsingLatestPrices(_account);
        require(!_anyPriceInvalid, "invalid-price");
    }

    /**
     * @notice Get max issuable synthetic asset amount for a given account
     * @dev This function will revert if any price from oracle is invalid
     * @param _account The account to check
     * @param _syntheticAsset The synthetic asset to check issuance
     * @return _maxIssuable The max issuable amount
     */
    function maxIssuableFor(address _account, ISyntheticAsset _syntheticAsset)
        external
        override
        onlyIfSyntheticAssetExists(_syntheticAsset)
        updatePriceOfAsset(_syntheticAsset)
        updatePricesOfAssetsUsedBy(_account)
        returns (uint256 _maxIssuable)
    {
        bool _anyPriceInvalid;
        (_maxIssuable, _anyPriceInvalid) = maxIssuableForUsingLatestPrices(_account, _syntheticAsset);
        require(!_anyPriceInvalid, "invalid-price");
    }

    /**
     * @notice Get max issuable synthetic asset amount for a given account
     * @param _account The account to check
     * @param _syntheticAsset The synthetic asset to check issuance
     * @return _maxIssuable The max issuable amount
     * @return _anyPriceInvalid Returns true if any price is invalid
     */
    function maxIssuableForUsingLatestPrices(address _account, ISyntheticAsset _syntheticAsset)
        public
        view
        override
        onlyIfSyntheticAssetExists(_syntheticAsset)
        returns (uint256 _maxIssuable, bool _anyPriceInvalid)
    {
        if (!_syntheticAsset.isActive()) {
            return (0, false);
        }

        (, , , uint256 __unlockedDepositInUsd, ) = debtPositionOfUsingLatestPrices(_account);

        (_maxIssuable, _anyPriceInvalid) = oracle.convertFromUsdUsingLatestPrice(
            _syntheticAsset,
            __unlockedDepositInUsd.wadDiv(_syntheticAsset.collateralizationRatio())
        );
    }

    /**
     * @notice Accrue interest for a given synthetic asset's debts
     * @param _syntheticAsset The synthetic asset's to accrue interest from
     */
    function accrueInterest(ISyntheticAsset _syntheticAsset) public {
        uint256 _interestAccumulated = _syntheticAsset.debtToken().accrueInterest();

        if (_interestAccumulated > 0) {
            // Note: We can save some gas by incrementing only and mint all accrue amount later
            _syntheticAsset.mint(address(treasury), _interestAccumulated);
        }
    }

    /**
     * @notice Mint synthetic asset
     * @param _syntheticAsset The synthetic asset to mint
     * @param _to The destination account
     * @param _amount The amount to mint
     */
    function mintSyntheticAsset(
        ISyntheticAsset _syntheticAsset,
        address _to,
        uint256 _amount
    ) external nonReentrant onlyVSynth {
        require(_amount > 0, "amount-to-mint-is-zero");
        _syntheticAsset.mint(_to, _amount);
    }

    /**
     * @notice Mint synthetic asset's debt
     * @param _debtToken The debt token to mint
     * @param _to The destination account
     * @param _amount The amount to mint
     */
    function mintDebtToken(
        IDebtToken _debtToken,
        address _to,
        uint256 _amount
    ) external nonReentrant onlyVSynth {
        require(_amount > 0, "amount-to-mint-is-zero");
        _debtToken.mint(_to, _amount);
    }

    /**
     * @notice Burn synthetic asset
     * @param _syntheticAsset The synthetic asset to mint
     * @param _from The account to burn synthetic assets from
     * @param _amount The amount to mint
     */
    function burnSyntheticAsset(
        ISyntheticAsset _syntheticAsset,
        address _from,
        uint256 _amount
    ) external override nonReentrant onlyVSynth {
        require(_amount > 0, "amount-to-burn-is-zero");
        require(_amount <= _syntheticAsset.balanceOf(_from), "amount-gt-burnable-synthetic");
        _syntheticAsset.burn(_from, _amount);
    }

    /**
     * @notice Burn synthetic asset's debt
     * @param _debtToken The debt token to burn
     * @param _from The account to burn debt tokens from
     * @param _amount The amount to mint
     */
    function burnDebtToken(
        IDebtToken _debtToken,
        address _from,
        uint256 _amount
    ) external override nonReentrant onlyVSynth {
        require(_amount > 0, "amount-to-burn-is-zero");
        require(_amount <= _debtToken.balanceOf(_from), "amount-gt-burnable-debt");
        _debtToken.burn(_from, _amount);
    }

    /**
     * @notice Mint deposit token
     * @param _to The synthetic asset to mint
     * @param _amount The account to burn synthetic assets from
     */
    function mintDepositToken(
        IDepositToken _depositToken,
        address _to,
        uint256 _amount
    ) external override nonReentrant onlyVSynth {
        require(_amount > 0, "amount-to-mint-is-zero");
        _depositToken.mint(_to, _amount);
    }

    /**
     * @notice Pull collateral from treasury
     * @param _depositToken The collateral receipt token
     * @param _to The beneficiary account
     * @param _amount The account to pull
     */
    function withdrawFromTreasury(
        IDepositToken _depositToken,
        address _to,
        uint256 _amount
    ) external override nonReentrant onlyVSynth {
        require(_amount > 0, "amount-to-withdraw-is-zero");
        treasury.pull(_depositToken.underlying(), _to, _amount);
    }

    /**
     * @notice Burn deposit token as part of withdraw process
     * @dev The `DepositToken` checks some constraints to validate withdraw
     * @param _account The account to burn from
     * @param _amount The amount to burn
     */
    function burnWithdrawnDeposit(
        IDepositToken _depositToken,
        address _account,
        uint256 _amount
    ) external override nonReentrant onlyVSynth {
        require(_amount > 0, "amount-to-burn-is-zero");
        _depositToken.burnForWithdraw(_account, _amount);
    }

    /**
     * @notice Seize deposit tokens from a user
     * @param _depositToken The deposit token to seize from
     * @param _from The account to seize from
     * @param _to The account to transfer to
     * @param _amount The amount to seize
     */
    function seizeDepositToken(
        IDepositToken _depositToken,
        address _from,
        address _to,
        uint256 _amount
    ) external override nonReentrant onlyVSynth {
        require(_from != _to, "seize-from-and-to-are-the-same");
        require(_amount > 0, "amount-to-seize-is-zero");
        _depositToken.seize(_from, _to, _amount);
    }

    /**
     * @notice Add synthetic token to vSynth offerings
     */
    function addSyntheticAsset(ISyntheticAsset _syntheticAsset) public override onlyGovernor {
        address _address = address(_syntheticAsset);

        require(_address != address(0), "address-is-null");
        require(address(syntheticAssetByAddress[_address]) == address(0), "synthetic-asset-exists");

        syntheticAssets.push(_syntheticAsset);
        syntheticAssetByAddress[_address] = _syntheticAsset;

        emit SyntheticAssetAdded(_syntheticAsset);
    }

    /**
     * @notice Remove synthetic token from vSynth offerings
     */
    function removeSyntheticAsset(ISyntheticAsset _syntheticAsset)
        external
        override
        onlyGovernor
        onlyIfSyntheticAssetExists(_syntheticAsset)
    {
        require(_syntheticAsset != vsEth(), "can-not-delete-vseth");
        require(_syntheticAsset.totalSupply() == 0, "synthetic-asset-with-supply");
        require(_syntheticAsset.debtToken().totalSupply() == 0, "synthetic-asset-with-debt-supply");

        for (uint256 i = 0; i < syntheticAssets.length; i++) {
            if (syntheticAssets[i] == _syntheticAsset) {
                // Using the last to overwrite the synthetic asset to remove
                syntheticAssets[i] = syntheticAssets[syntheticAssets.length - 1];

                // Removing the last (and duplicated) synthetic asset
                syntheticAssets.pop();

                break;
            }
        }

        delete syntheticAssetByAddress[address(_syntheticAsset)];

        emit SyntheticAssetRemoved(_syntheticAsset);
    }

    /**
     * @notice Add deposit token (i.e. collateral) to vSynth
     */
    function addDepositToken(IDepositToken _depositToken) public override onlyGovernor {
        address _address = address(_depositToken);

        require(_address != address(0), "address-is-null");
        require(address(depositTokenByAddress[_address]) == address(0), "deposit-token-exists");

        depositTokens.push(_depositToken);
        depositTokenByAddress[_address] = _depositToken;

        emit DepositTokenAdded(_depositToken);
    }

    /**
     * @notice Remove deposit token (i.e. collateral) from vSynth
     */
    function removeDepositToken(IDepositToken _depositToken)
        external
        override
        onlyGovernor
        onlyIfDepositTokenExists(_depositToken)
    {
        require(_depositToken.underlying() != met(), "can-not-delete-met");
        require(_depositToken.totalSupply() == 0, "deposit-token-with-supply");

        for (uint256 i = 0; i < depositTokens.length; i++) {
            if (depositTokens[i] == _depositToken) {
                // Using the last to overwrite the deposit token to remove
                depositTokens[i] = depositTokens[depositTokens.length - 1];

                // Removing the last (and duplicated) deposit token
                depositTokens.pop();

                break;
            }
        }

        delete depositTokenByAddress[address(_depositToken)];

        emit DepositTokenRemoved(_depositToken);
    }

    /**
     * @notice Update price oracle contract
     */
    function updateOracle(IOracle _newOracle) public override onlyGovernor {
        require(address(_newOracle) != address(0), "oracle-address-is-null");
        require(_newOracle != oracle, "new-oracle-is-same-as-current");

        emit OracleUpdated(oracle, _newOracle);
        oracle = _newOracle;
    }

    /**
     * @notice Update treasury contract - will migrate funds to the new contract
     */
    function updateTreasury(ITreasury _newTreasury) external override onlyGovernor {
        require(address(_newTreasury) != address(0), "treasury-address-is-null");
        require(_newTreasury != treasury, "new-treasury-is-same-as-current");

        IDepositToken[] memory _depositTokens = getDepositTokens();
        for (uint256 i = 0; i < _depositTokens.length; ++i) {
            IERC20 _underlying = _depositTokens[i].underlying();
            uint256 _balance = _underlying.balanceOf(address(treasury));
            if (_balance > 0) {
                treasury.pull(_underlying, address(_newTreasury), _balance);
            }
        }

        emit TreasuryUpdated(treasury, _newTreasury);
        treasury = _newTreasury;
    }
}