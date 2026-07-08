"use client";

import { useEffect, useState } from "react";
import { Search, MapPin, Users, CreditCard, ChevronRight, CheckCircle, Loader2 } from "lucide-react";
import { getReservations, checkInGuest } from "@/actions/hotel";

export default function CheckInPage() {
  const [reservations, setReservations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setIsLoading(true);
    try {
      const resRes = await getReservations();
      if (resRes.success) {
        const pending = resRes.data.filter((r: any) => r.status === "RESERVED");
        setReservations(pending);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCheckIn(id: string) {
    if (!confirm("Are you sure you want to check in this guest?")) return;
    setProcessingId(id);
    const res = await checkInGuest(id);
    if (!res.error) {
      loadData();
    } else {
      alert(res.error);
    }
    setProcessingId(null);
  }

  const filteredReservations = reservations.filter(res => {
    const fullName = `${res.guest?.firstName || ""} ${res.guest?.lastName || ""}`.toLowerCase();
    const id = res.id.toLowerCase();
    const roomNum = (res.room?.number || "").toLowerCase();
    const query = searchQuery.toLowerCase();
    return fullName.includes(query) || id.includes(query) || roomNum.includes(query);
  });

  return (
    <div className="space-y-6 pb-12">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">Today's Check-ins</h2>
          <p className="text-zinc-500 mt-1 text-sm">Process arriving guests and assign rooms.</p>
        </div>
        <div>
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-5 py-2.5 rounded-2xl shadow-md flex items-center gap-4 border border-indigo-400/20">
            <div className="text-right">
              <p className="text-[10px] font-bold uppercase tracking-wider opacity-85">Expected Arrivals</p>
              <p className="text-2xl font-extrabold tracking-tight">{reservations.length}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/10">
              <Users className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-zinc-200/60 flex justify-between items-center bg-zinc-50/50 gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input 
              type="text" 
              placeholder="Search by guest name, room number, or booking ID..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900 text-sm bg-white"
            />
          </div>
        </div>

        <div className="p-6 min-h-[400px]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64 text-zinc-400 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-zinc-300" />
              <p className="text-sm font-medium">Loading expected arrivals...</p>
            </div>
          ) : filteredReservations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-zinc-500 gap-3">
              <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-2 border border-green-100">
                <CheckCircle className="w-5 h-5" />
              </div>
              <p className="text-sm font-bold text-zinc-800">No pending check-ins</p>
              <p className="text-xs text-zinc-400">All expected guests are currently checked in.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredReservations.map((res) => {
                const initials = `${res.guest?.firstName?.charAt(0) || ""}${res.guest?.lastName?.charAt(0) || ""}`.toUpperCase();
                return (
                  <div key={res.id} className="relative border border-zinc-200 rounded-2xl p-5 hover:border-zinc-400 hover:shadow-md transition-all duration-300 bg-white group overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
                    
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-500/10 to-indigo-600/10 text-indigo-700 flex items-center justify-center font-bold text-sm border border-indigo-100">
                          {initials}
                        </div>
                        <div>
                          <h3 className="font-bold text-zinc-900 text-sm">{res.guest?.firstName} {res.guest?.lastName}</h3>
                          <p className="text-[10px] font-mono text-zinc-400 font-semibold tracking-wider uppercase">ID: {res.id.substring(res.id.length - 8)}</p>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-100 rounded-lg text-[10px] font-bold tracking-wider">
                        EXPECTED
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-y-3 gap-x-4 mb-5 p-4 bg-zinc-50/50 rounded-xl border border-zinc-200/50">
                      <div className="flex items-center gap-2 text-xs">
                        <MapPin className="w-4 h-4 text-blue-500" />
                        <div>
                          <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Room</p>
                          <p className="font-bold text-zinc-900">Room {res.room?.number} <span className="text-zinc-500 font-normal text-[10px]">({res.room?.roomType?.name})</span></p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <Users className="w-4 h-4 text-purple-500" />
                        <div>
                          <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Guests</p>
                          <p className="font-bold text-zinc-900">{res.adults} Adults</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs col-span-2 border-t border-zinc-100 pt-2.5">
                        <CreditCard className="w-4 h-4 text-emerald-500" />
                        <div className="flex justify-between items-center w-full">
                          <div>
                            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Advance Paid</p>
                            <p className="font-bold text-emerald-600 font-mono">${res.advancePayment}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end pt-2 border-t border-zinc-100 mt-2">
                      <button 
                        onClick={() => handleCheckIn(res.id)}
                        disabled={processingId === res.id}
                        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-2.5 rounded-xl transition-all font-bold text-xs shadow-md shadow-indigo-100 disabled:opacity-50"
                      >
                        {processingId === res.id ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin text-white" />
                            Processing check-in...
                          </>
                        ) : (
                          <>
                            Complete Check-in
                            <ChevronRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
