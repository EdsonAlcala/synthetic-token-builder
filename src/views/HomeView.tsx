import {
  Button,
  Container,
  Grid,
  styled as MaterialUIStyled,
  Typography,
} from "@material-ui/core";
import React from "react";
import { Link } from "react-router-dom";
import YouTube from "react-youtube";
import styled from "styled-components";
import { TOKEN_BUILDER_ROUTE } from "../constants";

const Subtitle = MaterialUIStyled(Typography)({
  marginTop: "0",
});

const Title = MaterialUIStyled(Typography)({
  lineHeight: "2.5",
});

const GetStartedButton = MaterialUIStyled(Button)({
  marginTop: "2em",
  padding: "0.6em 2em",
});

const WrapperContainer = MaterialUIStyled(Container)({
  paddingTop: "7em",
});

const opts = {
  height: "350",
  width: "100%",
};

export const HomeView: React.FC = () => {
  const onReady = (event: any) => {
    // access to player in all event handlers via event.target
    event.target.pauseVideo();
  };

  return (
    <WrapperContainer maxWidth="lg">
      <Grid container={true}>
        <Grid item={true} xs={6} lg={6}>
          <Title variant="h3">Synthetic Token Builder</Title>
          <Subtitle variant="h6">Deploy synthetic tokens easily</Subtitle>
          <StyledLink to={`${TOKEN_BUILDER_ROUTE}`}>
            <GetStartedButton variant="contained" color="secondary">
              Get Started
            </GetStartedButton>
          </StyledLink>
        </Grid>
        <Grid item={true} xs={6} lg={6}>
          <YouTube opts={opts} videoId="Ogrs1eQZSeA" onReady={onReady} />
        </Grid>
      </Grid>
    </WrapperContainer>
  );
};

const StyledLink = styled(Link)`
  text-decoration: none;

  &:hover {
    text-decoration: none;
  }
`;
