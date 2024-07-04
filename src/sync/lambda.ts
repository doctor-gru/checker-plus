import { IHost } from '../types';
import { getCurrentTimeHr } from '../utils/time';
import { logger } from '../utils/logger';
import { LAMBDA_APIKEY } from '../utils/secrets';

export const _fetch = (): Promise<IHost[]> => {
  return new Promise(async (resolve, reject) => {
    try {
      const begin = getCurrentTimeHr();

      const response = await fetch(
        'https://cloud.lambdalabs.com/api/v1/instance-types', 
        {
          method: 'GET',
          headers: {
            'API_KEY': LAMBDA_APIKEY, 
          }
        }
      );
      if (!response.ok) {
        throw new Error(`FAILED STATUS ${response.status}`);
      }

      const instances = await response.json();

      if (instances.error)
        throw new Error(instances.error.message);

      const hostsData = instances.data;

      let hosts: IHost[] = [];
      
      for (const key in instances.data) {
        hosts.push({
          model: hostsData[key].instance_type.description,
          costPerHour: hostsData[key].instance_type.price_cents_per_hour,
          deviceType: 'GPU',
          provider: 'Lambda',
        });
      }
      
      const end = getCurrentTimeHr();

      logger.info(`SYNC FETCHED ${hosts.length} HOSTS FROM LAMBDA - ${((end - begin) / 1e6)} ms`);

      return resolve(hosts);
    } catch (e) {
      logger.error(`SYNC FETCHING HOSTS FROM LAMBDA FAILED ${(e as Error).message.toUpperCase().slice(0, 30)}`);
      return reject(e);
    }
  });
}