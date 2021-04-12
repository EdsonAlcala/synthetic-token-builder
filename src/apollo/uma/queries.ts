import { gql } from "@apollo/client";

export const PRICE_IDENTIFIERS = gql`
  query priceIdentifiers {
      priceIdentifiers(first: 1000, where: {isSupported: true}) {
        id
        isSupported
      }
  }
`;

export const COLLATERALS = gql`
  query collaterals {
      tokens(where: {isOnWhitelist: true}, first: 1000) {
        name
        symbol
        address
        indexingAsCollateral
        isOnWhitelist
      }
  }
`;