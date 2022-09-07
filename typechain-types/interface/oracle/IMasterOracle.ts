/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
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
} from "../../common";

export interface IMasterOracleInterface extends utils.Interface {
  functions: {
    "quote(address,address,uint256)": FunctionFragment;
    "quoteTokenToUsd(address,uint256)": FunctionFragment;
    "quoteUsdToToken(address,uint256)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic: "quote" | "quoteTokenToUsd" | "quoteUsdToToken"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "quote",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "quoteTokenToUsd",
    values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "quoteUsdToToken",
    values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]
  ): string;

  decodeFunctionResult(functionFragment: "quote", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "quoteTokenToUsd",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "quoteUsdToToken",
    data: BytesLike
  ): Result;

  events: {};
}

export interface IMasterOracle extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: IMasterOracleInterface;

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
    quote(
      _assetIn: PromiseOrValue<string>,
      _assetOut: PromiseOrValue<string>,
      _amountIn: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[BigNumber] & { _amountOut: BigNumber }>;

    quoteTokenToUsd(
      _asset: PromiseOrValue<string>,
      _amount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[BigNumber] & { _amountInUsd: BigNumber }>;

    quoteUsdToToken(
      _asset: PromiseOrValue<string>,
      _amountInUsd: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[BigNumber] & { _amount: BigNumber }>;
  };

  quote(
    _assetIn: PromiseOrValue<string>,
    _assetOut: PromiseOrValue<string>,
    _amountIn: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  quoteTokenToUsd(
    _asset: PromiseOrValue<string>,
    _amount: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  quoteUsdToToken(
    _asset: PromiseOrValue<string>,
    _amountInUsd: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  callStatic: {
    quote(
      _assetIn: PromiseOrValue<string>,
      _assetOut: PromiseOrValue<string>,
      _amountIn: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    quoteTokenToUsd(
      _asset: PromiseOrValue<string>,
      _amount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    quoteUsdToToken(
      _asset: PromiseOrValue<string>,
      _amountInUsd: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  filters: {};

  estimateGas: {
    quote(
      _assetIn: PromiseOrValue<string>,
      _assetOut: PromiseOrValue<string>,
      _amountIn: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    quoteTokenToUsd(
      _asset: PromiseOrValue<string>,
      _amount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    quoteUsdToToken(
      _asset: PromiseOrValue<string>,
      _amountInUsd: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    quote(
      _assetIn: PromiseOrValue<string>,
      _assetOut: PromiseOrValue<string>,
      _amountIn: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    quoteTokenToUsd(
      _asset: PromiseOrValue<string>,
      _amount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    quoteUsdToToken(
      _asset: PromiseOrValue<string>,
      _amountInUsd: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}