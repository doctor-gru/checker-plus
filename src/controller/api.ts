import User from '../models/User';
import ApiKey from '../models/ApiKey';
import Host from '../models/Host';
import generateApiKey from 'generate-api-key';
import { ControllerResponse } from '../types'
import { IHost } from '../types';

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

export const availableHosts = async (): Promise<ControllerResponse> => {
  try {
    const user = await Host.find({});
    if (!user || user.length == 0) 
      return { success: false, error: 'Hosts not found' };
    return { success: true, data: user };
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
}

export const removeHosts = async (userIds: string[]): Promise<ControllerResponse> => {
  try {
    const data = await Host.deleteMany({ _id: { $in: userIds }});
    if (data.acknowledged == false)
      return { success: false, error: 'Deletion failed' };
    return { success: true, data: `Deleted ${data.deletedCount} hosts`};
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
}

export const insertHosts = async (hosts: IHost[]): Promise<ControllerResponse> => {
  try {
    const data = await Host.insertMany(hosts, { ordered: false });
    if (hosts.length == data.length)
      return { success: true, data: `Inserted ${hosts.length} hosts`};
    return { success: false, error: `Inserted ${data.length} out of ${hosts.length} hosts`}
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
}

export const updateHost = async (_id: string, updatedHost: IHost): Promise<ControllerResponse> => {
  try {
    const host = await Host.findOne({ _id });
    if (!host) 
      return { success: false, error: 'User not found' };
    const updated = await Host.updateOne({ _id }, { $set: updatedHost });
    return { success: true, data: updated };
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
}