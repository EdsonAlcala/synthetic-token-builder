import { BigNumber, ethers, utils, ContractReceipt } from "ethers";
import { toWei } from "web3-utils";

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

  liquidationLiveness: number;
  withdrawalLiveness: number;
  excessTokenBeneficiary: EthereumAddress;

  disputeBondPct?: Percentage;
  sponsorDisputeRewardPct?: Percentage;
  disputerDisputeRewardPct?: Percentage;
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
  } = values;

  const {
    disputeBondPct,
    sponsorDisputeRewardPct,
    disputerDisputeRewardPct,
    excessTokenBeneficiary,
  } = values;

  const params = {
    expirationTimestamp: BigNumber.from(expirationTimestamp),
    collateralAddress: collateralAddress,
    priceFeedIdentifier: utils.formatBytes32String(priceFeedIdentifier),
    syntheticName: syntheticName,
    syntheticSymbol: syntheticSymbol,
    collateralRequirement: {
      rawValue: toWei(`${collateralRequirement / 100}`),
    },
    disputeBondPct: {
      rawValue: toWei(disputeBondPct ? `${disputeBondPct / 100}` : "0.1"), // 0.1 -> 10 % dispute bond.
    },
    sponsorDisputeRewardPct: {
      rawValue: toWei(
        sponsorDisputeRewardPct ? `${sponsorDisputeRewardPct / 100}` : "0.05"
      ), // 0.05 -> 5% reward for sponsors who are disputed invalidly.
    },
    disputerDisputeRewardPct: {
      rawValue: toWei(
        disputerDisputeRewardPct ? `${disputerDisputeRewardPct / 100}` : "0.2"
      ), // 0.2 -> 20% reward for correct disputes.
    },
    minSponsorTokens: {
      rawValue: toWei(`${values.minSponsorTokens}`),
    },
    liquidationLiveness: BigNumber.from(values.liquidationLiveness),
    withdrawalLiveness: BigNumber.from(values.withdrawalLiveness),
    excessTokenBeneficiary: excessTokenBeneficiary, // i,e UMA Store contract.
  };

  console.log("Params", params);

  const umaABIs = getUMAAbis();
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

  console.log(
    "expiringMultipartyCreatorAddress",
    expiringMultipartyCreatorAddress
  );

  const expiringMultipartyCreator = new ethers.Contract(
    expiringMultipartyCreatorAddress,
    expiringMultipartyCreatorInterface,
    signer
  );

  const expiringMultiPartyAddress = await expiringMultipartyCreator.callStatic.createExpiringMultiParty(
    params
  );
  console.log("expiringMultiPartyAddress", expiringMultiPartyAddress);

  const txn = await expiringMultipartyCreator.createExpiringMultiParty(params);

  const receipt: ContractReceipt = await txn.wait();

  console.log("Receipt", receipt);

  return { receipt, expiringMultiPartyAddress };
};

export default deployEMP;
