import mongoose, { Document } from 'mongoose';
import { 
  ILocation, 
  ICpu,
  IGpu, 
  IRamOrStorage, 
  IMinMax, 
  IRestriction, 
  ISpecs,
  IHost,
} from '../types';

const Schema = mongoose.Schema;

export type HostDocument = Document & IHost;

const locationSchema = new Schema<ILocation>({
  city: {
    type: String,
    required: false,
    default: "Not Specified",
  },
  country: {
    type: String,
    required: false,
  },
  region: {
    type: String,
    required: false,
  }
}, { _id : false });

const cpuSchema = new Schema<ICpu>({
  amount: {
    type: Number,
    required: false,
  },
  price: {
    type: Number,
    required: false,
  },
  type: {
    type: String,
    required: false,
  },
}, { _id : false });

const gpuSchema = new Schema<IGpu>({
  amount: {
    type: Number,
    required: false,
  },
  price: {
    type: Number,
    required: false,
  },
  type: {
    type: String,
    required: false,
  },
  vram: {
    type: Number,
    required: false,
  }
}, { _id : false });

const ramStorageSchema = new Schema<IRamOrStorage>({
  amount: {
    type: Number,
    required: false,
  },
  price: {
    type: Number,
    required: false,
  }
}, { _id : false });

const minMaxSchema = new Schema<IMinMax>({
  min: {
    type: Number,
    required: false,
  },
  max: {
    type: Number,
    required: false,
  },
}, { _id : false });

const restrictionSchema = new Schema<IRestriction>({
  cpu: {
    type: minMaxSchema,
    required: false,
  },
  ram: {
    type: minMaxSchema,
    required: false,
  },
  storage: {
    type: minMaxSchema,
    required: false,
  },
}, { _id : false });

const specsSchema = new Schema<ISpecs>({
  cpu: {
    type: cpuSchema,
    required: false,
  }, 
  gpu: {
    type: [gpuSchema],
    required: false,
    validate: [(val: (typeof gpuSchema)[]) => val.length > 0, 'Must have minimum one gpu'],
  },
  ram: {
    type: ramStorageSchema,
    required: false,
  },
  storage: {
    type: ramStorageSchema,
    required: false,
  },
  restrictions: {
    type: [restrictionSchema],
    required: false,
    default: [],
  },
}, { _id : false });

const hostSchema = new Schema<HostDocument>({
  hostId: {
    type: String,
    required: false,
  },
  provider: {
    type: String,
    required: false,
  },
  subindex: {
    type: String,
    required: false,
  },
  location: {
    type: locationSchema,
    required: false,
  },
  specs: {
    type: specsSchema,
    required: false,
  }
});

const Host = mongoose.model<HostDocument>('Host', hostSchema);

export default Host;
