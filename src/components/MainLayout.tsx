import { Outlet } from "react-router";
import SearchBar from "./SearchBar";
import Sidebar from "./Sidebar";
import AudioPlayer from "./AudioPlayer";

export default function MainLayout() {
  return (
    <div className="flex h-screen bg-neutral-950 text-white font-sans w-full">
      <Sidebar />
      <main className="flex-1 p-8 bg-gradient-to-b from-neutral-900 to-neutral-950 overflow-y-auto min-w-0">
        <SearchBar />
        <Outlet />
        <div className="fixed bottom-0 right-0 z-50 w-full p-4 bg-neutral-900 border-t border-neutral-800">
          <AudioPlayer />
        </div>
      </main>
    </div>
  );
}
