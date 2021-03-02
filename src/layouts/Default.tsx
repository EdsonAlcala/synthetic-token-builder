import React from "react";
import { Box, Container, Grid } from "@material-ui/core";
import { styled as materialUIStyled } from "@material-ui/core/styles";

import { Header } from "../sections";

const MainContainer = materialUIStyled(Grid)({
  paddingRight: 0,
  paddingLeft: 0,
  height: "100%",
});

export const DefaultLayout: React.FC = ({ children }) => {
  return (
    <Box pt="1em">
      <Container>
        <MainContainer>
          <Grid item={true}>
            <Header />
          </Grid>
          <Grid item={true}>
            <Box marginTop="4em">{children}</Box>
          </Grid>
        </MainContainer>
      </Container>
    </Box>
  );
};
