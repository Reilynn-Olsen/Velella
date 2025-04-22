export function SearchBar() {
  return (
    <div className="mb-8">
      <input
        type="text"
        placeholder="Search for music, artists, albums..."
        className="w-full px-4 py-2 rounded-lg bg-neutral-800 text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
      />
    </div>
  );
}
