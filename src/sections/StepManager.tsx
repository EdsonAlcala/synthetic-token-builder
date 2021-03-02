import React, { useEffect } from "react";
import { Route, Switch, useHistory, useRouteMatch } from "react-router-dom";
import {
  CREATE_EXPIRING_MULTIPARTY,
  MINT,
  SELECT_COLLATERAL_TOKEN,
  SELECT_PRICE_IDENTIFIER,
} from "../constants";

// steps
import { SelectPriceIdentifier } from "./SelectPriceIdentifier";
import { SelectCollateralToken } from "./SelectCollateralToken";
import { CreateExpiringMultiParty } from "./CreateExpiringMultiParty";
import { Mint } from "./Mint";
import { Box } from "@material-ui/core";

export const StepManager: React.FC = () => {
  const match = useRouteMatch();
  const history = useHistory();

  useEffect(() => {
    history.push(`${match.path}/${SELECT_COLLATERAL_TOKEN}`);
  }, []); // eslint-disable-line

  return (
    <Box pl="1.5em" pr="1.5em">
      <Switch>
        <Route path={`${match.path}/${SELECT_PRICE_IDENTIFIER}`}>
          <SelectPriceIdentifier />
        </Route>

        <Route path={`${match.path}/${CREATE_EXPIRING_MULTIPARTY}`}>
          <CreateExpiringMultiParty />
        </Route>

        <Route path={`${match.path}/${SELECT_COLLATERAL_TOKEN}`}>
          <SelectCollateralToken />
        </Route>
      </Switch>
    </Box>
  );
};
