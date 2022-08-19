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
import type {
  FunctionFragment,
  Result,
  EventFragment,
} from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "../common";

export interface DefaultOracleInterface extends utils.Interface {
  functions: {
    "ONE_USD()": FunctionFragment;
    "acceptGovernorship()": FunctionFragment;
    "addOrUpdateAssetThatUsesChainlink(address,address,uint256)": FunctionFragment;
    "addOrUpdateAssetThatUsesUniswapV2(address,address,uint256)": FunctionFragment;
    "addOrUpdateAssetThatUsesUniswapV3(address,address)": FunctionFragment;
    "addOrUpdateUsdAsset(address)": FunctionFragment;
    "assets(address)": FunctionFragment;
    "getPriceInUsd(address)": FunctionFragment;
    "governor()": FunctionFragment;
    "proposedGovernor()": FunctionFragment;
    "providerByProtocol(uint8)": FunctionFragment;
    "setPriceProvider(uint8,address)": FunctionFragment;
    "sweep(address,address,uint256)": FunctionFragment;
    "transferGovernorship(address)": FunctionFragment;
    "update(address)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "ONE_USD"
      | "acceptGovernorship"
      | "addOrUpdateAssetThatUsesChainlink"
      | "addOrUpdateAssetThatUsesUniswapV2"
      | "addOrUpdateAssetThatUsesUniswapV3"
      | "addOrUpdateUsdAsset"
      | "assets"
      | "getPriceInUsd"
      | "governor"
      | "proposedGovernor"
      | "providerByProtocol"
      | "setPriceProvider"
      | "sweep"
      | "transferGovernorship"
      | "update"
  ): FunctionFragment;

