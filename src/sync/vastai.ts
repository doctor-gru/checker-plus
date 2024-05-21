import request from "request";
import { IHost } from "../types";
import { getCurrentTimeHr } from "../utils/time";
import { logger } from "../utils/logger";

const requestParams = {
  "verified": { "eq": true },
  "external": { "eq": false },
  "rentable": { "eq": true },
  "rented": { "eq": false },
  "limit": 1024,
  "order": [["score", "desc"]]
};

const generateQueryParams = (params: any): string => {
  let jsonString = JSON.stringify(params);
  jsonString = jsonString.replace(/{/g, "%7B");
  jsonString = jsonString.replace(/}/g, "%7D");
  jsonString = jsonString.replace(/:/g, "%3A");
  jsonString = jsonString.replace(/,/g, "%2C");
  jsonString = jsonString.replace(/"/g, "%22");
  jsonString = jsonString.replace(/\[/g, "%5B");
  jsonString = jsonString.replace(/]/g, "%5D");
  return jsonString;
}

export const _fetch = async (): Promise<IHost[]> => {
  const queryParams = generateQueryParams(requestParams);
  return new Promise((resolve, reject) => request({
    method: 'GET',
    url: `https://console.vast.ai/api/v0/bundles?q=${queryParams}`,
  }, (err: any, response: request.Response) => {
    if (err) reject(err);

    try {
      const begin = getCurrentTimeHr();
      const bundles = JSON.parse(response.body).offers ?? [];

      let hosts: IHost[] = [];
      
      hosts = bundles.map((bundle: any) => ({
        model: bundle.gpu_name,
        costPerHour: bundle.discounted_dph_total,
        index: bundle.host_id,
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