import {
  ApolloClient,
  InMemoryCache,
  ApolloLink,
  HttpLink,
} from "@apollo/client";

const umaLinkKovanVoting = new HttpLink({
  uri: "https://api.thegraph.com/subgraphs/name/umaprotocol/kovan-voting",
});

const umaLinkKovanContracts = new HttpLink({
  uri: "https://api.thegraph.com/subgraphs/name/umaprotocol/kovan-contracts",
});

const umaLinkMainnetVoting = new HttpLink({
  uri: "https://api.thegraph.com/subgraphs/name/umaprotocol/mainnet-voting",
});

const umaLinkMainnetContracts = new HttpLink({
  uri: "https://api.thegraph.com/subgraphs/name/umaprotocol/mainnet-contracts",
});

const umaLinksMainnet = ApolloLink.split(
  (operation) => operation.getContext().useMainnetContracts === true,
  umaLinkMainnetContracts,
  umaLinkMainnetVoting
)

const umaLinksKovan = ApolloLink.split(
  (operation) => operation.getContext().useMainnetContracts === true,
  umaLinkKovanContracts,
  umaLinkKovanVoting
)

// Uses ApolloLink's directional composition logic, docs: https://www.apollographql.com/docs/react/api/link/introduction/#directional-composition
const umaLinks = ApolloLink.split(
  (operation) => operation.getContext().clientName === "UMA42",
  umaLinksKovan,
  umaLinksMainnet
);

export const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: umaLinks,
});
