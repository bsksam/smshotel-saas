import { Building2, Key, Users, Activity, AlertTriangle } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  // Query actual stats from the database
  const [totalHotels, activeLicenses, totalUsers, recentLicenses] = await Promise.all([
    prisma.tenant.count(),
    prisma.licenseKey.count({ where: { isActive: true } }),
    prisma.user.count(),
    prisma.licenseKey.findMany({
      include: { tenant: true },
      orderBy: { createdAt: "desc" },
      take: 3
    })
  ]);

  const stats = [
    { label: "Total Hotels", value: totalHotels.toString(), icon: Building2, color: "text-zinc-900", bg: "bg-zinc-100" },
    { label: "Active Licenses", value: activeLicenses.toString(), icon: Key, color: "text-zinc-900", bg: "bg-zinc-100" },
    { label: "Total Users", value: totalUsers.toString(), icon: Users, color: "text-zinc-900", bg: "bg-zinc-100" },
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
            <div key={index} className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm hover:shadow-md transition-shadow">
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
        <div className="lg:col-span-2 bg-white rounded-2xl border border-zinc-200 shadow-sm p-6">
          <h3 className="text-lg font-bold text-zinc-900 mb-6 tracking-tight">Recent Licenses Issued</h3>
          <div className="space-y-4">
            {recentLicenses.length === 0 ? (
              <p className="text-sm text-zinc-500 text-center py-8">No licenses issued yet.</p>
            ) : (
              recentLicenses.map((lic) => (
                <div key={lic.id} className="flex items-center justify-between p-4 rounded-xl border border-zinc-100 hover:border-zinc-300 transition-colors bg-zinc-50/50">
                  <div>
                    <p className="font-semibold text-zinc-900 text-sm">{lic.tenant?.name || "Unknown Tenant"}</p>
                    <p className="text-xs text-zinc-500 font-mono mt-1">Key: {lic.key}</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      lic.isActive ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
                    }`}>
                      {lic.isActive ? "Active" : "Inactive"}
                    </span>
                    <p className="text-xs text-zinc-400 mt-1">Expires: {new Date(lic.expiresAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-6">
            <h3 className="text-lg font-bold text-zinc-900 mb-6 tracking-tight">System Alerts</h3>
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-100 flex gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                <div>
                  <p className="font-semibold text-amber-900 text-sm">License Check</p>
                  <p className="text-xs text-amber-700 mt-1">Verify that validity dates are active across new registrations.</p>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 flex gap-3">
                <Activity className="w-5 h-5 text-blue-600 shrink-0" />
                <div>
                  <p className="font-semibold text-blue-900 text-sm">System Update</p>
                  <p className="text-xs text-blue-700 mt-1">All platform services are operational and running normally.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
