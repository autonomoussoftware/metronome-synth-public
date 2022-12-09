// SPDX-License-Identifier: MIT

pragma solidity 0.8.9;

import "./dependencies/openzeppelin/security/ReentrancyGuard.sol";
import "./access/Manageable.sol";
import "./storage/TreasuryStorage.sol";

/**
 * @title Treasury contract
 */
contract Treasury is ReentrancyGuard, Manageable, TreasuryStorageV1 {
    using SafeERC20 for IERC20;
    using SafeERC20 for IDepositToken;

    string public constant VERSION = "1.0.0";

    /**
     * @dev Throws if caller isn't a deposit token
     */
    modifier onlyIfDepositToken() {
        require(pool.isDepositTokenExists(IDepositToken(msg.sender)), "not-deposit-token");
        _;
    }

    function initialize(IPool pool_) external initializer {
        __ReentrancyGuard_init();
        __Manageable_init(pool_);
    }

    /**
     * @notice Transfer all funds to another contract
     * @dev This function can become too expensive depending on the length of the arrays
     * @param newTreasury_ The new treasury
     */
    function migrateTo(address newTreasury_) external override onlyPool {
        require(newTreasury_ != address(0), "address-is-null");

        address[] memory _depositTokens = pool.getDepositTokens();
        uint256 _depositTokensLength = _depositTokens.length;

        for (uint256 i; i < _depositTokensLength; ++i) {
            IERC20 _underlying = IDepositToken(_depositTokens[i]).underlying();

            uint256 _underlyingBalance = _underlying.balanceOf(address(this));

            if (_underlyingBalance > 0) {
                _underlying.safeTransfer(newTreasury_, _underlyingBalance);
            }
        }
    }

    /**
     * @notice Pull token from the Treasury
     * @param to_ The transfer recipient
     * @param amount_ The transfer amount
     */
    function pull(address to_, uint256 amount_) external override nonReentrant onlyIfDepositToken {
        require(to_ != address(0), "recipient-is-null");
        require(amount_ > 0, "amount-is-zero");
        IDepositToken(msg.sender).underlying().safeTransfer(to_, amount_);
    }
}
