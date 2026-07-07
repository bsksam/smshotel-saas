import { 
  Users, 
  DoorOpen, 
  Wallet, 
  TrendingUp, 
  Coffee, 
  Wine, 
  Calendar,
  AlertCircle
} from "lucide-react";

export default function HotelDashboard() {
  const kpis = [
    { title: "Today's Check-ins", value: "12", icon: Users, color: "text-blue-600", bg: "bg-blue-100" },
    { title: "Today's Check-outs", value: "8", icon: Calendar, color: "text-orange-600", bg: "bg-orange-100" },
    { title: "Occupied Rooms", value: "45/60", icon: DoorOpen, color: "text-purple-600", bg: "bg-purple-100" },
    { title: "Available Rooms", value: "15", icon: DoorOpen, color: "text-green-600", bg: "bg-green-100" },
    { title: "Restaurant Sales", value: "₹24,500", icon: Coffee, color: "text-amber-600", bg: "bg-amber-100" },
    { title: "Bar Sales", value: "₹18,200", icon: Wine, color: "text-red-600", bg: "bg-red-100" },
    { title: "Cash Collection", value: "₹42,000", icon: Wallet, color: "text-emerald-600", bg: "bg-emerald-100" },
    { title: "Occupancy Rate", value: "75%", icon: TrendingUp, color: "text-indigo-600", bg: "bg-indigo-100" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Hotel Dashboard</h2>
          <p className="text-gray-500 mt-1">Real-time overview of today's operations.</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold text-gray-800">July 7, 2026</p>
          <p className="text-xs text-gray-500">11:15 AM</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.title} className="bg-white rounded-xl border p-5 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${kpi.bg}`}>
                <Icon className={`w-6 h-6 ${kpi.color}`} />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{kpi.title}</p>
                <h3 className="text-xl font-bold text-gray-900 mt-0.5">{kpi.value}</h3>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <div className="lg:col-span-2 bg-white rounded-xl border shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Revenue Trend (Last 7 Days)</h3>
          <div className="h-64 flex items-end gap-2">
            {[40, 60, 45, 80, 100, 75, 90].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col justify-end group">
                <div 
                  className="bg-blue-100 group-hover:bg-blue-200 rounded-t-sm transition-colors relative" 
                  style={{ height: `${h}%` }}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    ₹{(h * 1000).toLocaleString()}
                  </div>
                </div>
                <p className="text-center text-xs text-gray-500 mt-2">Day {i + 1}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-900">Task Alerts</h3>
            <span className="bg-red-100 text-red-800 text-xs font-semibold px-2 py-1 rounded-full">3 New</span>
          </div>
          <div className="space-y-4">
            <div className="flex gap-3 items-start">
              <AlertCircle className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-gray-800">Room 204 requires cleaning</p>
                <p className="text-xs text-gray-500">Guest checked out 30 mins ago.</p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-gray-800">Low Inventory: Water Bottles</p>
                <p className="text-xs text-gray-500">Stock below minimum threshold (15 left).</p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <AlertCircle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-gray-800">Pending Advance</p>
                <p className="text-xs text-gray-500">Room 105 reservation advance pending.</p>
              </div>
            </div>
          </div>
          <button className="w-full mt-6 py-2 text-sm text-blue-600 font-medium border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors">
            View All Tasks
          </button>
        </div>
      </div>
    </div>
  );
}
