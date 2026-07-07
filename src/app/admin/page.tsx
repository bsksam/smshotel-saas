import { Building2, Key, Users, Activity, AlertTriangle } from "lucide-react";

export default function AdminDashboard() {
  const stats = [
    { label: "Total Hotels", value: "124", icon: Building2, color: "text-zinc-900", bg: "bg-zinc-100" },
    { label: "Active Licenses", value: "112", icon: Key, color: "text-zinc-900", bg: "bg-zinc-100" },
    { label: "Total Users", value: "845", icon: Users, color: "text-zinc-900", bg: "bg-zinc-100" },
    { label: "System Health", value: "99.9%", icon: Activity, color: "text-emerald-600", bg: "bg-emerald-50" },
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      <div>
        <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">Dashboard Overview</h2>
        <p className="text-zinc-500 mt-1 text-sm">Welcome back, Super Admin. Here's what's happening today.</p>
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
          <h3 className="text-lg font-bold text-zinc-900 mb-6 tracking-tight">Recent Licenses Issued</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-zinc-100 hover:border-zinc-300 transition-colors bg-zinc-50/50">
                <div>
                  <p className="font-semibold text-zinc-900 text-sm">Grand Taj Hotel - Mumbai</p>
                  <p className="text-xs text-zinc-500 font-mono mt-1">Key: XXXX-XXXX-XXXX-XXXX</p>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                    Active
                  </span>
                  <p className="text-xs text-zinc-400 mt-1">Expires: Dec 31, 2026</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-zinc-200/60 shadow-sm p-6">
            <h3 className="text-lg font-bold text-zinc-900 mb-6 tracking-tight">System Alerts</h3>
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-100 flex gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                <div>
                  <p className="font-semibold text-amber-900 text-sm">License Expiring Soon</p>
                  <p className="text-xs text-amber-700 mt-1">3 licenses are expiring in the next 7 days.</p>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 flex gap-3">
                <Activity className="w-5 h-5 text-blue-600 shrink-0" />
                <div>
                  <p className="font-semibold text-blue-900 text-sm">System Update</p>
                  <p className="text-xs text-blue-700 mt-1">New GST compliance features have been rolled out.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
