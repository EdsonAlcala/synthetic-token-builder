import { Container, Box, Typography, Grid } from "@material-ui/core";
import React from "react";

import Connection from "../hooks/Connection";
import { NavMenu, RightPanel, StepManager } from "../sections";

export const SyntheticTokenBuilderView: React.FC = () => {
  const { signer } = Connection.useContainer();
  const connected = signer !== null;

  return (
    <Container>
      <Box marginTop="6em">
        <Box
          border="1px solid #fa4a4a"
          height="800px"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          {connected ? (
            <TokenBuilderSection />
          ) : (
            <Typography>Connect to a network</Typography>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export const TokenBuilderSection = () => {
  return (
    <Container style={{ height: "100%", padding: "2em" }}>
      <Grid container={true}>
        <Grid item={true} xs={3}>
          <NavMenu />
        </Grid>
        <Grid item={true} xs={6}>
          <StepManager />
        </Grid>
        <Grid item={true} xs={3}>
          <RightPanel />
        </Grid>
      </Grid>
    </Container>
  );
};
