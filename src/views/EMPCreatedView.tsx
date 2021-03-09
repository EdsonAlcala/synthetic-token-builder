import React, { useEffect, useState } from "react";
import { Box, Button, Typography, Dialog, DialogContent } from "@material-ui/core";
import { ArrowUpRight } from "react-bootstrap-icons";
import { BigNumber, Bytes, ethers } from "ethers";
import { formatUnits, parseBytes32String } from "ethers/lib/utils";
import styled from "styled-components";
import {
  createMuiTheme,
  ThemeProvider as MuiThemeProvider
} from "@material-ui/core/styles";

import { useGlobalState } from "../hooks";
import { Loader } from "../components";
import Etherscan from "../hooks/Etherscan";

import Connection from "../hooks/Connection";
import { fromWei, getUMAAbis } from "../utils";
import { CollateralInfo, EMPData, EMPDataParsed, EthereumAddress } from "../types";
import { FINANCIAL_PRODUCT_LIBRARY, INFINITY } from "../constants";
import { Mint } from "../components/Mint";

export const EMPCreatedView: React.FC = () => {
  const { signer, address, block$ } = Connection.useContainer()
  const { empAddress, transactionHash } = useGlobalState();
  const { getEtherscanUrl } = Etherscan.useContainer();
  const [empState, setEMPState] = useState<EMPDataParsed | undefined>(undefined)
  const [collateralState, setCollateralState] = useState<CollateralInfo | undefined>(undefined)
  const [collateralInstance, setCollateralInstance] = useState<ethers.Contract | undefined>(undefined)
  const [showContractDeploymentDetails, setShowContractDeploymentDetails] = useState(false)
  const [showMintModal, setShowMintModal] = useState(false)

  const openContractDetails = () => {
    setShowContractDeploymentDetails(true)
  }

  const handleCloseContractDetails = () => {
    setShowContractDeploymentDetails(false)
  }

  const openMintModal = () => {
    setShowMintModal(true)
  }

  const handleCloseMintModal = () => {
    setShowMintModal(false)
  }

  const getCollateralInfo = async (collateralInstanceNew: ethers.Contract) => {
    const collateralDecimals = (await collateralInstanceNew.decimals()).toString()
    const collateralSymbol = (await collateralInstanceNew.symbol()).toString()
    const allowanceRaw: BigNumber = await collateralInstanceNew.allowance(
      address,
      empAddress
    );
    const newAllowance = allowanceRaw.eq(ethers.constants.MaxUint256)
      ? INFINITY
      : fromWei(allowanceRaw, collateralDecimals);

    const balanceRaw: BigNumber = await collateralInstanceNew.balanceOf(
      address
    );
    const newBalance = fromWei(balanceRaw, collateralDecimals)

    setCollateralState({
      collateralDecimals,
      collateralSymbol,
      collateralAllowance: newAllowance,
      collateralBalance: newBalance
    })
  }

  useEffect(() => {
    if (empAddress && signer !== null && address) {
      const getAllEMPData = async () => {
        const umaABIs = getUMAAbis();

        const empInterface = new ethers.utils.Interface(umaABIs.get('ExpiringMultiParty') as any)
        if (!empInterface) {
          throw new Error("Invalid ExpiringMultiParty Interface");
        }

        const empInstance: ethers.Contract = new ethers.Contract(empAddress, empInterface, signer)

        const erc20StandardInterface = umaABIs.get("ERC20");

        if (!erc20StandardInterface) {
          throw new Error("Invalid ERC20 Interface");
        }

        const res = await Promise.all([
          empInstance.expirationTimestamp(),
          empInstance.collateralCurrency(),
          empInstance.priceIdentifier(),
          empInstance.tokenCurrency(),
          empInstance.collateralRequirement(),
          empInstance.minSponsorTokens(),
          empInstance.liquidationLiveness(),
          empInstance.withdrawalLiveness(),
          empInstance.disputeBondPercentage(),
          empInstance.disputerDisputeRewardPercentage(),
          empInstance.sponsorDisputeRewardPercentage()
        ])

        const newState: EMPData = {
          expirationTimestamp: res[0] as BigNumber,
          collateralCurrency: res[1] as EthereumAddress,
          priceIdentifier: res[2] as Bytes,
          tokenCurrency: res[3] as EthereumAddress,
          collateralRequirement: res[4] as BigNumber,
          minSponsorTokens: res[5] as BigNumber,
          liquidationLiveness: res[6] as BigNumber,
          withdrawalLiveness: res[7] as BigNumber,
          disputeBondPercentage: res[8] as BigNumber,
          disputerDisputeRewardPercentage: res[9] as BigNumber,
          sponsorDisputeRewardPercentage: res[10] as BigNumber
        }

        const tokenInstance = new ethers.Contract(
          newState.tokenCurrency,
          erc20StandardInterface,
          signer
        );

        const collateralInstanceNew = new ethers.Contract(
          newState.collateralCurrency,
          erc20StandardInterface,
          signer
        );

        const tokenName = (await tokenInstance.name()).toString();
        const tokenSymbol = (await tokenInstance.symbol()).toString();
        const tokenDecimals = (await tokenInstance.decimals()).toString();
        const collateralDecimals = (await collateralInstanceNew.decimals()).toString()
        const priceIdentifierParsed = parseBytes32String(newState.priceIdentifier)
        const collateralRequirementPercentage = parseFloat(formatUnits(newState.collateralRequirement, collateralDecimals)).toString()
        const expireDate = new Date(newState.expirationTimestamp.toNumber() * 1000).toLocaleString('en-GB', { timeZone: 'UTC' })
        const minSponsorTokens = parseFloat(formatUnits(newState.minSponsorTokens, collateralDecimals)).toString()
        const disputeBondPercentage = `${(parseFloat(formatUnits(newState.disputeBondPercentage)) * 100)} %`
        const disputerDisputeRewardPercentage = `${(parseFloat(formatUnits(newState.disputerDisputeRewardPercentage)) * 100)} %`
        const sponsorDisputeRewardPercentage = `${(parseFloat(formatUnits(newState.sponsorDisputeRewardPercentage)) * 100)} %`

        const dataParsed: EMPDataParsed = {
          collateralCurrency: newState.collateralCurrency,
          priceIdentifier: priceIdentifierParsed,
          tokenName,
          tokenSymbol,
          tokenDecimals,
          collateralRequirement: collateralRequirementPercentage,
          expireDate,
          minSponsorTokens,
          disputeBondPercentage,
          disputerDisputeRewardPercentage,
          sponsorDisputeRewardPercentage,
          liquidationLiveness: newState.liquidationLiveness.toNumber(),
          withdrawalLiveness: newState.withdrawalLiveness.toNumber(),

        }
        setEMPState(dataParsed)
        setCollateralInstance(collateralInstanceNew)
      }

      getAllEMPData()
    }
  }, [empAddress, signer, address])

  // get info on each new block
  useEffect(() => {
    if (block$ && collateralInstance) {
      const sub = block$.subscribe(() => {
        getCollateralInfo(collateralInstance)
      });
      return () => sub.unsubscribe();
    }
  }, [ // eslint-disable-line
    block$, collateralInstance
  ]);

  if (empAddress && transactionHash && empState && collateralInstance && collateralState && address !== null && signer !== null) {
    return (
      <Box
        display="grid"
        justifyContent="center"
        flexDirection="column"
        width="100%"
        gridGap="2em"
        textAlign="center"
      >
        <Typography variant="h4">Congratulations !</Typography>

        <Box>
          <img
            height="150"
            width="150"
            src="https://res.cloudinary.com/key-solutions/image/upload/v1614643487/uma/rocket.svg"
            alt="rocket showing that the user has finished the wizard"
          />
        </Box>

        <Typography>You have successfully deployed the EMP at:</Typography>

        <Typography>{empAddress}</Typography>

        <button onClick={openContractDetails} style={{ padding: '0.4em', textTransform: 'capitalize', background: 'none', border: '1px solid #ff4a4a', color: '#ff4a4a' }}>
          View contract deployment details
          </button>
        <Box>
          <Typography>
            You can also view on Etherscan{" "}
            <a
              target="_blank"
              rel="noreferrer"
              href={getEtherscanUrl(transactionHash)}
            >
              <ArrowUpRight color="black" />
            </a>
          </Typography>
        </Box>

        <Typography variant="h5">What's next?</Typography>

        <Typography>
          Want to setup the GCR?{" "}
          <a
            target="_blank"
            rel="noreferrer"
            href="https://docs.umaproject.org/synthetic-tokens/glossary#global-collateralization-ratio-gcr"
          >
            Learn more
          </a>
        </Typography>

        <Box>
          <MintButton
            variant="contained"
            color="secondary"
            onClick={openMintModal}>
            Mint
          </MintButton>
        </Box>

        {/* Modals */}
        <Dialog maxWidth="md" open={showContractDeploymentDetails} onClose={handleCloseContractDetails}>
          <DialogContent style={{ background: 'white', color: 'black', padding: "2em 4em 1em" }}>
            <p style={{ marginBottom: "1em" }}>EMP Deployment Details</p>

            <ContractDetailItem label="Synthetic name" value={`${empState.tokenName}`} />
            <ContractDetailItem label="Synthetic symbol" value={`${empState.tokenSymbol}`} />
            <ContractDetailItem label="Expiration date" value={`${empState.expireDate}`} />
            <ContractDetailItem label="Collateral address" value={empState.collateralCurrency} />
            <ContractDetailItem label="Price identifier" value={`${empState.priceIdentifier}`} />
            <ContractDetailItem label="Collateral requirement" value={`${empState.collateralRequirement}`} />
            <ContractDetailItem label="Minimum sponsor tokens" value={`${empState.minSponsorTokens}`} />
            <ContractDetailItem label="Liquidation liveness" value={`${empState.liquidationLiveness}`} />
            <ContractDetailItem label="Withdrawal liveness" value={`${empState.withdrawalLiveness}`} />
            <ContractDetailItem label="Dispute bond percentage" value={`${empState.disputeBondPercentage}`} />
            <ContractDetailItem label="Sponsor dispute reward percentage" value={`${empState.sponsorDisputeRewardPercentage}`} />
            <ContractDetailItem label="Disputer dispute reward percentage" value={`${empState.disputerDisputeRewardPercentage}`} />
            <ContractDetailItem label="Financial product library address" value={`${FINANCIAL_PRODUCT_LIBRARY}`} />
          </DialogContent>
        </Dialog>

        <Dialog maxWidth="md" open={showMintModal} onClose={handleCloseMintModal}>
          <DialogContent style={{ background: 'white', color: 'black', padding: "2em 4em 1em" }}>
            <MuiThemeProvider theme={muiTheme}>
              <Mint signer={signer} address={address} empState={empState} collateralInstance={collateralInstance} empAddress={empAddress} collateralState={collateralState} />
            </MuiThemeProvider>
          </DialogContent>
        </Dialog>
      </Box>
    );
  } else {
    return (
      <Box mt="10em">
        <Loader />
      </Box>
    );
  }
};

