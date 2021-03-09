import React, { useEffect, useState } from "react";
import { Box, Button, Typography, Dialog, DialogContent } from "@material-ui/core";
import { ArrowUpRight } from "react-bootstrap-icons";
import { BigNumber, Bytes, ethers } from "ethers";
import { formatUnits, parseBytes32String } from "ethers/lib/utils";
import styled from "styled-components";

import { useGlobalState } from "../hooks";
import { Loader } from "../components";
import Etherscan from "../hooks/Etherscan";

import Connection from "../hooks/Connection";
import { getUMAAbis } from "../utils";
import { EthereumAddress } from "../types";
import { FINANCIAL_PRODUCT_LIBRARY } from "../constants";

interface EMPData {
  expirationTimestamp: BigNumber
  collateralCurrency: string
  priceIdentifier: string | Bytes
  tokenCurrency: string
  collateralRequirement: BigNumber | string
  disputeBondPercentage: BigNumber | string
  disputerDisputeRewardPercentage: BigNumber | string
  sponsorDisputeRewardPercentage: BigNumber | string
  minSponsorTokens: BigNumber | string
  timerAddress: string
  cumulativeFeeMultiplier: BigNumber
  rawTotalPositionCollateral: BigNumber
  totalTokensOutstanding: BigNumber
  liquidationLiveness: BigNumber
  withdrawalLiveness: BigNumber
  currentTime: BigNumber
  isExpired: boolean
  contractState: number
  finderAddress: string
  expiryPrice: BigNumber
  tokenSymbol: string
  tokenName: string
  collateralDecimals: string
  expireDate: string
  // financialProductLibraryAddress: string
}

export const EMPCreatedView: React.FC = () => {
  const { signer } = Connection.useContainer()
  const { empAddress, transactionHash } = useGlobalState();
  const { getEtherscanUrl } = Etherscan.useContainer();
  const [empState, setEMPState] = useState<EMPData | undefined>(undefined)

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
  useEffect(() => {
    if (empAddress && signer !== null) {
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
          empInstance.timerAddress(),
          empInstance.cumulativeFeeMultiplier(),
          empInstance.rawTotalPositionCollateral(),
          empInstance.totalTokensOutstanding(),
          empInstance.liquidationLiveness(),
          empInstance.withdrawalLiveness(),
          empInstance.getCurrentTime(),
          empInstance.contractState(),
          empInstance.finder(),
          empInstance.expiryPrice(),
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
          timerAddress: res[6] as EthereumAddress,
          cumulativeFeeMultiplier: res[7] as BigNumber,
          rawTotalPositionCollateral: res[8] as BigNumber,
          totalTokensOutstanding: res[9] as BigNumber,
          liquidationLiveness: res[10] as BigNumber,
          withdrawalLiveness: res[11] as BigNumber,
          currentTime: res[12] as BigNumber,
          isExpired: Number(res[12]) >= Number(res[0]),
          contractState: Number(res[13]),
          finderAddress: res[14] as EthereumAddress,
          expiryPrice: res[15] as BigNumber,
          disputeBondPercentage: res[16] as BigNumber,
          disputerDisputeRewardPercentage: res[17] as BigNumber,
          sponsorDisputeRewardPercentage: res[18] as BigNumber,
          tokenName: "",
          tokenSymbol: "",
          collateralDecimals: "",
          expireDate: ""
        }

        const tokenInstance = new ethers.Contract(
          newState.tokenCurrency,
          erc20StandardInterface,
          signer
        );

        const collateralInstance = new ethers.Contract(
          newState.collateralCurrency,
          erc20StandardInterface,
          signer
        );

        const tokenName = (await tokenInstance.name()).toString();
        const tokenSymbol = (await tokenInstance.symbol()).toString();
        const collateralDecimals = (await collateralInstance.decimals()).toString()

        const priceIdentifierParsed = parseBytes32String(newState.priceIdentifier)
        const collateralRequirementPercentage = parseFloat(formatUnits(newState.collateralRequirement, collateralDecimals)).toString()
        const expireDate = new Date(newState.expirationTimestamp.toNumber() * 1000).toLocaleString('en-GB', { timeZone: 'UTC' })
        const minSponsorTokens = parseFloat(formatUnits(newState.minSponsorTokens, collateralDecimals)).toString()
        const disputeBondPercentage = `${(parseFloat(formatUnits(newState.disputeBondPercentage)) * 100)} %`
        const disputerDisputeRewardPercentage = `${(parseFloat(formatUnits(newState.disputerDisputeRewardPercentage)) * 100)} %`
        const sponsorDisputeRewardPercentage = `${(parseFloat(formatUnits(newState.sponsorDisputeRewardPercentage)) * 100)} %`

        setEMPState({
          ...newState,
          priceIdentifier: priceIdentifierParsed,
          tokenName,
          tokenSymbol,
          collateralRequirement: collateralRequirementPercentage,
          collateralDecimals,
          expireDate,
          minSponsorTokens,
          disputeBondPercentage,
          disputerDisputeRewardPercentage,
          sponsorDisputeRewardPercentage
        })
      }

      getAllEMPData()
    }
  }, [empAddress, signer])

  if (empAddress && transactionHash && empState) {
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
