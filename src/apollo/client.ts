import {
  ApolloClient,
  InMemoryCache,
  ApolloLink,
  HttpLink,
} from "@apollo/client";

const umaLinkKovan = new HttpLink({
  uri: "https://api.thegraph.com/subgraphs/name/umaprotocol/uma-kovan",
});
const umaLinkMainnet = new HttpLink({
  uri: "https://api.thegraph.com/subgraphs/name/umaprotocol/uma",
});

// Uses ApolloLink's directional composition logic, docs: https://www.apollographql.com/docs/react/api/link/introduction/#directional-composition
const umaLinks = ApolloLink.split(
  (operation) => operation.getContext().clientName === "UMA42",
  umaLinkKovan,
  umaLinkMainnet
);

export const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: umaLinks
});
