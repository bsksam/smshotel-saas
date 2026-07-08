"use client";

import { useEffect, useState } from "react";
import { Coffee, Plus, Search, Loader2, Utensils, ReceiptText, ChevronRight, X } from "lucide-react";
import { getTables, addTable, getMenuCategories, addMenuCategory, addMenuItem, getActiveOrders, createRestOrder, addItemToOrder, billOrder } from "@/actions/hotel";

export default function RestaurantPOS() {
  const [tables, setTables] = useState<any[]>([]);
  const [menu, setMenu] = useState<any[]>([]);
  const [activeOrders, setActiveOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals state
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedTableForOrder, setSelectedTableForOrder] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setIsLoading(true);
    try {
      const [tRes, mRes, oRes] = await Promise.all([
        getTables(),
        getMenuCategories(),
        getActiveOrders()
      ]);
      if (tRes.success) setTables(tRes.data);
      if (mRes.success) setMenu(mRes.data);
      if (oRes.success) setActiveOrders(oRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleAddTable(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    const form = e.currentTarget;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value;
    await addTable(name);
    setIsTableModalOpen(false);
    setIsSubmitting(false);
    loadData();
  }

  async function handleAddCategory(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    const form = e.currentTarget;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value;
    await addMenuCategory(name);
    setIsCategoryModalOpen(false);
    setIsSubmitting(false);
    loadData();
  }

  async function handleAddMenuItem(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    await addMenuItem(formData);
    setIsMenuModalOpen(false);
    setIsSubmitting(false);
    loadData();
  }

  async function handleOpenOrder(tableId: string) {
    setIsSubmitting(true);
    await createRestOrder(tableId);
    setIsSubmitting(false);
    loadData();
  }

  async function handleAddItemToOrder(orderId: string, menuItemId: string, price: number) {
    await addItemToOrder(orderId, menuItemId, 1, price);
    loadData();
  }

  async function handleBillOrder(orderId: string) {
    if (confirm("Bill this order and free up the table?")) {
      await billOrder(orderId);
      loadData();
    }
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 tracking-tight flex items-center gap-2">
            <Utensils className="w-6 h-6" />
            Restaurant POS
          </h2>
          <p className="text-zinc-500 mt-1 text-sm">Manage dining tables, menus, and KOTs.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setIsTableModalOpen(true)} className="flex items-center gap-2 bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100/80 px-4 py-2 rounded-xl transition-all font-semibold text-xs shadow-sm">
            Add Table
          </button>
          <button onClick={() => setIsCategoryModalOpen(true)} className="flex items-center gap-2 bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100/80 px-4 py-2 rounded-xl transition-all font-semibold text-xs shadow-sm">
            Add Menu Category
          </button>
          <button onClick={() => setIsMenuModalOpen(true)} className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2 rounded-xl transition-all font-semibold text-xs shadow-md shadow-indigo-100">
            <Plus className="w-4 h-4" />
            Add Menu Item
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Tables */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-6">
            <h3 className="text-lg font-bold text-zinc-900 tracking-tight mb-6">Dining Tables</h3>
            {isLoading ? (
              <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-zinc-300" /></div>
            ) : tables.length === 0 ? (
              <p className="text-sm text-zinc-500 text-center py-4">No tables added yet.</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {tables.map(table => {
                  const isOccupied = table.status === "OCCUPIED";
                  return (
                    <button
                      key={table.id}
                      onClick={() => !isOccupied && handleOpenOrder(table.id)}
                      disabled={isOccupied}
                      className={`relative flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all ${
                        isOccupied 
                          ? "border-rose-200 bg-rose-50/20 text-rose-700 cursor-not-allowed" 
                          : "border-emerald-200 bg-emerald-50/20 text-emerald-700 hover:border-emerald-500 hover:shadow-md cursor-pointer"
                      }`}
                    >
                      <Coffee className={`w-8 h-8 mb-2 ${isOccupied ? "text-rose-500" : "text-emerald-500"}`} />
                      <span className="font-bold text-zinc-900">{table.name}</span>
                      <span className={`text-[10px] font-bold uppercase tracking-wider mt-1 px-2.5 py-0.5 rounded-md border ${
                        isOccupied ? "bg-rose-100 text-rose-800 border-rose-250" : "bg-emerald-100 text-emerald-800 border-emerald-250"
                      }`}>
                        {table.status}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Active Orders */}
        <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm flex flex-col max-h-[800px] overflow-hidden">
          <div className="p-6 border-b border-zinc-100 bg-zinc-50/50">
            <h3 className="text-lg font-bold text-zinc-900 tracking-tight flex items-center gap-2">
              <ReceiptText className="w-5 h-5 text-zinc-500" />
              Active Orders
            </h3>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {isLoading ? (
               <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-zinc-300" /></div>
            ) : activeOrders.length === 0 ? (
              <p className="text-sm text-zinc-500 text-center py-8">No active dine-in orders.</p>
            ) : (
              activeOrders.map(order => (
                <div key={order.id} className="border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
                  <div className="bg-gradient-to-r from-zinc-900 to-zinc-800 text-white p-3 flex justify-between items-center">
                    <span className="font-bold">{order.table?.name}</span>
                    <span className="text-xs font-mono bg-white/20 px-2 py-0.5 rounded">#{order.id.slice(-5)}</span>
                  </div>
                  
                  <div className="p-3 bg-zinc-50/50 max-h-48 overflow-y-auto">
                    {order.items.length === 0 ? (
                      <p className="text-xs text-zinc-500 text-center italic py-2">No items added.</p>
                    ) : (
                      <div className="space-y-2">
                        {order.items.map((item: any) => (
                          <div key={item.id} className="flex justify-between text-sm">
                            <span className="text-zinc-755 font-medium"><span className="text-zinc-400 mr-1">{item.quantity}x</span> {item.menuItem?.name}</span>
                            <span className="font-mono font-bold text-zinc-900">${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="p-3 border-t border-zinc-200 bg-white space-y-3">
                    <div className="flex justify-between font-bold text-zinc-900">
                      <span>Total</span>
                      <span className="font-mono text-base">${order.totalAmount.toFixed(2)}</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <button 
                        onClick={() => { setSelectedTableForOrder(order.id); setIsOrderModalOpen(true); }}
                        className="text-xs font-bold bg-zinc-100 hover:bg-zinc-200 text-zinc-800 py-2 rounded-lg transition-colors border border-zinc-200"
                      >
                        + Add Items
                      </button>
                      <button 
                        onClick={() => handleBillOrder(order.id)}
                        disabled={order.items.length === 0}
                        className="text-xs font-bold bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition-colors disabled:opacity-50"
                      >
                        Bill & Close
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modals for Add Table, Add Category, Add Menu Item */}
      {isTableModalOpen && (
        <div className="fixed inset-0 bg-zinc-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-zinc-100 bg-zinc-50/30">
              <h3 className="text-lg font-bold text-zinc-900 tracking-tight">Add Dining Table</h3>
              <button onClick={() => setIsTableModalOpen(false)} className="text-zinc-400 hover:text-zinc-900 transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleAddTable} className="p-6">
              <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">Table Name/Number</label>
              <input required name="name" type="text" placeholder="E.g. Table 1" className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 text-sm bg-white" />
              <button disabled={isSubmitting} type="submit" className="mt-6 w-full px-4 py-2 text-sm font-medium text-white bg-zinc-900 hover:bg-zinc-800 rounded-lg transition-colors">Save Table</button>
            </form>
          </div>
        </div>
      )}

      {isCategoryModalOpen && (
        <div className="fixed inset-0 bg-zinc-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-zinc-100 bg-zinc-50/30">
              <h3 className="text-lg font-bold text-zinc-900 tracking-tight">Add Menu Category</h3>
              <button onClick={() => setIsCategoryModalOpen(false)} className="text-zinc-400 hover:text-zinc-900 transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleAddCategory} className="p-6">
              <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">Category Name</label>
              <input required name="name" type="text" placeholder="E.g. Main Course" className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 text-sm bg-white" />
              <button disabled={isSubmitting} type="submit" className="mt-6 w-full px-4 py-2 text-sm font-medium text-white bg-zinc-900 hover:bg-zinc-800 rounded-lg transition-colors">Save Category</button>
            </form>
          </div>
        </div>
      )}

      {isMenuModalOpen && (
        <div className="fixed inset-0 bg-zinc-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-zinc-100 bg-zinc-50/30">
              <h3 className="text-lg font-bold text-zinc-900 tracking-tight">Add Menu Item</h3>
              <button onClick={() => setIsMenuModalOpen(false)} className="text-zinc-400 hover:text-zinc-900 transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleAddMenuItem} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">Category</label>
                <select required name="categoryId" className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 text-sm bg-white text-zinc-800">
                  <option value="">Select Category</option>
                  {menu.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">Item Name</label>
                <input required name="name" type="text" placeholder="E.g. Margherita Pizza" className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 text-sm bg-white" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">Price ($)</label>
                  <input required name="price" type="number" step="0.01" className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 text-sm bg-white font-mono" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">Dietary</label>
                  <select name="isVeg" className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 text-sm bg-white text-zinc-800">
                    <option value="true">Vegetarian</option>
                    <option value="false">Non-Veg</option>
                  </select>
                </div>
              </div>
              <button disabled={isSubmitting || menu.length === 0} type="submit" className="mt-4 w-full px-4 py-2 text-sm font-medium text-white bg-zinc-900 hover:bg-zinc-800 rounded-lg transition-colors">Save Item</button>
              {menu.length === 0 && <p className="text-xs text-red-500 text-center mt-2">Add a category first.</p>}
            </form>
          </div>
        </div>
      )}

      {/* Add Items to Order POS Modal */}
      {isOrderModalOpen && selectedTableForOrder && (
        <div className="fixed inset-0 bg-zinc-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden h-[80vh] flex flex-col">
            <div className="flex justify-between items-center p-6 border-b border-zinc-100 bg-zinc-50/30">
              <h3 className="text-lg font-bold text-zinc-900 tracking-tight">Add Items to Order</h3>
              <button onClick={() => setIsOrderModalOpen(false)} className="text-zinc-400 hover:text-zinc-900 transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 bg-zinc-50/50">
              {menu.map(category => (
                <div key={category.id} className="mb-8">
                  <h4 className="text-sm font-bold text-zinc-900 uppercase tracking-wider mb-4 border-b border-zinc-200 pb-2">{category.name}</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {category.items?.map((item: any) => (
                      <button 
                        key={item.id}
                        onClick={() => handleAddItemToOrder(selectedTableForOrder, item.id, item.price)}
                        className="flex justify-between items-center p-4 rounded-xl border border-zinc-200 bg-white hover:border-zinc-900 hover:shadow-md transition-all text-left"
                      >
                        <div>
                          <p className="font-semibold text-zinc-900">{item.name}</p>
                          <p className="text-xs text-zinc-550 mt-1 flex items-center gap-1.5">
                            <span className={`w-2 h-2 rounded-full ${item.isVeg ? 'bg-green-500 shadow-sm' : 'bg-red-500 shadow-sm'}`}></span>
                            {item.isVeg ? 'Veg' : 'Non-Veg'}
                          </p>
                        </div>
                        <span className="font-bold text-zinc-900">${item.price.toFixed(2)}</span>
                      </button>
                    ))}
                  </div>
                  {(!category.items || category.items.length === 0) && <p className="text-sm text-zinc-400 italic">No items in this category.</p>}
                </div>
              ))}
              {menu.length === 0 && <p className="text-center text-zinc-500 mt-10">Your menu is empty. Add categories and items first.</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
