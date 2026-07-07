"use client";
import { useState } from "react";
import { Plus, Search, Filter, X, Loader2 } from "lucide-react";
import { generateLicense } from "@/actions/admin";

export default function LicensesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    const formData = new FormData(e.currentTarget);
    const result = await generateLicense(formData);
    
    if (result?.error) {
      setError(result.error);
    } else {
      setIsModalOpen(false);
      window.location.reload(); 
    }
    setIsLoading(false);
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">License Management</h2>
          <p className="text-zinc-500 mt-1 text-sm">Manage and generate enterprise licenses for tenants.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-zinc-900 text-white px-4 py-2.5 rounded-lg hover:bg-zinc-800 transition-colors font-medium text-sm shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Generate License
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-zinc-200/60 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-zinc-100 flex gap-4 bg-zinc-50/30">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input 
              type="text" 
              placeholder="Search by hotel name or key..." 
              className="w-full pl-9 pr-4 py-2 bg-white border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 text-sm shadow-sm transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-zinc-200 rounded-lg hover:bg-zinc-50 text-zinc-700 text-sm font-medium shadow-sm transition-colors">
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-600">
            <thead className="bg-zinc-50/50 text-zinc-500 font-semibold border-b border-zinc-100 text-[11px] uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Hotel Name</th>
                <th className="px-6 py-4">License Key</th>
                <th className="px-6 py-4">Validity</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Expires At</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              <tr className="hover:bg-zinc-50/50 transition-colors">
                <td className="px-6 py-4 font-semibold text-zinc-900">Royal Palace Hotel</td>
                <td className="px-6 py-4 font-mono text-xs text-zinc-500 bg-zinc-50/50 rounded inline-block mt-2">A1B2-C3D4-E5F6-G7H8</td>
                <td className="px-6 py-4 font-medium">YEARLY</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
                    Active
                  </span>
                </td>
                <td className="px-6 py-4 text-zinc-500">Dec 31, 2026</td>
                <td className="px-6 py-4 text-right">
                  <button className="text-zinc-600 hover:text-zinc-900 font-medium transition-colors">Manage</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/20 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl border border-zinc-200/60 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
              <h3 className="font-bold text-zinc-900 tracking-tight">Generate License</h3>
              <button type="button" onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-zinc-900 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {error && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                  {error}
                </div>
              )}
              <div>
                <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">Tenant ID</label>
                <input required name="tenantId" type="text" className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 text-sm" placeholder="Paste Tenant ID here" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">Validity Period</label>
                <select required name="validity" className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 text-sm bg-white">
                  <option value="YEARLY">1 Year (Yearly)</option>
                  <option value="HALF_YEARLY">6 Months (Half-Yearly)</option>
                  <option value="QUARTERLY">3 Months (Quarterly)</option>
                  <option value="MONTHLY">1 Month (Monthly)</option>
                  <option value="LIFETIME">Lifetime</option>
                </select>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-zinc-100 flex justify-end gap-3 bg-zinc-50/50">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 font-medium text-sm text-zinc-600 hover:text-zinc-900 transition-colors">Cancel</button>
              <button disabled={isLoading} type="submit" className="flex items-center gap-2 px-4 py-2 font-medium text-sm bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 transition-colors shadow-sm disabled:opacity-50">
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                Generate Key
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
