import { createContainer } from "unstated-next";

import Connection from "./Connection";

interface NetworkMap {
  [key: string]: string;
}

const NETWORK_MAP: NetworkMap = {
  42: "https://kovan.etherscan.io",
  1: "https://etherscan.io",
  137: "https://polygonscan.com",
  80001: "https://mumbai.polygonscan.com",
};

function useEtherscan() {
  const { network } = Connection.useContainer();

  const getEtherscanUrl = (hex: string | null) => {
    if (!network || !hex || !network.name) {
      return undefined;
    }
    const baseUrl = NETWORK_MAP[network.chainId] || NETWORK_MAP.mainnet;
    // If the length is 66 then the hex is a transaction.
    if (hex.length === 66) {
      return `${baseUrl}/tx/${hex}`;
    }
    // If the length is 42 then the hex is an address.
    if (hex.length === 42) {
      return `${baseUrl}/address/${hex}`;
    }
    // If the length is neither 66 or 42 then it is invalid.
    return undefined;
  };

  return {
    getEtherscanUrl,
  };
}

const Etherscan = createContainer(useEtherscan);

export default Etherscan;
