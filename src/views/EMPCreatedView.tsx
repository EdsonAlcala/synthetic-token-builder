import React from "react"
import { Box, Button, Typography } from "@material-ui/core"
import { ArrowUpRight } from "react-bootstrap-icons"

import Etherscan from "../hooks/Etherscan";

import { useGlobalState } from "../hooks"
import { Loader } from "../components";
import styled from "styled-components";

export const EMPCreatedView: React.FC = () => {
    const { empAddress, transactionHash } = useGlobalState()
    const { getEtherscanUrl } = Etherscan.useContainer();

    console.log("empAddress", empAddress)
    console.log("transactionHash", transactionHash)

    if (empAddress && transactionHash) {
        return (
            <Box display="grid" justifyContent="center" flexDirection="column" width="100%" gridGap="2em" textAlign="center">

                <Typography variant="h4">
                    Congratulations !
                </Typography>

                <Box>
                    <img height="150" width="150" src="https://res.cloudinary.com/key-solutions/image/upload/v1614643487/uma/rocket.svg" alt="rocket showing that the user has finished the wizard" />
                </Box>

                <Typography>
                    You have successfully deployed the EMP at:
                </Typography>

                <Typography>
                    {empAddress}
                </Typography>

                <Box>
                    <Typography>
                        You can also view on Etherscan{" "}
                        <a target="_blank" href={getEtherscanUrl(transactionHash)}>
                            <ArrowUpRight color="black" />
                        </a>
                    </Typography>
                </Box>

                <Typography variant="h5">
                    What's next?
                </Typography>

                <Typography>
                    Want to setup the GCR? <a target="_blank" href="https://docs.umaproject.org/synthetic-tokens/glossary#global-collateralization-ratio-gcr">Learn more</a>
                </Typography>

                <Box>
                    <MintButton
                        variant="contained"
                        color="secondary"
                        onClick={() => console.log("Clicked")}>
                        Mint
                    </MintButton>
                </Box>
            </Box>

        )
    } else {
        return (<Box mt="10em">
            <Loader />
        </Box>)
    }
}

const MintButton = styled(Button)`
    padding: 0.3em 2em;
    font-size: 1em;
    pointer-events: "unset"
    text-transform: capitalize;
    border: 1px solid rgba(255, 255, 255, 0.23);
    text-transform: capitalize;
`;