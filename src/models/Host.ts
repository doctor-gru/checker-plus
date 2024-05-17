import mongoose, { Document } from "mongoose";
import { IHost } from "../types";

const Schema = mongoose.Schema;

export type HostDocument = Document & IHost;

const hostSchema = new Schema<HostDocument>({
  modal: {
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
  }
});

const Host = mongoose.model<HostDocument>("Host", hostSchema);

export default Host;
