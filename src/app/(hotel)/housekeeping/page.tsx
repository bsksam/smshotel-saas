import { Filter, Search, Plus, CheckCircle, Clock } from "lucide-react";

export default function HousekeepingPage() {
  const tasks = [
    { id: "HK-101", room: "101", type: "CLEANING", priority: "High", assignedTo: "Sita", status: "PENDING" },
    { id: "HK-102", room: "205", type: "MAINTENANCE", priority: "Medium", assignedTo: "Raju", status: "IN_PROGRESS" },
    { id: "HK-103", room: "105", type: "INSPECTION", priority: "Low", assignedTo: "Manager", status: "COMPLETED" },
    { id: "HK-104", room: "302", type: "CLEANING", priority: "High", assignedTo: "Gita", status: "PENDING" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Housekeeping & Maintenance</h2>
          <p className="text-gray-500 mt-1">Manage cleaning schedules, maintenance requests, and room status.</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
          <Plus className="w-5 h-5" />
          Assign Task
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-5 rounded-xl border shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold text-xl">
            2
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Pending Tasks</p>
            <p className="text-xl font-bold text-gray-900 mt-1">Requires Attention</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl">
            1
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">In Progress</p>
            <p className="text-xl font-bold text-gray-900 mt-1">Currently Working</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold text-xl">
            8
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Completed Today</p>
            <p className="text-xl font-bold text-gray-900 mt-1">Rooms Ready</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border shadow-sm">
        <div className="p-4 border-b flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by room or staff name..." 
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 text-gray-700 text-sm font-medium">
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-700 font-semibold border-b">
              <tr>
                <th className="px-6 py-4">Room No.</th>
                <th className="px-6 py-4">Task Type</th>
                <th className="px-6 py-4">Priority</th>
                <th className="px-6 py-4">Assigned To</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {tasks.map((task) => (
                <tr key={task.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-bold text-gray-900">{task.room}</td>
                  <td className="px-6 py-4 font-medium text-gray-800">{task.type}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-bold px-2 py-1 rounded ${task.priority === 'High' ? 'bg-red-100 text-red-700' : task.priority === 'Medium' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-700'}`}>
                      {task.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4">{task.assignedTo}</td>
                  <td className="px-6 py-4">
                    {task.status === 'PENDING' && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800"><Clock className="w-3 h-3"/> Pending</span>}
                    {task.status === 'IN_PROGRESS' && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800"><Clock className="w-3 h-3"/> In Progress</span>}
                    {task.status === 'COMPLETED' && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800"><CheckCircle className="w-3 h-3"/> Completed</span>}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-blue-600 hover:underline font-medium text-xs">Update Status</button>
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
