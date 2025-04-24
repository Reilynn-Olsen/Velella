import { createContext, useContext } from "react";
import { collection } from "./types";

type songCollectionContextType = {
  songCollection: collection | null;
  setSongCollection: (a: collection | null) => void;
};

export const songCollectionContext = createContext<songCollectionContextType>({
  songCollection: null,
  setSongCollection: () => {},
});
export const useSongCollectionContext = () => useContext(songCollectionContext);
