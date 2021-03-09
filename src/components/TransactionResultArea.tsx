import React from "react";
import styled from "styled-components";
import { Box, Typography } from "@material-ui/core";
import Etherscan from "../hooks/Etherscan";
import { ArrowUpRight } from "react-bootstrap-icons";

export interface TransactionResultAreaProps {
  hash: string | undefined;
  error: Error | undefined;
  success: boolean;
}

export const TransactionResultArea: React.FC<TransactionResultAreaProps> = ({
  hash,
  error,
  success,
}) => {
  const { getEtherscanUrl } = Etherscan.useContainer();

  return (
    <Box color="black" display="flex" flexDirection="column" fontSize="0.9em">
      {hash && (
        <React.Fragment>
          <Box>
            <Link
              href={getEtherscanUrl(hash)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span
                style={{
                  fontSize: "1em",
                  display: "inline-flex",
                  alignItems: "center",
                  marginTop: "0.5em",
                }}
              >
                View on Etherscan
                <ArrowUpRight
                  color="black"
                  style={{ marginLeft: "0.2em", fontSize: "1em" }}
                />
              </span>
            </Link>
          </Box>
        </React.Fragment>
      )}
      {success && (
        <Box marginTop="1em" mb="1em">
          <Typography>
            <label style={{ color: "rgb(98, 93, 247)", fontSize: "0.9em" }}>
              Transaction successful
            </label>
          </Typography>
        </Box>
      )}
      {error && (
        <React.Fragment>
          <Typography>
            <label style={{ color: "red" }}>{error.message}</label>
          </Typography>
        </React.Fragment>
      )}
    </Box>
  );
};

const Link = styled.a`
  text-decoration: none;
  color: black;
`;
