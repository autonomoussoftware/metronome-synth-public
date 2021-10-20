// SPDX-License-Identifier: MIT

pragma solidity 0.8.9;

interface IPriceProvider {
    function convertToUsd(bytes memory _assetData, uint256 _amount)
        external
        view
        returns (uint256 _amountInUsd, uint256 _lastUpdatedAt);

    function convertFromUsd(bytes memory _assetData, uint256 _amountInUsd)
        external
        view
        returns (uint256 _amount, uint256 _lastUpdatedAt);

    function update(bytes memory _assetData) external;

    function convert(
        bytes memory _assetInData,
        bytes memory _assetOutData,
        uint256 _amountIn
    ) external view returns (uint256 _amountOut, uint256 _lastUpdatedAt);
}