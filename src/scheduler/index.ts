import { updateAvailableInstances } from '../controller/sync';
import { updateMetrics } from '../controller/api';
import schedule from 'node-schedule';

import { logger } from '../utils/logger';

export const init = () => {
  schedule.scheduleJob('* * * * *', async () => {
    const result = await updateMetrics();
    if (result.success)
      logger.info(`METRICS UPDATE SUCCESS`);
    else
      logger.error(`METRICS UPDATE FAILED ${result.error}`);
  });

  schedule.scheduleJob('* * * *', async () => {
    const result = await updateAvailableInstances();
    if (result.success) 
      logger.info(`SYNC (${result.data.removed}) REMOVED (${result.data.inserted}) INSERTED`);
    else
      logger.error(`SYNC FAILED ${result.error}`);
  })
}