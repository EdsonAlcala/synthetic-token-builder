import { Box, Typography } from "@material-ui/core";
import React, { useState } from "react";
import { Form, Row, Col } from "react-bootstrap";

import { useGlobalState, useStep } from "../hooks";
import { TokenDataResponse } from "../types";
import { useQuery } from "@apollo/client";
import { COLLATERALS } from "../apollo/uma/queries";
import Connection from "../hooks/Connection";
import { StyledButton, StyledTitle } from "../components";
import { useHistory } from "react-router-dom";
import { DEFAULT_COLLATERALS_FOR_POLYGON_MAINNET, DEFAULT_COLLATERALS_FOR_POLYGON_MUMBAI, DEFAULT_SELECT_VALUE, POLYGON_MAINNET, POLYGON_MUMBAI } from "../constants";

export interface CollateralResponse {
  tokens: TokenDataResponse[];
}

export const SelectCollateralToken = () => {
  const { network } = Connection.useContainer();
  const history = useHistory();
  const { getNextStep, goNextStep } = useStep();

  const {
    selectedCollateralToken,
    setSelectedCollateralToken,
  } = useGlobalState();

  const [collateralTokens, setCollateralTokens] = useState<TokenDataResponse[]>(
    []
  );

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
  // TODO
  // eslint-disable-next-line
  const { loading, error } = useQuery(COLLATERALS, {
    skip: !network,
    context: { clientName: subgraphToQuery, useMainnetContracts: true },
    pollInterval: 10000,
    onCompleted: ({ tokens }: CollateralResponse) => {
      if (network?.chainId === POLYGON_MAINNET) {
        setCollateralTokens(DEFAULT_COLLATERALS_FOR_POLYGON_MAINNET)
      } else if (network?.chainId === POLYGON_MUMBAI) {
        setCollateralTokens(DEFAULT_COLLATERALS_FOR_POLYGON_MUMBAI)
      } else {
        setCollateralTokens(tokens);
      }
    },
  });

  const handleOnNextClick = () => {
    const nextStep = getNextStep();
    if (nextStep) {
      goNextStep();
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
