export interface ControllerResponse {
  success: boolean;
  error?: string;
  data?: any;
}

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

export interface ILocation {
  city: string;
  country: string;
  region: string;
}

export interface ICpu {
  amount: number;
  price: number;
  type: string;
}

export interface IGpu {
  amount: number;
  price: number;
  type: string;
  vram: number;
}

export interface IRamOrStorage {
  amount: number;
  price: number;
}

export interface IMinMax {
  max: number;
  min: number;
}

export interface IRestriction {
  cpu: IMinMax,
  ram: IMinMax,
  storage: IMinMax,
}

export interface ISpecs {
  cpu: ICpu;
  gpu: IGpu[];
  ram: IRamOrStorage;
  storage: IRamOrStorage;
  restrictions: IRestriction[];
}

export interface IHost {
  hostId: string;
  provider: string;
  subindex: string;
  location: ILocation;
  specs: ISpecs;
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
  cpuUsage: number;
}