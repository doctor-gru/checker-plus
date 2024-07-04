import { IRentInstance } from "../types";
import { VASTAI_APIKEY, PAPERSPACE_TEAMID } from "./secrets";
import { logger } from '../utils/logger';
import { _authenticate as authPaperspace } from "../sync/paperspace";
import { appCache } from "./cache";

interface HighchartsConfig {
  [key: string]: any;
}

function processData(data: string): Record<string, HighchartsConfig> {
  // Define the regular expression to match Highcharts.chart objects
  const regex = /Highcharts\.chart\('([^']+)',\s*(\{[\s\S]*?\})\)/g;
  let match: RegExpExecArray | null;
  const dictionary: Record<string, HighchartsConfig> = {};

  // Loop through all matches
  while ((match = regex.exec(data)) !== null) {
      const key = match[1];
      const value = match[2];

      // Parse the object string into an actual JavaScript object
      try {
          const parsedValue: HighchartsConfig = eval(`(${value})`);
          
          // Remove specified properties
          delete parsedValue.tooltip;
          delete parsedValue.plotOptions;
          delete parsedValue.credits;
          delete parsedValue.chart;
          delete parsedValue.title;

          dictionary[key] = parsedValue;
      } catch (e) {
        logger.error(`TRANSFORM ERROR PARSING VALUE FOR KEY "${key}"`);
      }
  }

  return dictionary;
}

export const extractSeriesData = (data: any): any => {
    const result: { [key: string]: any } = {};

    const seriesNameMapper: { [key: string]: string } = {
        'CPU': 'cpuUsage',
        'IOWait': 'IOwaitUsage',
        'Steal': 'stealUsage',
        'User': 'userUsage',
        'System': 'systemUsage',
        'RAM': 'ramUsage',
        'Swap': 'swapUsage',
        'Buffered': 'bufferedUsage',
        'Cached': 'cachedUsage',
        'In': 'networkIn',
        'Out': 'networkOut',
        'Disk': 'diskUsage'
    };

    for (let key in data) {
        if (data.hasOwnProperty(key)) {
            const chartData = data[key];
            const seriesArray = chartData.series;

            seriesArray.forEach((series: any) => {
                const seriesName = series.name;
                const mappedSeriesName = seriesNameMapper[seriesName] || seriesName;
                const seriesData = series.data;

                result[mappedSeriesName] = seriesData;
            });
        }
    }

    return result;
}

export const compareUnixTimestamps = (givenUnixTime: number): boolean => {
    // Get current time in milliseconds
    const currentTimeMillis = Date.now();

    // Get the current time as a Date object
    const currentTime = new Date(currentTimeMillis);

    // Get the offset in minutes for the local timezone
    const offsetMinutes = currentTime.getTimezoneOffset();

    // Adjust the current time to UTC+00:00
    const adjustedTime = new Date(currentTimeMillis + (offsetMinutes * 60 * 1000));

    // Set the seconds to 0
    adjustedTime.setSeconds(0);

    // Get the Unix timestamp (in seconds)
    const calculatedUnixTimestamp = Math.floor(adjustedTime.getTime() / 1000);

    // Compare the given Unix timestamp with the calculated Unix timestamp
    if (givenUnixTime === calculatedUnixTimestamp) {
        return false;
    } else {
        return true;
    }
}

