// SPDX-License-Identifier: MIT

pragma solidity 0.8.9;

import "./Governable.sol";
import "../interface/IDebtToken.sol";
import "../interface/IMBox.sol";

/**
 * @title Reusable contract that handles accesses
 */
abstract contract Manageable is Governable {
    /**
     * @notice mBox contract
     */
    IMBox public mBox;

    // solhint-disable-next-line func-name-mixedcase
    function __Manageable_init(IMBox _mBox) internal initializer {
        require(address(_mBox) != address(0), "mbox-is-null");

        __Governable_init();

        mBox = IMBox(_mBox);
    }

    /**
     * @notice Requires that the caller is the mBox contract
     */
    modifier onlyMBox() {
        require(_msgSender() == address(mBox), "not-mbox");
        _;
    }

    /**
     * @notice Update mBox contract
     * @param _mBox The new mBox contract
     */
    function updateMBox(IMBox _mBox) public onlyGovernor {
        require(address(_mBox) != address(0), "new-mbox-address-is-zero");
        mBox = _mBox;
    }

    uint256[49] private __gap;
}
