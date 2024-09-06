import NodeCache from "node-cache";

export const appCache = new NodeCache({ stdTTL: 86400 }); // TTL of 1 day
