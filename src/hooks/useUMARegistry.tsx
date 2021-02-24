import React, {
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { ethers } from "ethers";
import { Fragment } from "ethers/lib/utils";
import { getAbi, getAddress } from "@uma/core";

import { EthereumAddress, UMAContractName } from "../types";
import { SUPPORTED_NETWORK_IDS } from "../constants";

import Connection from "./Connection";

interface IUMAProvider {
  getContractAddress: (contractName: UMAContractName) => EthereumAddress;
  getContractInterface: (
    contractName: UMAContractName
  ) => ethers.utils.Interface;
}

const UMAContext = React.createContext<IUMAProvider>({
  getContractAddress: (contractName: UMAContractName) => {
    return "0x00";
  },
  getContractInterface: (contractName: UMAContractName) => {
    return new ethers.utils.Interface("[]");
  },
});

export const UMARegistryProvider: React.FC<PropsWithChildren<{}>> = ({
  children,
}) => {
  const [contracts, setContracts] = useState(
    new Map<UMAContractName, EthereumAddress>()
  );
  const [abis, setABIs] = useState(new Map<UMAContractName, Fragment[]>());
  const { network } = Connection.useContainer();

  const getContractAddress = (contractName: UMAContractName) => {
    const contractAddress = contracts.get(contractName);

    if (!contractAddress) {
      throw new Error("Couldn't find the contract address");
    }

    return contractAddress;
  };

  const getContractInterface = (contractName: UMAContractName) => {
    const abi = abis.get(contractName);

    if (!abi) {
      throw new Error("Couldn't find the abi");
    }

    return new ethers.utils.Interface(abi);
  };

  useEffect(() => {
    if (network) {
      const umaAddresses = getUMAAddresses(network.chainId);
      setContracts(umaAddresses);

      const umaABIs = getUMAAbis();
      setABIs(umaABIs);
    }
  }, []);

  return (
    <UMAContext.Provider
      value={{
        getContractAddress,
        getContractInterface,
      }}
    >
      {children}
    </UMAContext.Provider>
  );
};

export const getUMAAbis = () => {
  const interfaces = new Map<UMAContractName, Fragment[]>();
  interfaces.set("Finder", getAbi("Finder"));
  interfaces.set("VotingToken", getAbi("VotingToken"));
  interfaces.set("Registry", getAbi("Registry"));
  interfaces.set("FinancialContractAdmin", getAbi("FinancialContractAdmin"));
  interfaces.set("Store", getAbi("Store"));
  interfaces.set("Governor", getAbi("Governor"));
  interfaces.set("DesignatedVotingFactory", getAbi("DesignatedVotingFactory"));
  interfaces.set("TokenFactory", getAbi("TokenFactory"));
  interfaces.set("WETH9", getAbi("WETH9"));
  interfaces.set("TestnetERC20", getAbi("TestnetERC20"));
  interfaces.set("AddressWhitelist", getAbi("AddressWhitelist"));
  interfaces.set("IdentifierWhitelist", getAbi("IdentifierWhitelist"));
  interfaces.set("Voting", getAbi("Voting"));
  interfaces.set("OptimisticOracle", getAbi("OptimisticOracle"));
  interfaces.set("ExpiringMultiPartyLib", getAbi("ExpiringMultiPartyLib"));
  interfaces.set(
    "ExpiringMultiPartyCreator",
    getAbi("ExpiringMultiPartyCreator")
  );
  interfaces.set("PerpetualLib", getAbi("PerpetualLib"));
  interfaces.set("PerpetualCreator", getAbi("PerpetualCreator"));

  return interfaces;
};

export const getUMAAddresses = (networkId: number) => {
  if (!SUPPORTED_NETWORK_IDS.includes(networkId)) {
    throw new Error("Unsupported network");
  }
  const addresses = new Map<UMAContractName, EthereumAddress>();
  addresses.set("Finder", getAddress("Finder", networkId));
  addresses.set("VotingToken", getAddress("VotingToken", networkId));
  addresses.set("Registry", getAddress("Registry", networkId));
  addresses.set(
    "FinancialContractAdmin",
    getAddress("FinancialContractAdmin", networkId)
  );
  addresses.set("Store", getAddress("Store", networkId));
  addresses.set("Governor", getAddress("Governor", networkId));
  addresses.set(
    "DesignatedVotingFactory",
    getAddress("DesignatedVotingFactory", networkId)
  );
  addresses.set("TokenFactory", getAddress("TokenFactory", networkId));
  addresses.set("WETH9", getAddress("WETH9", networkId));
  addresses.set("TestnetERC20", getAddress("TestnetERC20", networkId));
  addresses.set("AddressWhitelist", getAddress("AddressWhitelist", networkId));
  addresses.set(
    "IdentifierWhitelist",
    getAddress("IdentifierWhitelist", networkId)
  );
  addresses.set("Voting", getAddress("Voting", networkId));
  addresses.set("OptimisticOracle", getAddress("OptimisticOracle", networkId));
  addresses.set(
    "ExpiringMultiPartyLib",
    getAddress("ExpiringMultiPartyLib", networkId)
  );
  addresses.set(
    "ExpiringMultiPartyCreator",
    getAddress("ExpiringMultiPartyCreator", networkId)
  );
  addresses.set("PerpetualLib", getAddress("PerpetualLib", networkId));
  addresses.set("PerpetualCreator", getAddress("PerpetualCreator", networkId));

  return addresses;
};

export const useUMARegistry = () => {
  const context = useContext(UMAContext);

  if (context === null) {
    throw new Error(
      "useUMARegistry() can only be used inside of <UMARegistryProvider />, please declare it at a higher level"
    );
  }
  return context;
};
