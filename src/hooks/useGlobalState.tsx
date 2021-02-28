import React, { PropsWithChildren, useContext, useState } from "react";

import { DEFAULT_SELECT_VALUE } from "../constants";
import { TokenData } from "../types";
import { useStep } from "./useStep";

interface IGlobalStateProvider {
  setSelectedCollateralToken: (token?: TokenData) => void;
  selectedCollateralToken?: TokenData;
  setSelectedPriceIdentifier: (priceIdentifier: string) => void;
  selectedPriceIdentifier: string;
  empAddress?: string
  setEmpAddress: (newAddress: string) => void
}

const defaultCollateral: TokenData = {
  name: "WETH",
  symbol: "WETH",
  decimals: 18,
  address: "0x1",
  isOnWhitelist: true,
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
    TokenData | undefined
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
