import { BigNumber, ethers } from "ethers";
import React, { PropsWithChildren, useContext, useState } from "react";

import { DEFAULT_SELECT_VALUE } from "../constants";
import { TokenDataResponse } from "../types";

interface IGlobalStateProvider {
  setSelectedCollateralToken: (token?: TokenDataResponse) => void;
  selectedCollateralToken?: TokenDataResponse;
  setSelectedPriceIdentifier: (priceIdentifier: string) => void;
  selectedPriceIdentifier: string;
  empAddress?: string
  setEmpAddress: (newAddress: string) => void
}

const defaultCollateral: TokenDataResponse = {
  name: "WETH",
  symbol: "WETH",
  decimals: 18,
  address: "0x0",
  isOnWhitelist: true
};

/* tslint:disable */
const GlobalStateContext = React.createContext<IGlobalStateProvider>({
  selectedPriceIdentifier: "",
  selectedCollateralToken: defaultCollateral,
  setSelectedCollateralToken: () => { },
  setSelectedPriceIdentifier: () => { },
  empAddress: "",
  setEmpAddress: () => { }
});
/* tslint:enable */

export const GlobalStateProvider: React.FC<PropsWithChildren<{}>> = ({
  children,
}) => {
  const [
    selectedPriceIdentifier,
    setSelectedPriceIdentifier,
  ] = useState<string>(DEFAULT_SELECT_VALUE);
  const [selectedCollateralToken, setSelectedCollateralToken] = useState<
    TokenDataResponse | undefined
  >(undefined);

  const [empAddress, setEmpAddress] = useState<string | undefined>(undefined)
  return (
    <GlobalStateContext.Provider
      value={{
        selectedPriceIdentifier,
        setSelectedPriceIdentifier,
        selectedCollateralToken,
        setSelectedCollateralToken,
        empAddress,
        setEmpAddress
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
