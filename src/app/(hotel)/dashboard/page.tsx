import { DoorOpen, CalendarCheck, Users, TrendingUp, ChevronRight, PlusCircle, UserPlus, ArrowUpRight } from "lucide-react";
import { getDashboardStats } from "@/actions/hotel";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function HotelDashboard() {
  const res = await getDashboardStats();
  const statsData = res.success ? res.data : {
    totalRooms: 0,
    availableRooms: 0,
    activeGuests: 0,
    todayCheckins: 0,
    occupancyRate: 0,
    recentBookings: [] as any[]
  };

  const occupancyRate = statsData?.occupancyRate || 0;
  const availableRooms = statsData?.availableRooms || 0;
  const totalRooms = statsData?.totalRooms || 0;
  const occupiedRooms = totalRooms - availableRooms;

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-600 via-indigo-650 to-blue-500 p-8 md:p-10 shadow-lg text-white border border-indigo-500/20">
        <div className="absolute right-0 top-0 -mr-20 -mt-20 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute left-1/3 bottom-0 -mb-20 w-60 h-60 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-100 bg-white/15 px-2.5 py-1 rounded-md border border-white/10">Live Status Board</span>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Today's Overview</h2>
          <p className="text-indigo-50/90 text-sm md:text-base max-w-xl">
            Real-time analytics and room metrics for your property. Keep track of reservations, guests, and operational statuses.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Available Rooms Card */}
        <div className="relative group bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-violet-500 to-indigo-600"></div>
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Available Rooms</p>
              <h3 className="text-3xl font-extrabold text-indigo-600 tracking-tight">{availableRooms} <span className="text-xs font-semibold text-zinc-400">/ {totalRooms} Total</span></h3>
            </div>
            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 shadow-inner group-hover:scale-110 transition-transform">
              <DoorOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-1.5">
            <div className="w-full bg-zinc-100 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-violet-500 to-indigo-600 h-full rounded-full transition-all duration-500" 
                style={{ width: `${totalRooms > 0 ? (availableRooms / totalRooms) * 100 : 0}%` }}
              ></div>
            </div>
            <p className="text-[10px] text-zinc-400 font-medium text-right">
              {totalRooms > 0 ? Math.round((availableRooms / totalRooms) * 100) : 0}% vacant
            </p>
          </div>
        </div>

        {/* Today's Check-ins Card */}
        <div className="relative group bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Today's Check-ins</p>
              <h3 className="text-3xl font-extrabold text-blue-600 tracking-tight">{statsData?.todayCheckins || 0}</h3>
            </div>
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 shadow-inner group-hover:scale-110 transition-transform">
              <CalendarCheck className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-zinc-500 font-medium">Expected arrivals today</p>
        </div>

        {/* Active Guests Card */}
        <div className="relative group bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-500 to-teal-500"></div>
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Active Guests</p>
              <h3 className="text-3xl font-extrabold text-emerald-600 tracking-tight">{statsData?.activeGuests || 0}</h3>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 shadow-inner group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-zinc-500 font-medium">Currently checked-in</p>
        </div>

        {/* Occupancy Rate Card */}
        <div className="relative group bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-fuchsia-500 to-rose-500"></div>
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Occupancy Rate</p>
              <h3 className="text-3xl font-extrabold text-rose-600 tracking-tight">{occupancyRate}%</h3>
            </div>
            <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600 shadow-inner group-hover:scale-110 transition-transform">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-1.5">
            <div className="w-full bg-zinc-100 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-fuchsia-500 to-rose-500 h-full rounded-full transition-all duration-500" 
                style={{ width: `${occupancyRate}%` }}
              ></div>
            </div>
            <p className="text-[10px] text-zinc-400 font-medium text-right">{occupiedRooms} occupied rooms</p>
          </div>
        </div>
      </div>

      {/* Main Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Bookings Feed */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-zinc-200/85 shadow-sm p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6 border-b border-zinc-100 pb-4">
            <div>
              <h3 className="text-lg font-bold text-zinc-900 tracking-tight">Recent Bookings</h3>
              <p className="text-xs text-zinc-400 mt-0.5">Lately registered bookings across rooms</p>
            </div>
            <Link 
              href="/reservations" 
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 text-xs font-bold text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 transition-colors shadow-sm"
            >
              View All
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          
          <div className="space-y-4 flex-1">
            {statsData?.recentBookings.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-zinc-400">
                <CalendarCheck className="w-10 h-10 text-zinc-200 mb-2" />
                <p className="text-sm font-semibold">No recent bookings found</p>
              </div>
            ) : (
              statsData?.recentBookings.map((booking: any) => {
                const initials = `${booking.guest?.firstName?.charAt(0) || ""}${booking.guest?.lastName?.charAt(0) || ""}`.toUpperCase();
                return (
                  <div key={booking.id} className="flex items-center justify-between p-4 rounded-2xl border border-zinc-100 hover:border-zinc-200 transition-all duration-200 bg-zinc-50/30 hover:bg-white hover:shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-violet-500/10 to-indigo-600/10 text-indigo-700 flex items-center justify-center font-bold text-sm border border-indigo-100">
                        {initials}
                      </div>
                      <div>
                        <p className="font-bold text-zinc-900 text-sm">{booking.guest?.firstName} {booking.guest?.lastName}</p>
                        <p className="text-xs text-zinc-500 mt-1 flex items-center gap-2">
                          <span className="font-semibold text-zinc-700 bg-zinc-100 border border-zinc-200 px-1.5 py-0.5 rounded text-[10px]">Room {booking.room?.number}</span>
                          • Check-in: {new Date(booking.checkInDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
                        booking.status === 'RESERVED' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                        booking.status === 'CHECKED_IN' ? 'bg-green-50 text-green-700 border-green-100' :
                        booking.status === 'CHECKED_OUT' ? 'bg-zinc-50 text-zinc-600 border-zinc-200' : 'bg-red-50 text-red-700 border-red-100'
                      }`}>
                        {booking.status}
                      </span>
                      <p className="text-xs text-zinc-500 mt-1.5 font-mono font-bold">₹{booking.advancePayment} paid</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-zinc-200/85 shadow-sm p-6">
            <h3 className="text-lg font-bold text-zinc-900 tracking-tight mb-6 border-b border-zinc-100 pb-4">Quick Operations</h3>
            <div className="grid grid-cols-1 gap-4">
              <Link 
                href="/reservations" 
                className="flex items-center justify-between p-4 rounded-2xl border border-zinc-200 hover:border-indigo-600 hover:bg-indigo-50/10 transition-all duration-300 group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <PlusCircle className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-zinc-900">New Booking</p>
                    <p className="text-[10px] text-zinc-500 mt-0.5">Register a reservation</p>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-zinc-400 group-hover:text-indigo-600 transition-colors" />
              </Link>

              <Link 
                href="/guests" 
                className="flex items-center justify-between p-4 rounded-2xl border border-zinc-200 hover:border-emerald-600 hover:bg-emerald-50/10 transition-all duration-300 group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    <UserPlus className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-zinc-900">Add Guest</p>
                    <p className="text-[10px] text-zinc-500 mt-0.5">Create guest directory file</p>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-zinc-400 group-hover:text-emerald-600 transition-colors" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
