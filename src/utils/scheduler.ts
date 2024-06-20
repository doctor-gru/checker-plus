import { fetchVastAiInstances, convertTimeToUnix } from '../utils/scraping'
import RentInstance from '../models/RentedHosts';
import { IRentInstance } from "../types";
import schedule from 'node-schedule';

export async function updateRentedHostInfo(){

    const data = await fetchVastAiInstances()


    let instance: IRentInstance = {
        uuid: "",
        model: "",
        driverVersion: "",
        vBiosVersion: "",
        metrics: [],
    };

  
    instance.uuid = "99894b4dd500bf0af5a906eb8f85e1c3";
    instance.model = data['instances'][0]['cpu_name'];
    instance.driverVersion = data['instances'][0]['driver_version'];
    instance.vBiosVersion = '0';
  
    instance.metrics = {
    timestamp: convertTimeToUnix(),
    gpuUtil: data['instances'][0]['gpu_util'],
    powerDraw: 0,
    fanSpeed: 0,
    temperature: data['instances'][0]['gpu_temp'],
    gpuClock: 0,
    memClock: 0,
    memAlloc: data['instances'][0]['gpu_util'],
    videoClock: 0,
    }
    console.log(instance)
    const newDocument = new RentInstance(instance);
    await newDocument.save()

};

schedule.scheduleJob('*/1 * * * *', async () => {
    await updateRentedHostInfo();
});
