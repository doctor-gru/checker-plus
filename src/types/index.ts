
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

export interface ControllerResponse {
  success: boolean;
  error?: string;
  data?: any;
}