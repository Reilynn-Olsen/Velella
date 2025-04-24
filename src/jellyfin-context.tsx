import { Api } from "@jellyfin/sdk";
import { createContext, useContext } from "react";

type jellyfinContextType = {
  jellyfinAPI: Api | null;
  setJellyfinAPI: (a: Api) => void;
};

export const JellyfinContext = createContext<jellyfinContextType>({
  jellyfinAPI: null,
  setJellyfinAPI: () => {},
});
export const useJellyfin = () => useContext(JellyfinContext);
