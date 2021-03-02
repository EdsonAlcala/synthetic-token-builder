import { Box, Typography } from "@material-ui/core";
import React, { useState } from "react";
import { Form, Row, Col } from "react-bootstrap";
import { useQuery } from "@apollo/client";
import { useHistory } from "react-router-dom";

import { useGlobalState, useStep } from "../hooks";
import { PRICE_IDENTIFIERS } from "../apollo/uma/queries";
import { PriceIdentifierData } from "../types";
import { StyledButton, StyledTitle } from "../components";
import { DEFAULT_SELECT_VALUE } from "../constants";
import Connection from "../hooks/Connection";

export interface PriceIdentifierResponse {
  priceIdentifiers: PriceIdentifierData[];
}

export const SelectPriceIdentifier = () => {
  const { network } = Connection.useContainer();
  const [allPriceIdentifiers, setAllPriceIdentifiers] = useState(
    [] as PriceIdentifierData[]
  );
  const { getNextStep, goNextStep, getStepBefore, goStepBefore } = useStep();
  const {
    selectedPriceIdentifier,
    setSelectedPriceIdentifier,
  } = useGlobalState();

  const handleSelectChange = (e: any) => {
    if (e.target.value === DEFAULT_SELECT_VALUE) {
      setSelectedPriceIdentifier(DEFAULT_SELECT_VALUE);
    } else {
      const newselectedPriceIdentifier = allPriceIdentifiers.find(
        (s) => s.id === e.target.value
      );
      if (newselectedPriceIdentifier) {
        setSelectedPriceIdentifier(newselectedPriceIdentifier.id);
      }
    }
  };

  const subgraphToQuery = `UMA${network?.chainId.toString()}`;
  // TODO
  // eslint-disable-next-line
  const { loading, error } = useQuery(PRICE_IDENTIFIERS, {
    context: { clientName: subgraphToQuery },
    skip: !network,
    pollInterval: 10000,
    onCompleted: ({ priceIdentifiers }: PriceIdentifierResponse) => {
      const priceIdentifiersResult = priceIdentifiers.map((item) => {
        return {
          id: item.id,
          isSupported: item.isSupported,
        };
      });
      setAllPriceIdentifiers(priceIdentifiersResult);
    },
  });

  const history = useHistory();

  const handleOnNextClick = () => {
    const nextStep = getNextStep();
    if (nextStep) {
      goNextStep();
      history.push(nextStep.route);
    }
  };

  const handleOnBackClick = () => {
    const stepBefore = getStepBefore();
    if (stepBefore) {
      goStepBefore();
      history.push(stepBefore.route);
    }
  };

  return (
    <Box>
      <StyledTitle variant="subtitle1">Select price identifier</StyledTitle>
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
                disabled={allPriceIdentifiers.length === 0}
                onChange={handleSelectChange}
                value={selectedPriceIdentifier}
              >
                {allPriceIdentifiers.length === 0 && (
                  <option>No price identifiers</option>
                )}
                <option value={DEFAULT_SELECT_VALUE}>Select an option</option>
                {allPriceIdentifiers.length > 0 &&
                  allPriceIdentifiers.map((item, index) => {
                    return (
                      <option key={index} value={item.id}>
                        {item.id}
                      </option>
                    );
                  })}
              </Form.Control>
            </Col>
          </Row>

          <div style={{ marginTop: "1em" }}>
            <StyledButton
              disabled={selectedPriceIdentifier === DEFAULT_SELECT_VALUE}
              variant="danger"
              onClick={handleOnNextClick}
            >
              Next
            </StyledButton>
            <StyledButton
              style={{ color: "black" }}
              variant="link"
              onClick={handleOnBackClick}
            >
              Back
            </StyledButton>
          </div>
        </Form>
      </Box>
    </Box>
  );
};
