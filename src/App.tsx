import Dashboard from "./components/Dashboard";
import { useState } from "react";
import Login from "./components/Login";
import { Api } from "@jellyfin/sdk";
import { localStorageKeys, jellyfinInfo } from "./jellyfinAPIConfig";
import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import { BrowserRouter, Routes, Route } from "react-router";
import { JellyfinContext } from "./jellyfin-context";
import { songCollectionContext } from "./songCollection-context";
import MainLayout from "./components/MainLayout";
import Album from "./components/Album";
import Artist from "./components/Artist";
import { collection } from "./types";

function App() {
  const attemptToMakeAPI = (): null | Api => {
    const address = localStorage.getItem(localStorageKeys.address);

    const accessToken = localStorage.getItem(localStorageKeys.accessToken);

    if (!address || !accessToken) {
      return null;
    }

    return jellyfinInfo.createApi(address, accessToken);
  };
  const [jellyfinAPI, setJellyfinAPI] = useState<Api | null>(
    attemptToMakeAPI(),
  );
  const [songCollection, setSongCollection] = useState<collection | null>(null);

  return (
    <JellyfinContext.Provider value={{ jellyfinAPI, setJellyfinAPI }}>
      <songCollectionContext.Provider
        value={{ songCollection, setSongCollection }}
      >
        <MantineProvider>
          <div className="text-white  bg-gradient-to-r from-neutral-800 to-neutral-950 ">
            <div className="flex h-screen bg-neutral-950 text-white font-sans">
              <BrowserRouter>
                <Routes>
                  <Route Component={MainLayout}>
                    <Route path="/" Component={Dashboard} />
                    <Route path="/Album/:id" Component={Album} />
                    <Route path="/Artist/:id" Component={Artist} />
                  </Route>
                  <Route path="/Login" Component={Login} />
                </Routes>
              </BrowserRouter>
            </div>
          </div>
        </MantineProvider>
      </songCollectionContext.Provider>
    </JellyfinContext.Provider>
  );
}

export default App;