export const fetchVastAIMetrics = async (): Promise<IRentInstance[]> => {
  let instances: IRentInstance[] = [];

  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch('https://console.vast.ai/api/v0/instances', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${VASTAI_APIKEY}`,
          }
        }
      );
      if (!response.ok) {
        throw new Error(`FAILED STATUS ${response.status}`);
      }

      const data = await response.json();

      const currentDate = new Date();

      instances = data.instances.map((item: any) => ({
        uuid: item.id,
        model: item.gpu_name,
        driverVersion: item.driver_version,
        vBiosVersion: '0',
        metrics: [{
          timestamp: currentDate.getTime(),
          gpuUtil: item.gpu_util,
          powerDraw: 0,
          fanSpeed: 0,
          temperature: item.gpu_temp,
          memClock: 0,
          memAlloc: 0,
          memUtil: item.mem_usage * 100,
          videoClock: 0,
          smClock: 0,
          cpuUsage: item.cpu_util,
        }],
      }));

      return resolve(instances);
    } catch (e) {
      logger.error(`FETCH METRICS FROM VASTAI FAILED ${(e as Error).message.toUpperCase().slice(0, 30)}`);
      return reject(e);
    }
  });
}

export const fetchTensordockMetrics = async (): Promise<IRentInstance[]> => {
  const id = "99894b4dd500bf0af5a906eb8f85e1c3";
  const duration = "30";
  const reqUrl = 'https://monitor.m.tensordock.com/auth.php';
  const reqParams = `m=69&tx=${id}&u=${duration}`;

  const headers = {
    'Host': 'monitor.m.tensordock.com',
    'Cookie': 'PHPSESSID=f28kd9e55ih3m5l9m39ddfq0pd; _fw_crm_v=b7c41f54-b64e-4a4d-90e6-664b0b4f623b',
    'Sec-Ch-Ua': '"Google Chrome";v="125", "Chromium";v="125", "Not.A/Brand";v="24"',
    'Accept': 'text/html, */*; q=0.01',
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    'X-Requested-With': 'XMLHttpRequest',
    'Sec-Ch-Ua-Mobile': '?0',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
    'Sec-Ch-Ua-Platform': '"Windows"',
    'Origin': 'https://monitor.m.tensordock.com',
    'Sec-Fetch-Site': 'same-origin',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Dest': 'empty',
    'Referer': `https://monitor.m.tensordock.com/report/uptime/${id}/`,
    'Accept-Encoding': 'gzip, deflate',
    'Accept-Language': 'en-US,en;q=0.9',
    'Priority': 'u=1, i'
  };

  let instances: IRentInstance[] = [];

  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(
        `${reqUrl}?${reqParams}`,
        {
          method: 'POST',
          headers: headers,
        }
      );
      if (!response.ok) {
        throw new Error(`FAILED STATUS ${response.status}`);
      }

      const data = await response.text();
      const dictionary: Record<string, HighchartsConfig> = processData(data);
      const jsonResponse = extractSeriesData(dictionary);

      instances.push({
        uuid: id,
        model: '0',
        driverVersion: '0',
        vBiosVersion: '0',
        metrics: jsonResponse.cpuUsage.map((item: number[], index: number) => ({ 
          timestamp: item[0],
          gpuUtil: 0,
          powerDraw: 0,
          fanSpeed: 0,
          temperature: 0,
          gpuClock: 0,
          memClock: 0,
          memAlloc: 0,
          memUtil: jsonResponse.ramUsage[index][1],
          videoClock: 0,
          smClock: item[1],
          cpuUsage: item[1],
        })),
      });

      return resolve(instances);
    } catch (e) {    
      logger.error(`FETCH METRICS FROM TENSORDOCK FAILED ${(e as Error).message.toUpperCase().slice(0, 30)}`);
      return reject(e);
    }
  });
}

export const fetchPaperspaceMetrics = async (): Promise<IRentInstance[]> => {
  return new Promise(async (resolve, reject) => {
    try {    
      let authenticateToken = appCache.get("authToken");
      let teamNamespace = appCache.get("teamNamespace");

      if (authenticateToken == undefined || teamNamespace == undefined)
      {
        const authResult = await authPaperspace();

        if (authResult.success == false)
          reject(authResult.error);

        authenticateToken = appCache.get("authToken");
        teamNamespace = appCache.get("teamNamespace");
      }

      console.log(authenticateToken);
      const reqUrl = `https://api.paperspace.io/accounts/team/${PAPERSPACE_TEAMID}/getMachineList`;
      const reqParams = `access_token=${authenticateToken}`;

      let instances: IRentInstance[] = [];

      const response = await fetch(
        `${reqUrl}?${reqParams}`,
        {
          method: 'GET',
        }
      );
      if (!response.ok) {
        throw new Error(`FAILED STATUS ${response.status}`);
      }

      const data = await response.json();

      const currentDate = new Date();

      instances = data.machines.map((item: any) => ({
        uuid: item.handle,
        model: item.gpus[0].model,
        driverVersion: '0',
        vBiosVersion: '0',
        metrics: [{
          timestamp: currentDate.getTime(),
          gpuUtil: 0,
          powerDraw: 0,
          fanSpeed: 0,
          temperature: 0,
          memClock: 0,
          memAlloc: 0,
          memUtil: 0,
          videoClock: 0,
          smClock: 0,
          cpuUsage: 0,
        }],
      }));

      return resolve(instances);
    } catch (e) {    
      logger.error(`FETCH METRICS FROM TENSORDOCK FAILED ${(e as Error).message.toUpperCase().slice(0, 30)}`);
      return reject(e);
    }
  });
}