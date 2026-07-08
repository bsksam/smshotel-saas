"use client";

import { useEffect, useState } from "react";
import { Plus, Search, Filter, MoreVertical, X, Loader2, Contact } from "lucide-react";
import { getGuests, createGuest } from "@/actions/hotel";

export default function GuestsPage() {
  const [guests, setGuests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setIsLoading(true);
    try {
      const res = await getGuests();
      if (res.success) setGuests(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleAddGuest(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    const res = await createGuest(formData);
    
    if (res?.error) {
      setError(res.error);
    } else {
      setIsModalOpen(false);
      loadData();
    }
    setIsSubmitting(false);
  }

  const getDocBadgeColor = (type: string) => {
    switch (type?.toUpperCase()) {
      case "AADHAAR": return "bg-blue-50 text-blue-700 border border-blue-200";
      case "PASSPORT": return "bg-purple-50 text-purple-700 border border-purple-200";
      case "DRIVING LICENSE": return "bg-amber-50 text-amber-700 border border-amber-200";
      default: return "bg-zinc-50 text-zinc-650 border border-zinc-200";
    }
  };

  const filteredGuests = guests.filter(guest => {
    const fullName = `${guest.firstName || ""} ${guest.lastName || ""}`.toLowerCase();
    const phone = (guest.mobile || "").toLowerCase();
    const email = (guest.email || "").toLowerCase();
    const query = searchTerm.toLowerCase();
    return fullName.includes(query) || phone.includes(query) || email.includes(query);
  });

  return (
    <div className="space-y-6 pb-12">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">Guest Directory</h2>
          <p className="text-zinc-500 mt-1 text-sm">Manage guest profiles, identities, and contact information.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2 rounded-xl transition-all font-semibold text-xs shadow-md shadow-indigo-100"
        >
          <Plus className="w-4 h-4" />
          Add Guest
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-zinc-200/60 flex justify-between gap-4 bg-zinc-50/50">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input 
              type="text" 
              placeholder="Search by name, phone, or email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900 text-sm bg-white"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto min-h-[400px]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64 text-zinc-400 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-zinc-300" />
              <p className="text-sm font-medium">Loading guests...</p>
            </div>
          ) : filteredGuests.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-zinc-500 gap-3">
              <div className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center mb-2">
                <Contact className="w-5 h-5 text-zinc-400" />
              </div>
              <p className="text-sm font-bold text-zinc-800">No guests found</p>
              <p className="text-xs text-zinc-400">Add your first guest profile to get started.</p>
            </div>
          ) : (
            <table className="w-full text-left text-sm text-zinc-650">
              <thead className="bg-zinc-50/80 text-zinc-700 font-bold border-b border-zinc-200">
                <tr>
                  <th className="px-6 py-4">Guest Name</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4">ID Proof</th>
                  <th className="px-6 py-4">Created Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {filteredGuests.map((guest) => {
                  const initials = `${guest.firstName?.charAt(0) || ""}${guest.lastName?.charAt(0) || ""}`.toUpperCase();
                  return (
                    <tr key={guest.id} className="hover:bg-zinc-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-500/10 to-indigo-600/10 text-indigo-700 flex items-center justify-center font-bold text-xs border border-indigo-100">
                            {initials}
                          </div>
                          <span className="font-bold text-zinc-900">{guest.firstName} {guest.lastName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-0.5">
                          <p className="font-semibold text-zinc-900">{guest.mobile}</p>
                          {guest.email && <p className="text-xs text-zinc-400">{guest.email}</p>}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {guest.idProofType ? (
                          <div className="space-y-1">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${getDocBadgeColor(guest.idProofType)}`}>
                              {guest.idProofType}
                            </span>
                            {guest.idProofNumber && <p className="text-xs font-mono font-medium text-zinc-500">{guest.idProofNumber}</p>}
                          </div>
                        ) : (
                          <span className="text-zinc-400 text-xs italic">No ID Saved</span>
                        )}
                      </td>
                      <td className="px-6 py-4 font-medium text-zinc-500">
                        {new Date(guest.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-zinc-400 hover:text-zinc-900 transition-colors">
                          <MoreVertical className="w-5 h-5 inline" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Add Guest Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-zinc-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-zinc-100 bg-zinc-50/30">
              <h3 className="text-lg font-bold text-zinc-900 tracking-tight">Add Guest Profile</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-zinc-900 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddGuest} className="p-6 space-y-4">
              {error && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                  {error}
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">First Name</label>
                  <input required name="firstName" type="text" placeholder="e.g. John" className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 text-sm bg-white" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">Last Name</label>
                  <input required name="lastName" type="text" placeholder="e.g. Doe" className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 text-sm bg-white" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">Mobile Number</label>
                  <input required name="mobile" type="text" placeholder="e.g. 9876543210" className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 text-sm bg-white" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">Email Address</label>
                  <input name="email" type="email" placeholder="e.g. john@example.com" className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 text-sm bg-white" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">Address</label>
                <input name="address" type="text" placeholder="e.g. 123 Main St, Mumbai" className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 text-sm bg-white" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">ID Proof Type</label>
                  <select name="idProofType" className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 text-sm bg-white text-zinc-800">
                    <option value="">Select ID Type</option>
                    <option value="Aadhaar">Aadhaar</option>
                    <option value="Passport">Passport</option>
                    <option value="Driving License">Driving License</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">ID Number</label>
                  <input name="idProofNumber" type="text" placeholder="ID Number details" className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 text-sm bg-white" />
                </div>
              </div>
              <div className="mt-8 flex gap-3 pt-4 border-t border-zinc-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2 text-sm font-medium text-zinc-700 bg-zinc-100 hover:bg-zinc-200 rounded-lg transition-colors">
                  Cancel
                </button>
                <button disabled={isSubmitting} type="submit" className="flex-1 px-4 py-2 text-sm font-medium text-white bg-zinc-900 hover:bg-zinc-800 rounded-lg transition-colors disabled:opacity-50">
                  {isSubmitting ? "Saving..." : "Save Profile"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
