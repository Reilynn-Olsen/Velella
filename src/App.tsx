import { useState } from "react";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import { Api } from "@jellyfin/sdk";

function App() {
  //TODO
  // try to recreate the api via JWTs?
  const [jellyfinAPI, setJellyfinAPI] = useState<null | Api>(null);
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
