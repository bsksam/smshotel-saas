import { Building2, Key, Users, Activity } from "lucide-react";

export default function AdminDashboard() {
  const stats = [
    { title: "Total Hotels", value: "124", icon: Building2, color: "text-blue-600", bg: "bg-blue-100" },
    { title: "Active Licenses", value: "112", icon: Key, color: "text-green-600", bg: "bg-green-100" },
    { title: "Total Users", value: "845", icon: Users, color: "text-purple-600", bg: "bg-purple-100" },
    { title: "System Health", value: "99.9%", icon: Activity, color: "text-emerald-600", bg: "bg-emerald-100" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
          <p className="text-gray-500 mt-1">Welcome back, Super Admin. Here's what's happening today.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.title} className="bg-white rounded-xl border p-6 shadow-sm flex items-center gap-4">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center ${stat.bg}`}>
                <Icon className={`w-7 h-7 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</h3>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-white rounded-xl border p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Licenses Issued</h3>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex justify-between items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div>
                  <p className="font-semibold text-gray-800">Grand Taj Hotel - Mumbai</p>
                  <p className="text-xs text-gray-500 mt-1">Key: XXXX-XXXX-XXXX-XXXX</p>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Active
                  </span>
                  <p className="text-xs text-gray-500 mt-1">Expires: Dec 31, 2026</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">System Alerts</h3>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-200 text-yellow-800">
              <p className="font-semibold">License Expiring Soon</p>
              <p className="text-sm mt-1">3 licenses are expiring in the next 7 days.</p>
            </div>
            <div className="p-4 rounded-lg bg-blue-50 border border-blue-200 text-blue-800">
              <p className="font-semibold">System Update</p>
              <p className="text-sm mt-1">New GST compliance features have been rolled out.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
