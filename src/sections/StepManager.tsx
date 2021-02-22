import React, { useEffect } from "react"
// import { Route, Switch, useHistory, useRouteMatch } from "react-router-dom"
import { CREATE_EXPIRING_MULTIPARTY, SELECT_COLLATERAL_TOKEN, SELECT_PRICE_IDENTIFIER_ROUTE } from "../constants"

// steps
// import { DeployCollateralToken } from "../pages/1_Select_Collateral_Token"
// import { DeployPriceIdentifier } from "../pages/2_Select_Price_Identifier"
// import { CreateExpiringMultiParty } from "../pages/3_CreateExpiringMultiParty"

export const StepManager: React.FC = () => {
  // const match = useRouteMatch()
  // const history = useHistory()

  // useEffect(() => {
  //   history.push(`${match.path}/${SELECT_COLLATERAL_TOKEN}`)
  // }, []) // eslint-disable-line

  return (
    <React.Fragment>
      <h1>Step Manager</h1>
      {/* <Switch>
        <Route path={`${match.path}/${SELECT_COLLATERAL_TOKEN}`}>
          <DeployCollateralToken />
        </Route>
        <Route path={`${match.path}/${SELECT_PRICE_IDENTIFIER_ROUTE}`}>
          <DeployPriceIdentifier />
        </Route>
        <Route path={`${match.path}/${CREATE_EXPIRING_MULTIPARTY}`}>
          <CreateExpiringMultiParty />
        </Route>
      </Switch> */}
    </React.Fragment>
  )
}
