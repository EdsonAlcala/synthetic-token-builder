import { gql } from "@apollo/client";

export const PRICE_IDENTIFIERS = gql`
  query priceIdentifiers {
    priceIdentifiers(where: { isSupported: true }) {
      id
      isSupported
    }
  }
`;

export const COLLATERALS = gql`
  query collaterals {
    tokens(where: { isOnWhitelist: true }) {
      name
      symbol
      decimals
      address
      isOnWhitelist
    }
  }
`;
