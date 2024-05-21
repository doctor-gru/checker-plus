import request from "request";
import { IHost } from "../types";
import { getCurrentTimeHr } from "../utils/time";
import { logger } from "../utils/logger";

export const _fetch = async (): Promise<IHost[]> => {
  return new Promise((resolve, reject) => request({
    method: 'GET',
    url: 'https://console.tensordock.com/api/metadata/instances',
  }, (err: any, response: request.Response) => {
    if (err) reject(err);

    try {
      const begin = getCurrentTimeHr();

      const instances = JSON.parse(response.body);

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
      logger.info(`SYNC [${currentDate.toUTCString()}] FETCHED ${hosts.length} HOSTS FROM TENSORDOCK - ${((end - begin) / 1000)} ms`);

      return resolve(hosts);
    } catch (e) {
      reject(e);
    }
  }));
}