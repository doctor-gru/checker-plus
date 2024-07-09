import { IHost, ILocation } from '../types';
import { getCurrentTimeHr } from '../utils/time';
import { logger } from '../utils/logger';
import { convertToUuid } from '../utils/uuid';
import { countryCodeToName } from '../utils/regional';

const requestParams = {
  'verified': { 'eq': true },
  'external': { 'eq': false },
  'rentable': { 'eq': true },
  'rented': { 'eq': false },
  'limit': 1024,
  'order': [['score', 'desc']]
};

const generateQueryParams = (params: any): string => {
  let jsonString = JSON.stringify(params);
  jsonString = jsonString.replace(/{/g, '%7B');
  jsonString = jsonString.replace(/}/g, '%7D');
  jsonString = jsonString.replace(/:/g, '%3A');
  jsonString = jsonString.replace(/,/g, '%2C');
  jsonString = jsonString.replace(/'/g, '%22');
  jsonString = jsonString.replace(/\[/g, '%5B');
  jsonString = jsonString.replace(/]/g, '%5D');
  return jsonString;
}

export const _fetch = (): Promise<IHost[]> => {
  const queryParams = generateQueryParams(requestParams);
  return new Promise(async (resolve, reject) => {
    try {
      const begin = getCurrentTimeHr();

      const response = await fetch(
        `https://console.vast.ai/api/v0/bundles?q=${queryParams}`, 
        {
          method: 'GET',
        }
      );
      if (!response.ok) {
        throw new Error(`FAILED STATUS ${response.status}`);
      }

      const data = await response.json();
      const bundles = data.offers ?? [];

      let hosts: IHost[] = [];
      
      hosts = bundles.map((bundle: any) => {
        let location: ILocation = {
          city: 'Not Specified',
          country: 'Not Specified',
          region: 'Not Specified',
        }
        const geolocation = bundle.geolocation;
        if (geolocation != null) {
          const [region, country] = (geolocation as string).replace(' ', '').split(',');
          location.country = countryCodeToName(country);
          location.region = region;
        }

        return {
          hostId: convertToUuid(bundle.bundle_id),
          provider: 'VastAI',
          subindex: bundle.bundle_id,
          location: location,
          specs: {
            cpu: {
              amount: bundle.cpu_cores ?? 0,
              price: 0,
              type: bundle.cpu_name != null ? bundle.cpu_name.toUpperCase() : "No CPU",
            },
            gpu: [{
              amount: bundle.num_gpus,
              price: bundle.search.gpuCostPerHour,
              type: bundle.gpu_name,
              vram: bundle.gpu_total_ram,
            }],
            ram: {
              amount: 0,
              price: 0,
            },
            storage: {
              amount: bundle.disk_space / 10,
              price: 0,
            },
            restrictions: [{
              cpu: {
                min: bundle.cpu_cores ?? 0,
                max: bundle.cpu_cores ?? 0,
              },
              gpu: {
                min: bundle.num_gpus,
                max: bundle.num_gpus,
              },
              ram: {
                min: 0,
                max: 0,
              }
            }],
          },
        }
      });

      const end = getCurrentTimeHr();

      logger.info(`SYNC FETCHED ${hosts.length} HOSTS FROM VASTAI - ${((end - begin) / 1e6)} ms`);

      return resolve(hosts);
    } catch (e) {
      logger.error(`SYNC FETCHING HOSTS FROM VASTAI FAILED ${(e as Error).message.toUpperCase().slice(0, 60)}`);
      return reject(e);
    }
  });
}

export const _fetchInstanceInformation = () => {
}