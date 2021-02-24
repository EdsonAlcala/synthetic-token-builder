import React from "react";

import { UMARegistryProvider } from "./hooks";
import { ErrorBoundary } from "./ErrorBoundary";
import { Routes } from "./routes";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <UMARegistryProvider>
        <Routes />
      </UMARegistryProvider>
    </ErrorBoundary>
  );
};

export default App;
