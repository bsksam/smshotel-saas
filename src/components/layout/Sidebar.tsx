import Link from "next/link";
import { Building2, LayoutDashboard, Key, Users, Settings, LogOut } from "lucide-react";

export function Sidebar() {
  const navItems = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Hotels", href: "/hotels", icon: Building2 },
    { name: "Licenses", href: "/licenses", icon: Key },
    { name: "Users", href: "/users", icon: Users },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <aside className="w-64 bg-white border-r h-screen flex flex-col fixed top-0 left-0">
      <div className="h-16 flex items-center px-6 border-b">
        <h1 className="text-xl font-bold text-blue-600">SMSHOTEL</h1>
        <span className="ml-2 text-xs font-semibold px-2 py-1 bg-blue-100 text-blue-800 rounded-full">SAAS</span>
      </div>
      
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100 hover:text-blue-600 transition-colors"
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t">
        <button className="flex w-full items-center gap-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors">
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
