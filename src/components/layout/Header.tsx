import { Bell, Search } from "lucide-react";

export function Header() {
  return (
    <header className="h-16 bg-white/60 backdrop-blur-md border-b border-zinc-200/60 flex items-center justify-between px-8 sticky top-0 z-10">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input 
            type="text" 
            placeholder="Search hotels, licenses, users..." 
            className="w-full pl-10 pr-4 py-2 bg-zinc-50 border-zinc-200 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all shadow-sm"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button className="text-zinc-500 hover:text-zinc-900 transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end">
            <span className="text-sm font-semibold text-zinc-900 leading-tight">Super Admin</span>
            <span className="text-[11px] font-medium text-zinc-500 uppercase tracking-widest">System Manager</span>
          </div>
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-zinc-900 to-zinc-700 flex items-center justify-center text-white font-bold shadow-sm border border-white/20 text-sm">
            SA
          </div>
        </div>
      </div>
    </header>
  );
}
