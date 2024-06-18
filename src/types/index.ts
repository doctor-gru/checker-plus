
export interface IUser {
  username: string;
  email: string;
  googleId: string;
  passwordHash?: string;
  apiKeys: string[];
};

export interface IApiKey {
  key: string;
  registeredUser: string;
  expiredIn: Date;
}

export interface IHost {
  model: string;
  costPerHour: number;
  provider: string;
  deviceType: string;
  index?: string;
}

export interface IRentInstance {
  uuid: string;
  model: string;
  driverVersion: string;
  vBiosVersion: string;
  metrics: IMetrics[];
}

export interface IMetrics {
  timestamp: number;
  gpuUtil: number;
  powerDraw: number;
  fanSpeed: number;
  temperature: number;
  gpuClock: number;
  memClock: number;
  memAlloc: number;
  memUtil: number;
  videoClock: number;
  smClock: number;
}
export interface ControllerResponse {
  success: boolean;
  error?: string;
  data?: any;
}