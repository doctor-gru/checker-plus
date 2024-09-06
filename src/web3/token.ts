import web3 from "./configuration";
import { pinTokenContract } from "./configuration";

export const batchCall = async () => {
  const results = await web3.multicall
    .aggregate([
      {
        target: pinTokenContract.options.address!,
        callData: pinTokenContract.methods.totalSupply().encodeABI(),
      },
    ])
    .call();

  const [marketCap] = results.returnData;

  return {
    marketCap: BigInt(marketCap as any).toString(),
  };
};

export const getTVL = async () => {};

export const marketCap = async () => {
  const result = await pinTokenContract.methods.totalSupply().call();
  return BigInt(result as any).toString();
};
