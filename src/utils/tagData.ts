import { ethers } from "ethers";
import ExpiringMultiPartyArtifact from '@uma/core/build/contracts/ExpiringMultiParty.json'
import { parseFixed } from '@ethersproject/bignumber'

import { EthereumAddress } from '../types'

const TAG: EthereumAddress = "0xAC716460A84B85d774bEa75666ddf0088b024741"

export const encodeCreateFunction = (collateralToSend: number, tokensToCreate: number, collateralDecimals: number, tokenDecimals: number) => {
    const emp = new ethers.utils.Interface(ExpiringMultiPartyArtifact.abi);
    return emp.encodeFunctionData("create", [
        { rawValue: parseFixed(`${collateralToSend}`, collateralDecimals) },
        { rawValue: parseFixed(`${tokensToCreate}`, tokenDecimals) }
    ]);
}

// This takes encoded data field and just appends the tag, tag must be valid hex
export const getTaggedData = (collateralToSend: number, tokensToCreate: number, collateralDecimals: number, tokenDecimals: number) => {
    const encodedCreateFunctionData = encodeCreateFunction(collateralToSend, tokensToCreate, collateralDecimals, tokenDecimals);
    return ethers.utils.hexConcat([encodedCreateFunctionData, TAG]);
}

export const makeTransaction = (from: EthereumAddress, empAddress: EthereumAddress, data: string) => {
    return {
        from,
        to: empAddress,
        data
    };
}