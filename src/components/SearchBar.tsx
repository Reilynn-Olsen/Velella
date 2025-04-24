import React, { useState } from "react";
import { useJellyfin } from "../jellyfin-context";
import { TextInput } from "@mantine/core";
import { getItemsApi } from "@jellyfin/sdk/lib/utils/api/items-api";
import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client";
import { Link } from "react-router";

export default function SearchBar() {
  const [query, setQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<BaseItemDto[]>([]); // Change to a more specific type
  const { jellyfinAPI } = useJellyfin(); // Access Jellyfin API from context

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSearch = async () => {
    if (!query) return;

    try {
      if (!jellyfinAPI) {
        throw new Error("jellyfin API was null");
      }
      const itemApi = getItemsApi(jellyfinAPI);
      // Search using Jellyfin API (you may need to adjust the method based on the SDK)
      const response = await itemApi.getItems({
        searchTerm: query,
        recursive: true,
        includeItemTypes: ["MusicAlbum", "MusicArtist"], // Filter by type (albums,  artists)
      });

      setSearchResults(response.data.Items ? response.data.Items : []);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  return (
    <div className="mb-8">
      <TextInput
        value={query}
        onChange={handleSearchChange}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        placeholder="Search for music, artists, albums..."
        className="w-full px-4 py-2 rounded-lg bg-neutral-800 text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
      />

      <div className="mt-4 space-y-4">
        {searchResults.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-neutral-200">
              Search Results:
            </h3>
            <ul className="space-y-2">
              {searchResults.map((item, i) => (
                <Link
                  key={i}
                  to={`/${item.Artists ? "Album" : "Artist"}/${item.Id}`}
                  onClick={() => setSearchResults([])}
                >
                  <li className="bg-neutral-800 p-4 rounded-xl shadow-md hover:bg-neutral-700">
                    <div className="flex items-center space-x-4">
                      <img
                        src={`${jellyfinAPI?.configuration.basePath}/Items/${item.Id}/Images/Primary?fillHeight=300&fillWidth=300&quality=90`}
                        alt={`search result image: ${item.Name}`}
                        className="w-16 h-16 rounded-lg"
                      />
                      <div>
                        <p className="text-sm font-medium">{item.Name}</p>
                      </div>
                    </div>
                  </li>
                </Link>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
