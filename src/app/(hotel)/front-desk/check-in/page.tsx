"use client";

import { useEffect, useState } from "react";
import { Search, MapPin, Users, CreditCard, ChevronRight, CheckCircle, Loader2 } from "lucide-react";
import { getReservations, checkInGuest } from "@/actions/hotel";

export default function CheckInPage() {
  const [reservations, setReservations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setIsLoading(true);
    try {
      const resRes = await getReservations();
      if (resRes.success) {
        // Only show reservations that are in RESERVED status (pending check-in)
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">Today's Check-ins</h2>
          <p className="text-zinc-500 mt-1 text-sm">Process arriving guests and assign rooms.</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-white px-4 py-2 rounded-lg border border-zinc-200 shadow-sm flex flex-col items-center justify-center">
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Expected</span>
            <span className="text-lg font-bold text-zinc-900">{reservations.length}</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-zinc-200/60 flex justify-between items-center bg-zinc-50/50">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input 
              type="text" 
              placeholder="Search by guest name or booking ID..." 
              className="w-full pl-10 pr-4 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 text-sm bg-white"
            />
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 text-sm font-medium text-zinc-700 bg-white border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors">
              Filter By Room Type
            </button>
          </div>
        </div>

        <div className="p-4 min-h-[400px]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64 text-zinc-400 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-zinc-300" />
              <p className="text-sm font-medium">Loading expected arrivals...</p>
            </div>
          ) : reservations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-zinc-500 gap-3">
              <div className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center mb-2">
                <CheckCircle className="w-5 h-5 text-zinc-400" />
              </div>
              <p className="text-sm font-medium">No pending check-ins</p>
              <p className="text-xs text-zinc-400">All guests have been checked in successfully.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reservations.map((res) => (
                <div key={res.id} className="border border-zinc-200 rounded-xl p-5 hover:border-zinc-300 transition-colors shadow-sm bg-white group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-900 font-bold">
                        {res.guest?.firstName?.charAt(0)}{res.guest?.lastName?.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-zinc-900">{res.guest?.firstName} {res.guest?.lastName}</h3>
                        <p className="text-xs font-mono text-zinc-500 font-medium">ID: {res.id.substring(res.id.length - 8).toUpperCase()}</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-zinc-100 text-zinc-700 rounded-lg text-xs font-bold tracking-wider">
                      EXPECTED
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-y-3 gap-x-4 mb-5 p-4 bg-zinc-50/50 rounded-lg border border-zinc-100">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-zinc-400" />
                      <div>
                        <p className="text-xs text-zinc-500 font-medium">Room</p>
                        <p className="font-semibold text-zinc-900">{res.room?.number} <span className="text-zinc-500 font-normal">({res.room?.roomType?.name})</span></p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="w-4 h-4 text-zinc-400" />
                      <div>
                        <p className="text-xs text-zinc-500 font-medium">Guests</p>
                        <p className="font-semibold text-zinc-900">{res.adults} Adults</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CreditCard className="w-4 h-4 text-zinc-400" />
                      <div>
                        <p className="text-xs text-zinc-500 font-medium">Advance Paid</p>
                        <p className="font-semibold text-green-600">${res.advancePayment}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-2 border-t border-zinc-100 mt-2">
                    <button 
                      onClick={() => handleCheckIn(res.id)}
                      disabled={processingId === res.id}
                      className="flex items-center gap-2 bg-zinc-900 text-white px-5 py-2 rounded-lg hover:bg-zinc-800 transition-colors font-medium text-sm shadow-sm disabled:opacity-50"
                    >
                      {processingId === res.id ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Processing
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
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
