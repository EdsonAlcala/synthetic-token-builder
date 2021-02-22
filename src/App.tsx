import React, { useEffect } from 'react';
import { Route, Switch, useHistory, useRouteMatch } from "react-router-dom"

import { UMARegistryProvider } from './hooks';
import { ErrorBoundary } from './ErrorBoundary';
import { Routes } from './routes';

import './App.css';

export const App: React.FC = () => {
  // const match = useRouteMatch()
  // const history = useHistory()

  // useEffect(() => {
  //   history.push(`${HOME_ROUTE}`)
  // }, []) // eslint-disable-line

  return (
    // <React.Fragment>
    //   {/* <Switch> */}
    //   {/* <Route path={`${match.path}/${SELECT_COLLATERAL_TOKEN}`}>
    //       <DeployCollateralToken />
    //     </Route>
    //     <Route path={`${match.path}/${SELECT_PRICE_IDENTIFIER_ROUTE}`}>
    //       <DeployPriceIdentifier />
    //     </Route> */}
    //   {/* </Switch> */}
    // </React.Fragment>
    <ErrorBoundary>
      <UMARegistryProvider>
        <Routes />
      </UMARegistryProvider>
    </ErrorBoundary>
  );
}

export default App;
