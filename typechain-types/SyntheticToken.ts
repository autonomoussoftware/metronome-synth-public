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
} from "./common";

export interface SyntheticTokenInterface extends utils.Interface {
  functions: {
    "SECONDS_PER_YEAR()": FunctionFragment;
    "VERSION()": FunctionFragment;
    "accrueInterest()": FunctionFragment;
    "allowance(address,address)": FunctionFragment;
    "approve(address,uint256)": FunctionFragment;
    "balanceOf(address)": FunctionFragment;
    "burn(address,uint256)": FunctionFragment;
    "controller()": FunctionFragment;
    "debtToken()": FunctionFragment;
    "decimals()": FunctionFragment;
    "decreaseAllowance(address,uint256)": FunctionFragment;
    "governor()": FunctionFragment;
    "increaseAllowance(address,uint256)": FunctionFragment;
    "initialize(string,string,uint8,address,address,uint256,uint256)": FunctionFragment;
    "interestRate()": FunctionFragment;
    "interestRatePerSecond()": FunctionFragment;
    "isActive()": FunctionFragment;
    "issue(uint256,address)": FunctionFragment;
    "maxTotalSupplyInUsd()": FunctionFragment;
    "mint(address,uint256)": FunctionFragment;
    "name()": FunctionFragment;
    "repay(address,uint256)": FunctionFragment;
    "setController(address)": FunctionFragment;
    "sweep(address,address,uint256)": FunctionFragment;
    "symbol()": FunctionFragment;
    "toggleIsActive()": FunctionFragment;
    "totalSupply()": FunctionFragment;
    "transfer(address,uint256)": FunctionFragment;
    "transferFrom(address,address,uint256)": FunctionFragment;
    "updateInterestRate(uint256)": FunctionFragment;
    "updateMaxTotalSupplyInUsd(uint256)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "SECONDS_PER_YEAR"
      | "VERSION"
      | "accrueInterest"
      | "allowance"
      | "approve"
      | "balanceOf"
      | "burn"
      | "controller"
      | "debtToken"
      | "decimals"
      | "decreaseAllowance"
      | "governor"
      | "increaseAllowance"
      | "initialize"
      | "interestRate"
      | "interestRatePerSecond"
      | "isActive"
      | "issue"
      | "maxTotalSupplyInUsd"
      | "mint"
      | "name"
      | "repay"
      | "setController"
      | "sweep"
      | "symbol"
      | "toggleIsActive"
      | "totalSupply"
      | "transfer"
      | "transferFrom"
      | "updateInterestRate"
      | "updateMaxTotalSupplyInUsd"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "SECONDS_PER_YEAR",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "VERSION", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "accrueInterest",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "allowance",
    values: [PromiseOrValue<string>, PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "approve",
    values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "balanceOf",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "burn",
    values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "controller",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "debtToken", values?: undefined): string;
  encodeFunctionData(functionFragment: "decimals", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "decreaseAllowance",
    values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(functionFragment: "governor", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "increaseAllowance",
    values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "initialize",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "interestRate",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "interestRatePerSecond",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "isActive", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "issue",
    values: [PromiseOrValue<BigNumberish>, PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "maxTotalSupplyInUsd",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "mint",
    values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(functionFragment: "name", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "repay",
    values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "setController",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "sweep",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;
  encodeFunctionData(functionFragment: "symbol", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "toggleIsActive",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "totalSupply",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "transfer",
    values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "transferFrom",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "updateInterestRate",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "updateMaxTotalSupplyInUsd",
    values: [PromiseOrValue<BigNumberish>]
  ): string;

  decodeFunctionResult(
    functionFragment: "SECONDS_PER_YEAR",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "VERSION", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "accrueInterest",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "allowance", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "approve", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "balanceOf", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "burn", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "controller", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "debtToken", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "decimals", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "decreaseAllowance",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "governor", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "increaseAllowance",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "initialize", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "interestRate",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "interestRatePerSecond",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "isActive", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "issue", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "maxTotalSupplyInUsd",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "mint", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "name", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "repay", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "setController",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "sweep", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "symbol", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "toggleIsActive",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "totalSupply",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "transfer", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "transferFrom",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "updateInterestRate",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "updateMaxTotalSupplyInUsd",
    data: BytesLike
  ): Result;

  events: {
    "Approval(address,address,uint256)": EventFragment;
    "DebtRepaid(address,address,uint256,uint256)": EventFragment;
    "InterestRateUpdated(uint256,uint256)": EventFragment;
    "MaxTotalSupplyUpdated(uint256,uint256)": EventFragment;
    "SyntheticTokenActiveUpdated(bool,bool)": EventFragment;
    "SyntheticTokenIssued(address,address,uint256,uint256)": EventFragment;
    "Transfer(address,address,uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "Approval"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "DebtRepaid"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "InterestRateUpdated"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "MaxTotalSupplyUpdated"): EventFragment;
  getEvent(
    nameOrSignatureOrTopic: "SyntheticTokenActiveUpdated"
  ): EventFragment;
  getEvent(nameOrSignatureOrTopic: "SyntheticTokenIssued"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Transfer"): EventFragment;
}

export interface ApprovalEventObject {
  owner: string;
  spender: string;
  value: BigNumber;
}
export type ApprovalEvent = TypedEvent<
  [string, string, BigNumber],
  ApprovalEventObject
>;

export type ApprovalEventFilter = TypedEventFilter<ApprovalEvent>;

export interface DebtRepaidEventObject {
  payer: string;
  account: string;
  amount: BigNumber;
  fee: BigNumber;
}
export type DebtRepaidEvent = TypedEvent<
  [string, string, BigNumber, BigNumber],
  DebtRepaidEventObject
>;

export type DebtRepaidEventFilter = TypedEventFilter<DebtRepaidEvent>;

export interface InterestRateUpdatedEventObject {
  oldInterestRate: BigNumber;
  newInterestRate: BigNumber;
}
export type InterestRateUpdatedEvent = TypedEvent<
  [BigNumber, BigNumber],
  InterestRateUpdatedEventObject
>;

export type InterestRateUpdatedEventFilter =
  TypedEventFilter<InterestRateUpdatedEvent>;

export interface MaxTotalSupplyUpdatedEventObject {
  oldMaxTotalSupply: BigNumber;
  newMaxTotalSupply: BigNumber;
}
export type MaxTotalSupplyUpdatedEvent = TypedEvent<
  [BigNumber, BigNumber],
  MaxTotalSupplyUpdatedEventObject
>;

export type MaxTotalSupplyUpdatedEventFilter =
  TypedEventFilter<MaxTotalSupplyUpdatedEvent>;

export interface SyntheticTokenActiveUpdatedEventObject {
  oldActive: boolean;
  newActive: boolean;
}
export type SyntheticTokenActiveUpdatedEvent = TypedEvent<
  [boolean, boolean],
  SyntheticTokenActiveUpdatedEventObject
>;

export type SyntheticTokenActiveUpdatedEventFilter =
  TypedEventFilter<SyntheticTokenActiveUpdatedEvent>;

export interface SyntheticTokenIssuedEventObject {
  account: string;
  to: string;
  amount: BigNumber;
  fee: BigNumber;
}
export type SyntheticTokenIssuedEvent = TypedEvent<
  [string, string, BigNumber, BigNumber],
  SyntheticTokenIssuedEventObject
>;

export type SyntheticTokenIssuedEventFilter =
  TypedEventFilter<SyntheticTokenIssuedEvent>;

export interface TransferEventObject {
  from: string;
  to: string;
  value: BigNumber;
}
export type TransferEvent = TypedEvent<
  [string, string, BigNumber],
  TransferEventObject
>;

export type TransferEventFilter = TypedEventFilter<TransferEvent>;

export interface SyntheticToken extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: SyntheticTokenInterface;

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
    SECONDS_PER_YEAR(overrides?: CallOverrides): Promise<[BigNumber]>;

    VERSION(overrides?: CallOverrides): Promise<[string]>;

    accrueInterest(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    allowance(
      arg0: PromiseOrValue<string>,
      arg1: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    approve(
      spender: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    balanceOf(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    burn(
      _from: PromiseOrValue<string>,
      _amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    controller(overrides?: CallOverrides): Promise<[string]>;

    debtToken(overrides?: CallOverrides): Promise<[string]>;

    decimals(overrides?: CallOverrides): Promise<[number]>;

    decreaseAllowance(
      spender: PromiseOrValue<string>,
      subtractedValue: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    governor(
      overrides?: CallOverrides
    ): Promise<[string] & { _governor: string }>;

    increaseAllowance(
      spender: PromiseOrValue<string>,
      addedValue: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    initialize(
      _name: PromiseOrValue<string>,
      _symbol: PromiseOrValue<string>,
      _decimals: PromiseOrValue<BigNumberish>,
      _controller: PromiseOrValue<string>,
      _debtToken: PromiseOrValue<string>,
      _interestRate: PromiseOrValue<BigNumberish>,
      _maxTotalSupplyInUsd: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    interestRate(overrides?: CallOverrides): Promise<[BigNumber]>;

    interestRatePerSecond(overrides?: CallOverrides): Promise<[BigNumber]>;

    isActive(overrides?: CallOverrides): Promise<[boolean]>;

    issue(
      _amount: PromiseOrValue<BigNumberish>,
      _to: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    maxTotalSupplyInUsd(overrides?: CallOverrides): Promise<[BigNumber]>;

    mint(
      _to: PromiseOrValue<string>,
      _amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    name(overrides?: CallOverrides): Promise<[string]>;

    repay(
      _onBehalfOf: PromiseOrValue<string>,
      _amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setController(
      _controller: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    sweep(
      _token: PromiseOrValue<string>,
      _to: PromiseOrValue<string>,
      _amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    symbol(overrides?: CallOverrides): Promise<[string]>;

    toggleIsActive(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    totalSupply(overrides?: CallOverrides): Promise<[BigNumber]>;

    transfer(
      recipient: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    transferFrom(
      sender: PromiseOrValue<string>,
      recipient: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    updateInterestRate(
      _newInterestRate: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    updateMaxTotalSupplyInUsd(
      _newMaxTotalSupplyInUsd: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;
  };

  SECONDS_PER_YEAR(overrides?: CallOverrides): Promise<BigNumber>;

  VERSION(overrides?: CallOverrides): Promise<string>;

  accrueInterest(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  allowance(
    arg0: PromiseOrValue<string>,
    arg1: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  approve(
    spender: PromiseOrValue<string>,
    amount: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  balanceOf(
    arg0: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  burn(
    _from: PromiseOrValue<string>,
    _amount: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  controller(overrides?: CallOverrides): Promise<string>;

  debtToken(overrides?: CallOverrides): Promise<string>;

  decimals(overrides?: CallOverrides): Promise<number>;

  decreaseAllowance(
    spender: PromiseOrValue<string>,
    subtractedValue: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  governor(overrides?: CallOverrides): Promise<string>;

  increaseAllowance(
    spender: PromiseOrValue<string>,
    addedValue: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  initialize(
    _name: PromiseOrValue<string>,
    _symbol: PromiseOrValue<string>,
    _decimals: PromiseOrValue<BigNumberish>,
    _controller: PromiseOrValue<string>,
    _debtToken: PromiseOrValue<string>,
    _interestRate: PromiseOrValue<BigNumberish>,
    _maxTotalSupplyInUsd: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  interestRate(overrides?: CallOverrides): Promise<BigNumber>;

  interestRatePerSecond(overrides?: CallOverrides): Promise<BigNumber>;

  isActive(overrides?: CallOverrides): Promise<boolean>;

  issue(
    _amount: PromiseOrValue<BigNumberish>,
    _to: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  maxTotalSupplyInUsd(overrides?: CallOverrides): Promise<BigNumber>;

  mint(
    _to: PromiseOrValue<string>,
    _amount: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  name(overrides?: CallOverrides): Promise<string>;

  repay(
    _onBehalfOf: PromiseOrValue<string>,
    _amount: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setController(
    _controller: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  sweep(
    _token: PromiseOrValue<string>,
    _to: PromiseOrValue<string>,
    _amount: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  symbol(overrides?: CallOverrides): Promise<string>;

  toggleIsActive(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  totalSupply(overrides?: CallOverrides): Promise<BigNumber>;

  transfer(
    recipient: PromiseOrValue<string>,
    amount: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  transferFrom(
    sender: PromiseOrValue<string>,
    recipient: PromiseOrValue<string>,
    amount: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  updateInterestRate(
    _newInterestRate: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  updateMaxTotalSupplyInUsd(
    _newMaxTotalSupplyInUsd: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    SECONDS_PER_YEAR(overrides?: CallOverrides): Promise<BigNumber>;

    VERSION(overrides?: CallOverrides): Promise<string>;

    accrueInterest(overrides?: CallOverrides): Promise<void>;

    allowance(
      arg0: PromiseOrValue<string>,
      arg1: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    approve(
      spender: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<boolean>;

    balanceOf(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    burn(
      _from: PromiseOrValue<string>,
      _amount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    controller(overrides?: CallOverrides): Promise<string>;

    debtToken(overrides?: CallOverrides): Promise<string>;

    decimals(overrides?: CallOverrides): Promise<number>;

    decreaseAllowance(
      spender: PromiseOrValue<string>,
      subtractedValue: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<boolean>;

    governor(overrides?: CallOverrides): Promise<string>;

    increaseAllowance(
      spender: PromiseOrValue<string>,
      addedValue: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<boolean>;

    initialize(
      _name: PromiseOrValue<string>,
      _symbol: PromiseOrValue<string>,
      _decimals: PromiseOrValue<BigNumberish>,
      _controller: PromiseOrValue<string>,
      _debtToken: PromiseOrValue<string>,
      _interestRate: PromiseOrValue<BigNumberish>,
      _maxTotalSupplyInUsd: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    interestRate(overrides?: CallOverrides): Promise<BigNumber>;

    interestRatePerSecond(overrides?: CallOverrides): Promise<BigNumber>;

    isActive(overrides?: CallOverrides): Promise<boolean>;

    issue(
      _amount: PromiseOrValue<BigNumberish>,
      _to: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    maxTotalSupplyInUsd(overrides?: CallOverrides): Promise<BigNumber>;

    mint(
      _to: PromiseOrValue<string>,
      _amount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    name(overrides?: CallOverrides): Promise<string>;

    repay(
      _onBehalfOf: PromiseOrValue<string>,
      _amount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    setController(
      _controller: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    sweep(
      _token: PromiseOrValue<string>,
      _to: PromiseOrValue<string>,
      _amount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    symbol(overrides?: CallOverrides): Promise<string>;

    toggleIsActive(overrides?: CallOverrides): Promise<void>;

    totalSupply(overrides?: CallOverrides): Promise<BigNumber>;

    transfer(
      recipient: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<boolean>;

    transferFrom(
      sender: PromiseOrValue<string>,
      recipient: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<boolean>;

    updateInterestRate(
      _newInterestRate: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    updateMaxTotalSupplyInUsd(
      _newMaxTotalSupplyInUsd: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    "Approval(address,address,uint256)"(
      owner?: PromiseOrValue<string> | null,
      spender?: PromiseOrValue<string> | null,
      value?: null
    ): ApprovalEventFilter;
    Approval(
      owner?: PromiseOrValue<string> | null,
      spender?: PromiseOrValue<string> | null,
      value?: null
    ): ApprovalEventFilter;

    "DebtRepaid(address,address,uint256,uint256)"(
      payer?: PromiseOrValue<string> | null,
      account?: PromiseOrValue<string> | null,
      amount?: null,
      fee?: null
    ): DebtRepaidEventFilter;
    DebtRepaid(
      payer?: PromiseOrValue<string> | null,
      account?: PromiseOrValue<string> | null,
      amount?: null,
      fee?: null
    ): DebtRepaidEventFilter;

    "InterestRateUpdated(uint256,uint256)"(
      oldInterestRate?: null,
      newInterestRate?: null
    ): InterestRateUpdatedEventFilter;
    InterestRateUpdated(
      oldInterestRate?: null,
      newInterestRate?: null
    ): InterestRateUpdatedEventFilter;

    "MaxTotalSupplyUpdated(uint256,uint256)"(
      oldMaxTotalSupply?: null,
      newMaxTotalSupply?: null
    ): MaxTotalSupplyUpdatedEventFilter;
    MaxTotalSupplyUpdated(
      oldMaxTotalSupply?: null,
      newMaxTotalSupply?: null
    ): MaxTotalSupplyUpdatedEventFilter;

    "SyntheticTokenActiveUpdated(bool,bool)"(
      oldActive?: null,
      newActive?: null
    ): SyntheticTokenActiveUpdatedEventFilter;
    SyntheticTokenActiveUpdated(
      oldActive?: null,
      newActive?: null
    ): SyntheticTokenActiveUpdatedEventFilter;

    "SyntheticTokenIssued(address,address,uint256,uint256)"(
      account?: PromiseOrValue<string> | null,
      to?: PromiseOrValue<string> | null,
      amount?: null,
      fee?: null
    ): SyntheticTokenIssuedEventFilter;
    SyntheticTokenIssued(
      account?: PromiseOrValue<string> | null,
      to?: PromiseOrValue<string> | null,
      amount?: null,
      fee?: null
    ): SyntheticTokenIssuedEventFilter;

    "Transfer(address,address,uint256)"(
      from?: PromiseOrValue<string> | null,
      to?: PromiseOrValue<string> | null,
      value?: null
    ): TransferEventFilter;
    Transfer(
      from?: PromiseOrValue<string> | null,
      to?: PromiseOrValue<string> | null,
      value?: null
    ): TransferEventFilter;
  };

  estimateGas: {
    SECONDS_PER_YEAR(overrides?: CallOverrides): Promise<BigNumber>;

    VERSION(overrides?: CallOverrides): Promise<BigNumber>;

    accrueInterest(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    allowance(
      arg0: PromiseOrValue<string>,
      arg1: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    approve(
      spender: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    balanceOf(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    burn(
      _from: PromiseOrValue<string>,
      _amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    controller(overrides?: CallOverrides): Promise<BigNumber>;

    debtToken(overrides?: CallOverrides): Promise<BigNumber>;

    decimals(overrides?: CallOverrides): Promise<BigNumber>;

    decreaseAllowance(
      spender: PromiseOrValue<string>,
      subtractedValue: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    governor(overrides?: CallOverrides): Promise<BigNumber>;

    increaseAllowance(
      spender: PromiseOrValue<string>,
      addedValue: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    initialize(
      _name: PromiseOrValue<string>,
      _symbol: PromiseOrValue<string>,
      _decimals: PromiseOrValue<BigNumberish>,
      _controller: PromiseOrValue<string>,
      _debtToken: PromiseOrValue<string>,
      _interestRate: PromiseOrValue<BigNumberish>,
      _maxTotalSupplyInUsd: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    interestRate(overrides?: CallOverrides): Promise<BigNumber>;

    interestRatePerSecond(overrides?: CallOverrides): Promise<BigNumber>;

    isActive(overrides?: CallOverrides): Promise<BigNumber>;

    issue(
      _amount: PromiseOrValue<BigNumberish>,
      _to: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    maxTotalSupplyInUsd(overrides?: CallOverrides): Promise<BigNumber>;

    mint(
      _to: PromiseOrValue<string>,
      _amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    name(overrides?: CallOverrides): Promise<BigNumber>;

    repay(
      _onBehalfOf: PromiseOrValue<string>,
      _amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setController(
      _controller: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    sweep(
      _token: PromiseOrValue<string>,
      _to: PromiseOrValue<string>,
      _amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    symbol(overrides?: CallOverrides): Promise<BigNumber>;

    toggleIsActive(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    totalSupply(overrides?: CallOverrides): Promise<BigNumber>;

    transfer(
      recipient: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    transferFrom(
      sender: PromiseOrValue<string>,
      recipient: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    updateInterestRate(
      _newInterestRate: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    updateMaxTotalSupplyInUsd(
      _newMaxTotalSupplyInUsd: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    SECONDS_PER_YEAR(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    VERSION(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    accrueInterest(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    allowance(
      arg0: PromiseOrValue<string>,
      arg1: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    approve(
      spender: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    balanceOf(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    burn(
      _from: PromiseOrValue<string>,
      _amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    controller(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    debtToken(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    decimals(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    decreaseAllowance(
      spender: PromiseOrValue<string>,
      subtractedValue: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    governor(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    increaseAllowance(
      spender: PromiseOrValue<string>,
      addedValue: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    initialize(
      _name: PromiseOrValue<string>,
      _symbol: PromiseOrValue<string>,
      _decimals: PromiseOrValue<BigNumberish>,
      _controller: PromiseOrValue<string>,
      _debtToken: PromiseOrValue<string>,
      _interestRate: PromiseOrValue<BigNumberish>,
      _maxTotalSupplyInUsd: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    interestRate(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    interestRatePerSecond(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    isActive(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    issue(
      _amount: PromiseOrValue<BigNumberish>,
      _to: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    maxTotalSupplyInUsd(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    mint(
      _to: PromiseOrValue<string>,
      _amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    name(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    repay(
      _onBehalfOf: PromiseOrValue<string>,
      _amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setController(
      _controller: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    sweep(
      _token: PromiseOrValue<string>,
      _to: PromiseOrValue<string>,
      _amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    symbol(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    toggleIsActive(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    totalSupply(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    transfer(
      recipient: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    transferFrom(
      sender: PromiseOrValue<string>,
      recipient: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    updateInterestRate(
      _newInterestRate: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    updateMaxTotalSupplyInUsd(
      _newMaxTotalSupplyInUsd: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;
  };
}
