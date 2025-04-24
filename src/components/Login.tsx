import { useState } from "react";
import { jellyfinInfo, localStorageKeys } from "../jellyfinAPIConfig";
import {
  TextInput,
  PasswordInput,
  Button,
  Paper,
  Title,
  Container,
} from "@mantine/core";
import { useJellyfin } from "../jellyfin-context";

export default function Login() {
  const [address, setAddress] = useState("");
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");

  const { setJellyfinAPI } = useJellyfin();

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
    <div className="flex items-center justify-center min-h-screen bg-neutral-950 text-white">
      <Container unstyled size={420} className="bg-transparent">
        <Paper
          unstyled
          withBorder
          shadow="md"
          p={30}
          radius="md"
          className="bg-neutral-900 border border-neutral-800"
        >
          <Title order={2} className="text-neutral-200 mb-6 text-center">
            Log in to Streamify
          </Title>
          <TextInput
            label="Server Address"
            placeholder="https://my-music-server.com"
            required
            onChange={(e) => setAddress(e.target.value)}
            value={address}
            classNames={{
              input: "bg-neutral-800 text-neutral-100",
              label: "text-neutral-300",
            }}
          />
          <TextInput
            label="Username"
            placeholder="Your Username"
            required
            onChange={(e) => setUser(e.target.value)}
            value={user}
            mt="md"
            classNames={{
              input: "bg-neutral-800 text-neutral-100",
              label: "text-neutral-300",
            }}
          />
          <PasswordInput
            label="Password"
            placeholder="Your Password"
            required
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            mt="md"
            classNames={{
              input: "bg-neutral-800 text-neutral-100",
              label: "text-neutral-300",
            }}
          />
          <Button
            fullWidth
            mt="xl"
            radius="xl"
            color="violet"
            onClick={onSubmit}
          >
            Log in
          </Button>
        </Paper>
      </Container>
    </div>
  );
}
