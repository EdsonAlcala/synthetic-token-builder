import { SUPPORTED_NETWORK_IDS } from "../constants";
import { EthereumAddress, UMAContractName } from "../types";

import ExpiringMultiPartyCreatorArtifact from "@uma/core/build/contracts/ExpiringMultiPartyCreator.json";
import StoreArtifact from "@uma/core/build/contracts/Store.json";

export const getUMAAddresses = (networkId: number) => {
  if (!SUPPORTED_NETWORK_IDS.includes(networkId)) {
    throw new Error("Unsupported network");
  }
  const addresses = new Map<UMAContractName, EthereumAddress>();
  addresses.set("Store", (StoreArtifact as any).networks[networkId].address);
  addresses.set("ExpiringMultiPartyCreator", (ExpiringMultiPartyCreatorArtifact as any).networks[networkId].address
  );

  return addresses;
};
