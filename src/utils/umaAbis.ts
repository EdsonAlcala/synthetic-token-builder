import { Fragment } from "ethers/lib/utils";
import { UMAContractName } from "../types";

import ExpiringMultiPartyCreatorArtifact from '@uma/core/build/contracts/ExpiringMultiPartyCreator.json'
import WETH9Artifact from '@uma/core/build/contracts/WETH9.json'
import ERC20Artifact from '@uma/core/build/contracts/ERC20.json'
import ExpiringMultiPartyArtifact from '@uma/core/build/contracts/ExpiringMultiParty.json'

export const getUMAAbis = () => {
    const interfaces = new Map<UMAContractName, Fragment[]>();
    // interfaces.set("Finder", getAbi("Finder"));
    // interfaces.set("VotingToken", getAbi("VotingToken"));
    // interfaces.set("Registry", getAbi("Registry"));
    // interfaces.set("FinancialContractAdmin", getAbi("FinancialContractAdmin"));
    // interfaces.set("Store", getAbi("Store"));
    // interfaces.set("Governor", getAbi("Governor"));
    // interfaces.set("DesignatedVotingFactory", getAbi("DesignatedVotingFactory"));
    // interfaces.set("TokenFactory", getAbi("TokenFactory"));
    interfaces.set("WETH9", WETH9Artifact.abi as any);
    // interfaces.set("TestnetERC20", getAbi("TestnetERC20"));
    // interfaces.set("AddressWhitelist", getAbi("AddressWhitelist"));
    // interfaces.set("IdentifierWhitelist", getAbi("IdentifierWhitelist"));
    // interfaces.set("Voting", getAbi("Voting"));
    // interfaces.set("OptimisticOracle", getAbi("OptimisticOracle"));
    // interfaces.set("ExpiringMultiPartyLib", getAbi("ExpiringMultiPartyLib"));
    interfaces.set('ERC20', ERC20Artifact.abi as any)
    interfaces.set('ExpiringMultiParty', ExpiringMultiPartyArtifact.abi as any)
    interfaces.set("ExpiringMultiPartyCreator",
        ExpiringMultiPartyCreatorArtifact.abi as any);
    // interfaces.set("PerpetualLib", getAbi("PerpetualLib"));
    // interfaces.set("PerpetualCreator", getAbi("PerpetualCreator"));

    return interfaces;
};
