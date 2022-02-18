// SPDX-License-Identifier: MIT

pragma solidity 0.8.9;

import "../dependencies/openzeppelin/token/ERC20/extensions/IERC20Metadata.sol";
import "../access/Governable.sol";
import "../interface/oracle/IMasterOracle.sol";
import "../interface/oracle/IOracle.sol";

/**
 * @title The Master oracle that is called by `Controller`
 */
contract MasterOracle is Initializable, IMasterOracle, Governable {
    /**
     * @notice Maps asset addresses to oracle contracts
     */
    mapping(address => IOracle) public oracles;

    /**
     * @notice The Default/fallback oracle
     */
    IOracle public defaultOracle;

    /**
     * @notice Event emitted when the default oracle is updated
     */
    event DefaultOracleUpdated(address oldOracle, address newOracle);

    /**
     * @notice Event emitted when a asset's oracle is updated
     */
    event OracleUpdated(address asset, address oldOracle, address newOracle);

    function initialize(
        address[] memory _assets,
        IOracle[] memory _oracles,
        IOracle _defaultOracle
    ) external initializer {
        __Governable_init();

        _updateOracles(_assets, _oracles);
        defaultOracle = _defaultOracle;
    }

    /**
     * @notice Sets `_oracles` for `_assets`.
     * @param _assets The ERC20 asset addresses to link to `_oracles`.
     * @param _oracles The `IOracle` contracts to be assigned to `_assets`.
     */
    function _updateOracles(address[] memory _assets, IOracle[] memory _oracles) private {
        require(_assets.length == _oracles.length, "invalid-arrays-length");

        for (uint256 i = 0; i < _assets.length; i++) {
            address _asset = _assets[i];
            IOracle _newOracle = _oracles[i];
            emit OracleUpdated(_asset, address(oracles[_asset]), address(_newOracle));
            oracles[_asset] = _newOracle;
        }
    }

    /**
     * @notice Add or update token oracles
     * @param _assets The ERC20 asset addresses to link to `_oracles`
     * @param _oracles The `IOracle` contracts to be assigned to `_assets`
     */
    function addOrUpdated(address[] calldata _assets, IOracle[] calldata _oracles) external onlyGovernor {
        require(_assets.length > 0 && _oracles.length > 0, "invalid-arrays-length");
        _updateOracles(_assets, _oracles);
    }

    /**
     * @notice Update the default oracle contract
     * @param _newOracle The new default oracle contract
     */
    function setDefaultOracle(IOracle _newOracle) external onlyGovernor {
        emit DefaultOracleUpdated(address(defaultOracle), address(_newOracle));
        defaultOracle = _newOracle;
    }

    /**
     * @notice Convert asset's amount to USD
     * @param _asset The asset's address
     * @param _amount The amount to convert
     * @return _amountInUsd The amount in USD (8 decimals)
     */
    function convertToUsd(IERC20 _asset, uint256 _amount) public view returns (uint256 _amountInUsd) {
        IOracle _oracle = oracles[address(_asset)];

        if (address(_oracle) != address(0)) {
            _amountInUsd = _oracle.convertToUsd(_asset, _amount);
            require(_amountInUsd > 0, "invalid-price");
            return _amountInUsd;
        }
        if (address(defaultOracle) != address(0)) return defaultOracle.convertToUsd(_asset, _amount);
        revert("asset-without-oracle");
    }

    /**
     * @notice Convert USD to asset's amount
     * @param _asset The asset's address
     * @param _amountInUsd The amount in USD (8 decimals)
     * @return _amount The converted amount
     */
    function convertFromUsd(IERC20 _asset, uint256 _amountInUsd) public view returns (uint256 _amount) {
        IOracle _oracle = oracles[address(_asset)];

        if (address(_oracle) != address(0)) {
            _amount = _oracle.convertFromUsd(_asset, _amountInUsd);
            require(_amount > 0, "invalid-price");
            return _amount;
        }
        if (address(defaultOracle) != address(0)) return defaultOracle.convertFromUsd(_asset, _amountInUsd);
        revert("asset-without-oracle");
    }

    /**
     * @notice Convert assets' amounts
     * @param _assetIn The asset to convert from
     * @param _assetOut The asset to convert to
     * @param _amountIn The amount to convert from
     * @return _amountOut The converted amount
     */
    function convert(
        IERC20 _assetIn,
        IERC20 _assetOut,
        uint256 _amountIn
    ) external view returns (uint256 _amountOut) {
        uint256 _amountInUsd = convertToUsd(_assetIn, _amountIn);
        _amountOut = convertFromUsd(_assetOut, _amountInUsd);
    }
}