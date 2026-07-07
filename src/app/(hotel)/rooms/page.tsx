import { Plus, Search, Filter, MoreVertical } from "lucide-react";

export default function RoomsPage() {
  const rooms = [
    { number: "101", type: "Deluxe", floor: "1st Floor", status: "AVAILABLE", statusColor: "bg-green-100 text-green-800" },
    { number: "102", type: "Deluxe", floor: "1st Floor", status: "OCCUPIED", statusColor: "bg-red-100 text-red-800" },
    { number: "103", type: "Suite", floor: "1st Floor", status: "CLEANING", statusColor: "bg-yellow-100 text-yellow-800" },
    { number: "201", type: "Standard", floor: "2nd Floor", status: "MAINTENANCE", statusColor: "bg-gray-100 text-gray-800" },
    { number: "202", type: "Standard", floor: "2nd Floor", status: "RESERVED", statusColor: "bg-blue-100 text-blue-800" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Room Management</h2>
          <p className="text-gray-500 mt-1">Manage rooms, categories, and availability status.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-white border text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm">
            Manage Room Types
          </button>
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm">
            <Plus className="w-4 h-4" />
            Add Room
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border shadow-sm">
        <div className="p-4 border-b flex justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by room number or type..." 
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
          <div className="flex gap-2">
            <select className="border rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
              <option>All Status</option>
              <option>Available</option>
              <option>Occupied</option>
              <option>Cleaning</option>
            </select>
            <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 text-gray-700 text-sm font-medium">
              <Filter className="w-4 h-4" />
              More Filters
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-700 font-semibold border-b">
              <tr>
                <th className="px-6 py-4">Room No.</th>
                <th className="px-6 py-4">Room Type</th>
                <th className="px-6 py-4">Floor</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {rooms.map((room) => (
                <tr key={room.number} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-bold text-gray-900">{room.number}</td>
                  <td className="px-6 py-4 font-medium">{room.type}</td>
                  <td className="px-6 py-4">{room.floor}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${room.statusColor}`}>
                      {room.status}
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
        <div className="p-4 border-t text-sm text-gray-500 flex justify-between items-center">
          <span>Showing 1 to 5 of 60 rooms</span>
          <div className="flex gap-1">
            <button className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50">Prev</button>
            <button className="px-3 py-1 border rounded bg-blue-50 text-blue-600 font-medium">1</button>
            <button className="px-3 py-1 border rounded hover:bg-gray-50">2</button>
            <button className="px-3 py-1 border rounded hover:bg-gray-50">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
