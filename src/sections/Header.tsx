import React from "react";
import { Box, Button, Container, Grid, Typography } from "@material-ui/core";
import Styled from "styled-components";
import { Link } from "react-router-dom";

import Connection from "../hooks/Connection";
import UMALogo from "../images/uma-red-logo.png";

interface IProps {
  styled: {
    connected: boolean;
  };
}

const StyledTypography = Styled(Typography)`
  font-weight: 400;
`;

export const Header = () => {
  return (
    <Container maxWidth="lg">
      <Grid
        container={true}
        alignContent="space-between"
        alignItems="center"
        justify="space-between"
      >
        <Grid item={true}>
          <Logo />
        </Grid>
        <Grid item={true}>
          <AddressBar />
        </Grid>
      </Grid>
    </Container>
  );
};

const Logo = () => {
  return (
    <Box
      display="flex"
      flexDirection="horizontal"
      justifyContent="center"
      alignItems="center"
    >
      <StyledLink to="/">
        <img
          src={UMALogo}
          height="32px"
          width="32px"
          style={{ marginRight: "0.5em" }}
          alt="UMA logo in red"
        />
      </StyledLink>
      <StyledTypography>Token Builder</StyledTypography>
    </Box>
  );
};

const StyledLink = Styled(Link)`
  text-decoration: none;
`;

const AddressBar = () => {
  const { connect, signer, network, address } = Connection.useContainer();
  const connected = signer !== null;

  const networkName = network?.name === "homestead" ? "mainnet" : network?.name;
  const shortAddress = `${address?.substr(0, 10)}…${address?.substr(-9)}`;

  return (
    <Box display="flex" alignItems="center">
      {address && (
        <AddressBox title={address || undefined}>
          <div>{shortAddress}</div>
        </AddressBox>
      )}
      {connected ? (
        <ConnectButton
          variant="outlined"
          color="secondary"
          styled={{ connected }}
        >
          <span style={{ color: "#8bc34a" }}>●</span>&nbsp;
          {networkName}
        </ConnectButton>
      ) : (
        <ConnectButton
          variant="outlined"
          color="secondary"
          onClick={connect}
          styled={{ connected }}
        >
          🦊 Connect
        </ConnectButton>
      )}
    </Box>
  );
};

const ConnectButton = Styled(Button)`
  padding-top: 8px;
  padding-bottom: 8px;
  pointer-events: ${({ styled }: IProps) =>
    styled.connected ? "none" : "unset"};
  text-transform: ${({ styled }: IProps) =>
    styled.connected ? "capitalize" : "uppercase"};
`;

const AddressBox = Styled.div`
  border: 1px solid rgba(255, 74, 74, 0.5);
  margin-right: 10px;
  align-self: stretch;
  margin-right: 3px;
  padding-right: 12px;
  padding-left: 12px;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
  display: flex;
  align-items: center;
  border-radius: 3px;
`;