interface ContractDetailItemProp {
  label: string
  value: string
}

const ContractDetailItem: React.FC<ContractDetailItemProp> = ({ label, value }) => {
  return (
    <p style={{ fontSize: "0.9em" }}>{label}: <span style={{ fontSize: "0.8em" }}>{value}</span></p>
  )
}

const MintButton = styled(Button)`
    padding: 0.3em 2em;
    font-size: 1em;
    pointer-events: "unset"
    text-transform: capitalize;
    border: 1px solid rgba(255, 255, 255, 0.23);
    text-transform: capitalize;
`;

const muiTheme = createMuiTheme({
  palette: {
    type: "light",
    primary: {
      main: "#E13938",
      contrastText: "#fff",
      dark: "#000",
    },
    secondary: {
      contrastText: "#fff",
      main: "#fff",
      dark: "#000",
    },
  },
  typography: {
    fontSize: 16,
    fontFamily: [
      `Noto Sans JP`,
      `-apple-system`,
      `BlinkMacSystemFont`,
      `"Segoe UI"`,
      `sans-serif`,
    ].join(","),
  },
});

muiTheme.typography.body1 = {
  [muiTheme.breakpoints.down("sm")]: {
    fontSize: 15,
  },
  [muiTheme.breakpoints.down("xs")]: {
    fontSize: 14,
  },
};
muiTheme.typography.h4 = {
  [muiTheme.breakpoints.down("sm")]: {
    fontSize: "1.4em",
  },
  [muiTheme.breakpoints.up("sm")]: {
    fontSize: "2.1em",
  },
};
