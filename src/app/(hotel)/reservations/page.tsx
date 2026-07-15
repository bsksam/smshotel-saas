"use client";

import { useEffect, useState } from "react";
import { Plus, Search, Filter, MoreVertical, X, Loader2, Calendar as CalendarIcon } from "lucide-react";
import { getReservations, getGuests, getRooms, createReservation } from "@/actions/hotel";

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<any[]>([]);
  const [guests, setGuests] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
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
      const [resRes, guestsRes, roomsRes] = await Promise.all([
        getReservations(),
        getGuests(),
        getRooms()
      ]);
      if (resRes.success) setReservations(resRes.data);
      if (guestsRes.success) setGuests(guestsRes.data);
      if (roomsRes.success) setRooms(roomsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleAddReservation(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    const res = await createReservation(formData);
    
    if (res?.error) {
      setError(res.error);
    } else {
      setIsModalOpen(false);
      loadData();
    }
    setIsSubmitting(false);
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "RESERVED": return "bg-blue-50 text-blue-700 border border-blue-200";
      case "CHECKED_IN": return "bg-emerald-50 text-emerald-700 border border-emerald-200";
      case "CHECKED_OUT": return "bg-zinc-50 text-zinc-600 border border-zinc-200";
      case "CANCELLED": return "bg-rose-50 text-rose-700 border border-rose-200";
      default: return "bg-zinc-50 text-zinc-600 border border-zinc-200";
    }
  };

  const filteredReservations = reservations.filter(res => {
    const fullName = `${res.guest?.firstName || ""} ${res.guest?.lastName || ""}`.toLowerCase();
    const id = res.id.toLowerCase();
    const roomNum = (res.room?.number || "").toLowerCase();
    const query = searchTerm.toLowerCase();
    return fullName.includes(query) || id.includes(query) || roomNum.includes(query);
  });

  return (
    <div className="space-y-6 pb-12">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">Reservations</h2>
          <p className="text-zinc-500 mt-1 text-sm">Manage future bookings, walk-ins, and modifications.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2 rounded-xl transition-all font-semibold text-xs shadow-md shadow-indigo-100"
        >
          <Plus className="w-4 h-4" />
          New Reservation
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-zinc-200/60 flex gap-4 items-center bg-zinc-50/50">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input 
              type="text" 
              placeholder="Search by guest name or room number..." 
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
              <p className="text-sm font-medium">Loading reservations...</p>
            </div>
          ) : filteredReservations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-zinc-500 gap-3">
              <div className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center mb-2">
                <CalendarIcon className="w-5 h-5 text-zinc-400" />
              </div>
              <p className="text-sm font-bold text-zinc-800">No reservations found</p>
              <p className="text-xs text-zinc-400">Create a new reservation to get started.</p>
            </div>
          ) : (
            <table className="w-full text-left text-sm text-zinc-650">
              <thead className="bg-zinc-50/80 text-zinc-700 font-bold border-b border-zinc-200">
                <tr>
                  <th className="px-6 py-4">Booking ID</th>
                  <th className="px-6 py-4">Guest Name</th>
                  <th className="px-6 py-4">Room Details</th>
                  <th className="px-6 py-4">Check-in</th>
                  <th className="px-6 py-4">Check-out</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {filteredReservations.map((res) => (
                  <tr key={res.id} className="hover:bg-zinc-50/50 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-zinc-500 font-bold uppercase tracking-wider">
                      {res.id.substring(res.id.length - 8)}
                    </td>
                    <td className="px-6 py-4 font-bold text-zinc-900">
                      {res.guest?.firstName} {res.guest?.lastName}
                    </td>
                    <td className="px-6 py-4 font-bold text-zinc-750">
                      Room {res.room?.number} <span className="text-indigo-600 bg-indigo-50 border border-indigo-150 text-[10px] font-semibold px-2 py-0.5 rounded ml-2">{res.room?.roomType?.name}</span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-zinc-500">{new Date(res.checkInDate).toLocaleDateString()}</td>
                    <td className="px-6 py-4 font-semibold text-zinc-500">{new Date(res.expectedCheckOut).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${getStatusColor(res.status)}`}>
                        {res.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-zinc-400 hover:text-zinc-900 transition-colors">
                        <MoreVertical className="w-5 h-5 inline" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Add Reservation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-zinc-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-zinc-100 bg-zinc-50/30">
              <h3 className="text-lg font-bold text-zinc-900 tracking-tight">New Reservation</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-zinc-900 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddReservation} className="p-6">
              {error && (
                <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                  {error}
                </div>
              )}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">Select Guest</label>
                  <select required name="guestId" className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 text-sm bg-white text-zinc-800">
                    <option value="">Choose a guest</option>
                    {guests.map(g => (
                      <option key={g.id} value={g.id}>{g.firstName} {g.lastName} ({g.mobile})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">Select Room</label>
                  <select required name="roomId" className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 text-sm bg-white text-zinc-800">
                    <option value="">Choose an available room</option>
                    {rooms.filter(r => r.status === "AVAILABLE" || r.status === "CLEANING").map(r => (
                      <option key={r.id} value={r.id}>Room {r.number} - {r.roomType?.name}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">Check-in Date</label>
                    <input required name="checkInDate" type="date" className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 text-sm bg-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">Check-out Date</label>
                    <input required name="expectedCheckOut" type="date" className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 text-sm bg-white" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">Adults</label>
                    <input required name="adults" type="number" min="1" defaultValue="1" className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 text-sm bg-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">Advance Payment (₹)</label>
                    <input name="advancePayment" type="number" min="0" step="0.01" defaultValue="0" className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 text-sm bg-white font-mono" />
                  </div>
                </div>
              </div>
              <div className="mt-8 flex gap-3 pt-4 border-t border-zinc-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2 text-sm font-medium text-zinc-700 bg-zinc-100 hover:bg-zinc-200 rounded-lg transition-colors">
                  Cancel
                </button>
                <button 
                  disabled={isSubmitting || guests.length === 0 || rooms.length === 0} 
                  type="submit" 
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-zinc-900 hover:bg-zinc-800 rounded-lg transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "Saving..." : "Create Reservation"}
                </button>
              </div>
              {(guests.length === 0 || rooms.length === 0) && (
                <p className="text-xs text-red-500 mt-3 text-center">
                  You must add at least one guest and one available room before creating a reservation.
                </p>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
