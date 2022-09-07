/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { ethers } from "ethers";
import {
  FactoryOptions,
  HardhatEthersHelpers as HardhatEthersHelpersBase,
} from "@nomiclabs/hardhat-ethers/types";

import * as Contracts from ".";

declare module "hardhat/types/runtime" {
  interface HardhatEthersHelpers extends HardhatEthersHelpersBase {
    getContractFactory(
      name: "Governable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Governable__factory>;
    getContractFactory(
      name: "Manageable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Manageable__factory>;
    getContractFactory(
      name: "Controller",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Controller__factory>;
    getContractFactory(
      name: "DebtToken",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.DebtToken__factory>;
    getContractFactory(
      name: "AggregatorV3Interface",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.AggregatorV3Interface__factory>;
    getContractFactory(
      name: "Ownable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Ownable__factory>;
    getContractFactory(
      name: "IBeacon",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IBeacon__factory>;
    getContractFactory(
      name: "ERC1967Proxy",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC1967Proxy__factory>;
    getContractFactory(
      name: "ERC1967Upgrade",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC1967Upgrade__factory>;
    getContractFactory(
      name: "Proxy",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Proxy__factory>;
    getContractFactory(
      name: "ProxyAdmin",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ProxyAdmin__factory>;
    getContractFactory(
      name: "TransparentUpgradeableProxy",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.TransparentUpgradeableProxy__factory>;
    getContractFactory(
      name: "ERC20",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC20__factory>;
    getContractFactory(
      name: "IERC20Metadata",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC20Metadata__factory>;
    getContractFactory(
      name: "IERC20",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC20__factory>;
    getContractFactory(
      name: "IUniswapV2Factory",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IUniswapV2Factory__factory>;
    getContractFactory(
      name: "IUniswapV2Pair",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IUniswapV2Pair__factory>;
    getContractFactory(
      name: "IUniswapV2Router01",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IUniswapV2Router01__factory>;
    getContractFactory(
      name: "IUniswapV2Router02",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IUniswapV2Router02__factory>;
    getContractFactory(
      name: "DepositToken",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.DepositToken__factory>;
    getContractFactory(
      name: "ICToken",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ICToken__factory>;
    getContractFactory(
      name: "ICurveAddressProvider",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ICurveAddressProvider__factory>;
    getContractFactory(
      name: "ICurveRegistry",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ICurveRegistry__factory>;
    getContractFactory(
      name: "IMulticall",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IMulticall__factory>;
    getContractFactory(
      name: "IWETH",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IWETH__factory>;
    getContractFactory(
      name: "IController",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IController__factory>;
    getContractFactory(
      name: "IDebtToken",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IDebtToken__factory>;
    getContractFactory(
      name: "IDepositToken",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IDepositToken__factory>;
    getContractFactory(
      name: "IGovernable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IGovernable__factory>;
    getContractFactory(
      name: "INativeTokenGateway",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.INativeTokenGateway__factory>;
    getContractFactory(
      name: "IPausable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IPausable__factory>;
    getContractFactory(
      name: "IRewardsDistributor",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IRewardsDistributor__factory>;
    getContractFactory(
      name: "ISyntheticToken",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ISyntheticToken__factory>;
    getContractFactory(
      name: "ITreasury",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ITreasury__factory>;
    getContractFactory(
      name: "IMasterOracle",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IMasterOracle__factory>;
    getContractFactory(
      name: "IOracle",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IOracle__factory>;
    getContractFactory(
      name: "IPriceProvider",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IPriceProvider__factory>;
    getContractFactory(
      name: "IUniswapV3CrossPoolOracle",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IUniswapV3CrossPoolOracle__factory>;
    getContractFactory(
      name: "OracleHelpers",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.OracleHelpers__factory>;
    getContractFactory(
      name: "ControllerMock",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ControllerMock__factory>;
    getContractFactory(
      name: "DefaultOracleMock",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.DefaultOracleMock__factory>;
    getContractFactory(
      name: "ERC20Mock",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC20Mock__factory>;
    getContractFactory(
      name: "IERC20",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC20__factory>;
    getContractFactory(
      name: "MasterOracleMock",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.MasterOracleMock__factory>;
    getContractFactory(
      name: "TokenHolderMock",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.TokenHolderMock__factory>;
    getContractFactory(
      name: "NativeTokenGateway",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.NativeTokenGateway__factory>;
    getContractFactory(
      name: "ChainlinkPriceProvider",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ChainlinkPriceProvider__factory>;
    getContractFactory(
      name: "DefaultOracle",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.DefaultOracle__factory>;
    getContractFactory(
      name: "CTokenOracle",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.CTokenOracle__factory>;
    getContractFactory(
      name: "MasterOracle",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.MasterOracle__factory>;
    getContractFactory(
      name: "UniswapV2LikePriceProvider",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.UniswapV2LikePriceProvider__factory>;
    getContractFactory(
      name: "UniswapV3PriceProvider",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.UniswapV3PriceProvider__factory>;
    getContractFactory(
      name: "Pausable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Pausable__factory>;
    getContractFactory(
      name: "RewardsDistributor",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.RewardsDistributor__factory>;
    getContractFactory(
      name: "ControllerStorageV1",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ControllerStorageV1__factory>;
    getContractFactory(
      name: "DebtTokenStorageV1",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.DebtTokenStorageV1__factory>;
    getContractFactory(
      name: "DepositTokenStorageV1",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.DepositTokenStorageV1__factory>;
    getContractFactory(
      name: "RewardsDistributorStorageV1",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.RewardsDistributorStorageV1__factory>;
    getContractFactory(
      name: "SyntheticTokenStorageV1",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.SyntheticTokenStorageV1__factory>;
    getContractFactory(
      name: "TreasuryStorageV1",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.TreasuryStorageV1__factory>;
    getContractFactory(
      name: "SyntheticToken",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.SyntheticToken__factory>;
    getContractFactory(
      name: "Treasury",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Treasury__factory>;
    getContractFactory(
      name: "ControllerUpgrader",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ControllerUpgrader__factory>;
    getContractFactory(
      name: "DebtTokenUpgrader",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.DebtTokenUpgrader__factory>;
    getContractFactory(
      name: "DepositTokenUpgrader",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.DepositTokenUpgrader__factory>;
    getContractFactory(
      name: "MasterOracleUpgrader",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.MasterOracleUpgrader__factory>;
    getContractFactory(
      name: "RewardsDistributorUpgrader",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.RewardsDistributorUpgrader__factory>;
    getContractFactory(
      name: "SyntheticTokenUpgrader",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.SyntheticTokenUpgrader__factory>;
    getContractFactory(
      name: "TreasuryUpgrader",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.TreasuryUpgrader__factory>;
    getContractFactory(
      name: "UpgraderBase",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.UpgraderBase__factory>;
    getContractFactory(
      name: "TokenHolder",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.TokenHolder__factory>;

    getContractAt(
      name: "Governable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.Governable>;
    getContractAt(
      name: "Manageable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.Manageable>;
    getContractAt(
      name: "Controller",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.Controller>;
    getContractAt(
      name: "DebtToken",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.DebtToken>;
    getContractAt(
      name: "AggregatorV3Interface",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.AggregatorV3Interface>;
    getContractAt(
      name: "Ownable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.Ownable>;
    getContractAt(
      name: "IBeacon",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IBeacon>;
    getContractAt(
      name: "ERC1967Proxy",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC1967Proxy>;
    getContractAt(
      name: "ERC1967Upgrade",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC1967Upgrade>;
    getContractAt(
      name: "Proxy",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.Proxy>;
    getContractAt(
      name: "ProxyAdmin",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ProxyAdmin>;
    getContractAt(
      name: "TransparentUpgradeableProxy",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.TransparentUpgradeableProxy>;
    getContractAt(
      name: "ERC20",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC20>;
    getContractAt(
      name: "IERC20Metadata",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC20Metadata>;
    getContractAt(
      name: "IERC20",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC20>;
    getContractAt(
      name: "IUniswapV2Factory",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IUniswapV2Factory>;
    getContractAt(
      name: "IUniswapV2Pair",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IUniswapV2Pair>;
    getContractAt(
      name: "IUniswapV2Router01",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IUniswapV2Router01>;
    getContractAt(
      name: "IUniswapV2Router02",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IUniswapV2Router02>;
    getContractAt(
      name: "DepositToken",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.DepositToken>;
    getContractAt(
      name: "ICToken",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ICToken>;
    getContractAt(
      name: "ICurveAddressProvider",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ICurveAddressProvider>;
    getContractAt(
      name: "ICurveRegistry",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ICurveRegistry>;
    getContractAt(
      name: "IMulticall",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IMulticall>;
    getContractAt(
      name: "IWETH",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IWETH>;
    getContractAt(
      name: "IController",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IController>;
    getContractAt(
      name: "IDebtToken",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IDebtToken>;
    getContractAt(
      name: "IDepositToken",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IDepositToken>;
    getContractAt(
      name: "IGovernable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IGovernable>;
    getContractAt(
      name: "INativeTokenGateway",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.INativeTokenGateway>;
    getContractAt(
      name: "IPausable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IPausable>;
    getContractAt(
      name: "IRewardsDistributor",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IRewardsDistributor>;
    getContractAt(
      name: "ISyntheticToken",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ISyntheticToken>;
    getContractAt(
      name: "ITreasury",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ITreasury>;
    getContractAt(
      name: "IMasterOracle",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IMasterOracle>;
    getContractAt(
      name: "IOracle",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IOracle>;
    getContractAt(
      name: "IPriceProvider",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IPriceProvider>;
    getContractAt(
      name: "IUniswapV3CrossPoolOracle",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IUniswapV3CrossPoolOracle>;
    getContractAt(
      name: "OracleHelpers",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.OracleHelpers>;
    getContractAt(
      name: "ControllerMock",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ControllerMock>;
    getContractAt(
      name: "DefaultOracleMock",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.DefaultOracleMock>;
    getContractAt(
      name: "ERC20Mock",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC20Mock>;
    getContractAt(
      name: "IERC20",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC20>;
    getContractAt(
      name: "MasterOracleMock",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.MasterOracleMock>;
    getContractAt(
      name: "TokenHolderMock",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.TokenHolderMock>;
    getContractAt(
      name: "NativeTokenGateway",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.NativeTokenGateway>;
    getContractAt(
      name: "ChainlinkPriceProvider",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ChainlinkPriceProvider>;
    getContractAt(
      name: "DefaultOracle",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.DefaultOracle>;
    getContractAt(
      name: "CTokenOracle",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.CTokenOracle>;
    getContractAt(
      name: "MasterOracle",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.MasterOracle>;
    getContractAt(
      name: "UniswapV2LikePriceProvider",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.UniswapV2LikePriceProvider>;
    getContractAt(
      name: "UniswapV3PriceProvider",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.UniswapV3PriceProvider>;
    getContractAt(
      name: "Pausable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.Pausable>;
    getContractAt(
      name: "RewardsDistributor",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.RewardsDistributor>;
    getContractAt(
      name: "ControllerStorageV1",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ControllerStorageV1>;
    getContractAt(
      name: "DebtTokenStorageV1",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.DebtTokenStorageV1>;
    getContractAt(
      name: "DepositTokenStorageV1",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.DepositTokenStorageV1>;
    getContractAt(
      name: "RewardsDistributorStorageV1",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.RewardsDistributorStorageV1>;
    getContractAt(
      name: "SyntheticTokenStorageV1",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.SyntheticTokenStorageV1>;
    getContractAt(
      name: "TreasuryStorageV1",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.TreasuryStorageV1>;
    getContractAt(
      name: "SyntheticToken",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.SyntheticToken>;
    getContractAt(
      name: "Treasury",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.Treasury>;
    getContractAt(
      name: "ControllerUpgrader",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ControllerUpgrader>;
    getContractAt(
      name: "DebtTokenUpgrader",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.DebtTokenUpgrader>;
    getContractAt(
      name: "DepositTokenUpgrader",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.DepositTokenUpgrader>;
    getContractAt(
      name: "MasterOracleUpgrader",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.MasterOracleUpgrader>;
    getContractAt(
      name: "RewardsDistributorUpgrader",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.RewardsDistributorUpgrader>;
    getContractAt(
      name: "SyntheticTokenUpgrader",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.SyntheticTokenUpgrader>;
    getContractAt(
      name: "TreasuryUpgrader",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.TreasuryUpgrader>;
    getContractAt(
      name: "UpgraderBase",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.UpgraderBase>;
    getContractAt(
      name: "TokenHolder",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.TokenHolder>;

    // default types
    getContractFactory(
      name: string,
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<ethers.ContractFactory>;
    getContractFactory(
      abi: any[],
      bytecode: ethers.utils.BytesLike,
      signer?: ethers.Signer
    ): Promise<ethers.ContractFactory>;
    getContractAt(
      nameOrAbi: string | any[],
      address: string,
      signer?: ethers.Signer
    ): Promise<ethers.Contract>;
  }
}