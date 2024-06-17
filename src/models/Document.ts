import mongoose, { Document } from 'mongoose';


interface IHostPerformance extends Document {
  dockerId: string;
  timestamp: number;
  gpuUtil: number;
  powerDraw: number;
  fanSpeed: number;
  temperature: number;
  gpuClock: number;
  memClock: number;
  memAlloc: number;
  memUtil: number;
  videoClock: number;
  smClock: number;
  cpuUsage: number[][];
  IOwaitUsage: number[][];
  stealUsage: number[][];
  userUsage: number[][];
  systemUsage: number[][];
  ramUsage: number[][];
  swapUsage: number[][];
  bufferedUsage: number[][];
  cachedUsage: number[][];
  networkIn: number[][];
  networkOut: number[][];
  diskUsage: number[][];
}

const HostPerformanceSchema = new mongoose.Schema<IHostPerformance>({
  dockerId: { type: String, required: true, unique: true },
  timestamp: { type: Number, required: true },
  gpuUtil: { type: Number, required: true },
  powerDraw: { type: Number, required: true },
  fanSpeed: { type: Number, required: true },
  temperature: { type: Number, required: true },
  gpuClock: { type: Number, required: true },
  memClock: { type: Number, required: true },
  memAlloc: { type: Number, required: true },
  memUtil: { type: Number, required: true },
  videoClock: { type: Number, required: true },
  smClock: { type: Number, required: true },
  cpuUsage: { type: [[Number]], required: true },
  IOwaitUsage: { type: [[Number]], required: true },
  stealUsage: { type: [[Number]], required: true },
  userUsage: { type: [[Number]], required: true },
  systemUsage: { type: [[Number]], required: true },
  ramUsage: { type: [[Number]], required: true },
  swapUsage: { type: [[Number]], required: true },
  bufferedUsage: { type: [[Number]], required: true },
  cachedUsage: { type: [[Number]], required: true },
  networkIn: { type: [[Number]], required: true },
  networkOut: { type: [[Number]], required: true },
  diskUsage: { type: [[Number]], required: true },
});

const HostPerformance = mongoose.model<IHostPerformance>('HostPerformance', HostPerformanceSchema, 'rent_instance', );
//const HostPerformance = mongoose.model<IHostPerformance>('HostPerformance', HostPerformanceSchema);

export default HostPerformance;
