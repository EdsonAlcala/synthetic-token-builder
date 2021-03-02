import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  RouteProps,
} from "react-router-dom";

import { ErrorView, HomeView, SyntheticTokenBuilderView, EMPCreatedView } from "./views";
import { DefaultLayout } from "./layouts";
import { SUCCESS_ROUTE, TOKEN_BUILDER_ROUTE } from "./constants";
import { ThemeProvider } from "styled-components";
import { ThemeProvider as MaterialUIProvider } from "@material-ui/core/styles";
import { GlobalStateProvider } from "./hooks";

import { materialUITheme, theme } from "./theme";
import { } from "./views/EMPCreatedView";

interface Props extends RouteProps {
  component: any; // TODO: new (props: any) => React.Component
}

const RouteWithDefaultLayout = ({ component: Component, ...rest }: Props) => {
  return (
    <Route
      {...rest}
      render={(matchProps) => (
        <ThemeProvider theme={theme}>
          <MaterialUIProvider theme={materialUITheme}>
            <GlobalStateProvider>
              <DefaultLayout {...rest}>
                <Component {...matchProps} />
              </DefaultLayout>
            </GlobalStateProvider>
          </MaterialUIProvider>
        </ThemeProvider>
      )}
    />
  );
};

export const Routes = () => (
  <Router>
    <Switch>
      <RouteWithDefaultLayout
        exact={true}
        path="/"
        component={HomeView}
      />
      <RouteWithDefaultLayout
        path={`/${TOKEN_BUILDER_ROUTE}`}
        component={SyntheticTokenBuilderView}
      />

      <RouteWithDefaultLayout
        path={`/${SUCCESS_ROUTE}`}
        component={EMPCreatedView}
      />

      <Route exact={true} path="/error">
        <ErrorView />
      </Route>
    </Switch>
  </Router>
);
