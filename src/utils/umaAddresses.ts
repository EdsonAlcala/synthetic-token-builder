import { SUPPORTED_NETWORK_IDS } from "../constants";
import { EthereumAddress, UMAContractName } from "../types";

import ExpiringMultiPartyCreatorArtifact from "@uma/core/build/contracts/ExpiringMultiPartyCreator.json";
import WETH9Artifact from "@uma/core/build/contracts/WETH9.json";
import ERC20Artifact from "@uma/core/build/contracts/ERC20.json";
import StoreArtifact from "@uma/core/build/contracts/Store.json";

// artifact.networks[networkId].address;
export const getUMAAddresses = (networkId: number) => {
  if (!SUPPORTED_NETWORK_IDS.includes(networkId)) {
    throw new Error("Unsupported network");
  }
  const addresses = new Map<UMAContractName, EthereumAddress>();
  // addresses.set("Finder", getAddress("Finder", networkId));
  // addresses.set("VotingToken", getAddress("VotingToken", networkId));
  // addresses.set("Registry", getAddress("Registry", networkId));
  // addresses.set(
  //     "FinancialContractAdmin",
  //     getAddress("FinancialContractAdmin", networkId)
  // );
  addresses.set("Store", (StoreArtifact as any).networks[networkId].address);
  // addresses.set("Governor", getAddress("Governor", networkId));
  // addresses.set(
  //     "DesignatedVotingFactory",
  //     getAddress("DesignatedVotingFactory", networkId)
  // );
  // addresses.set("TokenFactory", getAddress("TokenFactory", networkId));
  // addresses.set("WETH9", getAddress("WETH9", networkId));
  // addresses.set("TestnetERC20", getAddress("TestnetERC20", networkId));
  // addresses.set("AddressWhitelist", getAddress("AddressWhitelist", networkId));
  // addresses.set(
  //     "IdentifierWhitelist",
  //     getAddress("IdentifierWhitelist", networkId)
  // );
  // addresses.set("Voting", getAddress("Voting", networkId));
  // addresses.set("OptimisticOracle", getAddress("OptimisticOracle", networkId));
  // addresses.set(
  // "ExpiringMultiPartyLib",
  // getAddress("ExpiringMultiPartyLib", networkId)
  // );
  addresses.set(
    "ExpiringMultiPartyCreator",
    (ExpiringMultiPartyCreatorArtifact as any).networks[networkId].address
  );
  // addresses.set("PerpetualLib", getAddress("PerpetualLib", networkId));
  // addresses.set("PerpetualCreator", getAddress("PerpetualCreator", networkId));

  return addresses;
};
