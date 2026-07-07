"use client";
import { useState, useEffect } from "react";
import { Search, Filter, Plus, X, Loader2 } from "lucide-react";
import { createTenant, getTenants } from "@/actions/admin";

export default function HotelsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hotels, setHotels] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    async function loadHotels() {
      const result = await getTenants();
      if (result.success) {
        setHotels(result.data);
      }
      setIsFetching(false);
    }
    loadHotels();
  }, []);
  
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    const formData = new FormData(e.currentTarget);
    const result = await createTenant(formData);
    
    if (result?.error) {
      setError(result.error);
    } else {
      setIsModalOpen(false);
      const updated = await getTenants();
      if (updated.success) setHotels(updated.data);
    }
    setIsLoading(false);
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">Hotels Management</h2>
          <p className="text-zinc-500 mt-1 text-sm">Manage onboarding and configuration for all hotel tenants.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-zinc-900 text-white px-4 py-2.5 rounded-lg hover:bg-zinc-800 transition-colors font-medium text-sm shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add New Hotel
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-zinc-200/60 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-zinc-100 flex gap-4 bg-zinc-50/30">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input 
              type="text" 
              placeholder="Search hotels by name, location..." 
              className="w-full pl-9 pr-4 py-2 bg-white border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 text-sm shadow-sm transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-zinc-200 rounded-lg hover:bg-zinc-50 text-zinc-700 text-sm font-medium shadow-sm transition-colors">
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>
        
        {isFetching ? (
          <div className="p-16 flex justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-zinc-400" />
          </div>
        ) : hotels.length === 0 ? (
          <div className="p-16 text-center">
            <p className="text-zinc-400 text-sm">No hotels found. Click "Add New Hotel" to get started.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-zinc-600">
              <thead className="bg-zinc-50/50 text-zinc-500 font-semibold border-b border-zinc-100 text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Hotel Name</th>
                  <th className="px-6 py-4">Domain</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Created</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {hotels.map((hotel) => (
                  <tr key={hotel.id} className="hover:bg-zinc-50/50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-zinc-900">{hotel.name}</td>
                    <td className="px-6 py-4 font-mono text-xs text-zinc-500">{hotel.domain || "N/A"}</td>
                    <td className="px-6 py-4">
                      {hotel.isActive ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">Active</span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-800 border border-red-200">Inactive</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-zinc-500">{new Date(hotel.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-zinc-600 hover:text-zinc-900 font-medium transition-colors">Manage</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/20 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl border border-zinc-200/60 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
              <h3 className="font-bold text-zinc-900 tracking-tight">Add New Hotel</h3>
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
                <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">Hotel Name</label>
                <input required name="name" type="text" className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 text-sm" placeholder="e.g. Grand Taj Hotel" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">Custom Domain (Optional)</label>
                <input name="domain" type="text" className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 text-sm" placeholder="e.g. myhotel.com" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">Admin Email</label>
                <input required name="adminEmail" type="email" className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 text-sm" placeholder="admin@hotel.com" />
                <p className="text-[10px] text-zinc-400 mt-1">An owner account will be created with default password 'password123'.</p>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-zinc-100 flex justify-end gap-3 bg-zinc-50/50">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 font-medium text-sm text-zinc-600 hover:text-zinc-900 transition-colors">Cancel</button>
              <button disabled={isLoading} type="submit" className="flex items-center gap-2 px-4 py-2 font-medium text-sm bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 transition-colors shadow-sm disabled:opacity-50">
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                Save Hotel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
