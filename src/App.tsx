import { useState } from "react";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import { Api } from "@jellyfin/sdk";
import { localStorageKeys, jellyfinInfo } from "./jellyfinAPIConfig";
import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import Sidebar from "./components/Sidebar";
import { SearchBar } from "./components/SearchBar";

function App() {
  const attemptToMakeAPI = (): null | Api => {
    const address = localStorage.getItem(localStorageKeys.address);

    const accessToken = localStorage.getItem(localStorageKeys.accessToken);

    if (!address || !accessToken) {
      return null;
    }

    return jellyfinInfo.createApi(address, accessToken);
  };

  const [jellyfinAPI, setJellyfinAPI] = useState<null | Api>(
    attemptToMakeAPI(),
  );

  return (
    <MantineProvider>
      <div className="text-white  bg-gradient-to-r from-neutral-800 to-neutral-950 ">
        {jellyfinAPI ? (
          <div className="flex h-screen bg-neutral-950 text-white font-sans">
            <Sidebar />
            <div className="flex-1 p-8 bg-gradient-to-b from-neutral-900 to-neutral-950 overflow-y-auto">
              <SearchBar />
              <Dashboard jellyfinAPI={jellyfinAPI} />
            </div>
          </div>
        ) : (
          <Login setJellyfinAPI={(a: Api) => setJellyfinAPI(a)} />
        )}
      </div>
    </MantineProvider>
  );
}

export default App;
