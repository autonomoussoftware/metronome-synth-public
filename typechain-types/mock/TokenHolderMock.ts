/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type { FunctionFragment, Result } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "../common";

export interface TokenHolderMockInterface extends utils.Interface {
  functions: {
    "acceptETH()": FunctionFragment;
    "sweep(address,address,uint256)": FunctionFragment;
    "sweeper()": FunctionFragment;
    "toggleAcceptETH()": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "acceptETH"
      | "sweep"
      | "sweeper"
      | "toggleAcceptETH"
  ): FunctionFragment;

  encodeFunctionData(functionFragment: "acceptETH", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "sweep",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;
  encodeFunctionData(functionFragment: "sweeper", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "toggleAcceptETH",
    values?: undefined
  ): string;

  decodeFunctionResult(functionFragment: "acceptETH", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "sweep", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "sweeper", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "toggleAcceptETH",
    data: BytesLike
  ): Result;

  events: {};
}

export interface TokenHolderMock extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: TokenHolderMockInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    acceptETH(overrides?: CallOverrides): Promise<[boolean]>;

    sweep(
      _token: PromiseOrValue<string>,
      _to: PromiseOrValue<string>,
      _amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    sweeper(overrides?: CallOverrides): Promise<[string]>;

    toggleAcceptETH(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;
  };

  acceptETH(overrides?: CallOverrides): Promise<boolean>;

  sweep(
    _token: PromiseOrValue<string>,
    _to: PromiseOrValue<string>,
    _amount: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  sweeper(overrides?: CallOverrides): Promise<string>;

  toggleAcceptETH(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    acceptETH(overrides?: CallOverrides): Promise<boolean>;

    sweep(
      _token: PromiseOrValue<string>,
      _to: PromiseOrValue<string>,
      _amount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    sweeper(overrides?: CallOverrides): Promise<string>;

    toggleAcceptETH(overrides?: CallOverrides): Promise<void>;
  };

  filters: {};

  estimateGas: {
    acceptETH(overrides?: CallOverrides): Promise<BigNumber>;

    sweep(
      _token: PromiseOrValue<string>,
      _to: PromiseOrValue<string>,
      _amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    sweeper(overrides?: CallOverrides): Promise<BigNumber>;

    toggleAcceptETH(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    acceptETH(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    sweep(
      _token: PromiseOrValue<string>,
      _to: PromiseOrValue<string>,
      _amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    sweeper(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    toggleAcceptETH(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;
  };
}