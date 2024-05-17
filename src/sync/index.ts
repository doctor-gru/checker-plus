import { fetch as fetchTensorDock } from "./tensordock"
import { fetch as fetchVastAI } from "./vastai";
import { FETCH_INTERVAL } from "../utils/secrets";
import { availableHosts, updateHost, removeHosts, insertHosts } from "../controller/api";
import { HostDocument } from "../models/Host";
import { IHost } from "../types";
import { logger } from "../utils/logger";

export const sync = () => {
  setInterval(async () => {
    const [vastAI, tensorDock] = await Promise.all([
      fetchTensorDock(),
      fetchVastAI(),
    ])
    let allHosts: IHost[] = [];
    allHosts = vastAI.concat(tensorDock);

    let removingList: string[] = [];
    let updatingList: HostDocument[] = [];

    const $ = await availableHosts();
    if ($.success == true) {
      const oldHosts: HostDocument[]  = $.data;
      
      oldHosts.forEach((oldHost) => {
        const index = allHosts.findIndex((host) => 
          (oldHost.model === host.model));
        
        if (index == -1)
          removingList.push(oldHost._id);
        else {
          const hostAt = allHosts.at(index);
          if (hostAt?.costPerHour != oldHost.costPerHour) {
            oldHost.costPerHour = hostAt?.costPerHour || 0;
            updatingList.push(oldHost);
          }
          allHosts.splice(index, 1);
        }
      });

      if (updatingList.length > 0)
        updatingList.forEach(async (item) => {
          await updateHost(item.id, {
            model: item.model,
            provider: item.provider,
            costPerHour: item.costPerHour,
            deviceType: item.deviceType,
          })
        });

      if (removingList.length > 0)
        await removeHosts(removingList);
    }

    if (allHosts.length > 0)
      await insertHosts(allHosts);

    const currentDate = new Date();    
    logger.info(`SYNC [${currentDate.toUTCString()}] (${removingList.length}) REMOVED (${updatingList.length}) UPDATED (${allHosts.length}) INSERTED`);
  }, FETCH_INTERVAL);
}