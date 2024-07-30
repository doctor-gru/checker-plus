import { _fetch as fetchTensorDock } from '../sync/tensordock'
import { _fetch as fetchVastAI } from '../sync/vastai';
import { _fetch as fetchPaperspace} from '../sync/paperspace';
import { availableHosts, removeHosts, insertHosts } from './api';
import { HostDocument } from '../models/Host';
import { IHost } from '../types';
import { ControllerResponse } from '../types';

// Easy and simple markup for now
const markup = (host: IHost) => {
  const isH100orH200 = host.specs.gpu.some(gpu => 
    gpu.type.includes('H100') || gpu.type.includes('H200'));

  return {
    ...host,
    specs: {
      ...host.specs,
      gpu: host.specs.gpu.map(gpu => ({
        ...gpu,
        price: isH100orH200 ? gpu.price * 0.8 : gpu.price * 0.5,
      }))        
    }
  }
}

export const updateAvailableInstances = async (): Promise<ControllerResponse> => {
  try {
    const [vastAI, tensorDock, paperspace] = await Promise.all([
      fetchTensorDock(),
      fetchVastAI(),
      fetchPaperspace(),
    ])
    let allHosts: IHost[] = [];
    allHosts = vastAI.concat(tensorDock).concat(paperspace).map(markup);

    let removingList: string[] = [];

    const $ = await availableHosts();
    if ($.success == true) {
      const oldHosts: HostDocument[]  = $.data;
      
      oldHosts.forEach((oldHost) => {
        const index = allHosts.findIndex((host) => {
          return oldHost.hostId == host.hostId
        });
        
        if (index == -1)
          removingList.push(oldHost._id);
        else 
          allHosts.splice(index, 1);
      });

      if (removingList.length > 0) { 
        const response = await removeHosts(removingList);
        if (response.success == false) {
          throw new Error(response.error);
        }
      }
    }

    if (allHosts.length > 0) {
      const response = await insertHosts(allHosts);
      if (response.success == false)
        throw new Error(response.error);
    }

    return {
      success: true,
      data: {
        removed: removingList.length,
        inserted: allHosts.length,
      }
    };
  } catch (e) {
    return {
      success: false,
      error: (e as Error).message.toUpperCase().slice(0, 60),
    };
  }
}