import { BigNumber, ethers, utils, ContractReceipt } from "ethers";
import { parseFixed } from "@ethersproject/bignumber";
import { toWei } from "web3-utils";
import {
  DEFAULT_DISPUTER_DISPUTE_REWARD_PERCENTAGE,
  DEFAULT_DISPUTE_BOND_PERCENTAGE,
  DEFAULT_LIQUIDATION_LIVENESS,
  DEFAULT_SPONSOR_DISPUTE_REWARD_PERCENTAGE,
  DEFAULT_WITHDRAWAL_LIVENESS,
  FINANCIAL_PRODUCT_LIBRARY,
} from "../constants";

import { EthereumAddress, Percentage, Timestamp } from "../types";
import { getUMAAbis } from "./umaAbis";
import { getUMAAddresses } from "./umaAddresses";

export interface EMPParameters {
  expirationTimestamp: Timestamp;
  collateralAddress: EthereumAddress;
  priceFeedIdentifier: string;
  syntheticName: string;
  syntheticSymbol: string;
  collateralRequirement: Percentage;
  minSponsorTokens: number;
}

export const deployEMP = async (
  values: EMPParameters,
  network: ethers.providers.Network,
  signer: ethers.Signer
) => {
  const {
    expirationTimestamp,
    collateralAddress,
    priceFeedIdentifier,
    syntheticName,
    syntheticSymbol,
    collateralRequirement,
    minSponsorTokens,
  } = values;

  const umaABIs = getUMAAbis();

  const erc20StandardInterface = umaABIs.get("IERC20Standard");

  if (!erc20StandardInterface) {
    throw new Error("Invalid IERC20Standard Interface");
  }

  const collateralInstance = new ethers.Contract(
    collateralAddress,
    erc20StandardInterface,
    signer
  );

  const collateralDecimals = (await collateralInstance.decimals()).toString();
  const minSponsorTokensWithCollateralDecimals = {
    rawValue: parseFixed(minSponsorTokens.toString(), collateralDecimals),
  };

  const params = {
    expirationTimestamp: BigNumber.from(expirationTimestamp),
    collateralAddress,
    priceFeedIdentifier: utils.formatBytes32String(priceFeedIdentifier),
    syntheticName,
    syntheticSymbol,
    collateralRequirement: {
      rawValue: toWei(`${collateralRequirement / 100}`),
    },
    disputeBondPercentage: {
      rawValue: toWei(DEFAULT_DISPUTE_BOND_PERCENTAGE), // 0.1 -> 10 % dispute bond.
    },
    sponsorDisputeRewardPercentage: {
      rawValue: toWei(DEFAULT_SPONSOR_DISPUTE_REWARD_PERCENTAGE), // 0.05 -> 5% reward for sponsors who are disputed invalidly.
    },
    disputerDisputeRewardPercentage: {
      rawValue: toWei(DEFAULT_DISPUTER_DISPUTE_REWARD_PERCENTAGE), // 0.2 -> 20% reward for correct disputes.
    },
    minSponsorTokens: minSponsorTokensWithCollateralDecimals,
    liquidationLiveness: BigNumber.from(DEFAULT_LIQUIDATION_LIVENESS), // 2 hour liquidation liveness.
    withdrawalLiveness: BigNumber.from(DEFAULT_WITHDRAWAL_LIVENESS), // 2 hour withdrawal liveness.
    financialProductLibraryAddress: FINANCIAL_PRODUCT_LIBRARY, // 0x0 because, by default, we don't want to use a custom library.
  };

  const umaAddresses = getUMAAddresses(network.chainId);

  const expiringMultipartyCreatorInterface = umaABIs.get(
    "ExpiringMultiPartyCreator"
  );
  if (!expiringMultipartyCreatorInterface) {
    throw new Error("Invalid ExpiringMultipartyCreator Interface");
  }
  const expiringMultipartyCreatorAddress = umaAddresses.get(
    "ExpiringMultiPartyCreator"
  );
  if (!expiringMultipartyCreatorAddress) {
    throw new Error("Invalid ExpiringMultipartyCreator Address");
  }

  const expiringMultipartyCreator = new ethers.Contract(
    expiringMultipartyCreatorAddress,
    expiringMultipartyCreatorInterface,
    signer
  );

  const expiringMultiPartyAddress = await expiringMultipartyCreator.callStatic.createExpiringMultiParty(
    params
  );

  const txn = await expiringMultipartyCreator.createExpiringMultiParty(params);

  const receipt: ContractReceipt = await txn.wait();

  return { receipt, expiringMultiPartyAddress };
};

export default deployEMP;
