import mongoose, { Document, ObjectId } from "mongoose";
import { IApiKey } from "../types";

const Schema = mongoose.Schema;

export type ApiKeyDocument = Document & IApiKey;

const apiKeySchema = new Schema<ApiKeyDocument>({
  key: {
    type: String,
    required: true,
  },
  registeredUser: Schema.Types.ObjectId,
  expiredIn: Date,
});

const ApiKey = mongoose.model<ApiKeyDocument>("ApiKey", apiKeySchema);

export default ApiKey;
