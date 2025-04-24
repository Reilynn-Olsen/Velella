import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client";
import { useJellyfin } from "../jellyfin-context";
import { getItemsApi } from "@jellyfin/sdk/lib/utils/api/items-api";

export default function Artist() {
  const { id } = useParams();
  const { jellyfinAPI } = useJellyfin();

  const [artist, setArtist] = useState<BaseItemDto | null>(null);
  const [albums, setAlbums] = useState<BaseItemDto[]>([]);

  useEffect(() => {
    const fetchArtistData = async () => {
      if (!jellyfinAPI || !id) return;

      const itemApi = getItemsApi(jellyfinAPI);

      // Fetch artist details by ID
      const artistResponse = await itemApi.getItems({
        ids: [id],
      });

      if (artistResponse.data.Items && artistResponse.data.Items.length > 0) {
        setArtist(artistResponse.data.Items[0]);
      }

      // Fetch albums by artist
      const albumResponse = await itemApi.getItems({
        artistIds: [id], // Albums of this artist
        recursive: true,
        includeItemTypes: ["MusicAlbum"], // Only audio items (albums)
        sortBy: ["SortName"], // Sort by name
      });

      setAlbums(albumResponse.data.Items || []);
    };

    fetchArtistData();
  }, [id, jellyfinAPI]);

  if (!jellyfinAPI || !artist) {
    return <div className="text-white p-8">Loading...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-8 text-white">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-12">
        <img
          src={`${jellyfinAPI.configuration.basePath}/Items/${artist.Id}/Images/Primary?fillHeight=300&fillWidth=300&quality=90`}
          alt={`Album art of ${artist.Name}`}
          className="w-60 h-60 rounded-full shadow-md object-cover"
        />
        <div>
          <h1 className="text-3xl font-bold mb-2">{artist.Name}</h1>
        </div>
      </div>

      <div className="bg-neutral-900 p-6 rounded-xl shadow space-y-4">
        <h2 className="text-xl font-semibold mb-4">Albums</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {albums.map((album, i) => (
            <Link
              key={i}
              to={`/album/${album.Id}`} // Use the album's Id to link to the Album Page
              className="flex flex-col items-center bg-neutral-800 p-4 rounded-xl hover:bg-neutral-700 transition"
            >
              <img
                src={`${jellyfinAPI.configuration.basePath}/Items/${album.Id}/Images/Primary?fillHeight=300&fillWidth=300&quality=90`}
                alt={`Album art of ${album.Name}`}
                className="w-full h-40 rounded-md object-cover mb-4"
              />
              <h3 className="text-sm font-medium">{album.Name}</h3>
              <p className="text-xs text-neutral-400">
                {album.Artists?.join(", ") || "Unknown Artist"}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
