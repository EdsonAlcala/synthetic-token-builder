import { BigNumber, ethers } from "ethers";

export type Web3Provider = ethers.providers.Web3Provider;

export type Signer = ethers.Signer;

export type Block = ethers.providers.Block;

export interface Token {
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: BigNumber;
  address?: string;
}
