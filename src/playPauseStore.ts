import { create } from "zustand";

type usePlayPauseStoreType = {
  isPlaying: boolean;
  setPlay: () => void;
  setPause: () => void;
};

export const usePlayPauseStore = create<usePlayPauseStoreType>((set) => ({
  isPlaying: false,
  setPlay: () => set(() => ({ isPlaying: true })),
  setPause: () => set(() => ({ isPlaying: false })),
}));
