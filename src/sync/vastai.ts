import request from "request";
import { IHost } from "../types";
import { getCurrentTimeHr } from "../utils/time";
import { logger } from "../utils/logger";

export const fetch = async (): Promise<IHost[]> => {
  return new Promise((resolve, reject) => request({
    method: 'GET',
    url: 'https://cloud.vast.ai/api/v0/bundles',
  }, (err: any, response: request.Response) => {
    if (err) reject(err);

    try {
      const begin = getCurrentTimeHr();

      const bundles = JSON.parse(response.body).offers;

      let hosts: IHost[] = [];
      
      hosts = bundles.map((bundle: any) => ({
        model: bundle.gpu_name,
        costPerHour: bundle.search.discountedTotalPerHour,
        deviceType: 'GPU',
        provider: 'VastAI',
      }));

      const end = getCurrentTimeHr();

      const currentDate = new Date();
      logger.info(`SYNC [${currentDate.toUTCString()}] FETCHED ${hosts.length} HOSTS FROM VASTAI - ${((end - begin) / 1000)} ms`);

      return resolve(hosts);
    } catch (e) {
      reject(e);
    }
  }));
}