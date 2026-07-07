import { Bell, Search } from "lucide-react";

export function Header() {
  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-8 sticky top-0 z-10">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search hotels, licenses, users..." 
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border-gray-200 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button className="relative text-gray-500 hover:text-gray-700 transition-colors">
          <Bell className="w-6 h-6" />
          <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
            SA
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-700 leading-none">Super Admin</span>
            <span className="text-xs text-gray-500">System Manager</span>
          </div>
        </div>
      </div>
    </header>
  );
}
