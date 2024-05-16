import { ControllerResponse } from "../types";

export const availableHosts = (): ControllerResponse => {
  return { success: true, data: [] };
}