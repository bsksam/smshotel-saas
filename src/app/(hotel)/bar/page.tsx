"use client";

import { useEffect, useState } from "react";
import { Search, Plus, Wine, Beer, Martini, GlassWater, Loader2, X, PlusCircle, MinusCircle, Trash2 } from "lucide-react";
import { getLiquorBrands, createLiquorBrand, addBarStock, createBarOrder, getCheckedInGuests } from "@/actions/hotel";

export default function BarPOS() {
  const [brands, setBrands] = useState<any[]>([]);
  const [checkedInGuests, setCheckedInGuests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Modals state
  const [isBrandModalOpen, setIsBrandModalOpen] = useState(false);
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [selectedBrandForStock, setSelectedBrandForStock] = useState<string>("");

  // Order state
  const [cart, setCart] = useState<any[]>([]);
  const [postingType, setPostingType] = useState<"WALK_IN" | "ROOM">("WALK_IN");
  const [selectedReservationId, setSelectedReservationId] = useState<string>("");
  const [customerName, setCustomerName] = useState("");

  const categories = ["All", "Whiskey", "Vodka", "Rum", "Beer", "Wine", "Gin", "Cocktail"];

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setIsLoading(true);
    try {
      const [brandsRes, guestsRes] = await Promise.all([
        getLiquorBrands(),
        getCheckedInGuests()
      ]);
      if (brandsRes.success) setBrands(brandsRes.data);
      if (guestsRes.success) setCheckedInGuests(guestsRes.data);
    } catch (err) {
      console.error("Error loading bar data:", err);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleAddBrand(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const res = await createLiquorBrand(formData);
    setIsSubmitting(false);
    if (res.success) {
      setIsBrandModalOpen(false);
      loadData();
    } else {
      alert(res.error || "Failed to add brand");
    }
  }

  async function handleAddStock(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const res = await addBarStock(formData);
    setIsSubmitting(false);
    if (res.success) {
      setIsStockModalOpen(false);
      loadData();
    } else {
      alert(res.error || "Failed to add stock");
    }
  }

  const addToCart = (brand: any, saleType: "PEG" | "BOTTLE") => {
    const price = saleType === "PEG" ? brand.pegPrice : brand.bottlePrice;
    const key = `${brand.id}-${saleType}`;
    
    // Check inventory
    const inventory = brand.inventories?.[0];
    const pegsPerBottle = Math.floor(brand.bottleSizeMl / brand.pegSizeMl);
    const totalPegsInStock = inventory ? (inventory.bottlesStock * pegsPerBottle + inventory.pegsStock) : 0;
    
    const cartItem = cart.find(i => i.key === key);
    const currentQty = cartItem ? cartItem.quantity : 0;
    const qtyNeeded = saleType === "PEG" ? currentQty + 1 : (currentQty + 1) * pegsPerBottle;

    if (totalPegsInStock < qtyNeeded) {
      alert(`Insufficient stock for ${brand.name}. Available pegs: ${totalPegsInStock}`);
      return;
    }

    if (cartItem) {
      setCart(cart.map(item => item.key === key ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      setCart([...cart, {
        key,
        brandId: brand.id,
        name: brand.name,
        saleType,
        quantity: 1,
        price,
      }]);
    }
  };

  const updateCartQty = (key: string, change: number) => {
    const cartItem = cart.find(i => i.key === key);
    if (!cartItem) return;

    const brand = brands.find(b => b.id === cartItem.brandId);
    if (!brand) return;

    const inventory = brand.inventories?.[0];
    const pegsPerBottle = Math.floor(brand.bottleSizeMl / brand.pegSizeMl);
    const totalPegsInStock = inventory ? (inventory.bottlesStock * pegsPerBottle + inventory.pegsStock) : 0;

    const newQty = cartItem.quantity + change;
    if (newQty <= 0) {
      setCart(cart.filter(item => item.key !== key));
      return;
    }

    const pegsNeeded = cartItem.saleType === "PEG" ? newQty : newQty * pegsPerBottle;
    if (totalPegsInStock < pegsNeeded) {
      alert(`Insufficient stock. Available pegs: ${totalPegsInStock}`);
      return;
    }

    setCart(cart.map(item => item.key === key ? { ...item, quantity: newQty } : item));
  };

  const removeFromCart = (key: string) => {
    setCart(cart.filter(item => item.key !== key));
  };

  const getSubtotal = () => cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const getTax = () => getSubtotal() * 0.20; // 20% VAT
  const getTotal = () => getSubtotal() + getTax();

  async function handleCheckout() {
    if (cart.length === 0) return;
    setIsSubmitting(true);
    
    let roomId = null;
    let custName = customerName || "Walk-in Guest";

    if (postingType === "ROOM") {
      const reservation = checkedInGuests.find(g => g.id === selectedReservationId);
      if (!reservation) {
        alert("Please select a guest room for posting.");
        setIsSubmitting(false);
        return;
      }
      roomId = reservation.roomId;
      custName = `${reservation.guest.firstName} ${reservation.guest.lastName} (Room ${reservation.room.number})`;
    }

    const res = await createBarOrder({
      roomId,
      customerName: custName,
      items: cart.map(i => ({
        brandId: i.brandId,
        saleType: i.saleType,
        quantity: i.quantity,
        price: i.price
      }))
    });

    setIsSubmitting(false);
    if (res.success) {
      alert("Order placed successfully!");
      setCart([]);
      setCustomerName("");
      loadData();
    } else {
      alert(res.error || "Failed to place bar order");
    }
  }

  const filteredBrands = brands.filter(brand => {
    const matchesSearch = brand.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          brand.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || brand.type.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col md:flex-row gap-6">
      {/* Left Panel: Inventory & Menu */}
      <div className="flex-1 bg-white rounded-2xl border border-zinc-200/60 shadow-sm flex flex-col overflow-hidden">
        <div className="p-4 border-b border-zinc-200/60 flex justify-between items-center bg-zinc-50/50">
          <h3 className="font-bold text-zinc-800 flex items-center gap-2">
            <Wine className="w-5 h-5 text-indigo-600 animate-pulse" />
            Bar POS & Inventory
          </h3>
          <div className="flex gap-2">
            <button 
              onClick={() => setIsBrandModalOpen(true)}
              className="px-3 py-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 rounded-lg transition-colors shadow-sm"
            >
              Add New Brand
            </button>
            <button 
              onClick={() => setIsStockModalOpen(true)}
              className="px-3 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-lg transition-colors shadow-md shadow-indigo-100"
            >
              Add Stock
            </button>
          </div>
        </div>

        <div className="p-4 border-b border-zinc-200/60 flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input 
              type="text" 
              placeholder="Search liquor brands..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white"
            />
          </div>
        </div>

        <div className="flex overflow-x-auto p-2 border-b border-zinc-200/60 gap-2 scrollbar-hide bg-zinc-50/20">
          {categories.map(cat => (
            <button 
              key={cat} 
              onClick={() => setSelectedCategory(cat)}
              className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                selectedCategory === cat 
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm" 
                  : "bg-white border border-zinc-200 text-zinc-650 hover:bg-zinc-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {isLoading ? (
            <div className="col-span-2 flex flex-col items-center justify-center py-20 text-zinc-400">
              <Loader2 className="w-8 h-8 animate-spin text-zinc-300 mb-2" />
              <span className="text-xs font-medium">Loading catalog...</span>
            </div>
          ) : filteredBrands.length === 0 ? (
            <div className="col-span-2 flex flex-col items-center justify-center py-20 text-zinc-400">
              <Wine className="w-12 h-12 text-zinc-200 mb-2" />
              <span className="text-sm font-semibold text-zinc-500">No brands found</span>
              <span className="text-xs text-zinc-400">Add a brand to populate the catalog.</span>
            </div>
          ) : (
            filteredBrands.map(brand => {
              const inventory = brand.inventories?.[0] || { bottlesStock: 0, pegsStock: 0 };
              const pegsPerBottle = Math.floor(brand.bottleSizeMl / brand.pegSizeMl);
              const totalPegs = (inventory.bottlesStock * pegsPerBottle) + inventory.pegsStock;
              const hasPegOption = brand.pegPrice > 0;

              return (
                <div key={brand.id} className="flex flex-col p-4 border border-zinc-200 rounded-2xl hover:border-indigo-400 hover:shadow-md bg-white transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-bold text-zinc-900 text-sm tracking-tight">{brand.name}</h4>
                      <p className="text-xs text-zinc-500 font-medium">{brand.type} • {brand.bottleSizeMl}ml</p>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                      totalPegs > 15 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-250' 
                        : 'bg-rose-50 text-rose-700 border-rose-250'
                    }`}>
                      In Stock: {inventory.bottlesStock}B, {inventory.pegsStock}P ({totalPegs} Pegs)
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-auto">
                    {hasPegOption && (
                      <button 
                        onClick={() => addToCart(brand, "PEG")}
                        className="flex flex-col items-center justify-center p-2 rounded-xl bg-indigo-50/20 border border-indigo-150 text-indigo-700 hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-600 hover:text-white transition-all group"
                      >
                        <span className="text-[10px] text-indigo-500 font-semibold group-hover:text-indigo-100">Peg ({brand.pegSizeMl}ml)</span>
                        <span className="text-sm font-bold text-indigo-700 group-hover:text-white">${brand.pegPrice.toFixed(2)}</span>
                      </button>
                    )}
                    <button 
                      onClick={() => addToCart(brand, "BOTTLE")}
                      className={`${!hasPegOption ? 'col-span-2' : ''} flex flex-col items-center justify-center p-2 rounded-xl bg-indigo-50/20 border border-indigo-150 text-indigo-700 hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-600 hover:text-white transition-all group`}
                    >
                      <span className="text-[10px] text-indigo-500 font-semibold group-hover:text-indigo-100">Full Bottle</span>
                      <span className="text-sm font-bold text-indigo-700 group-hover:text-white">${brand.bottlePrice.toFixed(2)}</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Right Panel: Current Tab / Billing */}
      <div className="w-full md:w-96 bg-white rounded-2xl border border-zinc-200/60 shadow-sm flex flex-col h-full overflow-hidden">
        <div className="p-4 border-b border-zinc-200/60 bg-zinc-50/50">
          <h3 className="font-bold text-zinc-900 text-sm">Current Tab</h3>
          <div className="mt-3 space-y-3">
            <div className="flex gap-2 bg-white p-1 rounded-xl border border-zinc-200">
              <button 
                type="button"
                onClick={() => setPostingType("WALK_IN")}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  postingType === "WALK_IN" 
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm" 
                    : "text-zinc-650 hover:bg-zinc-50"
                }`}
              >
                Walk-In
              </button>
              <button 
                type="button"
                onClick={() => setPostingType("ROOM")}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  postingType === "ROOM" 
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm" 
                    : "text-zinc-650 hover:bg-zinc-50"
                }`}
              >
                Room Post
              </button>
            </div>

            {postingType === "WALK_IN" ? (
              <input 
                type="text" 
                placeholder="Guest Name (Optional)" 
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3 py-1.5 border border-zinc-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white text-zinc-800 font-medium"
              />
            ) : (
              <select 
                value={selectedReservationId}
                onChange={(e) => setSelectedReservationId(e.target.value)}
                className="w-full px-3 py-1.5 border border-zinc-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white text-zinc-850 font-medium"
              >
                <option value="">Select Room / Guest</option>
                {checkedInGuests.map(g => (
                  <option key={g.id} value={g.id}>Room {g.room.number} - {g.guest.firstName} {g.guest.lastName}</option>
                ))}
              </select>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-zinc-400 py-20">
              <GlassWater className="w-10 h-10 text-zinc-200 mb-2" />
              <span className="text-xs">No items in tab</span>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.key} className="flex justify-between items-center border-b border-zinc-100 pb-3">
                <div className="max-w-[140px]">
                  <p className="font-bold text-zinc-900 text-xs truncate">{item.name}</p>
                  <p className="text-[10px] text-zinc-500 font-semibold">{item.saleType} @ ${item.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 bg-zinc-50 border border-zinc-200 rounded-lg p-0.5">
                    <button 
                      onClick={() => updateCartQty(item.key, -1)}
                      className="text-zinc-500 hover:text-indigo-650 p-0.5 rounded"
                    >
                      <MinusCircle className="w-4 h-4" />
                    </button>
                    <span className="w-5 text-center text-xs font-bold text-zinc-900">{item.quantity}</span>
                    <button 
                      onClick={() => updateCartQty(item.key, 1)}
                      className="text-zinc-500 hover:text-indigo-650 p-0.5 rounded"
                    >
                      <PlusCircle className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="font-mono font-bold text-zinc-900 text-xs w-14 text-right">${(item.price * item.quantity).toFixed(2)}</p>
                  <button 
                    onClick={() => removeFromCart(item.key)}
                    className="text-zinc-400 hover:text-rose-650 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-4 bg-zinc-50/50 border-t border-zinc-200/60 space-y-3">
          <div className="flex justify-between text-xs text-zinc-500 font-semibold">
            <span>Subtotal</span>
            <span className="font-mono text-zinc-700 font-bold">${getSubtotal().toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-xs text-zinc-500 font-semibold">
            <span>VAT (20%)</span>
            <span className="font-mono text-zinc-700 font-bold">${getTax().toFixed(2)}</span>
          </div>
          <div className="pt-3 border-t border-zinc-200 flex justify-between items-center">
            <span className="font-bold text-zinc-900 text-sm">Total</span>
            <span className="font-mono font-extrabold text-xl text-zinc-900">${getTotal().toFixed(2)}</span>
          </div>
          
          <button 
            onClick={handleCheckout}
            disabled={cart.length === 0 || isSubmitting}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-2.5 rounded-xl font-bold text-xs transition-colors shadow-md disabled:opacity-50 mt-4"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin text-white" />
            ) : (
              <Wine className="w-4 h-4 text-white" />
            )}
            {postingType === "ROOM" ? "Post to Room Bill" : "Generate Bar Bill"}
          </button>
        </div>
      </div>

      {/* Add Liquor Brand Modal */}
      {isBrandModalOpen && (
        <div className="fixed inset-0 bg-zinc-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-zinc-100 bg-zinc-50/30">
              <h3 className="text-lg font-bold text-zinc-900 tracking-tight">Add New Liquor Brand</h3>
              <button onClick={() => setIsBrandModalOpen(false)} className="text-zinc-400 hover:text-zinc-900 transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleAddBrand} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">Brand Name</label>
                <input required name="name" type="text" placeholder="E.g. Jack Daniel's" className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">Liquor Type</label>
                  <select required name="type" className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white text-zinc-800">
                    <option value="Whiskey">Whiskey</option>
                    <option value="Vodka">Vodka</option>
                    <option value="Rum">Rum</option>
                    <option value="Beer">Beer</option>
                    <option value="Wine">Wine</option>
                    <option value="Gin">Gin</option>
                    <option value="Cocktail">Cocktail</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">Bottle Size (ml)</label>
                  <input required name="bottleSizeMl" type="number" defaultValue="750" className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">Peg Size (ml)</label>
                  <input required name="pegSizeMl" type="number" defaultValue="30" className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">Peg Price ($)</label>
                  <input name="pegPrice" type="number" step="0.01" defaultValue="8" className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white font-mono" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">Bottle Price ($)</label>
                  <input required name="bottlePrice" type="number" step="0.01" placeholder="120" className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white font-mono" />
                </div>
              </div>
              <div className="mt-8 flex gap-3 pt-4 border-t border-zinc-100">
                <button type="button" onClick={() => setIsBrandModalOpen(false)} className="flex-1 px-4 py-2 text-sm font-medium text-zinc-700 bg-zinc-100 hover:bg-zinc-200 rounded-lg transition-colors">Cancel</button>
                <button disabled={isSubmitting} type="submit" className="flex-1 px-4 py-2 text-sm font-medium text-white bg-zinc-900 hover:bg-zinc-800 rounded-lg transition-colors disabled:opacity-50">
                  {isSubmitting ? "Adding..." : "Add Brand"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Stock Modal */}
      {isStockModalOpen && (
        <div className="fixed inset-0 bg-zinc-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-zinc-100 bg-zinc-50/30">
              <h3 className="text-lg font-bold text-zinc-900 tracking-tight">Add Bar Stock</h3>
              <button onClick={() => setIsStockModalOpen(false)} className="text-zinc-400 hover:text-zinc-900 transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleAddStock} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">Select Brand</label>
                <select 
                  required 
                  name="brandId" 
                  value={selectedBrandForStock} 
                  onChange={(e) => setSelectedBrandForStock(e.target.value)}
                  className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white text-zinc-800"
                >
                  <option value="">Choose a brand</option>
                  {brands.map(b => (
                    <option key={b.id} value={b.id}>{b.name} ({b.type})</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">Bottles Count</label>
                  <input name="bottles" type="number" defaultValue="0" min="0" className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">Pegs Count (Loose)</label>
                  <input name="pegs" type="number" defaultValue="0" min="0" className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white" />
                </div>
              </div>
              <div className="mt-8 flex gap-3 pt-4 border-t border-zinc-100">
                <button type="button" onClick={() => setIsStockModalOpen(false)} className="flex-1 px-4 py-2 text-sm font-medium text-zinc-700 bg-zinc-100 hover:bg-zinc-200 rounded-lg transition-colors">Cancel</button>
                <button disabled={isSubmitting || brands.length === 0} type="submit" className="flex-1 px-4 py-2 text-sm font-medium text-white bg-zinc-900 hover:bg-zinc-800 rounded-lg transition-colors disabled:opacity-50">
                  {isSubmitting ? "Updating..." : "Add Stock"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
