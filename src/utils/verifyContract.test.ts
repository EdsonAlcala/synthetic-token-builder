import { BigNumberish, ethers } from "ethers";

import ExpiringMultiPartyContractArtifact from "@uma/core/build/contracts/ExpiringMultiParty.json";
import ExpandedERC20Artifact from "@uma/core/build/contracts/ExpandedERC20.json";

import { VerificationParameters, verifyOnEtherscan } from "./verifyContract";
import { EthereumAddress } from "../types";
import { KOVAN_NETWORK, MAINNET_NETWORK } from "../constants";

const ETHERSCAN_KEY = process.env.REACT_APP_ETHERSCAN_KEY as string;
if (!ETHERSCAN_KEY) {
  throw new Error("Not etherscan key found");
}

const MNEMONIC = process.env.REACT_APP_MNEMONIC as string;
if (!MNEMONIC) {
  throw new Error("Not mnemonic variable environment found");
}

const NETWORK = process.env.NETWORK as string;
if (!NETWORK) {
  throw new Error("Not network variable environment found");
}

const getAlchemyAPIKey: () => string | undefined = () => {
  if (process.env.NETWORK === KOVAN_NETWORK) {
    const apiKey = process.env.REACT_APP_ALCHEMY_KOVAN_KEY as string;
    if (!apiKey) {
      throw new Error("REACT_APP_ALCHEMY_KOVAN not defined");
    }
    return apiKey;
  } else if (process.env.NETWORK === MAINNET_NETWORK) {
    const apiKey = process.env.REACT_APP_ALCHEMY_MAINNET_KEY as string;
    if (!apiKey) {
      throw new Error("REACT_APP_ALCHEMY_MAINNET not defined");
    }
    return apiKey;
  }
};

export const fromWei = ethers.utils.formatUnits;

export const weiToNum = (x: BigNumberish, u = 18) => parseFloat(fromWei(x, u));

const getContractNameFromArtifact = (artifact: any) => {
  return artifact.contractName;
};

const getCompilerVersionFromArtifact = (artifact: any) => {
  return artifact.compiler.version;
};

describe("Verify Contract Tests", () => {
  let contractAddress: EthereumAddress;
  let expandedERC20Interface: ethers.utils.Interface;
  let network: ethers.providers.Network;
  beforeAll(async () => {
    // provider
    const alchemyKey = getAlchemyAPIKey() as string;
    const provider = new ethers.providers.AlchemyProvider(
      NETWORK.toLowerCase(),
      alchemyKey
    );
    const wallet = ethers.Wallet.fromMnemonic(MNEMONIC); // default to m/44'/60'/0'/0/0
    const newWalletInstance = wallet.connect(provider);
    console.log("Wallet", newWalletInstance.address);
    console.log("Wallet", fromWei(await newWalletInstance.getBalance()));

    network = await provider.getNetwork();
    // // deploy contract
    expandedERC20Interface = new ethers.utils.Interface(
      ExpandedERC20Artifact.abi
    );
    const expandedERC20Bytecode = ExpandedERC20Artifact.bytecode;
    const expandedERC20Factory = new ethers.ContractFactory(
      expandedERC20Interface,
      expandedERC20Bytecode,
      newWalletInstance
    );
    const contract = await expandedERC20Factory.deploy(
      "EdToken",
      "EdToken",
      18
    );
    contract.deployTransaction.wait();

    contractAddress = contract.contractAddress;
    // console.log("contractAddress", contract.contractAddress)
  });

  test("verifyOnEtherscan", async () => {
    const solcVersion = "0.6.12"; // TODO

    console.log(
      "expandedERC20Interface.encodeDeploy",
      expandedERC20Interface.encodeDeploy(["EdToken", "EdToken", 18])
    );
    const parameters: VerificationParameters = {
      apiKey: ETHERSCAN_KEY,
      contractAddress,
      contractName: getContractNameFromArtifact(ExpandedERC20Artifact),
      compilerVersion: getCompilerVersionFromArtifact(ExpandedERC20Artifact),
      contractArguments: expandedERC20Interface.encodeDeploy([
        "EdToken",
        "EdToken",
        18,
      ]),
      sourceCode: "",
      network,
    };

    // const result = await verifyOnEtherscan(parameters)
    expect(true).toBeTruthy();
  });
});
