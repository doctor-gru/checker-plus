import mongoose, { Document } from "mongoose";
import { IHost } from "../types";

const Schema = mongoose.Schema;

export type HostDocument = Document & IHost;

const hostSchema = new Schema<HostDocument>({
  model: {
    type: String,
    required: true,
  },
  costPerHour: {
    type: Number,
    required: true,
  },
  provider: {
    type: String,
    required: true,
  },
  deviceType: {
    type: String,
    required: true,
  },
  index: {
    type: String,
    required: true,
    default: "Unavailable",
  }
});

const Host = mongoose.model<HostDocument>("Host", hostSchema);

export default Host;
