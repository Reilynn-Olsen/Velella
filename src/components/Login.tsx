import { useState } from "react";
import TextInput from "./TextInput";
import { Api } from "@jellyfin/sdk";
import { jellyfinInfo, localStorageKeys } from "../jellyfinAPIConfig";

type LoginProps = {
  setJellyfinAPI: (a: Api) => void;
};

export default function Login(Props: LoginProps) {
  const [address, setAddress] = useState("");
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");

  const { setJellyfinAPI } = Props;

  const onSubmit = async () => {
    if (!address || !user || !password) {
      return;
    }
    try {
      const api = jellyfinInfo.createApi(address);

      const auth = await api.authenticateUserByName(user, password);

      if (!auth.data.AccessToken) {
        return;
      }

      localStorage.setItem(localStorageKeys.address, address);
      localStorage.setItem(localStorageKeys.accessToken, auth.data.AccessToken);

      setJellyfinAPI(api);
    } catch (e) {
      //TODO: Implement
      console.error(e);
    }
  };

  return (
    <div className="h-screen">
      <div className="flex  gap-5 flex-col justify-evenly items-center h-1/4">
        <h1 className="">Log into your jellyfin server</h1>
        <TextInput
          value={address}
          setValue={setAddress}
          title="Address"
          name="user"
        />
        <TextInput value={user} setValue={setUser} title="User" name="user" />
        <TextInput
          value={password}
          setValue={setPassword}
          title="Password"
          type="password"
          name="password"
        />
        <button
          className="rounded-lg border-2 w-96 h-10 border-purple-300 text-purple-300"
          onClick={onSubmit}
        >
          Log in
        </button>
      </div>
    </div>
  );
}
