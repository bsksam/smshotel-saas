import { Search, Plus, Wine, Beer, Martini, GlassWater } from "lucide-react";

export default function BarPOS() {
  const liquorCategories = ["Whiskey", "Vodka", "Rum", "Beer", "Wine", "Cocktails"];
  
  const liquorItems = [
    { name: "Black Dog Reserve", type: "Whiskey", pegPrice: 350, bottlePrice: 4500, stockPegs: 45, icon: GlassWater },
    { name: "Absolut Classic", type: "Vodka", pegPrice: 280, bottlePrice: 3800, stockPegs: 20, icon: Martini },
    { name: "Old Monk", type: "Rum", pegPrice: 150, bottlePrice: 1800, stockPegs: 110, icon: GlassWater },
    { name: "Kingfisher Ultra", type: "Beer", pegPrice: null, bottlePrice: 250, stockPegs: 48, icon: Beer },
  ];

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col md:flex-row gap-6">
      {/* Left Panel: Inventory & Menu */}
      <div className="flex-1 bg-white rounded-xl border shadow-sm flex flex-col overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center bg-gray-50">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <Wine className="w-5 h-5 text-red-600" />
            Bar Inventory & Sales
          </h3>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
              Add Stock
            </button>
          </div>
        </div>
        <div className="p-4 border-b flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search liquor brands..." 
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
        </div>
        <div className="flex overflow-x-auto p-2 border-b gap-2 scrollbar-hide">
          <button className="whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium bg-blue-600 text-white">All</button>
          {liquorCategories.map(cat => (
            <button key={cat} className="whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200">
              {cat}
            </button>
          ))}
        </div>
        <div className="flex-1 overflow-y-auto p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {liquorItems.map(item => {
            const Icon = item.icon;
            return (
              <div key={item.name} className="flex flex-col p-4 border rounded-xl hover:border-blue-300 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{item.name}</h4>
                      <p className="text-xs text-gray-500">{item.type}</p>
                    </div>
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${item.stockPegs > 30 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    Stock: {item.stockPegs} {item.pegPrice ? 'pegs' : 'bottles'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-auto">
                  {item.pegPrice && (
                    <button className="flex flex-col items-center justify-center p-2 rounded-lg bg-gray-50 border hover:bg-blue-50 hover:border-blue-200 transition-colors group">
                      <span className="text-xs text-gray-500 font-medium group-hover:text-blue-600">30ml Peg</span>
                      <span className="text-sm font-bold text-gray-900">₹{item.pegPrice}</span>
                    </button>
                  )}
                  <button className={`${!item.pegPrice ? 'col-span-2' : ''} flex flex-col items-center justify-center p-2 rounded-lg bg-gray-50 border hover:bg-blue-50 hover:border-blue-200 transition-colors group`}>
                    <span className="text-xs text-gray-500 font-medium group-hover:text-blue-600">Full Bottle</span>
                    <span className="text-sm font-bold text-gray-900">₹{item.bottlePrice}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Panel: Billing */}
      <div className="w-full md:w-96 bg-white rounded-xl border shadow-sm flex flex-col h-full overflow-hidden">
        <div className="p-4 border-b bg-gray-50">
          <h3 className="font-bold text-gray-900">Current Tab</h3>
          <div className="mt-2 flex gap-2">
            <select className="flex-1 px-3 py-1.5 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 bg-white">
              <option>Walk-in Customer</option>
              <option>Room 101 (Rahul)</option>
              <option>Room 205 (Anita)</option>
            </select>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-semibold text-gray-800 text-sm">Black Dog Reserve</p>
              <p className="text-xs text-gray-500">30ml Peg @ ₹350</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                <button className="w-6 h-6 flex items-center justify-center bg-white rounded shadow-sm text-gray-600 font-bold">-</button>
                <span className="w-4 text-center text-sm font-bold">2</span>
                <button className="w-6 h-6 flex items-center justify-center bg-white rounded shadow-sm text-gray-600 font-bold">+</button>
              </div>
              <p className="font-bold text-gray-900 text-sm w-12 text-right">₹700</p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-gray-50 border-t space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Subtotal</span>
            <span className="font-semibold text-gray-800">₹700.00</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">VAT (20%)</span>
            <span className="font-semibold text-gray-800">₹140.00</span>
          </div>
          <div className="pt-3 border-t flex justify-between items-center">
            <span className="font-bold text-gray-900">Total</span>
            <span className="font-bold text-2xl text-blue-600">₹840.00</span>
          </div>
          
          <div className="grid grid-cols-2 gap-2 mt-4">
            <button className="col-span-2 flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-bold text-sm transition-colors shadow-sm">
              <Wine className="w-4 h-4" />
              Generate Bar Bill
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
