import hre from 'hardhat'

const {chainId} = hre.network.config

type Addresses = {
  [chainId: number]: {
    [key: string]: string
  }
}

const Address: Addresses = {
  [1]: {
    NATIVE_TOKEN_ADDRESS: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    WETH_ADDRESS: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    SGETH_ADDRESS: '0x72E2F4830b9E45d52F80aC08CB2bEC0FeF72eD9c',
    MET_ADDRESS: '0x2Ebd53d035150f328bd754D6DC66B99B0eDB89aa',
    DAI_ADDRESS: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    USDC_ADDRESS: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    FRAX_ADDRESS: '0x853d955aCEf822Db058eb8505911ED77F175b99e',
    WBTC_ADDRESS: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
    VSP_ADDRESS: '0x1b40183EFB4Dd766f11bDa7A7c3AD8982e998421',
    USDT_ADDRESS: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    VAUSDC_ADDRESS: '0xa8b607Aa09B6A2E306F93e74c282Fb13f6A80452',
    VADAI_ADDRESS: '0x0538C8bAc84E95A9dF8aC10Aad17DbE81b9E36ee',
    VAFRAX_ADDRESS: '0xc14900dFB1Aa54e7674e1eCf9ce02b3b35157ba5',
    VALINK_ADDRESS: '0xef4F4604106de23CDadfEAE08fcC34602cB475C1',
    VASTETH_ADDRESS: '0x4Dbe3f01aBe271D3E65432c74851625a8c30Aa7B',
    VARETH_ADDRESS: '0xDD9F61a85fFE73E41eF889817972f0B0AaE6D6Dd',
    VACBETH_ADDRESS: '0x650CD45DEdb19c33160Acc522aD1a82D9701036a',
    VAWBTC_ADDRESS: '0x01e1d41C1159b745298724c5Fd3eAfF3da1C6efD',
    VAETH_ADDRESS: '0xd1C117319B3595fbc39b471AB1fd485629eb05F2',
    UNISWAP_V3_CROSS_POOL_ORACLE_ADDRESS: '0x0F1f5A87f99f0918e6C81F16E59F3518698221Ff',
    UNISWAP_V2_LIKE_ROUTER_ADDRESS: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D', // UniswapV2 Router02
    CDAI_ADDRESS: '0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643',
    CUSDC_ADDRESS: '0x39AA39c021dfbaE8faC545936693aC917d5E7563',
    CURVE_ADDRESS_PROVIDER_ADDRESS: '0x0000000022D53366457F9d5E68Ec105046FC4383',
    CURVE_3CRV_ADDRESS: '0x6c3f90f043a72fa612cbac8115ee7e52bde6e490',
    MIM_ADDRESS: '0x99d8a9c45b2eca8864373a26d1459e3dff1e17f3',
    LINK_ADDRESS: '0x514910771af9ca656af840dff83e8264ecf986ca',
    WAVAX_ADDRESS: '0x85f138bfEE4ef8e540890CFb48F620571d67Eda3',
    UNI_ADDRESS: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
    CRV_ADDRESS: '0xD533a949740bb3306d119CC777fa900bA034cd52',
    AAVE_ADDRESS: '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9',
    USDC_USD_CHAINLINK_AGGREGATOR_ADDRESS: '0x8fFfFfd4AfB6115b954Bd326cbe7B4BA576818f6',
    AAVE_USD_CHAINLINK_AGGREGATOR_ADDRESS: '0x547a514d5e3769680Ce22B2361c10Ea13619e8a9',
    AVAX_USD_CHAINLINK_AGGREGATOR_ADDRESS: '0xFF3EEb22B5E3dE6e705b44749C2559d704923FD7',
    BTC_USD_CHAINLINK_AGGREGATOR_ADDRESS: '0xF4030086522a5bEEa4988F8cA5B36dbC97BeE88c',
    CRV_USD_CHAINLINK_AGGREGATOR_ADDRESS: '0xCd627aA160A6fA45Eb793D19Ef54f5062F20f33f',
    DAI_USD_CHAINLINK_AGGREGATOR_ADDRESS: '0xAed0c38402a5d19df6E4c03F4E2DceD6e29c1ee9',
    ETH_USD_CHAINLINK_AGGREGATOR_ADDRESS: '0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419',
    UNI_USD_CHAINLINK_AGGREGATOR_ADDRESS: '0x553303d460EE0afB37EdFf9bE42922D8FF63220e',
    USDT_USD_CHAINLINK_AGGREGATOR_ADDRESS: '0x3E7d1eAB13ad0104d2750B8863b489D65364e32D',
    MASTER_ORACLE_ADDRESS: '0x80704Acdf97723963263c78F861F091ad04F46E2',
    MASTER_ORACLE_GOVERNOR_ADDRESS: '0x9520b477Aa81180E6DdC006Fc09Fb6d3eb4e807A',
    FEE_COLLECTOR: '0xd1DE3F9CD4AE2F23DA941a67cA4C739f8dD9Af33',
    CURVE_MSUSD_FRAXBP_POOL_ADDRESS: '0xc3b19502f8c02be75f3f77fd673503520deb51dd',
    ESMET: '0xA28D70795a61Dc925D4c220762A4344803876bb8',
    ESMET721: '0x89c4AedCd10DF1B19Cf2d4B540AF3fcaD5D4C21a',
    GNOSIS_SAFE_ADDRESS: '0xd1DE3F9CD4AE2F23DA941a67cA4C739f8dD9Af33',
    GNOSIS_MULTISEND_ADDRESS: '0x40A2aCCbd92BCA938b02010E17A5b8929b49130D',
    SFRXETH_ADDRESS: '0xac3E018457B222d93114458476f3E3416Abbe38F',
    SWAPPER: '0x229f19942612A8dbdec3643CB23F88685CCd56A5',
    LZ_ENDPOINT: '0x66A71Dcef29A0fFBDBE3c6a460a3B5BC225Cd675',
    STARGATE_ROUTER: '0x8731d54E9D02c286767d56ac03e8037C07e01e98',
    STARGATE_COMPOSER: '0xeCc19E177d24551aA7ed6Bc6FE566eCa726CC8a9',
  },
  [43114]: {
    NATIVE_TOKEN_ADDRESS: '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7', // WAVAX
    WETH_ADDRESS: '0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB',
    DAI_ADDRESS: '0xd586E7F844cEa2F87f50152665BCbc2C279D8d70',
    USDC_ADDRESS: '0xA7D7079b0FEaD91F3e65f86E8915Cb59c1a4C664',
    WBTC_ADDRESS: '0x50b7545627a5162F82A992c33b87aDc75187B218',
    UNISWAP_V2_LIKE_ROUTER_ADDRESS: '0x60aE616a2155Ee3d9A68541Ba4544862310933d4', // TraderJoe
    MIM_ADDRESS: '0x130966628846BFd36ff31a822705796e8cb8C18D',
    LINK_ADDRESS: '0x5947BB275c521040051D82396192181b413227A3',
    WAVAX_ADDRESS: '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7',
    USDT_ADDRESS: '0xc7198437980c041c805A1EDcbA50c1Ce5db95118',
    UNI_ADDRESS: '0x8ebaf22b6f053dffeaf46f4dd9efa95d89ba8580',
    CRV_ADDRESS: '0x249848beca43ac405b8102ec90dd5f22ca513c06',
    AAVE_ADDRESS: '0x63a72806098Bd3D9520cC43356dD78afe5D386D9',
    USDC_USD_CHAINLINK_AGGREGATOR_ADDRESS: '0xF096872672F44d6EBA71458D74fe67F9a77a23B9',
    AAVE_USD_CHAINLINK_AGGREGATOR_ADDRESS: '0x3CA13391E9fb38a75330fb28f8cc2eB3D9ceceED',
    AVAX_USD_CHAINLINK_AGGREGATOR_ADDRESS: '0x0A77230d17318075983913bC2145DB16C7366156',
    BTC_USD_CHAINLINK_AGGREGATOR_ADDRESS: '0x2779D32d5166BAaa2B2b658333bA7e6Ec0C65743',
    CRV_USD_CHAINLINK_AGGREGATOR_ADDRESS: '0x7CF8A6090A9053B01F3DF4D4e6CfEdd8c90d9027',
    DAI_USD_CHAINLINK_AGGREGATOR_ADDRESS: '0x51D7180edA2260cc4F6e4EebB82FEF5c3c2B8300',
    ETH_USD_CHAINLINK_AGGREGATOR_ADDRESS: '0x976B3D034E162d8bD72D6b9C989d545b839003b0',
    UNI_USD_CHAINLINK_AGGREGATOR_ADDRESS: '0x9a1372f9b1B71B3A5a72E092AE67E172dBd7Daaa',
    USDT_USD_CHAINLINK_AGGREGATOR_ADDRESS: '0xEBE676ee90Fe1112671f19b6B7459bC678B67e8a',
    MASTER_ORACLE_ADDRESS: '0xe42e893353448143f36B59E0122fA8F58346611A',
    CHAINLINK_PRICE_PROVIDER: '0xf51aCe69A082eE132c54aBd6eb4b304E20383e93',
    MS_USD_TOKEN_ORACLE_ADDRESS: '0x5Db1C3B4E0D31B277a6a292B0365162A1100D527',
    ONE_ORACLE_ADDRESS_PROVIDER: '0xfbA0816A81bcAbBf3829bED28618177a2bf0e82A',
    FEE_COLLECTOR: '0x1cbfae0367a9b1e4ac2c158e57b5f00ccb337271', // keeping same as vesper pools
    ESMET: '0x0000000000000000000000000000000000000000',
  },
  [56]: {
    WBNB_ADDRESS: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
    BUSD_ADDRESS: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
    NATIVE_TOKEN_ADDRESS: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
    MASTER_ORACLE_ADDRESS: '0x5323F445A8665239222b117aE095423a238F5706',
    FEE_COLLECTOR: '0x1cbfae0367a9b1e4ac2c158e57b5f00ccb337271', // keeping same as vesper pools on avalanche
  },
  [10]: {
    MASTER_ORACLE_ADDRESS: '0x0aac835162D368F246dc71628AfcD6d2930c47d3',
    MASTER_ORACLE_GOVERNOR_ADDRESS: '0x169e2FfC1c6b229b04E65A431434bF0e8eD9563d',
    FEE_COLLECTOR: '0xE01Df4ac1E1e57266900E62C37F12C986495A618',
    SWAPPER: '0x017CBF62b53313d5eE3aD1288daA95CD39AA11fE',
    NATIVE_TOKEN_ADDRESS: '0x4200000000000000000000000000000000000006',
    USDC_ADDRESS: '0x7F5c764cBc14f9669B88837ca1490cCa17c31607',
    WETH_ADDRESS: '0x4200000000000000000000000000000000000006',
    SGETH_ADDRESS: '0xb69c8CBCD90A39D8D3d3ccf0a3E968511C3856A0',
    VAETH_ADDRESS: '0xCcF3d1AcF799bAe67F6e354d685295557cf64761',
    VAOP_ADDRESS: '0x19382707d5a47E74f60053b652Ab34b6e30Febad',
    VAWSTETH_ADDRESS: '0xdd63ae655b388Cd782681b7821Be37fdB6d0E78d',
    VAUSDC_ADDRESS: '0x539505Dde2B9771dEBE0898a84441c5E7fDF6BC0',
    OP_ADDRESS: '0x4200000000000000000000000000000000000042',
    GNOSIS_SAFE_ADDRESS: '0xE01Df4ac1E1e57266900E62C37F12C986495A618',
    LZ_ENDPOINT: '0x3c2269811836af69497E5F486A85D7316753cf62',
    STARGATE_ROUTER: '0xB0D502E938ed5f4df2E681fE6E419ff29631d62b',
    FRAX_ADDRESS: '0x2e3d870790dc77a83dd1d18184acc7439a53f475',
    STARGATE_COMPOSER: '0xeCc19E177d24551aA7ed6Bc6FE566eCa726CC8a9',
  },
  [8453]: {
    MASTER_ORACLE_ADDRESS: '0x99866a6074ADb027f09c9AF31929dB5941D36DA7',
    MASTER_ORACLE_GOVERNOR_ADDRESS: '0x76d266DFD3754f090488ae12F6Bd115cD7E77eBD',
    // TODO: Update
    FEE_COLLECTOR: '0x76d266DFD3754f090488ae12F6Bd115cD7E77eBD',
    NATIVE_TOKEN_ADDRESS: '0x4200000000000000000000000000000000000006',
    USDC_ADDRESS: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    WETH_ADDRESS: '0x4200000000000000000000000000000000000006',
    SGETH_ADDRESS: '0x224D8Fd7aB6AD4c6eb4611Ce56EF35Dec2277F03',
    // TODO: Update
    GNOSIS_SAFE_ADDRESS: '0xdf826ff6518e609E4cEE86299d40611C148099d5',
    LZ_ENDPOINT: '0x1a44076050125825900e736c501f859c50fE728c',
    STARGATE_ROUTER: '0x45f1A95A4D3f3836523F5c83673c797f4d4d263B',
    STARGATE_COMPOSER: '0xeCc19E177d24551aA7ed6Bc6FE566eCa726CC8a9',
  },
}

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export default Address[chainId!]
