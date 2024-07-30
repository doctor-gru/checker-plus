import { ControllerResponse } from "../types";
import { IStaking } from "../types";
import { batchCallStaking, batchCallToken } from "../web3";
import { mintNFT as _mintNFT, transferNFT } from "../web3/nft";
import Staking from "../models/Staking";

export const storeStakingInformation = async (): Promise<ControllerResponse> => {
  try {
    const staking = await batchCallStaking();
    const token = await batchCallToken();
    const currentDate = new Date();

    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?' + 'ids=ethereum&vs_currencies=usd');

    if (!response.ok) {
      throw new Error(`Fetch Eth Price Failed ${response.status}`);
    }

    const data = await response.json();
    const etherPrice = data.ethereum.usd;
    
    const stakingInformation: IStaking = {
      timestamp: currentDate.getTime(),
      marketCap: token.marketCap,
      TVL: "0",
      totalStaked: staking.totalStaked,
      stakeRate: staking.stakeRate,
      APY: staking.APY,
      ethPrice: String(etherPrice),
      pinPrice: "0",
    }

    await Staking.create(stakingInformation);

    return { success: true };
  } catch (e) {
    return {
      success: false,
      error: (e as Error).message,
    }
  }
};

export const getStakingInformation = async (records: number): Promise<ControllerResponse> => {
  try {
    const stakingInformation = await Staking.find({}).sort({
      timestamp: 1,
    }).limit(
      records
    );
    return {
      success: true,
      data: stakingInformation.reverse(),
    };
  } catch (e) {
    return {
      success: false,
      error: (e as Error).message,
    }
  }
}

export const mintNFT = async (address: `0x${string}`): Promise<ControllerResponse> => {
  try {
    const mintResult = await _mintNFT();
    if (mintResult.success == true) {
      const transferResult = await transferNFT(address, mintResult.data.nftId);
      return transferResult;
    }
    return mintResult; 
  } catch (e) {
    return {
      success: false,
      error: (e as Error).message,
    }
  }
}