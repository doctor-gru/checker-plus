import { IHost } from '../types';
import { getCurrentTimeHr } from '../utils/time';
import { logger } from '../utils/logger';

export const _fetch = (): Promise<IHost[]> => {
  return new Promise(async (resolve, reject) => {
    try {
      const begin = getCurrentTimeHr();

      const response = await fetch(
        'https://console.tensordock.com/api/metadata/instances', 
        {
          method: 'GET',
        }
      );

      const instances = await response.json();

      const cpu = instances.cpu ?? [];
      const gpu = instances.gpu ?? [];

      let hosts: IHost[] = [];
      
      for (const key in cpu) {
        hosts.push({
          model: key,
          costPerHour: cpu[key].cost.costHr,
          deviceType: 'CPU',
          provider: 'TensorDock',
        });
      }
      
      for (const key in gpu) {
        hosts.push({
          model: key,
          costPerHour: gpu[key].cost.costHr,
          deviceType: 'GPU',
          provider: 'TensorDock',
        });
      }

      const end = getCurrentTimeHr();

      const currentDate = new Date();
      logger.info(`SYNC [${currentDate.toUTCString()}] FETCHED ${hosts.length} HOSTS FROM TENSORDOCK - ${((end - begin) / 1e6)} ms`);

      return resolve(hosts);
    } catch (e) {
      return resolve([]);
    }
  });
}