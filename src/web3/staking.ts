import web3 from "./configuration";
import { stakingContract } from "./configuration"

export const batchCall = async () => {
  const results = await web3.multicall.aggregate([
    {
      target: stakingContract.options.address!,
      callData: stakingContract.methods.totalStakedTokens().encodeABI()
    },
    {
      target: stakingContract.options.address!,
      callData: stakingContract.methods.globalRewardsPerStakedToken().encodeABI()
    },
    {
      target: stakingContract.options.address!,
      callData: stakingContract.methods.getEstimatedAPR().encodeABI()
    },
  ]).call();

  const [totalStaked, stakeRate, APY] = results.returnData;
  
  return {
    totalStaked: BigInt(totalStaked as any).toString(),
    stakeRate: BigInt(stakeRate as any).toString(),
    APY: BigInt(APY as any).toString(),
  }
}

export const totalStaked = async () => {
  const result = await stakingContract.methods.totalStakedTokens().call();
  return BigInt(result as any).toString();
}

export const stakeRate = async () => {
  const result = await stakingContract.methods.globalRewardsPerStakedToken().call();
  return BigInt(result as any).toString();
}

export const APY = async () => {
  const result = await stakingContract.methods.getEstimatedAPR().call();
  return BigInt(result as any).toString();
}