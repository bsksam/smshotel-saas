import { Search, Plus, Coffee, Utensils, Printer, Receipt } from "lucide-react";

export default function RestaurantPOS() {
  const tables = [
    { id: "T1", name: "Table 1", status: "AVAILABLE", capacity: 4 },
    { id: "T2", name: "Table 2", status: "OCCUPIED", capacity: 4, amount: 1250 },
    { id: "T3", name: "Table 3", status: "AVAILABLE", capacity: 2 },
    { id: "F1", name: "Family 1", status: "OCCUPIED", capacity: 8, amount: 4500 },
  ];

  const menuCategories = ["All", "Starters", "Main Course", "Breads", "Desserts", "Beverages"];
  
  const menuItems = [
    { name: "Paneer Tikka", price: 280, veg: true, category: "Starters" },
    { name: "Chicken Kabab", price: 350, veg: false, category: "Starters" },
    { name: "Dal Makhani", price: 220, veg: true, category: "Main Course" },
    { name: "Butter Naan", price: 45, veg: true, category: "Breads" },
  ];

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col md:flex-row gap-6">
      {/* Left Panel: Tables & Menu */}
      <div className="flex-1 flex flex-col gap-6">
        <div className="bg-white rounded-xl border p-4 shadow-sm flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-gray-900">Dining Tables</h3>
            <div className="flex gap-2">
              <span className="flex items-center gap-1 text-xs font-medium text-gray-600"><div className="w-3 h-3 rounded-full bg-green-500"></div> Available</span>
              <span className="flex items-center gap-1 text-xs font-medium text-gray-600"><div className="w-3 h-3 rounded-full bg-red-500"></div> Occupied</span>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {tables.map(table => (
              <button 
                key={table.id}
                className={`p-3 rounded-lg border-2 text-left transition-all ${
                  table.status === 'AVAILABLE' 
                  ? 'border-green-200 bg-green-50 hover:border-green-400' 
                  : 'border-red-200 bg-red-50 hover:border-red-400 ring-2 ring-red-500 ring-offset-1'
                }`}
              >
                <div className="flex justify-between items-start">
                  <span className="font-bold text-gray-900">{table.name}</span>
                  <Utensils className={`w-4 h-4 ${table.status === 'AVAILABLE' ? 'text-green-600' : 'text-red-600'}`} />
                </div>
                <p className="text-xs text-gray-500 mt-1">Cap: {table.capacity}</p>
                {table.amount && <p className="text-sm font-bold text-gray-900 mt-2">₹{table.amount}</p>}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border shadow-sm flex-1 flex flex-col overflow-hidden">
          <div className="p-4 border-b flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search menu items..." 
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
          </div>
          <div className="flex overflow-x-auto p-2 border-b gap-2 scrollbar-hide">
            {menuCategories.map(cat => (
              <button key={cat} className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium ${cat === 'All' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                {cat}
              </button>
            ))}
          </div>
          <div className="flex-1 overflow-y-auto p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {menuItems.map(item => (
              <div key={item.name} className="flex justify-between items-center p-3 border rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors cursor-pointer group">
                <div>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 border-2 flex items-center justify-center ${item.veg ? 'border-green-600' : 'border-red-600'}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${item.veg ? 'bg-green-600' : 'bg-red-600'}`}></div>
                    </div>
                    <span className="font-semibold text-gray-800 text-sm">{item.name}</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900 mt-1 block">₹{item.price}</span>
                </div>
                <button className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel: KOT & Billing */}
      <div className="w-full md:w-96 bg-white rounded-xl border shadow-sm flex flex-col h-full overflow-hidden">
        <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
          <div>
            <h3 className="font-bold text-gray-900">Current Order</h3>
            <p className="text-xs text-blue-600 font-semibold mt-0.5">Table 2 • Dine In</p>
          </div>
          <button className="text-gray-500 hover:text-gray-800 text-sm font-medium underline">
            Change
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-semibold text-gray-800 text-sm">Paneer Tikka</p>
              <p className="text-xs text-gray-500">₹280 x 2</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                <button className="w-6 h-6 flex items-center justify-center bg-white rounded shadow-sm text-gray-600 font-bold">-</button>
                <span className="w-4 text-center text-sm font-bold">2</span>
                <button className="w-6 h-6 flex items-center justify-center bg-white rounded shadow-sm text-gray-600 font-bold">+</button>
              </div>
              <p className="font-bold text-gray-900 text-sm w-12 text-right">₹560</p>
            </div>
          </div>
          
          <div className="flex justify-between items-start">
            <div>
              <p className="font-semibold text-gray-800 text-sm">Butter Naan</p>
              <p className="text-xs text-gray-500">₹45 x 4</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                <button className="w-6 h-6 flex items-center justify-center bg-white rounded shadow-sm text-gray-600 font-bold">-</button>
                <span className="w-4 text-center text-sm font-bold">4</span>
                <button className="w-6 h-6 flex items-center justify-center bg-white rounded shadow-sm text-gray-600 font-bold">+</button>
              </div>
              <p className="font-bold text-gray-900 text-sm w-12 text-right">₹180</p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-gray-50 border-t space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Subtotal</span>
            <span className="font-semibold text-gray-800">₹740.00</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">CGST (2.5%)</span>
            <span className="font-semibold text-gray-800">₹18.50</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">SGST (2.5%)</span>
            <span className="font-semibold text-gray-800">₹18.50</span>
          </div>
          <div className="pt-3 border-t flex justify-between items-center">
            <span className="font-bold text-gray-900">Total</span>
            <span className="font-bold text-2xl text-blue-600">₹777.00</span>
          </div>
          
          <div className="grid grid-cols-2 gap-2 mt-4">
            <button className="flex items-center justify-center gap-2 bg-orange-100 text-orange-700 py-3 rounded-lg hover:bg-orange-200 font-bold text-sm transition-colors">
              <Printer className="w-4 h-4" />
              Print KOT
            </button>
            <button className="flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-bold text-sm transition-colors shadow-sm">
              <Receipt className="w-4 h-4" />
              Generate Bill
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
