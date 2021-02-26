import React, { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import styled from "styled-components";

import TestnetERC20Artifact from "@uma/core/build/contracts/TestnetERC20.json";

import { useGlobalState } from "../hooks/useGlobalState";
import Connection from "../hooks/Connection";
import { BigNumber, ethers } from "ethers";
import { formatUnits } from "ethers/lib/utils";

export const RightPanel: React.FC = () => {
  const { address, provider } = Connection.useContainer();
  const { selectedCollateralToken, selectedPriceIdentifier } = useGlobalState();
  const [collateralBalance, setCollateralBalance] = useState("0");

  useEffect(() => {
    if (
      selectedCollateralToken &&
      selectedCollateralToken.address &&
      provider
    ) {
      const getBalance = async () => {
        const testnetERC20Contract = new ethers.Contract(
          selectedCollateralToken.address,
          TestnetERC20Artifact.abi,
          provider
        );
        const balance: BigNumber = await testnetERC20Contract.balanceOf(
          address
        );
        setCollateralBalance(`${formatUnits(balance, "ether").toString()}`);
      };
      getBalance();
    }
  }, [selectedCollateralToken, provider]);

  return (
    <React.Fragment>
      {selectedCollateralToken && (
        <Card>
          <Card.Header>Selected collateral token</Card.Header>
          <React.Fragment>
            <AccordionContentBody className="borderBottomExceptLast">
              <p style={{ fontWeight: "bold" }}>
                Name:{" "}
                <span style={{ fontWeight: "lighter" }}>
                  {selectedCollateralToken.name}
                </span>
              </p>
              <p style={{ fontWeight: "bold" }}>
                Symbol:{" "}
                <span style={{ fontWeight: "lighter" }}>
                  {selectedCollateralToken.symbol}
                </span>
              </p>
              <p style={{ fontWeight: "bold" }}>
                Balance:{" "}
                <span style={{ fontWeight: "lighter" }}>
                  {collateralBalance}
                </span>
              </p>
            </AccordionContentBody>
          </React.Fragment>
        </Card>
      )}
      {selectedPriceIdentifier && (
        <Card>
          <Card.Header>Selected price identifier</Card.Header>
          <React.Fragment>
            <AccordionContentBody direction="horizontal">
              <Description style={{ justifyContent: "center" }}>
                <span>{selectedPriceIdentifier}</span>
              </Description>
            </AccordionContentBody>
          </React.Fragment>
        </Card>
      )}
    </React.Fragment>
  );
};

const AccordionContentBody = styled.div<{ direction?: string }>`
  display: flex;
  padding: 0.5em 1em;
  flex-direction: ${(props) => props.direction || "column"};
`;

const Image = styled.div`
  display: flex;
  background-color: #ff4a4a;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  justify-content: center;
  align-items: center;
  margin-right: 1em;
`;

const Description = styled.div`
  display: flex;
  width: 70%;
  flex-direction: column;
  font-weight: 400;
  span.subtitle {
                          font - size: 0.85em;
    font-weight: 300;
  }
`;
