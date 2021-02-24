import { BigNumber, ethers } from "ethers";
import React, {
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { Observable } from "rxjs";
import { debounceTime } from "rxjs/operators";

import { Block, Token } from "../types";

import { useUMARegistry } from "./useUMARegistry";
import Connection from "./Connection";

interface IGlobalStateProvider {
  priceIdentifiers: string[];
  collateralTokens: Token[];
  setSelectedCollateralToken: (token?: Token) => void;
  selectedCollateralToken?: Token;
  setSelectedPriceIdentifier: (priceIdentifier: string) => void;
  selectedPriceIdentifier: string;
}

const defaultToken: Token = {
  name: "SNT",
  symbol: "SNT",
  decimals: 18,
  totalSupply: BigNumber.from("10000000"),
};
const defaultCollateral: Token = {
  name: "WETH",
  symbol: "WETH",
  decimals: 18,
  totalSupply: BigNumber.from("10000000"),
};

/* tslint:disable */
// Defaults
const GlobalStateContext = React.createContext<IGlobalStateProvider>({
  priceIdentifiers: ["ETH/BTC"],
  collateralTokens: [defaultCollateral],
  selectedPriceIdentifier: "",
  selectedCollateralToken: defaultToken,
  setSelectedCollateralToken: () => {},
  setSelectedPriceIdentifier: () => {},
});
/* tslint:enable */

export const GlobalStateProvider: React.FC<PropsWithChildren<{}>> = ({
  children,
}) => {
  const { provider, signer } = Connection.useContainer();
  const [priceIdentifiers, setPriceIdentifiers] = useState<string[]>([]);
  const [collateralTokens, setCollateralTokens] = useState<Token[]>([]);
  const [
    selectedPriceIdentifier,
    setSelectedPriceIdentifier,
  ] = useState<string>("");
  const [selectedCollateralToken, setSelectedCollateralToken] = useState<
    Token | undefined
  >(undefined);
  const [block$, setBlock$] = useState<Observable<Block> | null>(null);
  const { getContractAddress, getContractInterface } = useUMARegistry();

  // const getCollateralTokens = async () => {
  //   const address = getContractAddress("AddressWhitelist")
  //   const erc20Interface = getContractInterface('TestnetERC20')
  //   const whitelistInterface = getContractInterface('AddressWhitelist')
  //   const whitelistContract = new ethers.Contract(address, whitelistInterface, signer)
  //   const addressesWhitelisted = await whitelistContract.getWhitelist()
  //   console.log("addressesWhitelisted", addressesWhitelisted)

  //   const promises = addressesWhitelisted.map(async (collateralAddressItem: any) => {
  //     const instance = new ethers.Contract(collateralAddressItem, erc20Interface, signer)
  //     return {
  //       name: await instance.name(),
  //       symbol: await instance.symbol(),
  //       decimals: await instance.decimals(),
  //       totalSupply: await instance.totalSupply(),
  //       address: collateralAddressItem,
  //     }
  //   })
  //   const result = await Promise.all(promises)
  //   setCollateralTokens(result as Token[])
  // }

  // const getPriceIdentifiers = async () => {
  //   const address = getContractAddress("IdentifierWhitelist")
  //   const identifierWhitelistInterface = getContractInterface('IdentifierWhitelist')
  //   const identifierWhitelistContract = new ethers.Contract(address, identifierWhitelistInterface, signer)
  //   const supportedIdentifierFilter = await identifierWhitelistContract.filters.SupportedIdentifierAdded()
  //   const events = await identifierWhitelistContract.queryFilter(supportedIdentifierFilter, 0, "latest")
  //   const identifiers = events.map((event) => {
  //     if (event.args) {
  //       return ethers.utils.parseBytes32String(event.args[0])
  //     }
  //     return undefined
  //   })
  //   const identifiersFiltered: string[] = identifiers.filter((s) => s !== undefined) as string[]
  //   setPriceIdentifiers(identifiersFiltered)
  // }

  useEffect(() => {
    if (provider && signer) {
      const observable = new Observable<Block>((subscriber) => {
        provider.on("block", (blockNumber: number) => {
          provider
            .getBlock(blockNumber)
            .then((block) => subscriber.next(block));
        });
      });
      // debounce to prevent subscribers making unnecessary calls
      const blockInstance = observable.pipe(debounceTime(1000));
      setBlock$(blockInstance);

      // getCollateralTokens()
      //   .then(() => console.log("Collateral retrieved"))
      //   .catch((error) => console.log("Error getCollateralTokens", error))

      // getPriceIdentifiers()
      //   .then(() => console.log("Price identifiers retrieved"))
      //   .catch((error) => console.log("Error getPriceIdentifiers", error))
    }
  }, [provider, signer]); // eslint-disable-line

  useEffect(() => {
    if (block$ && provider && signer) {
      const sub = block$.subscribe(async () => {
        console.log("New block observable arrived");
        // await getCollateralTokens()
        // await getPriceIdentifiers()
        // await getEMPAddresses()
      });
      return () => sub.unsubscribe();
    }
  }, [block$]); // eslint-disable-line

  return (
    <GlobalStateContext.Provider
      value={{
        priceIdentifiers,
        collateralTokens,
        selectedPriceIdentifier,
        setSelectedPriceIdentifier,
        selectedCollateralToken,
        setSelectedCollateralToken,
      }}
    >
      {children}
    </GlobalStateContext.Provider>
  );
};

export const useGlobalState = () => {
  const context = useContext(GlobalStateContext);

  if (context === null) {
    throw new Error(
      "useGlobalState() can only be used inside of <GlobalStateProvider />, please declare it at a higher level"
    );
  }
  return context;
};
