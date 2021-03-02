import React, { useState } from "react";
import { Box } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { Formik, Form, FormikErrors } from "formik";

import {
  Button,
  ErrorMessage,
  FormItem,
  StyledButton,
  StyledTitle,
} from "../components";
import { useGlobalState, useStep, useUMARegistry } from "../hooks";
import Connection from "../hooks/Connection";

import { deployEMP, EMPParameters } from "../utils";
import { DEFAULT_SELECT_VALUE, SUCCESS_ROUTE } from "../constants";

import "react-datetime/css/react-datetime.css";

interface FormProps {
  expirationTimestamp: string;
  syntheticName: string;
  syntheticSymbol: string;
  collateralRequirement: string;
  disputeBond: string;
  minSponsorTokens: string;
  withdrawalLiveness: string;
  liquidationLiveness: string;
}

const initialValues: FormProps = {
  expirationTimestamp: "",
  syntheticName: "",
  syntheticSymbol: "",
  collateralRequirement: "",
  disputeBond: "",
  minSponsorTokens: "",
  withdrawalLiveness: "",
  liquidationLiveness: "",
};

export const CreateExpiringMultiParty = () => {
  const { signer, network } = Connection.useContainer();

  const {
    setSelectedCollateralToken,
    setSelectedPriceIdentifier,
    selectedPriceIdentifier,
    selectedCollateralToken,
    setEmpAddress,
    setTransactionHash,
  } = useGlobalState();
  const { getContractAddress } = useUMARegistry();
  const { getStepBefore, goStepBefore } = useStep();
  const [error, setError] = useState<string | undefined>(undefined);
  const [empHasBeenCreated, setEMPHasBeenCreated] = useState(false);

  const history = useHistory();

  const handleOnBackClick = () => {
    const stepBefore = getStepBefore();
    if (stepBefore) {
      goStepBefore();
      history.push(stepBefore.route);
    }
  };

  const handleSubmit = (values: FormProps, { setSubmitting }: any) => {
    setError(undefined);

    const deployEMPTx = async () => {
      if (signer !== null && network !== null) {
        const dateTimestamp = values.expirationTimestamp;
        const storeAddress = getContractAddress("Store");
        if (!storeAddress) {
          throw new Error("Invalid Store address");
        }
        const params: EMPParameters = {
          expirationTimestamp: parseInt(dateTimestamp, 10),
          collateralAddress: selectedCollateralToken?.address as string,
          priceFeedIdentifier: selectedPriceIdentifier,
          syntheticName: values.syntheticName,
          syntheticSymbol: values.syntheticSymbol,
          collateralRequirement: parseInt(values.collateralRequirement, 10),
          minSponsorTokens: parseInt(values.minSponsorTokens, 10),
          liquidationLiveness: parseInt(values.liquidationLiveness, 10),
          withdrawalLiveness: parseInt(values.withdrawalLiveness, 10),
          excessTokenBeneficiary: storeAddress, // UMA Store contract.
        };

        const result = await deployEMP(params, network, signer);
        if (result) {
          const { receipt, expiringMultiPartyAddress } = result;
          setEmpAddress(expiringMultiPartyAddress);
          setTransactionHash(receipt.transactionHash);
        }
      }
    };

    deployEMPTx()
      .then(() => {
        setEMPHasBeenCreated(true);
        setSubmitting(false);
        setSelectedCollateralToken(undefined);
        setSelectedPriceIdentifier(DEFAULT_SELECT_VALUE);
        history.push(`/${SUCCESS_ROUTE}`);
      })
      .catch((err) => {
        setError("Something unexpected happened. Please refresh and try again");
        setSubmitting(false);
      });
  };

  return (
    <Box>
      {/* {empHasBeenCreated === false && */}
      <React.Fragment>
        <StyledTitle variant="subtitle1">
          Create Expiring MultiParty
        </StyledTitle>

        <Formik
          initialValues={initialValues}
          validate={(values) => {
            const errors: FormikErrors<FormProps> = {};
            if (!values.expirationTimestamp) {
              errors.expirationTimestamp = "Required";
            }

            if (!values.syntheticName) {
              errors.syntheticName = "Required";
            }

            if (!values.syntheticSymbol) {
              errors.syntheticSymbol = "Required";
            }

            if (!values.collateralRequirement) {
              errors.collateralRequirement = "Required";
            } else if (parseInt(values.collateralRequirement, 10) < 100) {
              errors.collateralRequirement = "Value should be higher than 100";
            }

            if (!values.minSponsorTokens) {
              errors.minSponsorTokens = "Required";
            } else if (parseInt(values.minSponsorTokens, 10) < 0) {
              errors.minSponsorTokens = "Value cannot be negative";
            }

            if (!values.withdrawalLiveness) {
              errors.withdrawalLiveness = "Required";
            } else if (parseInt(values.withdrawalLiveness, 10) < 0) {
              errors.withdrawalLiveness = "Value cannot be negative";
            }

            if (!values.liquidationLiveness) {
              errors.liquidationLiveness = "Required";
            } else if (parseInt(values.liquidationLiveness, 10) < 0) {
              errors.liquidationLiveness = "Value cannot be negative";
            }

            return errors;
          }}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <FormItem
                customClass="custom"
                key="expirationTimestamp"
                label="Expiration timestamp"
                field="expirationTimestamp"
                labelWidth={3}
                placeHolder="Timestamp (seconds)"
                showhelp={true}
                isDate={true}
                helptext="Unix timestamp of when the contract will expire."
              />

              <FormItem
                key="syntheticName"
                label="Synthetic name"
                field="syntheticName"
                labelWidth={3}
                placeHolder="Synthetic Token"
              />

              <FormItem
                key="syntheticSymbol"
                label="Synthetic symbol"
                field="syntheticSymbol"
                labelWidth={3}
                placeHolder="SNT"
              />

              <FormItem
                key="collateralRequirement"
                label="Collateral requirement (%)"
                field="collateralRequirement"
                labelWidth={3}
                placeHolder="Percentage required (i.e. 125)"
                type="number"
              />

              <FormItem
                key="minSponsorTokens"
                label="Minimum sponsor tokens"
                field="minSponsorTokens"
                labelWidth={3}
                placeHolder="100"
                type="number"
                showhelp={true}
                helptext="Minimum number of tokens in a sponsor's position."
              />

              <FormItem
                key="withdrawalLiveness"
                label="Withdrawal liveness (in seconds)"
                field="withdrawalLiveness"
                labelWidth={3}
                placeHolder="7200"
                type="number"
                showhelp={true}
                helptext="Liveness delay, in seconds, for pending withdrawals."
              />

              <FormItem
                key="liquidationLiveness"
                label="Liquidation liveness (in seconds)"
                field="liquidationLiveness"
                labelWidth={3}
                placeHolder="7200"
                type="number"
                showhelp={true}
                helptext="Amount of time in seconds for pending liquidation before expiry."
              />

              {!empHasBeenCreated && (
                <div
                  style={{
                    display: "flex",
                    paddingRight: "2.5em",
                    marginTop: "1em",
                    marginBottom: "2em",
                  }}
                >
                  <Button
                    variant="danger"
                    type="submit"
                    size="sm"
                    disabled={isSubmitting}
                    isloading={isSubmitting}
                    loadingText="Creating..."
                    text="Create"
                  />
                  <StyledButton
                    style={{ color: "black" }}
                    variant="link"
                    onClick={handleOnBackClick}
                  >
                    Back
                  </StyledButton>
                </div>
              )}
            </Form>
          )}
        </Formik>

        <ErrorMessage show={error !== undefined}>{error}</ErrorMessage>
      </React.Fragment>
    </Box>
  );
};
