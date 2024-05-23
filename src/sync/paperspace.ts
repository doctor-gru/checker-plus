import { IHost } from '../types';
import { getCurrentTimeHr } from '../utils/time';
import { logger } from '../utils/logger';
import { PAPERSPACE_EMAIL, PAPERSPACE_PWD, PAPERSPACE_REQUEST_VALIDATE_KEY } from '../utils/secrets';
import { appCache } from '../utils/cache';

const _authenticate = async (): Promise<any> => {
  const currentDate = new Date();

  const credential = {
    email: PAPERSPACE_EMAIL,
    password: PAPERSPACE_PWD,
    PS_REQUEST_VALIDATION_KEY: PAPERSPACE_REQUEST_VALIDATE_KEY,
  }

  try {
    const response = await fetch('https://api.paperspace.io/users/login?include=user', {
      method: 'POST',
      body: JSON.stringify(credential),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    if (response.status != 200) {
      logger.error(`SYNC [${currentDate.toUTCString()}] LOGIN FAILED WITH INVALID CREDENTIALS`);
      return {
        success: false,
        error: 'Invalid credentials'
      }
    }
    
    let authenticateToken = '';
    let teamNamespace = '';
    let ttl = 0;

    authenticateToken = data.id;
    ttl = Number(data.ttl);
    if (data.user.userTeam.length > 0)
      teamNamespace = data.user.userTeam[0].handle;
    else {
      logger.error(`SYNC [${currentDate.toUTCString()}] FAILURE PARSING RESPOSE`);
      return {
        success: false,
        error: 'Invalid response'
      };
    }

    logger.info(`SYNC [${currentDate.toUTCString()}] REFRESHED PAPERSPACE AUTHENTICATE TOKEN`);

    appCache.mset([
      { key: "authToken", val: authenticateToken, ttl: ttl },
      { key: "teamNamespace", val: teamNamespace, ttl: ttl },
    ])
    return { success: true };
  } catch (err) {
    logger.error(`SYNC [${currentDate.toUTCString()}] FAILURE DURING REQUEST`);
    return {
      success: false,
      error: 'Request failed'
    };
  }
}

export const _fetch = (): Promise<IHost[]> => {
  return new Promise(async (resolve, reject) => {      
    try {
      const begin = getCurrentTimeHr();
      // let authenticateToken = appCache.get("authToken");
      // let teamNamespace = appCache.get("teamNamespace");

      let authenticateToken = 'u3e2ffidgDCjW9ZqThtAG25eFi73zDID6kAMRibsGK60hasBMKC2JjzRgELWfqyB';
      let teamNamespace = 'tr66e86fx5';
      
      // if (authenticateToken == undefined || teamNamespace == undefined)
      // {
      //   const authResult = await _authenticate();

      //   if (authResult.success == false)
      //     reject(authResult.error);

      //   authenticateToken = appCache.get("authToken");
      //   teamNamespace = appCache.get("teamNamespace");
      // }

      const response = await fetch(
        'https://api.paperspace.com/trpc/machines.createFormDataV2', 
        {
          method: 'GET',
          headers: {
            "Authorization": `token ${teamNamespace}_${authenticateToken}`
          },
        }
      );

      const data = await response.json();

      const instances = data.result.data.json.machineTypes ?? [];

      let hosts: IHost[] = [];
      
      hosts = instances
        .filter((instance: any) => (instance.defaultUsageRates as any[]).findIndex((rate) => rate.type == "hourly") != -1)
        .map((instance: any) => ({
          model: instance.label,
          costPerHour: (instance.defaultUsageRates as any[]).find((rate) => rate.type == "hourly").rate ?? 0,
          deviceType: 'GPU',
          provider: 'Paperspace',
        }));
      

      const end = getCurrentTimeHr();

      const currentDate = new Date();
      logger.info(`SYNC [${currentDate.toUTCString()}] FETCHED ${hosts.length} HOSTS FROM PAPERSPACE - ${((end - begin) / 1e6)} ms`);

      return resolve(hosts);
    } catch (e) {
      reject(e);
    }

  });
}