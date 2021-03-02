import { Fragment } from "ethers/lib/utils";
import { UMAContractName } from "../types";

import ExpiringMultiPartyCreatorArtifact from "@uma/core/build/contracts/ExpiringMultiPartyCreator.json";
import WETH9Artifact from "@uma/core/build/contracts/WETH9.json";
import ERC20Artifact from "@uma/core/build/contracts/ERC20.json";
import ExpiringMultiPartyArtifact from "@uma/core/build/contracts/ExpiringMultiParty.json";

export const getUMAAbis = () => {
  const interfaces = new Map<UMAContractName, Fragment[]>();
  interfaces.set("WETH9", WETH9Artifact.abi as any);
  interfaces.set("ERC20", ERC20Artifact.abi as any);
  interfaces.set("ExpiringMultiParty", ExpiringMultiPartyArtifact.abi as any);
  interfaces.set(
    "ExpiringMultiPartyCreator",
    ExpiringMultiPartyCreatorArtifact.abi as any
  );

  return interfaces;
};
