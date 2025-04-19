import { useState } from "react";
import Dashboard from "./components/Dashboard";
import Login, { jellyfinInfo, localStorageKeys } from "./components/Login";
import { Api } from "@jellyfin/sdk";

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
  console.log(jellyfinAPI);

  return (
    <>
      {jellyfinAPI ? (
        <Dashboard />
      ) : (
        <Login setJellyfinAPI={(a: Api) => setJellyfinAPI(a)} />
      )}
    </>
  );
}

export default App;
