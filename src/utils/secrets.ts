import dotenv from 'dotenv';
import fs from 'fs';
import { logger } from './logger';

if (fs.existsSync('.env')) {
  dotenv.config({ path: '.env' });
} else {
  logger.error('.env file not found.');
}

export const ENVIRONMENT = process.env.NODE_ENV;
const prod = ENVIRONMENT === 'production';

export const PORT = (process.env.PORT || 3000) as number;

export const MONGO_URI = prod
  ? (process.env.MONGO_PROD as string)
  : (process.env.MONGO_LOCAL as string);

if (!MONGO_URI) {
  if (prod) {
    logger.error('No mongo connection string. Set MONGO_PROD environment variable.');
  } else {
    logger.error('No mongo connection string. Set MONGO_LOCAL environment variable.');
  }
  process.exit(1);
}

export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID as string;
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET as string;

export const COOKIE_KEY = process.env.COOKIE_KEY as string;

export const FETCH_INTERVAL = (process.env.FETCH_INTERVAL || 10000) as number;

export const TENSORDOCK_APIKEY = (process.env.TENSORDOCK_APIKEY || '') as string;
export const TENSORDOCK_APITOKEN = (process.env.TENSORDOCK_APITOKEN || '') as string

export const VASTAI_APIKEY = (process.env.VASTAI_APIKEY || '') as string;

export const PAPERSPACE_APIKEY = (process.env.PAPERSPACE_APIKEY || '') as string;
export const PAPERSPACE_EMAIL = (process.env.PAPERSPACE_EMAIL || '') as string;
export const PAPERSPACE_PWD = (process.env.PAPERSPACE_PWD || '') as string;
export const PAPERSPACE_TEAMID = (process.env.PAPERSPACE_TEAMID || '') as string;
export const PAPERSPACE_REQUEST_VALIDATE_KEY = (process.env.PAPERSPACE_REQUEST_VALIDATE_KEY || '') as string;

export const LAMBDA_APIKEY = (process.env.LAMBDA_APIKEY || '') as string;

export const MANAGER_PRIVATE_KEY = (process.env.MANAGER_PRIVATE_KEY || '') as string;