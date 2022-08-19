/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../common";
import type {
  DefaultOracleMock,
  DefaultOracleMockInterface,
} from "../../mock/DefaultOracleMock";

const _abi = [
  {
    inputs: [
      {
        internalType: "contract IERC20",
        name: "_asset",
        type: "address",
      },
    ],
    name: "getPriceInUsd",
    outputs: [
      {
        internalType: "uint256",
        name: "_priceInUsd",
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
    name: "prices",
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
        internalType: "contract IERC20",
        name: "_asset",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_price",
        type: "uint256",
      },
    ],
    name: "updatePrice",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b5061016b806100206000396000f3fe608060405234801561001057600080fd5b50600436106100415760003560e01c806307ee40bf14610046578063457972de14610081578063cfed246b146100ad575b600080fd5b61006f6100543660046100e9565b6001600160a01b031660009081526020819052604090205490565b60405190815260200160405180910390f35b6100ab61008f36600461010b565b6001600160a01b03909116600090815260208190526040902055565b005b61006f6100bb3660046100e9565b60006020819052908152604090205481565b80356001600160a01b03811681146100e457600080fd5b919050565b6000602082840312156100fb57600080fd5b610104826100cd565b9392505050565b6000806040838503121561011e57600080fd5b610127836100cd565b94602093909301359350505056fea26469706673582212204167f6df34aef0323faeef7102d716d9493c5d8438460371a5db37e4663cb0a064736f6c63430008090033";

type DefaultOracleMockConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: DefaultOracleMockConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class DefaultOracleMock__factory extends ContractFactory {
  constructor(...args: DefaultOracleMockConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<DefaultOracleMock> {
    return super.deploy(overrides || {}) as Promise<DefaultOracleMock>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): DefaultOracleMock {
    return super.attach(address) as DefaultOracleMock;
  }
  override connect(signer: Signer): DefaultOracleMock__factory {
    return super.connect(signer) as DefaultOracleMock__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): DefaultOracleMockInterface {
    return new utils.Interface(_abi) as DefaultOracleMockInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): DefaultOracleMock {
    return new Contract(address, _abi, signerOrProvider) as DefaultOracleMock;
  }
}
