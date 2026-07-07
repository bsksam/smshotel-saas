import Link from "next/link";
import { 
  LayoutDashboard, 
  DoorOpen, 
  Users, 
  CalendarCheck, 
  Utensils, 
  Wine, 
  ClipboardList, 
  Receipt,
  Settings,
  LogOut,
  Brush,
  Calculator
} from "lucide-react";

export function HotelSidebar() {
  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Front Desk", href: "/front-desk/check-in", icon: ClipboardList },
    { name: "Reservations", href: "/reservations", icon: CalendarCheck },
    { name: "Rooms", href: "/rooms", icon: DoorOpen },
    { name: "Restaurant", href: "/restaurant", icon: Utensils },
    { name: "Bar", href: "/bar", icon: Wine },
    { name: "Housekeeping", href: "/housekeeping", icon: Brush },
    { name: "Billing", href: "/billing", icon: Receipt },
    { name: "Expenses", href: "/expenses", icon: Calculator },
    { name: "Settings", href: "/hotel-settings", icon: Settings },
  ];

  return (
    <aside className="w-64 bg-white border-r h-screen flex flex-col fixed top-0 left-0 z-20">
      <div className="h-16 flex items-center px-6 border-b bg-blue-600 text-white">
        <h1 className="text-xl font-bold truncate">Grand Taj Hotel</h1>
      </div>
      
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-3">
          Hotel Management
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-colors"
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600">
            JD
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-800">John Doe</span>
            <span className="text-xs text-gray-500">Manager</span>
          </div>
        </div>
        <button className="flex w-full items-center gap-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors">
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
