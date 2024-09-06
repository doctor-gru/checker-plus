import { IHost } from "../types";
import { getCurrentTimeHr } from "../utils/time";
import { logger } from "../utils/logger";
import {
  PAPERSPACE_EMAIL,
  PAPERSPACE_PWD,
  PAPERSPACE_REQUEST_VALIDATE_KEY,
} from "../utils/secrets";
import { appCache } from "../utils/cache";

export const _authenticate = async (): Promise<any> => {
  const credential = {
    email: PAPERSPACE_EMAIL,
    password: PAPERSPACE_PWD,
    PS_REQUEST_VALIDATION_KEY: PAPERSPACE_REQUEST_VALIDATE_KEY,
  };

  try {
    const response = await fetch(
      "https://api.paperspace.io/users/login?include=user",
      {
        method: "POST",
        body: JSON.stringify(credential),
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    if (!response.ok) {
      throw new Error(`FAILED STATUS ${response.status}`);
    }

    const data = await response.json();
    if (response.status != 200) {
      logger.error(`SYNC LOGIN FAILED WITH INVALID CREDENTIALS`);
      return {
        success: false,
        error: "Invalid credentials",
      };
    }

    let authenticateToken = "";
    let teamNamespace = "";
    let ttl = 0;

    authenticateToken = data.id;
    ttl = Number(data.ttl);
    if (data.user.userTeam.length > 0)
      teamNamespace = data.user.userTeam[0].handle;
    else {
      logger.error(`SYNC FAILURE PARSING RESPOSE`);
      return {
        success: false,
        error: "Invalid response",
      };
    }

    logger.info(`SYNC REFRESHED PAPERSPACE AUTHENTICATE TOKEN`);

    appCache.mset([
      { key: "authToken", val: authenticateToken, ttl: ttl },
      { key: "teamNamespace", val: teamNamespace, ttl: ttl },
    ]);
    return { success: true };
  } catch (err) {
    logger.error(`SYNC FAILURE DURING REQUEST`);
    return {
      success: false,
      error: "Request failed",
    };
  }
};

export const _fetch = (): Promise<IHost[]> => {
  return new Promise(async (resolve, reject) => {
    try {
      const begin = getCurrentTimeHr();
      let authenticateToken = appCache.get("authToken");
      let teamNamespace = appCache.get("teamNamespace");

      // let authenticateToken = 'u3e2ffidgDCjW9ZqThtAG25eFi73zDID6kAMRibsGK60hasBMKC2JjzRgELWfqyB';
      // let teamNamespace = 'tr66e86fx5';

      if (authenticateToken == undefined || teamNamespace == undefined) {
        const authResult = await _authenticate();

        if (authResult.success == false) reject(authResult.error);

        authenticateToken = appCache.get("authToken");
        teamNamespace = appCache.get("teamNamespace");
      }

      const response = await fetch(
        "https://api.paperspace.com/trpc/machines.createFormDataV2",
        {
          method: "GET",
          headers: {
            Authorization: `token ${teamNamespace}_${authenticateToken}`,
          },
        },
      );
      if (!response.ok) {
        throw new Error(`FAILED STATUS ${response.status}`);
      }

      const data = await response.json();

      const instances = data.result.data.json.machineTypes ?? [];

      let hosts: IHost[] = [];

      hosts = instances
        .filter(
          (instance: any) =>
            (instance.defaultUsageRates as any[]).findIndex(
              (rate) => rate.type == "hourly",
            ) != -1,
        )
        .map((instance: any, index: number) => ({
          hostId: `PS-${index}`,
          provider: "Paperspace",
          subindex: `PS-${index}`,
          location: {
            city: "Not Specified",
            country: "Not Specified",
            region: "Not Specified",
          },
          specs: {
            cpu: {
              amount: Number(instance.cpus),
              price: 0,
              type: "Not Specified",
            },
            gpu: [
              {
                amount: 1,
                price:
                  (instance.defaultUsageRates as any[]).find(
                    (rate) => rate.type == "hourly",
                  ).rate ?? 0,
                type: instance.gpu,
                vram: 0,
              },
            ],
            ram: {
              amount: Number(instance.ram) / 1024 / 1024 / 1024,
              price: 0,
            },
            storage: {
              amount: 0,
              price: 0,
            },
            restrictions: [
              {
                cpu: {
                  min: Number(instance.cpus),
                  max: Number(instance.cpus),
                },
                gpu: {
                  min: 1,
                  max: 1,
                },
                ram: {
                  min: Number(instance.ram) / 1024 / 1024 / 1024,
                  max: Number(instance.ram) / 1024 / 1024 / 1024,
                },
              },
            ],
          },
        }));

      const end = getCurrentTimeHr();

      logger.info(
        `SYNC FETCHED ${hosts.length} HOSTS FROM PAPERSPACE - ${(end - begin) / 1e6} ms`,
      );

      return resolve(hosts);
    } catch (e) {
      logger.error(
        `SYNC FETCHING HOSTS FROM PAPERSPACE FAILED ${(e as Error).message.toUpperCase().slice(0, 60)}`,
      );
      return reject(e);
    }
  });
};
