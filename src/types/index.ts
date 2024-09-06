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
}

export interface IApiKey {
  key: string;
  registeredUser: string;
  expiredIn: Date;
}

export interface IStaking {
  timestamp: number;
  marketCap: string;
  TVL: string;
  totalStaked: string;
  stakeRate: string;
  APY: string;
  ethPrice: string;
  pinPrice: string;
}

export interface ILocation {
  city: string;
  country: string;
  region: string;
}

export interface ICpu {
  amount: number;
  price: string;
  type: string;
}

export interface IGpu {
  amount: number;
  price: string;
  type: string;
  vram: number;
}

export interface IRamOrStorage {
  amount: number;
  price: string;
}

export interface IMinMax {
  max: number;
  min: number;
}

export interface IRestriction {
  cpu: IMinMax;
  ram: IMinMax;
  storage: IMinMax;
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
  assignedUser: string;
  lastRent: Date;
  ssh: string;
}

export interface IHostPerformance {
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

export interface INft {
  nftId: string;
  nftName: string;
  nftOwner: string;
  nftPrice: number;
  nftImage: string;
  nftDescription: string;
}
export interface INftTransaction extends INft {
  expiryDate: Date;
}

export interface IWalletUser {
  walletAddress: `0x${string}`;
  ownedDevices: INft[];
  portfolio: INft[];
  rentalHistory: INftTransaction[];
  apiKeys: string[];
}
