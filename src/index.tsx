import React from "react";
import ReactDOM from "react-dom";
import { ApolloProvider } from "@apollo/client";

import { client } from "./apollo/client";
import Connection from "./hooks/Connection";
import Etherscan from "./hooks/Etherscan";

import App from "./App";

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <Connection.Provider>
        <Etherscan.Provider>
          <App />
        </Etherscan.Provider>
      </Connection.Provider>
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
