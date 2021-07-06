export const SELECT_COLLATERAL_TOKEN = "select_collateral_token";

export const SELECT_PRICE_IDENTIFIER = "select_price_identifier";

export const CREATE_EXPIRING_MULTIPARTY = "create_expiring_multiparty";

export const MINT = "mint";

export const BLUE_COLOR = "#222336";

export const SUPPORTED_NETWORK_IDS: number[] = [1, 42, 137, 80001];

export const MAINNET_ID = 1

export const KOVAN_ID = 42

export const POLYGON_MAINNET = 137

export const POLYGON_MUMBAI = 80001

// Source: https://docs.matic.network/docs/develop/network-details/mapped-tokens/
export const DEFAULT_COLLATERALS_FOR_POLYGON_MAINNET = [
  {
    name: "Matic Token",
    symbol: "MATIC",
    address: "0x0000000000000000000000000000000000001010",
    decimals: 18,
    isOnWhitelist: true // MATIC https://polygonscan.com/address/0x0000000000000000000000000000000000001010
  },
  {
    name: "Wrapped Ether",
    symbol: "WETH",
    address: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
    decimals: 18,
    isOnWhitelist: true // POS-WETH https://polygonscan.com/address/0x7ceb23fd6bc0add59e62ac25578270cff1b9f619
  }
]

export const DEFAULT_COLLATERALS_FOR_POLYGON_MUMBAI = [
  {
    name: "Matic Token",
    symbol: "MATIC",
    address: "0x0000000000000000000000000000000000001010",
    decimals: 18,
    isOnWhitelist: true // MATIC https://mumbai.polygonscan.com/token/0x0000000000000000000000000000000000001010
  },
  {
    name: "Wrapped Ether",
    symbol: "WETH",
    address: "0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa",
    decimals: 18,
    isOnWhitelist: true // POS-WETH https://mumbai-explorer.matic.today/address/0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa
  }
]

export const TOKEN_BUILDER_ROUTE = "token-builder";

export const DEFAULT_SELECT_VALUE = "0";

export const KOVAN_NETWORK = "Kovan";

export const MAINNET_NETWORK = "Mainnet";

export const DAI = "DAI";

export const OneInchUSDPriceIdentifier = "1INCHUSD";

export const SUCCESS_ROUTE = "congratulations";

export const MINIMUM_COLLATERAL_REQUIREMENT = 125;

export const DEFAULT_LIQUIDATION_LIVENESS = 7200;

export const DEFAULT_WITHDRAWAL_LIVENESS = 7200;

export const DEFAULT_COLLATERAL_REQUIREMENT = "1.25";

export const DEFAULT_DISPUTE_BOND_PERCENTAGE = "0.1";

export const DEFAULT_SPONSOR_DISPUTE_REWARD_PERCENTAGE = "0.05";

export const DEFAULT_DISPUTER_DISPUTE_REWARD_PERCENTAGE = "0.2";

export const FINANCIAL_PRODUCT_LIBRARY =
  "0x0000000000000000000000000000000000000000";

export const INFINITY = "Infinity";
