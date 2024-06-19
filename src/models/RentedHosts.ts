import mongoose, { Document } from 'mongoose';
import { IMetrics, IRentInstance } from '../types';

const Schema = mongoose.Schema;

export type MetricsDocument = Document & IMetrics;
export type RentInstanceDocument = Document & IRentInstance;

const Metrics = new Schema<MetricsDocument>({
  timestamp: {
    type: Number,
    required: true,
  },
  gpuUtil: {
    type: Number,
    required: true,
    default: 0,
  },
  powerDraw: {
    type: Number,
    required: true,
    default: 0,
  },
  fanSpeed: {
    type: Number,
    required: true,
    default: 0,
  },
  temperature: {
    type: Number,
    required: true,
    default: 0,
  },
  gpuClock: {
    type: Number,
    required: true,
    default: 0,
  },
  memClock: {
    type: Number,
    required: true,
    default: 0,
  },
  memAlloc: {
    type: Number,
    required: true,
    default: 0,
  },
  memUtil: {
    type: Number,
    required: true,
    default: 0,
  },
  videoClock: {
    type: Number,
    required: true,
    default: 0,
  },
  smClock: {
    type: Number,
    required: true,
    default: 0,
  },
  cpuUsage: {
     type: [[Number]], 
     required: true 
    },
  ramUsage: {
     type: [[Number]], 
     required: true 
    },
  networkIn: {
     type: [[Number]], 
     required: true 
    },
  networkOut: {
     type: [[Number]], 
     required: true 
    },
  diskUsage: {
     type: [[Number]], 
     required: true 
    },
});

const RentedHosts = new Schema<RentInstanceDocument>({
  uuid: {
    type: String,
    required: true,
  },
  model: {
    type: String,
    required: true,
  },
  driverVersion: {
    type: String,
    required: true,
  },
  vBiosVersion: {
    type: String,
    required: true,
  },
  metrics: [Metrics],
});

const RentInstance = mongoose.model<RentInstanceDocument>('RentedInstances', RentedHosts);

export default RentInstance;