  encodeFunctionData(functionFragment: "ONE_USD", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "acceptGovernorship",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "addOrUpdateAssetThatUsesChainlink",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "addOrUpdateAssetThatUsesUniswapV2",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "addOrUpdateAssetThatUsesUniswapV3",
    values: [PromiseOrValue<string>, PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "addOrUpdateUsdAsset",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "assets",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "getPriceInUsd",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(functionFragment: "governor", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "proposedGovernor",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "providerByProtocol",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "setPriceProvider",
    values: [PromiseOrValue<BigNumberish>, PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "sweep",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "transferGovernorship",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "update",
    values: [PromiseOrValue<string>]
  ): string;

  decodeFunctionResult(functionFragment: "ONE_USD", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "acceptGovernorship",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "addOrUpdateAssetThatUsesChainlink",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "addOrUpdateAssetThatUsesUniswapV2",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "addOrUpdateAssetThatUsesUniswapV3",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "addOrUpdateUsdAsset",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "assets", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getPriceInUsd",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "governor", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "proposedGovernor",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "providerByProtocol",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setPriceProvider",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "sweep", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "transferGovernorship",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "update", data: BytesLike): Result;

  events: {
    "AssetUpdated(address,uint8,address,bool,uint256)": EventFragment;
    "PriceProviderUpdated(uint8,address,address)": EventFragment;
    "UpdatedGovernor(address,address)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "AssetUpdated"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "PriceProviderUpdated"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "UpdatedGovernor"): EventFragment;
}

export interface AssetUpdatedEventObject {
  asset: string;
  protocol: number;
  assetData: string;
  isUsd: boolean;
  stalePeriod: BigNumber;
}
export type AssetUpdatedEvent = TypedEvent<
  [string, number, string, boolean, BigNumber],
  AssetUpdatedEventObject
>;

export type AssetUpdatedEventFilter = TypedEventFilter<AssetUpdatedEvent>;

export interface PriceProviderUpdatedEventObject {
  protocol: number;
  oldPriceProvider: string;
  newPriceProvider: string;
}
export type PriceProviderUpdatedEvent = TypedEvent<
  [number, string, string],
  PriceProviderUpdatedEventObject
>;

export type PriceProviderUpdatedEventFilter =
  TypedEventFilter<PriceProviderUpdatedEvent>;

export interface UpdatedGovernorEventObject {
  previousGovernor: string;
  proposedGovernor: string;
}
export type UpdatedGovernorEvent = TypedEvent<
  [string, string],
  UpdatedGovernorEventObject
>;

export type UpdatedGovernorEventFilter = TypedEventFilter<UpdatedGovernorEvent>;

export interface DefaultOracle extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: DefaultOracleInterface;

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
    ONE_USD(overrides?: CallOverrides): Promise<[BigNumber]>;

    acceptGovernorship(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    addOrUpdateAssetThatUsesChainlink(
      _asset: PromiseOrValue<string>,
      _aggregator: PromiseOrValue<string>,
      _stalePeriod: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    addOrUpdateAssetThatUsesUniswapV2(
      _asset: PromiseOrValue<string>,
      _underlying: PromiseOrValue<string>,
      _stalePeriod: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    addOrUpdateAssetThatUsesUniswapV3(
      _asset: PromiseOrValue<string>,
      _underlying: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    addOrUpdateUsdAsset(
      _asset: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    assets(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<
      [number, string, boolean, BigNumber] & {
        protocol: number;
        assetData: string;
        isUsd: boolean;
        stalePeriod: BigNumber;
      }
    >;

    getPriceInUsd(
      _asset: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[BigNumber] & { _priceInUsd: BigNumber }>;

    governor(overrides?: CallOverrides): Promise<[string]>;

    proposedGovernor(overrides?: CallOverrides): Promise<[string]>;

    providerByProtocol(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[string]>;

    setPriceProvider(
      _protocol: PromiseOrValue<BigNumberish>,
      _priceProvider: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    sweep(
      _token: PromiseOrValue<string>,
      _to: PromiseOrValue<string>,
      _amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    transferGovernorship(
      _proposedGovernor: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    update(
      _asset: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;
  };

  ONE_USD(overrides?: CallOverrides): Promise<BigNumber>;

  acceptGovernorship(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  addOrUpdateAssetThatUsesChainlink(
    _asset: PromiseOrValue<string>,
    _aggregator: PromiseOrValue<string>,
    _stalePeriod: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  addOrUpdateAssetThatUsesUniswapV2(
    _asset: PromiseOrValue<string>,
    _underlying: PromiseOrValue<string>,
    _stalePeriod: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  addOrUpdateAssetThatUsesUniswapV3(
    _asset: PromiseOrValue<string>,
    _underlying: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  addOrUpdateUsdAsset(
    _asset: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  assets(
    arg0: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<
    [number, string, boolean, BigNumber] & {
      protocol: number;
      assetData: string;
      isUsd: boolean;
      stalePeriod: BigNumber;
    }
  >;

  getPriceInUsd(
    _asset: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  governor(overrides?: CallOverrides): Promise<string>;

  proposedGovernor(overrides?: CallOverrides): Promise<string>;

  providerByProtocol(
    arg0: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<string>;

  setPriceProvider(
    _protocol: PromiseOrValue<BigNumberish>,
    _priceProvider: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  sweep(
    _token: PromiseOrValue<string>,
    _to: PromiseOrValue<string>,
    _amount: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  transferGovernorship(
    _proposedGovernor: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  update(
    _asset: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    ONE_USD(overrides?: CallOverrides): Promise<BigNumber>;

    acceptGovernorship(overrides?: CallOverrides): Promise<void>;

    addOrUpdateAssetThatUsesChainlink(
      _asset: PromiseOrValue<string>,
      _aggregator: PromiseOrValue<string>,
      _stalePeriod: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    addOrUpdateAssetThatUsesUniswapV2(
      _asset: PromiseOrValue<string>,
      _underlying: PromiseOrValue<string>,
      _stalePeriod: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    addOrUpdateAssetThatUsesUniswapV3(
      _asset: PromiseOrValue<string>,
      _underlying: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    addOrUpdateUsdAsset(
      _asset: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    assets(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<
      [number, string, boolean, BigNumber] & {
        protocol: number;
        assetData: string;
        isUsd: boolean;
        stalePeriod: BigNumber;
      }
    >;

    getPriceInUsd(
      _asset: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    governor(overrides?: CallOverrides): Promise<string>;

    proposedGovernor(overrides?: CallOverrides): Promise<string>;

    providerByProtocol(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<string>;

    setPriceProvider(
      _protocol: PromiseOrValue<BigNumberish>,
      _priceProvider: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    sweep(
      _token: PromiseOrValue<string>,
      _to: PromiseOrValue<string>,
      _amount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    transferGovernorship(
      _proposedGovernor: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    update(
      _asset: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    "AssetUpdated(address,uint8,address,bool,uint256)"(
      asset?: PromiseOrValue<string> | null,
      protocol?: null,
      assetData?: null,
      isUsd?: null,
      stalePeriod?: null
    ): AssetUpdatedEventFilter;
    AssetUpdated(
      asset?: PromiseOrValue<string> | null,
      protocol?: null,
      assetData?: null,
      isUsd?: null,
      stalePeriod?: null
    ): AssetUpdatedEventFilter;

    "PriceProviderUpdated(uint8,address,address)"(
      protocol?: null,
      oldPriceProvider?: null,
      newPriceProvider?: null
    ): PriceProviderUpdatedEventFilter;
    PriceProviderUpdated(
      protocol?: null,
      oldPriceProvider?: null,
      newPriceProvider?: null
    ): PriceProviderUpdatedEventFilter;

    "UpdatedGovernor(address,address)"(
      previousGovernor?: PromiseOrValue<string> | null,
      proposedGovernor?: PromiseOrValue<string> | null
    ): UpdatedGovernorEventFilter;
    UpdatedGovernor(
      previousGovernor?: PromiseOrValue<string> | null,
      proposedGovernor?: PromiseOrValue<string> | null
    ): UpdatedGovernorEventFilter;
  };

  estimateGas: {
    ONE_USD(overrides?: CallOverrides): Promise<BigNumber>;

    acceptGovernorship(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    addOrUpdateAssetThatUsesChainlink(
      _asset: PromiseOrValue<string>,
      _aggregator: PromiseOrValue<string>,
      _stalePeriod: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    addOrUpdateAssetThatUsesUniswapV2(
      _asset: PromiseOrValue<string>,
      _underlying: PromiseOrValue<string>,
      _stalePeriod: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    addOrUpdateAssetThatUsesUniswapV3(
      _asset: PromiseOrValue<string>,
      _underlying: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    addOrUpdateUsdAsset(
      _asset: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    assets(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getPriceInUsd(
      _asset: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    governor(overrides?: CallOverrides): Promise<BigNumber>;

    proposedGovernor(overrides?: CallOverrides): Promise<BigNumber>;

    providerByProtocol(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    setPriceProvider(
      _protocol: PromiseOrValue<BigNumberish>,
      _priceProvider: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    sweep(
      _token: PromiseOrValue<string>,
      _to: PromiseOrValue<string>,
      _amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    transferGovernorship(
      _proposedGovernor: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    update(
      _asset: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    ONE_USD(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    acceptGovernorship(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    addOrUpdateAssetThatUsesChainlink(
      _asset: PromiseOrValue<string>,
      _aggregator: PromiseOrValue<string>,
      _stalePeriod: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    addOrUpdateAssetThatUsesUniswapV2(
      _asset: PromiseOrValue<string>,
      _underlying: PromiseOrValue<string>,
      _stalePeriod: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    addOrUpdateAssetThatUsesUniswapV3(
      _asset: PromiseOrValue<string>,
      _underlying: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    addOrUpdateUsdAsset(
      _asset: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    assets(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getPriceInUsd(
      _asset: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    governor(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    proposedGovernor(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    providerByProtocol(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    setPriceProvider(
      _protocol: PromiseOrValue<BigNumberish>,
      _priceProvider: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    sweep(
      _token: PromiseOrValue<string>,
      _to: PromiseOrValue<string>,
      _amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    transferGovernorship(
      _proposedGovernor: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    update(
      _asset: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;
  };
}
