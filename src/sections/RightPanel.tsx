import React, { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import styled from "styled-components";

import ERC20Artifact from "@uma/core/build/contracts/ERC20.json";

import { useGlobalState } from "../hooks/useGlobalState";
import Connection from "../hooks/Connection";
import { BigNumber, ethers } from "ethers";
import { formatUnits } from "ethers/lib/utils";
import { DEFAULT_SELECT_VALUE } from "../constants";
import Etherscan from "../hooks/Etherscan";

export const RightPanel: React.FC = () => {
  const { address, provider } = Connection.useContainer();
  const { selectedCollateralToken, selectedPriceIdentifier } = useGlobalState();
  const [collateralBalance, setCollateralBalance] = useState("0");
  const { getEtherscanUrl } = Etherscan.useContainer()

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
  }, [selectedCollateralToken, provider]); // eslint-disable-line

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

              <RowItemLink label="Address" href={getEtherscanUrl(selectedCollateralToken.address)} value={shortAddress(selectedCollateralToken.address)} />

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
              <Description style={{ justifyContent: "space-between", display: "flex", alignItems: "center", width: "100%", flexDirection: "row" }}>
                <RowItem label="Name" value={selectedPriceIdentifier} noMargin={true} />

                <a style={{ fontSize: "0.9em" }} href="https://docs.umaproject.org/uma-tokenholders/approved-price-identifiers" target="_black" rel="noreferrer">Learn more</a>

              </Description>

            </AccordionContentBody>
          </React.Fragment>
        </Card>
      )}
    </React.Fragment>
  );
};

const shortAddress = (publicKey: string) =>
  `${publicKey?.substr(0, 20)}..${publicKey?.substr(-18)}`


interface RowItemProps {
  label: string;
  value: string;
  href?: string
  noMargin?: boolean
}

const RowItem: React.FC<RowItemProps> = ({ label, value, noMargin = false }) => {
  return (
    <p style={{ fontWeight: "bold", marginBottom: noMargin ? "0" : "1em" }} >
      {label}: <span style={{ fontWeight: "lighter" }}>{value}</span>
    </p>
  );
};

const RowItemLink: React.FC<RowItemProps> = ({ label, value, href }) => {
  return (
    <p style={{ fontWeight: "bold", fontSize: "0.9em" }}>
      {label}: <a href={href} target="_blank" rel="noreferrer" style={{ fontWeight: "lighter" }}>{value}</a>
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
