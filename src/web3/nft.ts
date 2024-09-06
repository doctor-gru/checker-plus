import { ControllerResponse } from "../types";
import { pinNFTContract, account } from "./configuration";

export const mintNFT = async (
  amount: number,
  tokenUri: string,
): Promise<ControllerResponse> => {
  const result = await pinNFTContract.methods
    .mint(BigInt(amount), tokenUri)
    .send({ from: account.address });
  if (result) {
    return {
      success: true,
      data: {
        txHash: result.transactionHash,
        nftId: result.events ? result.events.TransferSingle.returnValues.id : 0,
      },
    };
  }

  return {
    success: false,
  };
};

export const transferNFT = async (
  address: `0x${string}`,
  id: BigInt,
): Promise<ControllerResponse> => {
  if (address == account.address)
    return {
      success: false,
      error: "The destination address is same as minter",
    };

  const balance = await pinNFTContract.methods
    .balanceOf(account.address, id)
    .call({ from: account.address });
  await pinNFTContract.methods
    .setApprovalForAll(address, true)
    .send({ from: account.address });
  const result = await pinNFTContract.methods
    .safeTransferFrom(account.address, address, id, balance, "0x")
    .send({ from: account.address });
  if (result) {
    return {
      success: true,
      data: {
        txHash: result.transactionHash,
      },
    };
  }

  return {
    success: false,
  };
};
