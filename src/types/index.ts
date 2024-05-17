
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
}
export interface ControllerResponse {
  success: boolean;
  error?: string;
  data?: any;
}