import { updateAvailableInstances } from "../controller/sync";
import { updateMetrics } from "../controller/api";
import {
  storeStakingInformation,
  removeOldStakingInformation,
} from "../controller/web3";
import schedule from "node-schedule";

import { logger } from "../utils/logger";

export const init = () => {
  // schedule.scheduleJob("* * * * *", async () => {
  //   const result = await updateMetrics();
  //   if (result.success) logger.info(`METRICS UPDATE SUCCESS`);
  //   else logger.error(`METRICS UPDATE FAILED ${result.error?.toUpperCase()}`);
  // });

  // Schedule a job to run every 5 minutes
  schedule.scheduleJob("*/5 * * * *", async () => {
    const result = await storeStakingInformation();
    if (result.success) logger.info(`STAKING INFORMATION UPDATE SUCCESS`);
    else
      logger.error(
        `STAKING INFORMATION UPDATE FAILED ${result.error?.toUpperCase()}`,
      );
  });

  // Schedule job to run every 3 days at midnight
  // schedule.scheduleJob("0 0 */3 * *", async () => {
  //   const result = await removeOldStakingInformation(3);
  //   if (result.success) {
  //     logger.info(
  //       `OLD RECORDS REMOVAL SUCCESS, ${result.deletedCount} RECORD(S) DELETED`,
  //     );
  //   } else {
  //     logger.error(`OLD RECORDS REMOVAL FAILED ${result.error}`);
  //   }
  // });

  // schedule.scheduleJob("*/5 * * * *", async () => {
  //   const result = await updateAvailableInstances();
  //   if (result.success)
  //     logger.info(
  //       `SYNC (${result.data.removed}) REMOVED (${result.data.inserted}) INSERTED`,
  //     );
  //   else logger.error(`SYNC FAILED ${result.error}`);
  // });
};
