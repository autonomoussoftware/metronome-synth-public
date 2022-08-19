/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  IGovernable,
  IGovernableInterface,
} from "../../interface/IGovernable";

const _abi = [
  {
    inputs: [],
    name: "governor",
    outputs: [
      {
        internalType: "address",
        name: "_governor",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_proposedGovernor",
        type: "address",
      },
    ],
    name: "transferGovernorship",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export class IGovernable__factory {
  static readonly abi = _abi;
  static createInterface(): IGovernableInterface {
    return new utils.Interface(_abi) as IGovernableInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): IGovernable {
    return new Contract(address, _abi, signerOrProvider) as IGovernable;
  }
}
