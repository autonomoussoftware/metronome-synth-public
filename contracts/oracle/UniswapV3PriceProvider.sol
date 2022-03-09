// SPDX-License-Identifier: MIT

pragma solidity 0.8.9;

import "../access/Governable.sol";
import "../interface/oracle/IUniswapV3CrossPoolOracle.sol";
import "../interface/oracle/IPriceProvider.sol";
import "../lib/OracleHelpers.sol";

/**
 * @title UniswapV3 Oracle contract
 * @dev The UniswapV3CrossPoolOracle uses 0.3% fee pool as default
 * @dev The `assetToAsset` function uses token->weth->usdToken under the hoods
 */
contract UniswapV3PriceProvider is IPriceProvider, Governable {
    /**
     * @notice The UniswapV3CrossPoolOracle contract address
     * @dev This is 3rd-party non-upgradable contract
     * @dev The address isn't hardcoded because we may want to deploy to other chains
     * See more: https://etherscan.io/address/0x0f1f5a87f99f0918e6c81f16e59f3518698221ff#code
     */
    IUniswapV3CrossPoolOracle public crossPoolOracle;

    /**
     * @notice The USD token (stable coin) to use to convert amounts to/from USD
     * @dev This contract supports tokens with any decimals (e.g. USDC, DAI)
     */
    address public usdToken;

    /**
     * @notice The time-weighted average price (TWAP) period
     * @dev See more: https://docs.uniswap.org/protocol/concepts/V3-overview/oracle
     */
    uint32 public twapPeriod;

    /// @notice Emitted when TWAP period is updated
    event TwapPeriodUpdated(uint32 oldTwapPeriod, uint32 newTwapPeriod);

    constructor(
        IUniswapV3CrossPoolOracle _crossPoolOracle,
        address _usdToken,
        uint32 _twapPeriod
    ) {
        require(address(_crossPoolOracle) != address(0), "null-cross0pool-oracle-address");
        require(_usdToken != address(0), "null-usd-token-address");
        crossPoolOracle = _crossPoolOracle;
        usdToken = _usdToken;
        twapPeriod = _twapPeriod;
    }

    /**
     * @notice Update TWAP period
     * @param _newTwapPeriod The new period
     */
    function updateTwapPeriod(uint32 _newTwapPeriod) external onlyGovernor {
        emit TwapPeriodUpdated(twapPeriod, _newTwapPeriod);
        twapPeriod = _newTwapPeriod;
    }

    /**
     * @notice Decode asset data
     * @param _encodedTokenAddress The asset's encoded address
     * @return _token The asset's address
     */
    function _decode(bytes calldata _encodedTokenAddress) private pure returns (address _token) {
        _token = abi.decode(_encodedTokenAddress, (address));
    }

    /**
     * @notice Get asset's USD price
     * @param _encodedTokenAddress The asset's encoded address
     * @return _priceInUsd The amount in USD (18 decimals)
     * @return _lastUpdatedAt The timestamp of the price used to convert
     */
    function getPriceInUsd(bytes calldata _encodedTokenAddress)
        external
        view
        override
        returns (uint256 _priceInUsd, uint256 _lastUpdatedAt)
    {
        address _token = _decode(_encodedTokenAddress);
        uint256 _decimals = IERC20Metadata(_token).decimals();
        uint256 _amount = 10**_decimals;
        _priceInUsd = OracleHelpers.normalizeUsdOutput(
            usdToken,
            crossPoolOracle.assetToAsset(_decode(_encodedTokenAddress), _amount, usdToken, twapPeriod)
        );
        _lastUpdatedAt = block.timestamp;
    }

    /**
     * @dev This function is here just to follow IPriceProvider
     */
    // solhint-disable-next-line no-empty-blocks
    function update(bytes calldata) external {}
}
