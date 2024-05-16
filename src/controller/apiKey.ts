import User from "../models/User";
import ApiKey from "../models/ApiKey";
import generateApiKey from "generate-api-key";
import { ControllerResponse, IApiKey } from "../types"

export const findApiKey = async (key: string): Promise<ControllerResponse> => {
  try {
    const apiKey = await ApiKey.findOne({ key });
    if (!apiKey) 
      return { success: false, error: 'Invalid key' };
    return { success: true, data: apiKey };
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
}

export const registerApiKey = async (_userId: string): Promise<ControllerResponse> => {
  try {
    const user = await User.findOne({ _id: _userId });
    if (!user)
      return { success: false, error: 'User not found' };
    if (user.apiKeys.length >= 3)
      return { success: false, error: 'Already reached maximum limit' };
    
    const newApiKey = await ApiKey.create({
      key: generateApiKey({ 
        method: 'string', 
        pool: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890',
        length: 40, 
        prefix: 'PINLINK' 
      }),
      registeredUser: _userId,
      expiredIn: new Date(Date.now().valueOf() + 1000 * 60 * 60 * 24 * 30),
    })

    if (!newApiKey)
      return { success: false, error: 'Error creating API key' };
    
    await User.updateOne({
      _id: _userId 
    }, {
      $set: {
        apiKeys: [...user.apiKeys, newApiKey._id],
      }
    });

    return { success: true, data: newApiKey };
  } catch (e) {
    return { success: false, error: (e as Error).message};
  }
}

export const allApiKeys = async (_userId: string): Promise<ControllerResponse> => {
  try {
    const user = await User.findOne({ _id: _userId });
    if (!user)
      return { success: false, error: 'User not found' };
    
    const apiKeys = await ApiKey.find({ _id: { $in: user.apiKeys }});
    return { success: true, data: apiKeys };
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
}