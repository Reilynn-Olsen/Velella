export default function Sidebar() {
  return (
    <aside className="w-64 bg-neutral-900 p-6 flex flex-col justify-between">
      <div>
        <h1 className="text-2xl font-bold mb-8">Velella</h1>
        <nav className="space-y-4">
          <a href="#" className="block hover:text-purple-400">
            Home
          </a>
          <a href="#" className="block hover:text-purple-400">
            Browse
          </a>
          <a href="#" className="block hover:text-purple-400">
            Library
          </a>
          <a href="#" className="block hover:text-purple-400">
            Settings
          </a>
        </nav>
      </div>
      <div className="mt-8">
        <div className="flex items-center space-x-3">
          <img
            src="https://via.placeholder.com/40"
            className="rounded-full"
            alt="User profile"
          />
          <div>
            <p className="text-sm font-medium">Username</p>
            <p className="text-xs text-neutral-400">View Profile</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
