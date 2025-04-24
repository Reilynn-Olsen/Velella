import { Link } from "react-router";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-neutral-900 p-6 flex flex-col justify-between">
      <div>
        <h1 className="text-2xl font-bold mb-8">Velella</h1>
        <nav className="space-y-4">
          <Link to="/">
            <p className="block hover:text-purple-400">Home</p>
          </Link>
        </nav>
      </div>
    </aside>
  );
}
