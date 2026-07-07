import { DoorOpen, CalendarCheck, Users, TrendingUp } from "lucide-react";

export default function HotelDashboard() {
  const stats = [
    { label: "Available Rooms", value: "45", icon: DoorOpen, color: "text-zinc-900", bg: "bg-zinc-100" },
    { label: "Today's Check-ins", value: "12", icon: CalendarCheck, color: "text-zinc-900", bg: "bg-zinc-100" },
    { label: "Active Guests", value: "128", icon: Users, color: "text-zinc-900", bg: "bg-zinc-100" },
    { label: "Occupancy Rate", value: "78%", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      <div>
        <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">Today's Overview</h2>
        <p className="text-zinc-500 mt-1 text-sm">Here's what's happening at Grand Taj today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white p-6 rounded-2xl border border-zinc-200/60 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-zinc-900 tracking-tight">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-zinc-200/60 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-zinc-900 tracking-tight">Recent Bookings</h3>
            <button className="text-sm font-medium text-zinc-600 hover:text-zinc-900">View All</button>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-zinc-100 hover:border-zinc-300 transition-colors bg-zinc-50/50">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-zinc-200 flex items-center justify-center text-zinc-600 font-bold text-sm">
                    {String.fromCharCode(64 + i)}
                  </div>
                  <div>
                    <p className="font-semibold text-zinc-900 text-sm">Guest Name {i}</p>
                    <p className="text-xs text-zinc-500 mt-0.5">Room 30{i} • 2 Nights</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-zinc-100 text-zinc-800 border border-zinc-200">
                    Confirmed
                  </span>
                  <p className="text-xs text-zinc-400 mt-1 font-mono">$245.00</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-zinc-200/60 shadow-sm p-6">
            <h3 className="text-lg font-bold text-zinc-900 mb-6 tracking-tight">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
              <button className="flex flex-col items-center justify-center p-4 rounded-xl border border-zinc-200 hover:bg-zinc-50 hover:border-zinc-300 transition-all gap-2 text-zinc-700">
                <CalendarCheck className="w-6 h-6 text-zinc-900" />
                <span className="text-xs font-semibold">New Booking</span>
              </button>
              <button className="flex flex-col items-center justify-center p-4 rounded-xl border border-zinc-200 hover:bg-zinc-50 hover:border-zinc-300 transition-all gap-2 text-zinc-700">
                <Users className="w-6 h-6 text-zinc-900" />
                <span className="text-xs font-semibold">Add Guest</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
