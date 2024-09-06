import mongoose, { Document } from "mongoose";
import { IStaking } from "../types";

const Schema = mongoose.Schema;

export type StakingDocument = Document & IStaking;

const stakingSchema = new Schema<StakingDocument>({
  timestamp: {
    type: Number,
    required: true,
  },
  marketCap: {
    type: String,
    required: true,
  },
  TVL: {
    type: String,
    required: true,
  },
  totalStaked: {
    type: String,
    required: true,
  },
  stakeRate: {
    type: String,
    required: true,
  },
  APY: {
    type: String,
    required: true,
  },
  ethPrice: {
    type: String,
    required: true,
  },
  pinPrice: {
    type: String,
    required: true,
  },
});

const Staking = mongoose.model<StakingDocument>("Staking", stakingSchema);

export default Staking;
