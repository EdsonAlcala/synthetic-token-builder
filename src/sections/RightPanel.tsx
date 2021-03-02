import React, { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import styled from "styled-components";

import ERC20Artifact from "@uma/core/build/contracts/ERC20.json";

import { useGlobalState } from "../hooks/useGlobalState";
import Connection from "../hooks/Connection";
import { BigNumber, ethers } from "ethers";
import { formatUnits } from "ethers/lib/utils";
import { DEFAULT_SELECT_VALUE } from "../constants";

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
          ERC20Artifact.abi,
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
              <RowItem label="Name" value={selectedCollateralToken.name} />

              <RowItem label="Symbol" value={selectedCollateralToken.symbol} />

              <RowItem label="Balance" value={collateralBalance} />
            </AccordionContentBody>
          </React.Fragment>
        </Card>
      )}
      {selectedPriceIdentifier !== DEFAULT_SELECT_VALUE && (
        <Card style={{ borderTop: "none" }}>
          <Card.Header>Selected price identifier</Card.Header>
          <React.Fragment>
            <AccordionContentBody
              className="borderBottomExceptLast"
              direction="horizontal"
            >
              <Description style={{ justifyContent: "center" }}>
                <RowItem label="Name" value={selectedPriceIdentifier} />
              </Description>
            </AccordionContentBody>
          </React.Fragment>
        </Card>
      )}
    </React.Fragment>
  );
};

interface RowItemProps {
  label: string;
  value: string;
}

const RowItem: React.FC<RowItemProps> = ({ label, value }) => {
  return (
    <p style={{ fontWeight: "bold" }}>
      {label}: <span style={{ fontWeight: "lighter" }}>{value}</span>
    </p>
  );
};
const AccordionContentBody = styled.div<{ direction?: string }>`
  display: flex;
  padding: 0.5em 1em;
  flex-direction: ${(props) => props.direction || "column"};
  font-size: 0.8em;
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
