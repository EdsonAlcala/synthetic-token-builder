import { Box, makeStyles, styled, Typography } from "@material-ui/core"
import React from "react"
import { Form, Button as BootstrapButton, Row, Col } from "react-bootstrap"
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import { useGlobalState } from "../hooks"

const StyledTitle = styled(Typography)({
    paddingTop: 0
})

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));


export const SelectCollateralToken = () => {
    const { collateralTokens, selectedCollateralToken, setSelectedCollateralToken } = useGlobalState()
    const classes = useStyles();

    const handleSelectChange = (e: any) => {
        const selectedToken = collateralTokens.find((s) => s.address === e.target.value)
        if (selectedToken) {
            setSelectedCollateralToken(selectedToken)
        }
    }

    // const handleOnNextClick = () => {
    //     const nextStep = getNextStep()
    //     if (nextStep) {
    //         goNextStep()
    //         console.log("nextStep.route", nextStep.route)
    //         history.push(nextStep.route)
    //     }
    // }

    return (
        <Box>
            <StyledTitle variant="subtitle1">Select collateral token</StyledTitle>
            <Typography variant="subtitle2">
                This is the token that will serve as collateral for the synthethic token.
            </Typography>

            {/* <Form>
                <Row>
                    <Col md={10}>
                        <Form.Control
                            as="select"
                            disabled={collateralTokens.length === 0}
                            onChange={handleSelectChange}
                            value={selectedCollateralToken?.address || "0"}>
                            {collateralTokens.length === 0 && <option>No collateral tokens</option>}
                            <option value="0">Select an option</option>
                            {collateralTokens.length > 0 &&
                                collateralTokens.map((item, index) => {
                                    return (
                                        <option key={index} value={item.address}>
                                            {item.name}
                                        </option>
                                    )
                                })}
                        </Form.Control>
                    </Col>
                </Row> */}

            <FormControl>
                <InputLabel id="demo-simple-select-label">Age</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={selectedCollateralToken}
                    onChange={handleSelectChange}>
                    <MenuItem value={10}>Ten</MenuItem>
                    <MenuItem value={20}>Twenty</MenuItem>
                    <MenuItem value={30}>Thirty</MenuItem>
                </Select>
            </FormControl>
            {/* <div style={{ marginTop: "1em" }}>
                    <StyledButton
                        disabled={selectedCollateralToken === undefined}
                        variant="success"
                        onClick={handleOnNextClick}>
                        Next
                    </StyledButton>
                </div> */}
            {/* </Form> */}
        </Box >
    )
}

// export const StyledButton = styled(BootstrapButton)`
//   padding-left: 1.5em;
//   padding-right: 1.5em;
//   padding-top: 6px;
//   padding-bottom: 6px;
// `