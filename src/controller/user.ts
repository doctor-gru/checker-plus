import * as validator from 'validator';
import User from '../models/User';
import { ControllerResponse, IUser } from '../types'

export const findUserByEmail = async (email: string): Promise<ControllerResponse> => {
  if (!validator.isEmail(email))
    return { success: false, error: 'Invalid email' };

  try {
    const user = await User.findOne({ email });
    if (!user) 
      return { success: false, error: 'User not found' };
    return { success: true, data: user };
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
}

export const findUserById = async (_id: string): Promise<ControllerResponse> => {
  try {
    const user = await User.findOne({ _id });
    if (!user) 
      return { success: false, error: 'User not found' };
    return { success: true, data: user };
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
}

export const findUserByGoogleId = async (profileId: string): Promise<ControllerResponse> => {
  try {
    const user = await User.findOne({ googleId: profileId });
    if (!user)
      return { success: false, error: 'User not found'};
    return { success: true, data: user };
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
}

export const registerUser = async (userInfo: IUser): Promise<ControllerResponse> => {
  if (userInfo.email === undefined || 
      userInfo.username === undefined ||
      !validator.isEmail(userInfo.email) || 
      validator.isEmpty(userInfo.username))
    return { success: false, error: 'Invalid email' };

  try {
    const user = await User.findOne({ email: userInfo.email });
    if (!user) {
      const newUser = await User.create(userInfo);
      if (!newUser)
        return { success: false, error: 'Error creating user' };
      return { success: true, data: newUser };
    }
    return { success: false, error: 'Already exists with that email' };
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
}