import { useState, useRef } from "react";
import usePlaySong from "../helperFunctions/PlaySong";
import { useSongCollectionContext } from "../songCollection-context";
import { usePlayPauseStore } from "../playPauseStore";

export default function AudioPlayer() {
  const isPlaying = usePlayPauseStore((s) => s.isPlaying);
  const setPlay = usePlayPauseStore((s) => s.setPlay);
  const setPause = usePlayPauseStore((s) => s.setPause);
  const { playSong } = usePlaySong();
  const { songCollection, setSongCollection } = useSongCollectionContext();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setPause();
      } else {
        audioRef.current.play();
        setPlay();
      }
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleNext = () => {
    if (!songCollection) {
      return;
    }

    const trackList = songCollection.set;
    const currentTrackIndex = songCollection.currentIndex;

    if (trackList.length === 0 || !currentTrackIndex) {
      return;
    }

    const nextIndex = (currentTrackIndex + 1) % trackList.length;
    setSongCollection({ set: songCollection.set, currentIndex: nextIndex });
    playSong(trackList[nextIndex]);
  };

  const handlePrevious = () => {
    if (!songCollection) {
      return;
    }

    const trackList = songCollection.set;
    const currentTrackIndex = songCollection.currentIndex;

    if (trackList.length === 0 || !currentTrackIndex) {
      return;
    }

    const prevIndex = (currentTrackIndex - 1) % trackList.length;
    setSongCollection({ set: songCollection.set, currentIndex: prevIndex });
    playSong(trackList[prevIndex]);
  };

  return (
    <div className="bg-neutral-900 p-4 flex items-center justify-between rounded-xl shadow-md">
      <div className="flex items-center space-x-4">
        <button onClick={handlePrevious} className="text-white">
          ⏮️
        </button>
        <button onClick={togglePlayPause} className="text-white">
          {isPlaying ? "⏸️" : "▶️"}
        </button>
        <button onClick={handleNext} className="text-white">
          ⏭️
        </button>
      </div>
      <div className="flex flex-col ml-4 w-full">
        <audio
          id="audio-player"
          ref={audioRef}
          onTimeUpdate={handleTimeUpdate}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-neutral-400">
          <span>{Math.floor(currentTime)}s</span>
        </div>
      </div>
    </div>
  );
}
