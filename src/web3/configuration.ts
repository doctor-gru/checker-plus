import { Web3 } from "web3";
import { MulticallPlugin } from "@rudra-xyz/web3-plugin-multicall";
import { PinNFT, PinStaking, PinToken } from "./abi";
import { MANAGER_PRIVATE_KEY } from "../utils/secrets";

const web3 = new Web3("https://rpc.sepolia.org");

const multicallAddress = "0x25Eef291876194AeFAd0D60Dff89e268b90754Bb";
export const stakingContractAddress = "0x164f2D94555443e0e2C4C1738b970cc7f7010fA7";
export const pinTokenAddress = "0xf2EF2BbD3C52e6453dA5ca7BA67189AAf05cBe07";
export const pinNFTAddress = "0x18781b2D15d354aaC168f812A16B9B5643174a83";

const multicallPlugin = new MulticallPlugin({contractAddress: multicallAddress});
web3.registerPlugin(multicallPlugin);

export const account = web3.eth.accounts.privateKeyToAccount(MANAGER_PRIVATE_KEY);
web3.eth.accounts.wallet.add(account);
web3.eth.defaultAccount = account.address;


export const stakingContract = new web3.eth.Contract(PinStaking, stakingContractAddress);
export const pinTokenContract = new web3.eth.Contract(PinToken, pinTokenAddress);
export const pinNFTContract = new web3.eth.Contract(PinNFT, pinNFTAddress);

export default web3;