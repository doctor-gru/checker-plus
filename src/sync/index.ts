import { fetch as fetchTensorDock } from "./tensordock"
import { FETCH_INTERVAL } from "../utils/secrets";
import { availableHosts, updateHost, removeHosts, insertHosts } from "../controller/api";
import { HostDocument } from "../models/Host";
import { getCurrentTimeHr } from "../utils/time";
import { logger } from "../utils/logger";

export const sync = () => {
  setInterval(async () => {
    let tensordockHosts = await fetchTensorDock();
    let removingList: string[] = [];
    let updatingList: HostDocument[] = [];

    const $ = await availableHosts();
    if ($.success == true) {
      const oldHosts: HostDocument[]  = $.data;
      
      oldHosts.forEach((oldHost) => {
        const index = tensordockHosts.findIndex((host) => 
          (oldHost.modal === host.modal));
        
        if (index == -1)
          removingList.push(oldHost._id);
        else {
          const hostAt = tensordockHosts.at(index);
          if (hostAt?.costPerHour != oldHost.costPerHour) {
            oldHost.costPerHour = hostAt?.costPerHour || 0;
            updatingList.push(oldHost);
          }
          tensordockHosts.splice(index, 1);
        }
      });

      if (updatingList.length > 0)
        updatingList.forEach(async (item) => {
          await updateHost(item.id, {
            modal: item.modal,
            provider: item.provider,
            costPerHour: item.costPerHour,
            deviceType: item.deviceType,
          })
        });

      if (removingList.length > 0)
        await removeHosts(removingList);
    }

    if (tensordockHosts.length > 0)
      await insertHosts(tensordockHosts);

    const currentDate = new Date();    
    logger.info(`SYNC [${currentDate.toUTCString()}] (${removingList.length}) REMOVED (${updatingList.length}) UPDATED (${tensordockHosts.length}) INSERTED`);
  }, FETCH_INTERVAL);
}