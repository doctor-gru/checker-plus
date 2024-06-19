import { IGpu, IHost, IRestriction } from '../types';
import { getCurrentTimeHr } from '../utils/time';
import { logger } from '../utils/logger';
import { TENSORDOCK_APIKEY, TENSORDOCK_APITOKEN } from '../utils/secrets';

export const _fetch = (): Promise<IHost[]> => {
  return new Promise(async (resolve, reject) => {
    try {
      const begin = getCurrentTimeHr();

      const response = await fetch(
        `https://marketplace.tensordock.com/api/v0/client/deploy/hostnodes?api_key=${TENSORDOCK_APIKEY}&api_token=${TENSORDOCK_APITOKEN}`, 
        {
          method: 'GET',
        }
      );
      
      const instances = await response.json();
      const hostnodes = instances.hostnodes ?? [];
      
      let hosts: IHost[] = [];
      
      for (const key in hostnodes) {
        const hostnode = hostnodes[key];

        let gpus: IGpu[] = [];
        for (const gpu in hostnode.specs.gpu) {
          gpus.push({
            amount: hostnode.specs.gpu[gpu].amount,
            price: hostnode.specs.gpu[gpu].price,
            type: gpu.toUpperCase(),
            vram: hostnode.specs.gpu[gpu].vram * 1024,
          })
        }

        let restrictions: IRestriction[] = [];
        for (const restrictionId in hostnode.specs.restrictions)
          restrictions.push(hostnode.specs.restrictions[restrictionId]);

        hosts.push({
          hostId: key,
          provider: 'TD',
          subindex: key,
          location: {
            city: hostnode.location.city,
            country: hostnode.location.country,
            region: hostnode.location.region,
          },
          specs: {
            cpu: {
              amount: hostnode.specs.cpu.amount,
              price: hostnode.specs.cpu.price,
              type: hostnode.specs.cpu.type.toUpperCase(),
            },
            gpu: gpus,
            ram: hostnode.specs.ram,
            storage: hostnode.specs.storage,
            restrictions: restrictions,
          },
        });
      }

      const end = getCurrentTimeHr();

      const currentDate = new Date();
      logger.info(`SYNC [${currentDate.toUTCString()}] FETCHED ${hosts.length} HOSTS FROM TENSORDOCK - ${((end - begin) / 1e6)} ms`);

      return resolve(hosts);
    } catch (e) {
      return reject(e);
    }
  });
}