import { Plus, Search, Filter, IndianRupee, PieChart } from "lucide-react";

export default function ExpensesPage() {
  const expenses = [
    { id: "EXP-001", date: "Jul 7, 2026", category: "Kitchen Purchase", description: "Vegetables and Dairy", amount: 4500, mode: "UPI" },
    { id: "EXP-002", date: "Jul 6, 2026", category: "Maintenance", description: "AC Repair Room 102", amount: 1200, mode: "Cash" },
    { id: "EXP-003", date: "Jul 5, 2026", category: "Salary", description: "Advance to Raju", amount: 2000, mode: "Bank Transfer" },
    { id: "EXP-004", date: "Jul 5, 2026", category: "Electricity", description: "Monthly Bill", amount: 15400, mode: "Credit Card" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Expenses Tracking</h2>
          <p className="text-gray-500 mt-1">Record and monitor day-to-day hotel expenses.</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
          <Plus className="w-5 h-5" />
          Add Expense
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-5 rounded-xl border shadow-sm">
          <p className="text-sm text-gray-500 font-medium">Today's Expenses</p>
          <div className="flex items-center gap-2 mt-2">
            <IndianRupee className="w-6 h-6 text-gray-900" />
            <h3 className="text-2xl font-bold text-gray-900">4,500</h3>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border shadow-sm">
          <p className="text-sm text-gray-500 font-medium">This Week</p>
          <div className="flex items-center gap-2 mt-2">
            <IndianRupee className="w-6 h-6 text-gray-900" />
            <h3 className="text-2xl font-bold text-gray-900">23,100</h3>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border shadow-sm">
          <p className="text-sm text-gray-500 font-medium">This Month</p>
          <div className="flex items-center gap-2 mt-2">
            <IndianRupee className="w-6 h-6 text-gray-900" />
            <h3 className="text-2xl font-bold text-gray-900">84,500</h3>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border shadow-sm flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors text-blue-600">
          <div className="flex items-center gap-2 font-bold">
            <PieChart className="w-5 h-5" />
            View Reports
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border shadow-sm">
        <div className="p-4 border-b flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by description or category..." 
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
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4">Payment Mode</th>
                <th className="px-6 py-4 text-right">Amount (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {expenses.map((expense) => (
                <tr key={expense.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-900 font-medium">{expense.date}</td>
                  <td className="px-6 py-4 font-semibold text-gray-800">{expense.category}</td>
                  <td className="px-6 py-4">{expense.description}</td>
                  <td className="px-6 py-4 text-gray-500">{expense.mode}</td>
                  <td className="px-6 py-4 text-right font-bold text-gray-900 text-base">{expense.amount.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
