export type Bytes20 = string;

export type EthereumAddress = Bytes20;

export type UMAContractName =
  | "Finder"
  | "VotingToken"
  | "Registry"
  | "FinancialContractAdmin"
  | "Store"
  | "Governor"
  | "DesignatedVotingFactory"
  | "TokenFactory"
  | "WETH9"
  | "TestnetERC20"
  | "AddressWhitelist"
  | "IdentifierWhitelist"
  | "Voting"
  | "OptimisticOracle"
  | "ExpiringMultiPartyLib"
  | "ExpiringMultiPartyCreator"
  | "PerpetualLib"
  | "PerpetualCreator";

export type Percentage = number

export type Timestamp = number