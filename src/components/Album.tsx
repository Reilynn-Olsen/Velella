import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useJellyfin } from "../jellyfin-context";
import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client";
import { getItemsApi } from "@jellyfin/sdk/lib/utils/api/items-api";
import usePlaySong from "../helperFunctions/PlaySong";
import { useSongCollectionContext } from "../songCollection-context";
import { usePlayPauseStore } from "../playPauseStore";

export default function Album() {
  const setPlay = usePlayPauseStore((s) => s.setPlay);
  const { id } = useParams();
  const { jellyfinAPI } = useJellyfin();
  const { songCollection, setSongCollection } = useSongCollectionContext();
  const { playSong } = usePlaySong();

  const [album, setAlbum] = useState<BaseItemDto | null>(null);
  const [tracks, setTracks] = useState<BaseItemDto[]>([]);

  useEffect(() => {
    const fetchAlbumData = async () => {
      if (!jellyfinAPI || !id) {
        return;
      }

      const itemApi = getItemsApi(jellyfinAPI);

      const albumResponse = await itemApi.getItems({
        ids: [id],
      });

      if (!albumResponse.data.Items) {
        return;
      }
      setAlbum(albumResponse.data.Items[0]);

      const trackResponse = await itemApi.getItems({
        parentId: id,
        sortBy: ["IndexNumber"],
        includeItemTypes: ["Audio"],
      });

      setTracks(trackResponse.data.Items || []);
      setSongCollection({
        set: trackResponse.data.Items || [],
        currentIndex: null,
      });
    };

    fetchAlbumData();
  }, [id, jellyfinAPI, setSongCollection]);

  if (!jellyfinAPI || !album) {
    return <div className="text-white p-8">Loading...</div>;
  }

  const handlePlay = (track: BaseItemDto, currentIndex: number) => {
    setSongCollection({
      set: songCollection ? songCollection.set : [],
      currentIndex,
    });

    setPlay();
    playSong(track);
  };

  const isCurrentTrack = (track: BaseItemDto) => {
    if (!songCollection || !songCollection.currentIndex) {
      return;
    }
    console.log(track.Id);
    console.log(songCollection.set[songCollection.currentIndex].Id);
    return track.Id === songCollection.set[songCollection.currentIndex].Id;
  };

  return (
    <div className="max-w-5xl mx-auto p-8 text-white min-w-full">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-12">
        <img
          src={`${jellyfinAPI.configuration.basePath}/Items/${album.Id}/Images/Primary?fillHeight=300&fillWidth=300&quality=90`}
          alt={`Album art of ${album.Name}`}
          className="w-60 h-60 rounded-lg shadow-md object-cover"
        />
        <div>
          <h1 className="text-3xl font-bold mb-2">{album.Name}</h1>
          <p className="text-lg text-neutral-400 mb-4">
            {album.Artists?.join(", ") || "Unknown Artist"}
          </p>
          <div className="flex gap-4">
            <button className="bg-violet-600 hover:bg-violet-700 text-white px-5 py-2 rounded-xl transition">
              Play
            </button>
          </div>
        </div>
      </div>

      <div className="bg-neutral-900 p-6 rounded-xl shadow space-y-4">
        <h2 className="text-xl font-semibold mb-4">Track List</h2>
        <ul className="space-y-2">
          {tracks.map((track, index) => (
            <li
              onClick={() => handlePlay(track, index)}
              key={track.Id}
              className={`flex items-center justify-between px-4 py-2 ${isCurrentTrack(track) ? "bg-violet-600" : "bg-neutral-800"} rounded-md hover:bg-neutral-700 transition`}
            >
              <div className="flex items-center gap-3">
                <span className="text-sm text-neutral-400 w-6">
                  {index + 1}
                </span>
                <span className="text-base">{track.Name}</span>
              </div>
              <span className="text-sm text-neutral-400">
                {(track.RunTimeTicks &&
                  Math.floor(track.RunTimeTicks / 10000000 / 60)) ||
                  "--"}
                :
                {(track.RunTimeTicks &&
                  Math.floor((track.RunTimeTicks / 10000000) % 60)
                    .toString()
                    .padStart(2, "0")) ||
                  "--"}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
