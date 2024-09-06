import WalletUser from "../models/WalletUser";
import ApiKey from "../models/ApiKey";
import Host from "../models/Host";

import generateApiKey from "generate-api-key";
import { ControllerResponse } from "../types";
import { IHostPerformance, IHost } from "../types";
import {
  fetchTensordockMetrics,
  fetchVastAIMetrics,
  fetchPaperspaceMetrics,
} from "../utils/metrics";
import HostPerformance from "../models/HostPerformance";

export const findApiKey = async (key: string): Promise<ControllerResponse> => {
  try {
    const apiKey = await ApiKey.findOne({ key });
    if (!apiKey) return { success: false, error: "Invalid key" };
    return { success: true, data: apiKey };
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
};

export const registerApiKey = async (_userId: string): Promise<ControllerResponse> => {
  try {
    const user = await WalletUser.findOne({ _id: _userId });
    if (!user)
      return { success: false, error: 'User not found' };
    if (user.apiKeys.length >= 3)
      return { success: false, error: 'Already reached maximum limit' };

    const newApiKey = await ApiKey.create({
      key: generateApiKey({
        method: "string",
        pool: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890",
        length: 40,
        prefix: "PINLINK",
      }),
    });

    if (!newApiKey) return { success: false, error: "Error creating API key" };

    await WalletUser.updateOne({
      _id: _userId
    }, {
      $set: {
        apiKeys: [...user.apiKeys, newApiKey._id],
      }
    });

    return { success: true, data: newApiKey };
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
};

export const allApiKeys = async (
  _userId: string,
): Promise<ControllerResponse> => {
  try {
    const user = await WalletUser.findOne({ _id: _userId });
    if (!user) return { success: false, error: "User not found" };

    const apiKeys = await ApiKey.find({ _id: { $in: user.apiKeys } });
    return { success: true, data: apiKeys };
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
};

export const availableHosts = async (): Promise<ControllerResponse> => {
  try {
    const hosts = await Host.find({ lastRent: null }, { lastRent: 0, ssh: 0, assignedUser: 0 });
    if (!hosts || hosts.length == 0)
      return { success: false, error: "Hosts not found" };
    return { success: true, data: hosts };
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
};

export const availableHost = async (
  hostId: string,
): Promise<ControllerResponse> => {
  try {
    const host = await Host.findOne({ hostId: hostId, lastRent: null }, { lastRent: 0, ssh: 0, assignedUser: 0 });
    if (!host) return { success: false, error: "The target host not found" };
    return { success: true, data: host };
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
};

export const rentHost = async (
  walletAddress: `0x${string}`,
  hostId: string,
): Promise<ControllerResponse> => {
  try {
    const user = await WalletUser.findOne({ walletAddress });
    const host = await Host.findOne({ hostId: hostId }, { ssh: 0 });
    if (!user) return { success: false, error: "User not found" };
    if (!host) return { success: false, error: "Host not found" };
    if (host.assignedUser) return { success: false, error: "Host is already assigned by another user" };

    host.assignedUser = user._id;
    host.lastRent = new Date();
    host.save();

    return { success: true, data: { user, host } };
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
};

export const rentedHosts = async (
  walletAddress: `0x${string}`,
): Promise<ControllerResponse> => {
  try {
    const user = await WalletUser.findOne({ walletAddress });
    if (!user) return { success: false, error: "User not found" };

    const hosts = await Host.find({ assignedUser: user._id }, { assignedUser: 0 });
    if (!hosts || hosts.length == 0)
      return { success: false, error: "Rented Hosts not found" };

    return { success: true, data: hosts };
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
};

export const rentedHostsById = async (
  walletAddress: `0x${string}`,
  hostId: string,
): Promise<ControllerResponse> => {
  try {
    const user = await WalletUser.findOne({ walletAddress });
    if (!user) return { success: false, error: "User not found" };

    const host = await Host.findOne({ assignedUser: user._id, hostId }, { assignedUser: 0 });
    if (!host)
      return { success: false, error: "The target host not found" };

    return { success: true, data: host };
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
}

export const availableRentInstances = async (): Promise<ControllerResponse> => {
  try {
    const instances = await HostPerformance.find({});
    if (!instances || instances.length == 0)
      return { success: false, error: "Rented Hosts not found" };
    return { success: true, data: instances };
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
};

export const availableRentInstance = async (
  uuid: string,
): Promise<ControllerResponse> => {
  try {
    const instance = await HostPerformance.findOne({ uuid: uuid });
    if (!instance)
      return { success: false, error: "The target host not found" };
    return { success: true, data: instance };
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
};

export const removeHosts = async (
  userIds: string[],
): Promise<ControllerResponse> => {
  try {
    const data = await Host.deleteMany({ _id: { $in: userIds } });
    if (data.acknowledged == false)
      return { success: false, error: "Deletion failed" };
    return { success: true, data: `Deleted ${data.deletedCount} hosts` };
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
};

export const insertHosts = async (
  hosts: IHost[],
): Promise<ControllerResponse> => {
  try {
    const data = await Host.insertMany(hosts, { ordered: false });
    if (hosts.length == data.length)
      return { success: true, data: `Inserted ${hosts.length} hosts` };
    return {
      success: false,
      error: `Inserted ${data.length} out of ${hosts.length} hosts`,
    };
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
};

export const updateHost = async (
  _id: string,
  updatedHost: IHost,
): Promise<ControllerResponse> => {
  try {
    const host = await Host.findOne({ _id });
    if (!host) return { success: false, error: "User not found" };
    const updated = await Host.updateOne({ _id }, { $set: updatedHost });
    return { success: true, data: updated };
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
};

export const updateMetrics = async (): Promise<ControllerResponse> => {
  try {
    const tensordock: IHostPerformance[] = await fetchTensordockMetrics();
    const vastai: IHostPerformance[] = await fetchVastAIMetrics();
    const paperspace: IHostPerformance[] = await fetchPaperspaceMetrics();

    const rentInstances = tensordock.concat(vastai).concat(paperspace);

    for (let i = 0; i < rentInstances.length; i++) {
      const eachInstance = rentInstances[i];
      const existingDocument = await HostPerformance.findOne({
        uuid: eachInstance.uuid,
      });

      if (existingDocument) {
        const metrics = existingDocument.metrics;
        metrics.push(eachInstance.metrics[eachInstance.metrics.length - 1]);
        if (metrics.length > 1440)
          metrics.splice(existingDocument.metrics.length - 1440);
        await HostPerformance.updateOne(
          { uuid: eachInstance.uuid },
          { $set: { metrics: metrics } },
        );
      } else {
        const newInstance = await HostPerformance.create(eachInstance);
        if (!newInstance)
          return { success: false, error: "Error register new instance" };
      }
    }
    return { success: true };
  } catch (e) {
    return {
      success: false,
      error: (e as Error).message,
    };
  }
};
