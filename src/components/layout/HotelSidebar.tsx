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
    { name: "Guests", href: "/guests", icon: Users },
    { name: "Restaurant", href: "/restaurant", icon: Utensils },
    { name: "Bar", href: "/bar", icon: Wine },
    { name: "Housekeeping", href: "/housekeeping", icon: Brush },
    { name: "Billing", href: "/billing", icon: Receipt },
    { name: "Expenses", href: "/expenses", icon: Calculator },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <aside className="w-64 bg-white/50 backdrop-blur-xl border-r border-zinc-200 h-screen flex flex-col fixed top-0 left-0">
      <div className="h-16 flex items-center px-6 border-b border-zinc-200/60">
        <div className="w-8 h-8 bg-zinc-950 rounded-lg flex items-center justify-center mr-3">
          <span className="text-white font-bold text-sm tracking-tighter">GT</span>
        </div>
        <h1 className="text-lg font-bold text-zinc-900 tracking-tight">Grand Taj</h1>
      </div>
      
      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
        <p className="px-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-4">Hotel Management</p>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 text-zinc-600 rounded-lg hover:bg-zinc-100/80 hover:text-zinc-950 transition-all duration-200"
            >
              <Icon className="w-4 h-4" />
              <span className="font-medium text-sm">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-zinc-200/60">
        <form action={async () => {
          "use server"
          const { signOut } = await import("@/lib/auth");
          await signOut();
        }}>
          <button type="submit" className="flex w-full items-center gap-3 px-3 py-2.5 text-zinc-600 rounded-lg hover:bg-zinc-100 hover:text-zinc-950 transition-all duration-200">
            <LogOut className="w-4 h-4" />
            <span className="font-medium text-sm">Sign Out</span>
          </button>
        </form>
      </div>
    </aside>
  );
}
