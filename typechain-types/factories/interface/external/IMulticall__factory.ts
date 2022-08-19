/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  IMulticall,
  IMulticallInterface,
} from "../../../interface/external/IMulticall";

const _abi = [
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "target",
            type: "address",
          },
          {
            internalType: "bytes",
            name: "callData",
            type: "bytes",
          },
        ],
        internalType: "struct IMulticall.Call[]",
        name: "calls",
        type: "tuple[]",
      },
    ],
    name: "aggregate",
    outputs: [
      {
        internalType: "uint256",
        name: "blockNumber",
        type: "uint256",
      },
      {
        internalType: "bytes[]",
        name: "returnData",
        type: "bytes[]",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export class IMulticall__factory {
  static readonly abi = _abi;
  static createInterface(): IMulticallInterface {
    return new utils.Interface(_abi) as IMulticallInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): IMulticall {
    return new Contract(address, _abi, signerOrProvider) as IMulticall;
  }
}
