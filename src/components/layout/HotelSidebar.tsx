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
  Calculator,
  ChefHat
} from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function HotelSidebar() {
  const session = await auth();
  // @ts-ignore
  const tenantId = session?.user?.tenantId;
  let tenantName = "Grand Taj";
  let tenantInitials = "GT";

  if (tenantId) {
    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId }
    });
    if (tenant) {
      tenantName = tenant.name;
      tenantInitials = tenant.name.split(" ").map((n: string) => n[0]).join("").substring(0, 2).toUpperCase();
    }
  }

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, color: "text-indigo-500", hoverBg: "hover:bg-indigo-50 hover:text-indigo-700" },
    { name: "Front Desk", href: "/front-desk/check-in", icon: ClipboardList, color: "text-blue-500", hoverBg: "hover:bg-blue-50 hover:text-blue-700" },
    { name: "Reservations", href: "/reservations", icon: CalendarCheck, color: "text-emerald-500", hoverBg: "hover:bg-emerald-50 hover:text-emerald-700" },
    { name: "Rooms", href: "/rooms", icon: DoorOpen, color: "text-teal-500", hoverBg: "hover:bg-teal-50 hover:text-teal-700" },
    { name: "Guests", href: "/guests", icon: Users, color: "text-amber-500", hoverBg: "hover:bg-amber-50 hover:text-amber-700" },
    { name: "Restaurant", href: "/restaurant", icon: Utensils, color: "text-fuchsia-500", hoverBg: "hover:bg-fuchsia-50 hover:text-fuchsia-700" },
    { name: "Bar", href: "/bar", icon: Wine, color: "text-pink-500", hoverBg: "hover:bg-pink-50 hover:text-pink-700" },
    { name: "Kitchen", href: "/kitchen", icon: ChefHat, color: "text-orange-500", hoverBg: "hover:bg-orange-50 hover:text-orange-700" },
    { name: "Housekeeping", href: "/housekeeping", icon: Brush, color: "text-indigo-500", hoverBg: "hover:bg-indigo-50 hover:text-indigo-700" },
    { name: "Billing", href: "/billing", icon: Receipt, color: "text-purple-500", hoverBg: "hover:bg-purple-50 hover:text-purple-700" },
    { name: "Expenses", href: "/expenses", icon: Calculator, color: "text-rose-500", hoverBg: "hover:bg-rose-50 hover:text-rose-700" },
    { name: "Settings", href: "/settings", icon: Settings, color: "text-sky-500", hoverBg: "hover:bg-sky-50 hover:text-sky-700" },
  ];

  return (
    <aside className="w-64 bg-gradient-to-b from-white to-zinc-50 border-r border-zinc-200 h-screen flex flex-col fixed top-0 left-0 shadow-sm">
      <div className="h-16 flex items-center px-6 border-b border-zinc-200/60">
        <div className="w-9 h-9 bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-3 shadow-md shadow-indigo-100">
          <span className="text-white font-extrabold text-sm tracking-tighter">{tenantInitials}</span>
        </div>
        <h1 className="text-base font-extrabold text-zinc-800 tracking-tight">{tenantName}</h1>
      </div>
      
      <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
        <p className="px-3 text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-4">Hotel Management</p>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 text-zinc-650 rounded-xl transition-all duration-200 ${item.hoverBg} group`}
            >
              <Icon className={`w-4.5 h-4.5 transition-colors ${item.color}`} />
              <span className="font-bold text-xs">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-zinc-200/60 bg-zinc-50/50">
        <form action={async () => {
          "use server"
          const { signOut } = await import("@/lib/auth");
          await signOut();
        }}>
          <button type="submit" className="flex w-full items-center gap-3 px-3 py-2 text-zinc-600 rounded-xl hover:bg-rose-50 hover:text-rose-700 transition-all duration-200 font-bold text-xs">
            <LogOut className="w-4.5 h-4.5 text-rose-500" />
            <span>Sign Out</span>
          </button>
        </form>
      </div>
    </aside>
  );
}
