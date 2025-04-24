import { Button } from "@mantine/core";
import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";
import { getUserLibraryApi } from "@jellyfin/sdk/lib/utils/api/user-library-api";
import { getItemsApi } from "@jellyfin/sdk/lib/utils/api/items-api";
import { ItemFields } from "@jellyfin/sdk/lib/generated-client/models";
import { useEffect, useState } from "react";
import { useJellyfin } from "../jellyfin-context";
import { Link } from "react-router";

export default function Dashboard() {
  const { jellyfinAPI } = useJellyfin();

  const [latestAlbums, setLatestAlbums] = useState<BaseItemDto[] | null>(null);
  const [artists, setArtists] = useState<BaseItemDto[] | null>(null);
  const [featuredItem, setFeaturedItem] = useState<BaseItemDto | null>(null);

  useEffect(() => {
    const asyncWrapper = async () => {
      if (!jellyfinAPI) {
        return;
      }
      const recentLibraryApi = getUserLibraryApi(jellyfinAPI);
      const latestMedia = await recentLibraryApi.getLatestMedia();

      setLatestAlbums(
        latestMedia.data.filter((el) => el.Type === "MusicAlbum"),
      );

      const itemsApi = getItemsApi(jellyfinAPI);
      const albums = (
        await itemsApi.getItems({
          includeItemTypes: ["MusicAlbum"],
          recursive: true,
          fields: [ItemFields.PrimaryImageAspectRatio],
        })
      ).data.Items;
      const artistsRes = (
        await itemsApi.getItems({
          includeItemTypes: ["MusicArtist"],
          recursive: true,
          fields: [ItemFields.PrimaryImageAspectRatio],
        })
      ).data.Items;

      if (!albums) {
        return;
      }

      const randomIndex = Math.floor(Math.random() * albums.length);

      setFeaturedItem(albums[randomIndex]);
      if (!artistsRes) {
        return;
      }
      setArtists(artistsRes);
    };
    asyncWrapper();
  }, [jellyfinAPI]);

  if (!jellyfinAPI) {
    return <div></div>;
  }

  const renderFeaturedItem = () => {
    if (!featuredItem) {
      return null;
    }

    return (
      <Link to={`/Album/${featuredItem.Id}`}>
        <div className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Featured Album</h2>
          <div className="bg-neutral-800 p-6 rounded-2xl flex items-center space-x-6 shadow-md w-fit">
            <img
              src={`${jellyfinAPI.configuration.basePath}/Items/${featuredItem.Id}/Images/Primary?fillHeight=300&fillWidth=300&quality=90`}
              className="rounded-lg"
            />
            <div>
              <h3 className="text-lg font-bold">{featuredItem.Name}</h3>
              <p className="text-neutral-400">{featuredItem.Artists}</p>
              <Button color="gray">Play </Button>
            </div>
          </div>
        </div>
      </Link>
    );
  };

  const renderRecentlyPlayed = () => {
    if (!latestAlbums) {
      return null;
    }
    return (
      <div className="mb-12 w-fit">
        <h2 className="text-xl font-semibold mb-4">Latest Albums</h2>
        <div className="grid grid-cols-4 gap-6">
          {latestAlbums.map((el, i) => (
            <Link key={i} to={`/Album/${el.Id}`}>
              <div className="bg-neutral-800 p-4 rounded-xl shadow hover:bg-neutral-700 transition">
                <img
                  src={`${jellyfinAPI.configuration.basePath}/Items/${el.Id}/Images/Primary?fillHeight=300&fillWidth=300&quality=90`}
                  className="rounded mb-2"
                  alt="Recently Played"
                />

                <p className="text-sm font-medium">{el.Name}</p>
                <p className="text-xs text-neutral-400">{el.Artists}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  };
  const renderArtists = () => {
    if (!artists) {
      return null;
    }

    return (
      <div className="w-fit">
        <h2 className="text-xl font-semibold mb-4">Artists</h2>
        <div className="flex space-x-4">
          {artists.map((el, i) => (
            <Link key={i} to={`Artist/${el.Id}`}>
              <div className="w-40 h-48 w-fit flex flex-col items-center text-center bg-neutral-800 p-4 rounded-xl shadow hover:bg-neutral-700 transition">
                <img
                  src={`${jellyfinAPI.configuration.basePath}/Items/${el.Id}/Images/Primary?fillHeight=300&fillWidth=300&quality=90`}
                  className="w-16 h-16 rounded-full mb-2 object-cover"
                  alt="Artist Picture"
                />
                <p className="text-sm font-medium w-16 mt-1">{el.Name}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  };
  return (
    <div>
      {renderFeaturedItem()}
      {renderRecentlyPlayed()}
      {renderArtists()}
    </div>
  );
}
