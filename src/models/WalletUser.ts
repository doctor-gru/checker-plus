import mongoose, { Document } from 'mongoose';
import { IWalletUser,INft,INftTransaction } from '../types';

const Schema = mongoose.Schema;

const NftSchema = new Schema<INft>({
  nftId: { type: String, required: true },
  nftName: { type: String, required: true },
  nftOwner: { type: String, required: true },
  nftPrice: { type: Number, required: true },
  nftImage: { type: String, required: true },
  nftDescription: { type: String, required: true },
});

const NftTransactionSchema = new Schema<INftTransaction>({
  nftId: { type: String, required: true },
  nftName: { type: String, required: true },
  nftOwner: { type: String, required: true },
  nftPrice: { type: Number, required: true },
  nftImage: { type: String, required: true },
  nftDescription: { type: String, required: true },
  expiryDate: { type: Date, required: true },
});

export type WalletUserDocument = Document & IWalletUser;

const walletUserSchema = new Schema<WalletUserDocument>({
  walletAddress: {
    type: String,
    required: true,
    match: /^0x[a-fA-F0-9]{40}$/, // Ensuring the wallet address is in the correct format
  },
  ownedDevices: {
    type: [NftSchema],
    required: true,
  },
  portfolio: {
    type: [NftSchema],
    required: true,
  },
  rentalHistory: {
    type: [NftTransactionSchema],
    required: true,
  },
});

const WalletUser = mongoose.model<WalletUserDocument>('WalletUser', walletUserSchema);

export default WalletUser;
