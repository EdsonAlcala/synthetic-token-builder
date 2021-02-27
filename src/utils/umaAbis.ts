import { getAbi } from "@uma/core";
import { Fragment } from "ethers/lib/utils";
import { UMAContractName } from "../types";

export const getUMAAbis = () => {
    const interfaces = new Map<UMAContractName, Fragment[]>();
    interfaces.set("Finder", getAbi("Finder"));
    // interfaces.set("VotingToken", getAbi("VotingToken"));
    // interfaces.set("Registry", getAbi("Registry"));
    // interfaces.set("FinancialContractAdmin", getAbi("FinancialContractAdmin"));
    interfaces.set("Store", getAbi("Store"));
    // interfaces.set("Governor", getAbi("Governor"));
    // interfaces.set("DesignatedVotingFactory", getAbi("DesignatedVotingFactory"));
    // interfaces.set("TokenFactory", getAbi("TokenFactory"));
    interfaces.set("WETH9", getAbi("WETH9"));
    interfaces.set("TestnetERC20", getAbi("TestnetERC20"));
    interfaces.set("AddressWhitelist", getAbi("AddressWhitelist"));
    interfaces.set("IdentifierWhitelist", getAbi("IdentifierWhitelist"));
    interfaces.set("Voting", getAbi("Voting"));
    // interfaces.set("OptimisticOracle", getAbi("OptimisticOracle"));
    interfaces.set("ExpiringMultiPartyLib", getAbi("ExpiringMultiPartyLib"));
    interfaces.set(
        "ExpiringMultiPartyCreator",
        getAbi("ExpiringMultiPartyCreator")
    );
    // interfaces.set("PerpetualLib", getAbi("PerpetualLib"));
    // interfaces.set("PerpetualCreator", getAbi("PerpetualCreator"));

    return interfaces;
};
