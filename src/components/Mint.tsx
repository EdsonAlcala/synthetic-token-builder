import React, { useState } from "react";
import { Box, Grid, TextField, Typography } from "@material-ui/core";
import { ethers } from "ethers";

import { CollateralInfo, EMPDataParsed, EthereumAddress } from "../types";
import { getTaggedData, makeTransaction } from "../utils";
import { INFINITY } from "../constants";

import { TransactionResultArea } from "./TransactionResultArea";
import { FormButton } from "./FormButton";
import { FormTitle } from "./FormTitle";

export interface MintProps {
  empState: EMPDataParsed;
  collateralInstance: ethers.Contract;
  empAddress: EthereumAddress;
  collateralState: CollateralInfo;
  address: EthereumAddress;
  signer: ethers.Signer;
}

export const Mint: React.FC<MintProps> = ({
  signer,
  address,
  empState,
  collateralInstance,
  empAddress,
  collateralState,
}) => {
  // internal state
  const [collateral, setCollateral] = useState<string>("0");
  const [tokens, setTokens] = useState<string>("0");
  const [hash, setHash] = useState<string | undefined>(undefined);
  const [error, setError] = useState<Error | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState<boolean>(false);

  const { minSponsorTokens, tokenSymbol, tokenDecimals } = empState;
  const {
    collateralSymbol,
    collateralAllowance,
    collateralBalance,
    collateralDecimals,
  } = collateralState;

  const minSponsorTokensFromWei = parseFloat(minSponsorTokens);
  // input data
  const collateralToDeposit = Number(collateral) || 0;
  const tokensToCreate = Number(tokens) || 0;

  // computed synthetic
  const resultantTokens = tokensToCreate;
  const resultantTokensBelowMin =
    resultantTokens < minSponsorTokensFromWei && resultantTokens !== 0;

  // computed collateral
  const isBalanceBelowCollateralToDeposit =
    Number(collateralBalance) < collateralToDeposit;
  const needAllowance =
    collateralAllowance !== INFINITY &&
    Number(collateralAllowance) < collateralToDeposit;

  // computed general
  const transactionCR =
    tokensToCreate > 0 && collateralToDeposit > 0
      ? collateralToDeposit / tokensToCreate
      : 0;

  const mintTokens = async () => {
    setIsSubmitting(true);
    setSuccess(false);

    if (collateralToDeposit >= 0 && tokensToCreate > 0 && collateralDecimals) {
      setHash(undefined);
      setError(undefined);
      try {
        const data = getTaggedData(
          collateralToDeposit,
          tokensToCreate,
          Number(collateralDecimals),
          Number(tokenDecimals)
        );
        const transaction = makeTransaction(address, empAddress, data);
        const tx = await signer.sendTransaction(transaction);
        setHash(tx.hash as string);
        await tx.wait();
        setSuccess(true);
        console.log("Minting tokens successfully");
      } catch (error) {
        console.error(error);
        setError(error);
      }
    } else {
      setError(new Error("Collateral and Token amounts must be positive"));
    }
    setIsSubmitting(false);
  };

  const setMaxAllowance = async () => {
    setIsSubmitting(true);
    setHash(undefined);
    setError(undefined);
    setSuccess(false);
    try {
      const receipt = await collateralInstance.approve(
        empAddress,
        ethers.constants.MaxUint256
      );
      setHash(receipt.hash as string);
      await receipt.wait();
      setSuccess(true);
      console.log("Set max allowance successfully");
    } catch (error) {
      console.error(error);
      setError(error);
    }
    setIsSubmitting(false);
  };

  return (
    <React.Fragment>
      <Grid container>
        <Grid item xs={6}>
          <Grid container spacing={3}>
            <Grid item md={12} sm={12} xs={12}>
              <FormTitle>{`Mint new synthetic tokens (${tokenSymbol})`}</FormTitle>
            </Grid>

            <Grid item md={10} sm={10} xs={10}>
              <TextField
                size="small"
                fullWidth
                type="number"
                variant="outlined"
                label={`Tokens (${tokenSymbol})`}
                inputProps={{ min: "0" }}
                value={tokens}
                error={resultantTokensBelowMin}
                helperText={
                  resultantTokensBelowMin &&
                  `Below minimum of ${minSponsorTokensFromWei}`
                }
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setTokens(e.target.value)
                }
              />
            </Grid>

            <Grid item md={10} sm={10} xs={10}>
              <TextField
                size="small"
                fullWidth
                type="number"
                variant="outlined"
                label={`Collateral (${collateralSymbol})`}
                inputProps={{ min: "0", max: collateralBalance }}
                value={collateral}
                error={isBalanceBelowCollateralToDeposit}
                helperText={
                  isBalanceBelowCollateralToDeposit &&
                  `${collateralSymbol} balance is too low`
                }
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setCollateral(e.target.value)
                }
              />
            </Grid>

            <Grid item md={10} sm={10} xs={10}>
              <Box py={0}>
                {needAllowance && (
                  <FormButton
                    size="small"
                    onClick={setMaxAllowance}
                    isSubmitting={isSubmitting}
                    submittingText="Approving..."
                    text="Max Approve"
                  >
                    Max Approve
                  </FormButton>
                )}

                {!needAllowance && (
                  <FormButton
                    onClick={mintTokens}
                    disabled={
                      isBalanceBelowCollateralToDeposit ||
                      resultantTokensBelowMin ||
                      collateralToDeposit < 0 ||
                      tokensToCreate <= 0
                    }
                    isSubmitting={isSubmitting}
                    submittingText="Minting tokens..."
                    text={`Mint ${tokensToCreate} ${tokenSymbol}`}
                  />
                )}
              </Box>
            </Grid>

            <Grid item md={10} sm={10} xs={10} style={{ paddingTop: "0" }}>
              <TransactionResultArea
                hash={hash}
                error={error}
                success={success}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={6}>
          <Box
            height="100%"
            flexDirection="column"
            display="flex"
            justifyContent="center"
          >
            <Typography style={{ padding: "0 0 1em 0" }}>
              {`Resulting Collateral Ratio: ${transactionCR}`}
            </Typography>
            <Typography style={{ padding: "0 0 1em 0", fontSize: "0.85em" }}>
              <span style={{ color: "#ff4a4a" }}>Note:</span> You need to
              consult the selected price identifier external price feed to
              compute this value.
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};
