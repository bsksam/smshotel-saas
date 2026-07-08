"use client";

import { useEffect, useState } from "react";
import { Search, Loader2, Play, Check, Pause, RotateCw, Printer, AlertTriangle, Coffee } from "lucide-react";
import { getKdsOrders, updateRestOrderStatus } from "@/actions/hotel";

export default function KitchenPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<"ALL" | "NEW" | "PREPARING" | "DELAYED" | "COMPLETED">("ALL");
  const [processingId, setProcessingId] = useState<string | null>(null);
  
  // Elapsed timers state (updated every second)
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    loadData();
    const interval = setInterval(() => {
      loadData(false); // poll silently
    }, 12000); // Poll every 12 seconds

    const timerInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(timerInterval);
    };
  }, []);

  async function loadData(showLoader = true) {
    if (showLoader) setIsLoading(true);
    try {
      const res = await getKdsOrders();
      if (res.success) {
        setOrders(res.data);
      }
    } catch (err) {
      console.error("Error loading KDS orders:", err);
    } finally {
      if (showLoader) setIsLoading(false);
    }
  }

  async function handleStatusChange(orderId: string, newStatus: "KOT_PENDING" | "PREPARING" | "SERVED" | "BILLED") {
    setProcessingId(orderId);
    const res = await updateRestOrderStatus(orderId, newStatus);
    if (res.success) {
      loadData(false);
    } else {
      alert(res.error || "Failed to update order status");
    }
    setProcessingId(null);
  }

  // Helper: check if order is delayed (preparing for more than 10 minutes)
  const isOrderDelayed = (order: any) => {
    if (order.status !== "PREPARING") return false;
    const minutesElapsed = Math.floor((currentTime.getTime() - new Date(order.createdAt).getTime()) / 60000);
    return minutesElapsed >= 10;
  };

  // Counts for tabs
  const newCount = orders.filter(o => o.status === "KOT_PENDING").length;
  const preparingCount = orders.filter(o => o.status === "PREPARING" && !isOrderDelayed(o)).length;
  const delayedCount = orders.filter(o => isOrderDelayed(o)).length;
  const completedCount = orders.filter(o => o.status === "SERVED").length;

  // Filter logic
  const filteredOrders = orders.filter(order => {
    // Search query matches table name or order type or customer details
    const orderNum = order.id.slice(-5).toLowerCase();
    const tableName = (order.table?.name || "").toLowerCase();
    const matchSearch = orderNum.includes(searchQuery.toLowerCase()) || tableName.includes(searchQuery.toLowerCase());

    if (!matchSearch) return false;

    // Status tab filter
    if (activeFilter === "NEW") return order.status === "KOT_PENDING";
    if (activeFilter === "PREPARING") return order.status === "PREPARING" && !isOrderDelayed(order);
    if (activeFilter === "DELAYED") return isOrderDelayed(order);
    if (activeFilter === "COMPLETED") return order.status === "SERVED";
    return true; // "ALL"
  });

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto">
      {/* Header operations */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm">
        <div>
          <h2 className="text-2xl font-black text-zinc-800 tracking-tight flex items-center gap-2">
            <Coffee className="w-6 h-6 text-orange-500 animate-bounce" />
            Kitchen KDS (Display System)
          </h2>
          <p className="text-zinc-500 text-xs font-semibold mt-1">Real-time status board and queue management for chef operations.</p>
        </div>
        <button 
          onClick={() => loadData(true)} 
          className="flex items-center gap-2 bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 rounded-xl px-4 py-2 text-xs font-bold transition-all"
        >
          <RotateCw className="w-4 h-4 animate-spin-slow" />
          Refresh Board
        </button>
      </div>

      {/* Tabs and Filters */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="flex flex-wrap gap-2.5">
          <button 
            onClick={() => setActiveFilter("ALL")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
              activeFilter === "ALL" 
                ? "bg-zinc-800 border-zinc-900 text-white shadow-sm" 
                : "bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50"
            }`}
          >
            All Orders ({orders.length})
          </button>
          
          <button 
            onClick={() => setActiveFilter("NEW")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
              activeFilter === "NEW" 
                ? "bg-slate-600 border-slate-700 text-white shadow-sm" 
                : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-slate-500 border border-white"></span>
            New Order ({newCount})
          </button>

          <button 
            onClick={() => setActiveFilter("PREPARING")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
              activeFilter === "PREPARING" 
                ? "bg-amber-500 border-amber-600 text-white shadow-sm" 
                : "bg-white border-amber-200 text-amber-600 hover:bg-amber-50"
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 border border-white animate-pulse"></span>
            In Kitchen ({preparingCount})
          </button>

          <button 
            onClick={() => setActiveFilter("DELAYED")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
              activeFilter === "DELAYED" 
                ? "bg-rose-500 border-rose-600 text-white shadow-sm" 
                : "bg-white border-rose-250 text-rose-600 hover:bg-rose-50"
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 border border-white animate-ping"></span>
            Delayed ({delayedCount})
          </button>

          <button 
            onClick={() => setActiveFilter("COMPLETED")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
              activeFilter === "COMPLETED" 
                ? "bg-emerald-600 border-emerald-700 text-white shadow-sm" 
                : "bg-white border-emerald-250 text-emerald-700 hover:bg-emerald-50"
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white"></span>
            Completed ({completedCount})
          </button>
        </div>

        <div className="relative w-full lg:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input 
            type="text" 
            placeholder="Search by table or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-zinc-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          />
        </div>
      </div>

      {/* Grid List */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-32 text-zinc-400 gap-3 bg-white border border-zinc-200 rounded-3xl">
          <Loader2 className="w-8 h-8 animate-spin text-zinc-300" />
          <p className="text-sm font-semibold">Loading active kitchen KOT queue...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-zinc-400 gap-2 bg-white border border-zinc-200 rounded-3xl">
          <span className="text-sm font-bold text-zinc-700">No active kitchen orders</span>
          <span className="text-xs text-zinc-400">Newly placed restaurant orders will automatically sync here.</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOrders.map(order => {
            const isDelayed = isOrderDelayed(order);
            const timeElapsedMs = currentTime.getTime() - new Date(order.createdAt).getTime();
            const minutesElapsed = Math.floor(timeElapsedMs / 60000);
            const secondsElapsed = Math.floor((timeElapsedMs % 60000) / 1000);
            const timeFormatted = `${minutesElapsed}:${secondsElapsed.toString().padStart(2, "0")}`;

            // Header color mapping
            let headerBg = "from-slate-600 to-slate-700"; // default: new
            let badgeText = "New Order";
            if (isDelayed) {
              headerBg = "from-rose-500 to-rose-600";
              badgeText = "Delayed";
            } else if (order.status === "PREPARING") {
              headerBg = "from-amber-500 to-amber-600";
              badgeText = "In Kitchen";
            } else if (order.status === "SERVED") {
              headerBg = "from-emerald-600 to-emerald-700";
              badgeText = "Completed";
            }

            return (
              <div key={order.id} className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-all">
                {/* Card Header */}
                <div className={`p-4 bg-gradient-to-r ${headerBg} text-white flex justify-between items-center`}>
                  <div>
                    <h4 className="font-bold text-sm leading-tight flex items-center gap-1.5">
                      {order.table?.name || "Room Service"} 
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white/25 border border-white/20">
                        {order.orderType}
                      </span>
                    </h4>
                    <p className="text-[10px] text-white/95 mt-1 font-semibold">
                      Token No: {order.id.slice(-4).toUpperCase()} • {new Date(order.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                  <span className="text-xs font-mono bg-white/20 px-2 py-0.5 rounded-md font-bold">
                    #{order.id.slice(-5)}
                  </span>
                </div>

                {/* Items List */}
                <div className="p-4 flex-1 space-y-3 bg-zinc-50/30">
                  {order.items?.map((item: any) => (
                    <div key={item.id} className="flex gap-2">
                      {/* Dietary Type Indicator box */}
                      <span className={`w-4 h-4 rounded border flex items-center justify-center mt-0.5 flex-shrink-0 ${
                        item.menuItem?.isVeg 
                          ? "border-emerald-500 bg-emerald-50" 
                          : "border-rose-500 bg-rose-50"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          item.menuItem?.isVeg ? "bg-emerald-600" : "bg-rose-600"
                        }`}></span>
                      </span>
                      
                      <div className="flex-1">
                        <div className="flex justify-between items-start text-xs font-bold text-zinc-900 leading-tight">
                          <span>{item.menuItem?.name}</span>
                          <span className="text-indigo-650 bg-indigo-50 border border-indigo-150 px-1.5 py-0.5 rounded font-mono font-black">
                            x{item.quantity}
                          </span>
                        </div>
                        {item.notes && (
                          <div className="mt-1 bg-zinc-100/80 rounded border border-zinc-200/50 p-1.5 text-[10px] text-zinc-550 font-bold">
                            Notes: {item.notes}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Card Footer Timer / Progress */}
                <div className="p-4 border-t border-zinc-150 bg-white space-y-3 mt-auto">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-400 font-bold uppercase tracking-wider text-[10px]">Timer</span>
                    <span className={`font-mono font-bold ${
                      isDelayed ? "text-rose-600 animate-pulse flex items-center gap-1" : "text-zinc-600"
                    }`}>
                      {isDelayed && <AlertTriangle className="w-3.5 h-3.5" />}
                      {isDelayed ? `Delayed By ${minutesElapsed - 10}m` : timeFormatted}
                    </span>
                  </div>

                  {/* Horizontal visual progress line */}
                  <div className="w-full bg-zinc-100 rounded-full h-1 overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 ${
                        isDelayed ? "bg-rose-500 animate-pulse w-full" : 
                        order.status === "SERVED" ? "bg-emerald-500 w-full" : 
                        "bg-amber-500"
                      }`} 
                      style={{ width: isDelayed || order.status === "SERVED" ? "100%" : `${Math.min(100, (minutesElapsed / 10) * 100)}%` }}
                    ></div>
                  </div>

                  {/* Operational Action triggers */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    {order.status === "KOT_PENDING" && (
                      <>
                        <button 
                          onClick={() => handleStatusChange(order.id, "PREPARING")}
                          disabled={processingId === order.id}
                          className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 py-1.5 rounded-lg transition-colors"
                        >
                          <Play className="w-3 h-3" />
                          Start
                        </button>
                        <button 
                          onClick={() => handleStatusChange(order.id, "SERVED")}
                          disabled={processingId === order.id}
                          className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 py-1.5 rounded-lg transition-colors"
                        >
                          <Check className="w-3 h-3" />
                          Mark Done
                        </button>
                      </>
                    )}

                    {order.status === "PREPARING" && (
                      <>
                        <button 
                          onClick={() => handleStatusChange(order.id, "KOT_PENDING")}
                          disabled={processingId === order.id}
                          className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-zinc-700 bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 py-1.5 rounded-lg transition-colors"
                        >
                          <Pause className="w-3 h-3" />
                          Pause
                        </button>
                        <button 
                          onClick={() => handleStatusChange(order.id, "SERVED")}
                          disabled={processingId === order.id}
                          className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 py-1.5 rounded-lg transition-colors col-span-1"
                        >
                          <Check className="w-3 h-3" />
                          Mark Done
                        </button>
                      </>
                    )}

                    {order.status === "SERVED" && (
                      <>
                        <button 
                          onClick={() => alert("Printing KOT...")}
                          className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 py-1.5 rounded-lg transition-colors col-span-2"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          Print KOT Ticket
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
