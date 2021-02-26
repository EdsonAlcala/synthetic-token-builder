import { Box, makeStyles, styled, Typography } from "@material-ui/core";
import React, { useState } from "react";
import { Form, Button as BootstrapButton, Row, Col } from "react-bootstrap";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

import { useGlobalState, useStep } from "../hooks";
import { TokenData } from "../types";
import { useQuery } from "@apollo/client";
import { COLLATERALS } from "../apollo/uma/queries";
import Connection from "../hooks/Connection";
import { StyledButton, StyledTitle } from "../components";
import { useHistory } from "react-router-dom";
import { DEFAULT_SELECT_VALUE } from "../constants";

export interface CollateralResponse {
  tokens: TokenData[];
}

export const SelectCollateralToken = () => {
  const { network } = Connection.useContainer();
  const history = useHistory();
  const { getNextStep, goNextStep } = useStep();

  const {
    selectedCollateralToken,
    setSelectedCollateralToken,
  } = useGlobalState();
  // const classes = useStyles();

  const [collateralTokens, setCollateralTokens] = useState<TokenData[]>([]);

  const handleSelectChange = (e: any) => {
    if (e.target.value === DEFAULT_SELECT_VALUE) {
      setSelectedCollateralToken(undefined);
    } else {
      const selectedToken = collateralTokens.find(
        (s) => s.address === e.target.value
      );
      if (selectedToken) {
        setSelectedCollateralToken(selectedToken);
      }
    }
  };

  const subgraphToQuery = `UMA${network?.chainId.toString()}`;
  const { loading, error, data } = useQuery(COLLATERALS, {
    context: { clientName: subgraphToQuery },
    pollInterval: 10000,
    onCompleted: ({ tokens }: CollateralResponse) => {
      console.log("DATA COLLATERAL", tokens);
      setCollateralTokens(tokens);
    },
  });

  const handleOnNextClick = () => {
    debugger;
    const nextStep = getNextStep();
    if (nextStep) {
      goNextStep();
      console.log("nextStep.route", nextStep.route);
      history.push(nextStep.route);
    }
  };

  return (
    <Box>
      <StyledTitle variant="subtitle1">Select collateral token</StyledTitle>
      <Typography variant="subtitle2">
        This is the token that will serve as collateral for the synthethic
        token.
      </Typography>

      <Box mt="1em">
        <Form>
          <Row>
            <Col md={10}>
              <Form.Control
                as="select"
                disabled={collateralTokens.length === 0}
                onChange={handleSelectChange}
                value={
                  selectedCollateralToken
                    ? selectedCollateralToken.address
                    : DEFAULT_SELECT_VALUE
                }
              >
                {collateralTokens.length === 0 && (
                  <option>No collateral tokens</option>
                )}
                <option value={DEFAULT_SELECT_VALUE}>Select an option</option>
                {collateralTokens.length > 0 &&
                  collateralTokens.map((item, index) => {
                    return (
                      <option key={index} value={item.address}>
                        {item.name}
                      </option>
                    );
                  })}
              </Form.Control>
            </Col>
          </Row>

          <div style={{ marginTop: "1em" }}>
            <StyledButton
              disabled={selectedCollateralToken === undefined}
              variant="danger"
              onClick={handleOnNextClick}
            >
              Next
            </StyledButton>
          </div>
        </Form>
      </Box>
    </Box>
  );
};

// export const StyledButton = styled(BootstrapButton)`
//   padding-left: 1.5em;
//   padding-right: 1.5em;
//   padding-top: 6px;
//   padding-bottom: 6px;
// `
