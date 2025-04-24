import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client";
import { useJellyfin } from "../jellyfin-context";
import { getItemsApi } from "@jellyfin/sdk/lib/utils/api/items-api";
import { getUserApi } from "@jellyfin/sdk/lib/utils/api/user-api";
import { getMediaInfoApi } from "@jellyfin/sdk/lib/utils/api/media-info-api";

const usePlaySong = () => {
  const { jellyfinAPI } = useJellyfin();

  const playSong = async (song: BaseItemDto) => {
    if (!jellyfinAPI) {
      return;
    }

    try {
      if (song.AlbumId) {
        const itemsApi = getItemsApi(jellyfinAPI);
        const albumTracksResponse = await itemsApi.getItems({
          parentId: song.AlbumId,
          sortBy: ["IndexNumber"],
          includeItemTypes: ["Audio"],
        });

        const sortedTracks = albumTracksResponse.data.Items || [];
        const songIndex = sortedTracks.findIndex(
          (track: BaseItemDto) => track.Id === song.Id,
        );

        if (songIndex !== -1) {
          startPlayback(sortedTracks, songIndex);
        }
      } else {
        // No album context, just play the single song
        startPlayback([song], 0);
      }
    } catch (error) {
      console.error("Error starting playback:", error);
    }
  };

  const startPlayback = async (playlist: BaseItemDto[], startIndex: number) => {
    if (!jellyfinAPI) {
      return;
    }
    const currentSong = playlist[startIndex];
    const mediaInfoApi = getMediaInfoApi(jellyfinAPI);
    const userApi = getUserApi(jellyfinAPI);

    if (!currentSong?.Id) return;

    const mediaInfo = await mediaInfoApi.getPlaybackInfo({
      itemId: currentSong.Id,
    });

    const mediaSource = mediaInfo?.data?.MediaSources?.[0];
    if (!mediaSource) {
      console.warn("No media source found for playback");
      return;
    }

    const serverUrl = jellyfinAPI.basePath;
    const userId = (await userApi.getCurrentUser()).data.Id;
    const deviceId = jellyfinAPI.deviceInfo.id;
    const accessToken = jellyfinAPI.accessToken;

    // Construct the direct streaming URL
    const streamUrl =
      `${serverUrl}/Audio/${currentSong.Id}/universal?` +
      new URLSearchParams({
        UserId: userId ?? "",
        DeviceId: deviceId ?? "",
        MediaSourceId: mediaSource.Id ?? "",
        api_key: accessToken ?? "",
        MaxStreamingBitrate: "320000",
        TranscodingContainer: "mp3",
        TranscodingProtocol: "http",
        AudioCodec: "mp3",
      });

    const audioElement = document.getElementById(
      "audio-player",
    ) as HTMLAudioElement;
    if (audioElement) {
      audioElement.pause();
      audioElement.removeAttribute("src");
      audioElement.load();
      audioElement.src = streamUrl;
      audioElement.play();
    }
  };

  return { playSong };
};

export default usePlaySong;
