import { Plus, Search, Filter, MoreVertical, Calendar as CalendarIcon } from "lucide-react";

export default function ReservationsPage() {
  const reservations = [
    { id: "RES-001", guest: "Rahul Sharma", room: "101 (Deluxe)", checkIn: "Today", checkOut: "Tomorrow", status: "RESERVED", color: "bg-blue-100 text-blue-800" },
    { id: "RES-002", guest: "Anita Desai", room: "205 (Suite)", checkIn: "Jul 10, 2026", checkOut: "Jul 14, 2026", status: "RESERVED", color: "bg-blue-100 text-blue-800" },
    { id: "RES-003", guest: "Vikram Singh", room: "102 (Deluxe)", checkIn: "Yesterday", checkOut: "Tomorrow", status: "CHECKED_IN", color: "bg-green-100 text-green-800" },
    { id: "RES-004", guest: "Priya Patel", room: "108 (Standard)", checkIn: "Jul 15, 2026", checkOut: "Jul 18, 2026", status: "CANCELLED", color: "bg-red-100 text-red-800" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Reservations</h2>
          <p className="text-gray-500 mt-1">Manage future bookings, walk-ins, and booking modifications.</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
          <Plus className="w-5 h-5" />
          New Reservation
        </button>
      </div>

      <div className="bg-white rounded-xl border shadow-sm">
        <div className="p-4 border-b flex gap-4 items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by guest name or booking ID..." 
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 text-gray-700 text-sm font-medium">
            <CalendarIcon className="w-4 h-4" />
            Date Range
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 text-gray-700 text-sm font-medium">
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-700 font-semibold border-b">
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
            <tbody className="divide-y">
              {reservations.map((res) => (
                <tr key={res.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-mono text-xs text-gray-500 font-bold">{res.id}</td>
                  <td className="px-6 py-4 font-bold text-gray-900">{res.guest}</td>
                  <td className="px-6 py-4 font-medium">{res.room}</td>
                  <td className="px-6 py-4 text-gray-700">{res.checkIn}</td>
                  <td className="px-6 py-4 text-gray-700">{res.checkOut}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${res.color}`}>
                      {res.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreVertical className="w-5 h-5 inline" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
