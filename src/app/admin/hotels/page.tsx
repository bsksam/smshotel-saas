"use client";
import { useState, useEffect } from "react";
import { Search, Filter, Plus, X, Loader2 } from "lucide-react";
import { createTenant } from "@/actions/admin";

export default function HotelsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hotels, setHotels] = useState<any[]>([]);
  const [error, setError] = useState("");

  // In a real app we'd fetch these server-side or via SWR/React Query. 
  // We'll leave it as a placeholder for now since we're building out the actions.
  
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
      // reload page to see new data if we were fetching server side
      window.location.reload(); 
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
        
        <div className="p-16 text-center">
          <p className="text-zinc-400 text-sm">Hotels data table will be populated from the database here.</p>
        </div>
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
