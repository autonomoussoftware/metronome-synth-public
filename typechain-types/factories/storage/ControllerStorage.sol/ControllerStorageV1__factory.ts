/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  ControllerStorageV1,
  ControllerStorageV1Interface,
} from "../../../storage/ControllerStorage.sol/ControllerStorageV1";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_depositToken",
        type: "address",
      },
    ],
    name: "addDepositToken",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract IRewardsDistributor",
        name: "_distributor",
        type: "address",
      },
    ],
    name: "addRewardsDistributor",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_synthetic",
        type: "address",
      },
    ],
    name: "addSyntheticToken",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_account",
        type: "address",
      },
    ],
    name: "addToDebtTokensOfAccount",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_account",
        type: "address",
      },
    ],
    name: "addToDepositTokensOfAccount",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "debtFloorInUsd",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_account",
        type: "address",
      },
    ],
    name: "debtOf",
    outputs: [
      {
        internalType: "uint256",
        name: "_debtInUsd",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_account",
        type: "address",
      },
    ],
    name: "debtPositionOf",
    outputs: [
      {
        internalType: "bool",
        name: "_isHealthy",
        type: "bool",
      },
      {
        internalType: "uint256",
        name: "_depositInUsd",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_debtInUsd",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_issuableLimitInUsd",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_issuableInUsd",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "depositFee",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_account",
        type: "address",
      },
    ],
    name: "depositOf",
    outputs: [
      {
        internalType: "uint256",
        name: "_depositInUsd",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_issuableLimitInUsd",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract IERC20",
        name: "",
        type: "address",
      },
    ],
    name: "depositTokenOf",
    outputs: [
      {
        internalType: "contract IDepositToken",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "everythingStopped",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_account",
        type: "address",
      },
    ],
    name: "getDebtTokensOfAccount",
    outputs: [
      {
        internalType: "address[]",
        name: "",
        type: "address[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getDepositTokens",
    outputs: [
      {
        internalType: "address[]",
        name: "",
        type: "address[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_account",
        type: "address",
      },
    ],
    name: "getDepositTokensOfAccount",
    outputs: [
      {
        internalType: "address[]",
        name: "",
        type: "address[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getRewardsDistributors",
    outputs: [
      {
        internalType: "contract IRewardsDistributor[]",
        name: "",
        type: "address[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getSyntheticTokens",
    outputs: [
      {
        internalType: "address[]",
        name: "",
        type: "address[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract IDepositToken",
        name: "_depositToken",
        type: "address",
      },
    ],
    name: "isDepositTokenExists",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract ISyntheticToken",
        name: "_syntheticToken",
        type: "address",
      },
    ],
    name: "isSyntheticTokenExists",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "issueFee",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract ISyntheticToken",
        name: "_syntheticToken",
        type: "address",
      },
      {
        internalType: "address",
        name: "_account",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_amountToRepay",
        type: "uint256",
      },
      {
        internalType: "contract IDepositToken",
        name: "_depositToken",
        type: "address",
      },
    ],
    name: "liquidate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "liquidatorLiquidationFee",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "masterOracle",
    outputs: [
      {
        internalType: "contract IMasterOracle",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "maxLiquidable",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "paused",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "protocolLiquidationFee",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract IDepositToken",
        name: "_depositToken",
        type: "address",
      },
    ],
    name: "removeDepositToken",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_account",
        type: "address",
      },
    ],
    name: "removeFromDebtTokensOfAccount",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_account",
        type: "address",
      },
    ],
    name: "removeFromDepositTokensOfAccount",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract ISyntheticToken",
        name: "_synthetic",
        type: "address",
      },
    ],
    name: "removeSyntheticToken",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "repayFee",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract ISyntheticToken",
        name: "_syntheticTokenIn",
        type: "address",
      },
      {
        internalType: "contract ISyntheticToken",
        name: "_syntheticTokenOut",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_amountIn",
        type: "uint256",
      },
    ],
    name: "swap",
    outputs: [
      {
        internalType: "uint256",
        name: "_amountOut",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "swapFee",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "treasury",
    outputs: [
      {
        internalType: "contract ITreasury",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_newDebtFloorInUsd",
        type: "uint256",
      },
    ],
    name: "updateDebtFloor",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_newDepositFee",
        type: "uint256",
      },
    ],
    name: "updateDepositFee",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_newIssueFee",
        type: "uint256",
      },
    ],
    name: "updateIssueFee",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_newLiquidatorLiquidationFee",
        type: "uint256",
      },
    ],
    name: "updateLiquidatorLiquidationFee",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract IMasterOracle",
        name: "_newOracle",
        type: "address",
      },
    ],
    name: "updateMasterOracle",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_newMaxLiquidable",
        type: "uint256",
      },
    ],
    name: "updateMaxLiquidable",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_newProtocolLiquidationFee",
        type: "uint256",
      },
    ],
    name: "updateProtocolLiquidationFee",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_newRepayFee",
        type: "uint256",
      },
    ],
    name: "updateRepayFee",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_newSwapFee",
        type: "uint256",
      },
    ],
    name: "updateSwapFee",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract ITreasury",
        name: "_newTreasury",
        type: "address",
      },
    ],
    name: "updateTreasury",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_newWithdrawFee",
        type: "uint256",
      },
    ],
    name: "updateWithdrawFee",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "withdrawFee",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

export class ControllerStorageV1__factory {
  static readonly abi = _abi;
  static createInterface(): ControllerStorageV1Interface {
    return new utils.Interface(_abi) as ControllerStorageV1Interface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ControllerStorageV1 {
    return new Contract(address, _abi, signerOrProvider) as ControllerStorageV1;
  }
}
