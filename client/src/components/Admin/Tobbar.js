import { Input } from "../ui/input";

export default function Topbar({ name }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-xl font-medium text-gray-700">{name}</h1>
      <div className="flex items-center gap-4">
        <button className="p-2 rounded-full hover:bg-gray-100">
          <div className="w-5 h-5 bg-gray-700 rounded-full" />
        </button>
        <button className="p-2 rounded-full hover:bg-gray-100 relative">
          <div className="w-5 h-5">🔔</div>
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
            1
          </span>
        </button>
        <button className="p-2 rounded-full hover:bg-gray-100">⚙️</button>
        <button className="p-2 rounded-full hover:bg-gray-100">🕒</button>
        <div className="w-8 h-8 rounded-full bg-gray-200" />
        <div className="relative">
          <Input className="w-64 bg-gray-50 pl-10" placeholder="Search..." />
          <span className="absolute left-3 top-2.5">🔍</span>
        </div>
      </div>
    </div>
  );
}
