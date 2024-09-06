import * as validator from "validator";
import { ControllerResponse, IUser } from "../types";
import { isAddress } from "ethers";
import User from "../models/User";
import WalletUser from "../models/WalletUser";

export const findUserByEmail = async (
  email: string,
): Promise<ControllerResponse> => {
  if (!validator.isEmail(email))
    return { success: false, error: "Invalid email" };

  try {
    const user = await WalletUser.findOne({ email });
    if (!user) return { success: false, error: "User not found" };
    return { success: true, data: user };
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
};

export const findUserById = async (
  _id: string,
): Promise<ControllerResponse> => {
  try {
    const user = await WalletUser.findOne({ _id });
    if (!user) return { success: false, error: "User not found" };
    return { success: true, data: user };
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
};

export const findUserByGoogleId = async (
  profileId: string,
): Promise<ControllerResponse> => {
  try {
    const user = await WalletUser.findOne({ googleId: profileId });
    if (!user) return { success: false, error: "User not found" };
    return { success: true, data: user };
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
};

export const registerUserByEmail = async (
  userInfo: IUser,
): Promise<ControllerResponse> => {
  if (
    userInfo.email === undefined ||
    userInfo.username === undefined ||
    !validator.isEmail(userInfo.email) ||
    validator.isEmpty(userInfo.username)
  )
    return { success: false, error: "Invalid email" };

  try {
    const user = await WalletUser.findOne({ email: userInfo.email });
    if (!user) {
      const newUser = await WalletUser.create(userInfo);
      if (!newUser) return { success: false, error: "Error creating user" };
      return { success: true, data: newUser };
    }
    return { success: false, error: "Already exists with that email" };
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
};

export const registerUserByWallet = async (
  walletAddress: `0x${string}`,
): Promise<ControllerResponse> => {
  try {
    const existingUser = await WalletUser.findOne({ walletAddress });
    if (existingUser)
      return { success: false, error: "User Existed in Database" };

    if (!walletAddress || !isAddress(walletAddress)) {
      return { success: false, error: "Invalid Wallet Address" };
    }

    const newUser = new WalletUser({
      walletAddress,
      ownedDevices: [],
      portfolio: [],
      rentalHistory: [],
    });

    await newUser.save();

    return { success: true, data: newUser };
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
};

export const findUserByWallet = async (
  walletAddress: `0x${string}`,
): Promise<ControllerResponse> => {
  try {
    const user = await WalletUser.findOne({ walletAddress });
    if (!user) return { success: false, error: "User not found" };
    return { success: true, data: user };
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
};

export const getDailyNewUsers = async () => {
  try {
    const dailyData = await WalletUser.aggregate([
      {
        $project: {
          timestamp: {
            $toLong: "$createdAt" // Convert the date to milliseconds since epoch
          }
        }
      },
      {
        $project: {
          day: {
            $subtract: [
              { $toDate: { $subtract: ["$timestamp", { $mod: ["$timestamp", 86400000] }] } }, // Adjust to start of day
              new Date(0) // Subtract epoch start (1970-01-01)
            ]
          }
        }
      },
      {
        $project: {
          day: {
            $divide: ["$day", 86400000] // Convert milliseconds to days
          }
        }
      },
      {
        $group: {
          _id: "$day", // Group by the day in days
          count: { $sum: 1 } // Count the number of users per day
        }
      },
      {
        $sort: { _id: 1 } // Sort by day in ascending order
      },
      {
        $project: {
          _id: 0, // Exclude the default `_id` field
          day: { $multiply: ["$_id", 86400] }, // Convert days back to seconds
          count: {
            $toDouble: "$count" // Ensure count is treated as a number
          }
        }
      }
    ]);


    return { success: true, data: dailyData };
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
};