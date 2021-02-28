import React, {
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { ethers } from "ethers";
import { Fragment } from "ethers/lib/utils";

import { EthereumAddress, UMAContractName } from "../types";

import Connection from "./Connection";
import { getUMAAbis, getUMAAddresses } from "../utils";

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
  }, [network]);

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

export const useUMARegistry = () => {
  const context = useContext(UMAContext);

  if (context === null) {
    throw new Error(
      "useUMARegistry() can only be used inside of <UMARegistryProvider />, please declare it at a higher level"
    );
  }
  return context;
};
