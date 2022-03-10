import hre from 'hardhat'

const {chainId} = hre.network.config

type Addresses = {
  [chainId: number]: {
    [key: string]: string
  }
}

const Address: Addresses = {
  [1 | 31337]: {
    NATIVE_TOKEN_ADDRESS: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    MET_ADDRESS: '0xa3d58c4E56fedCae3a7c43A725aeE9A71F0ece4e',
    DAI_ADDRESS: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    USDC_ADDRESS: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    WBTC_ADDRESS: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
    VSP_ADDRESS: '0x1b40183EFB4Dd766f11bDa7A7c3AD8982e998421',
    UNISWAP_V3_CROSS_POOL_ORACLE_ADDRESS: '0x0F1f5A87f99f0918e6C81F16E59F3518698221Ff',
    UNISWAP_V2_ROUTER02_ADDRESS: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
    MULTICALL_ADDRESS: '0xeefBa1e63905eF1D7ACbA5a8513c70307C1cE441',
    CDAI_ADDRESS: '0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643',
    CUSDC_ADDRESS: '0x39AA39c021dfbaE8faC545936693aC917d5E7563',
    CURVE_ADDRESS_PROVIDER_ADDRESS: '0x0000000022D53366457F9d5E68Ec105046FC4383',
    CURVE_3CRV_ADDRESS: '0x6c3f90f043a72fa612cbac8115ee7e52bde6e490',
  },
  [43114]: {
    NATIVE_TOKEN_ADDRESS: '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7',
    WETH_ADDRESS: '0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB',
    DAI_ADDRESS: '0xd586E7F844cEa2F87f50152665BCbc2C279D8d70',
    USDC_ADDRESS: '0xA7D7079b0FEaD91F3e65f86E8915Cb59c1a4C664',
    WBTC_ADDRESS: '0x50b7545627a5162F82A992c33b87aDc75187B218',
    MULTICALL_ADDRESS: '0x98e2060F672FD1656a07bc12D7253b5e41bF3876',
  },
}

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export default Address[chainId!]
