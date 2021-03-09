import { BigNumber, Bytes } from "ethers";

export interface EMPData {
  expirationTimestamp: BigNumber;
  collateralCurrency: string;
  priceIdentifier: Bytes;
  tokenCurrency: string;
  collateralRequirement: BigNumber;
  disputeBondPercentage: BigNumber;
  disputerDisputeRewardPercentage: BigNumber;
  sponsorDisputeRewardPercentage: BigNumber;
  minSponsorTokens: BigNumber;
  liquidationLiveness: BigNumber;
  withdrawalLiveness: BigNumber;
}

export interface EMPDataParsed {
  collateralCurrency: string;
  priceIdentifier: string;
  collateralRequirement: string;
  disputeBondPercentage: string;
  disputerDisputeRewardPercentage: string;
  sponsorDisputeRewardPercentage: string;
  minSponsorTokens: string;
  liquidationLiveness: number;
  withdrawalLiveness: number;
  tokenSymbol: string;
  tokenName: string;
  tokenDecimals: string;
  expireDate: string;
}

export interface CollateralInfo {
  collateralDecimals: string;
  collateralBalance: string;
  collateralAllowance: string;
  collateralSymbol: string;
}
