import { _fetch as fetchTensorDock } from "./tensordock"
import { _fetch as fetchVastAI } from "./vastai";
import { FETCH_INTERVAL } from "../utils/secrets";
import { availableHosts, updateHost, removeHosts, insertHosts } from "../controller/api";
import { HostDocument } from "../models/Host";
import { IHost } from "../types";
import { logger } from "../utils/logger";

export const sync = async () => {
  const [vastAI, tensorDock] = await Promise.all([
    fetchTensorDock(),
    fetchVastAI(),
  ])
  let allHosts: IHost[] = [];
  allHosts = vastAI.concat(tensorDock);

  let removingList: string[] = [];

  const $ = await availableHosts();
  if ($.success == true) {
    const oldHosts: HostDocument[]  = $.data;
    
    oldHosts.forEach((oldHost) => {
      const index = allHosts.findIndex((host) => {
        return oldHost.costPerHour == host.costPerHour &&
          oldHost.provider == host.provider &&
          oldHost.deviceType == host.deviceType &&
          oldHost.model == host.model &&
          oldHost.index == host.index
      });
      
      if (index == -1)
        removingList.push(oldHost._id);
      else 
        allHosts.splice(index, 1);
    });

    if (removingList.length > 0)
      await removeHosts(removingList);
  }

  if (allHosts.length > 0)
    await insertHosts(allHosts);

  const currentDate = new Date();    
  logger.info(`SYNC [${currentDate.toUTCString()}] (${removingList.length}) REMOVED (${allHosts.length}) INSERTED`);

  setTimeout(sync, FETCH_INTERVAL);
}