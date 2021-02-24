import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  RouteProps,
} from "react-router-dom";

import { ErrorView, HomeView, SyntheticTokenBuilderView } from "./views";
import { DefaultLayout } from "./layouts";
import { TOKEN_BUILDER_ROUTE } from "./constants";
import { ThemeProvider } from "styled-components";
import { ThemeProvider as MaterialUIProvider } from "@material-ui/core/styles";
import { GlobalStateProvider } from "./hooks";

import { materialUITheme, theme } from "./theme";

interface Props extends RouteProps {
  component: any; // TODO: new (props: any) => React.Component
  from: string;
}

const RouteWithDefaultLayout = ({ component: Component, ...rest }: Props) => {
  // const materialUITheme = React.useMemo(
  //   () =>
  //     createMuiTheme({
  //       palette: {
  //         type: "dark",
  //         background: {
  //           default: 'black'
  //         }
  //       }
  //     }),
  //   []
  // )
  return (
    <Route
      {...rest}
      render={(matchProps) => (
        <ThemeProvider theme={theme}>
          <MaterialUIProvider theme={materialUITheme}>
            <DefaultLayout {...rest}>
              <Component {...matchProps} />
            </DefaultLayout>
          </MaterialUIProvider>
        </ThemeProvider>
      )}
    />
  );
};

const SyntheticTokenBuilderRoute = () => {
  return (
    <GlobalStateProvider>
      <SyntheticTokenBuilderView />
    </GlobalStateProvider>
  );
};

export const Routes = () => (
  <Router>
    <Switch>
      <RouteWithDefaultLayout
        exact={true}
        path="/"
        component={HomeView}
        from="/"
      />
      <RouteWithDefaultLayout
        path={TOKEN_BUILDER_ROUTE}
        component={SyntheticTokenBuilderRoute}
        from="/tutorial"
      />
      <Route exact={true} path="/error">
        <ErrorView />
      </Route>
    </Switch>
  </Router>
);
