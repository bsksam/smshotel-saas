"use client";
import { useState } from "react";
import { Search, Filter, Plus, X, Loader2 } from "lucide-react";
import { createUser } from "@/actions/admin";
import { Role } from "@prisma/client";

export default function UsersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    const formData = new FormData(e.currentTarget);
    const result = await createUser(formData);
    
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
          <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">User Administration</h2>
          <p className="text-zinc-500 mt-1 text-sm">Global directory of all system and hotel-level users.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-zinc-900 text-white px-4 py-2.5 rounded-lg hover:bg-zinc-800 transition-colors font-medium text-sm shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Create System User
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-zinc-200/60 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-zinc-100 flex gap-4 bg-zinc-50/30">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input 
              type="text" 
              placeholder="Search users by name, email, or role..." 
              className="w-full pl-9 pr-4 py-2 bg-white border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 text-sm shadow-sm transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-zinc-200 rounded-lg hover:bg-zinc-50 text-zinc-700 text-sm font-medium shadow-sm transition-colors">
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>
        
        <div className="p-16 text-center">
          <p className="text-zinc-400 text-sm">Global users datagrid will be rendered here.</p>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/20 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl border border-zinc-200/60 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
              <h3 className="font-bold text-zinc-900 tracking-tight">Create System User</h3>
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">First Name</label>
                  <input required name="firstName" type="text" className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 text-sm" placeholder="John" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">Last Name</label>
                  <input name="lastName" type="text" className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 text-sm" placeholder="Doe" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">Email Address</label>
                <input required name="email" type="email" className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 text-sm" placeholder="john@smshotel.com" />
                <p className="text-[10px] text-zinc-400 mt-1">Default password will be 'password123'.</p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">System Role</label>
                <select required name="role" className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 text-sm bg-white">
                  <option value={Role.SUPER_ADMIN}>SUPER_ADMIN</option>
                  <option value={Role.SUPPORT_STAFF}>SUPPORT_STAFF</option>
                  <option value={Role.BILLING_ADMIN}>BILLING_ADMIN</option>
                </select>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-zinc-100 flex justify-end gap-3 bg-zinc-50/50">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 font-medium text-sm text-zinc-600 hover:text-zinc-900 transition-colors">Cancel</button>
              <button disabled={isLoading} type="submit" className="flex items-center gap-2 px-4 py-2 font-medium text-sm bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 transition-colors shadow-sm disabled:opacity-50">
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                Create User
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
