import { Jellyfin } from "@jellyfin/sdk";
export const localStorageKeys = {
  address: "address",
  accessToken: "accessToken",
};

export const jellyfinInfo = new Jellyfin({
  clientInfo: {
    name: "Velella",
    version: "1.0.0",
  },
  deviceInfo: {
    name: "Velella",
    id: "velella-web-client",
  },
});
