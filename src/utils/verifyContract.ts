import { ethers } from "ethers"
import { EthereumAddress } from "../types"

export interface VerificationParameters {
    apiKey: string
    contractAddress: EthereumAddress
    contractArguments: {}
    contractName: string
    compilerVersion: string
    // optimizationEnabled: boolean
    // optimizerRuns: number
    sourceCode: string
    network: ethers.providers.Network
}

export const getEtherScanApi = (network: ethers.providers.Network) => {
    return network.name.toLowerCase() === "mainnet"
        ? `https://api.etherscan.io/api`
        : `https://api-${network}.etherscan.io/api`
}

export const verifyOnEtherscan = async (params: VerificationParameters) => {

    const {
        apiKey,
        contractAddress,
        contractArguments,
        contractName,
        compilerVersion,
        // optimizationEnabled,
        // optimizerRuns,
        sourceCode,
        network
    } = params
    const etherscanApi = getEtherScanApi(network)

    const data: { [key: string]: string | any } = {
        apikey: apiKey, // A valid API-Key is required
        module: "contract", // Do not change
        action: "verifysourcecode", // Do not change
        contractaddress: contractAddress, // Contract Address starts with 0x...
        sourceCode: sourceCode,
        contractname: contractName,
        compilerversion: compilerVersion, // see http://etherscan.io/solcversions for list of support versions
        // optimizationUsed: optimizationEnabled
        //     ? 1
        //     : 0, // 0 = Optimization used, 1 = No Optimization
        // runs: optimizerRuns, // set to 200 as default unless otherwise
        constructorArguements: contractArguments, // if applicable
        codeformat: "solidity-standard-json-input"
    }

    const body = new FormData()
    Object.keys(data).forEach((key) => body.append(key, data[key]))

    const response = await fetch(etherscanApi, { method: "POST", body })
    const { message, result, status } = await response.json()

    console.log("Message", message)
    console.log("Status", status)

    if (message === "OK" && status === "1") {
        let receiptStatus;
        try {
            receiptStatus = await getReceiptStatus(
                result,
                apiKey,
                etherscanApi
            )
            console.log("guid", result)
            console.log("status", receiptStatus)
        } catch (error) {
            return {
                receiptGuid: result
            }
        }

        console.log("guid", result)
        console.log("status", receiptStatus)

        return {
            receiptGuid: result,
            status: receiptStatus
        }
    }

    if (message === "NOTOK") {
        throw new Error("Couldn't verify the contract, Please try again")
    }

}

export const getReceiptStatus = async (
    receiptGuid: string,
    apiKey: string,
    etherscanApi: string
) => {
    const params = `guid=${receiptGuid}&module=contract&action=checkverifystatus&apiKey=${apiKey}`
    try {
        const response = await fetch(`${etherscanApi}?${params}`, {
            method: "GET",
        })
        const { result } = await response.json()
        return result
    } catch (error) {
        console.log("Error", error)
    }
}

interface VerificationResult {
    receiptGuid: string,
    status: string | undefined
}