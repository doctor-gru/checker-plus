import mongoose, { Document } from "mongoose";
import bcrypt from "bcryptjs";
import { IUser } from "../types";

const Schema = mongoose.Schema;

export type UserDocument = Document & IUser;

const userSchema = new Schema<UserDocument>({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  passwordHash: String,
  googleId: String,
  apiKeys: [Schema.Types.ObjectId]
});

userSchema.methods = {
  authenticate: function (password) {
    if (this.googleId.length || this.passwordHash === undefined)
      return false;

    return bcrypt.compareSync(password, this.passwordHash);
  },
  encryptPassword: function (password) {
    if (!password) return '';
    try {
      return bcrypt.hashSync(password, 10);
    } catch (err) {
      return '';
    }
  },
}

const User = mongoose.model<UserDocument>("User", userSchema);

export default User;
