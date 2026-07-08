"use client";

import { useEffect, useState } from "react";
import { Search, Receipt, CheckCircle, ChevronRight, Loader2, X, DollarSign } from "lucide-react";
import { getCheckedInGuests, generateInvoice, recordPayment } from "@/actions/hotel";

export default function BillingPage() {
  const [reservations, setReservations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Payment form state
  const [paymentMethod, setPaymentMethod] = useState("CARD");
  const [paymentAmount, setPaymentAmount] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setIsLoading(true);
    try {
      const res = await getCheckedInGuests();
      if (res.success) {
        setReservations(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGenerateInvoice(reservationId: string) {
    setIsProcessing(true);
    setError(null);
    try {
      const res = await generateInvoice(reservationId);
      if (res.error) {
        setError(res.error);
        alert(res.error);
      } else if (res.data) {
        setSelectedInvoice(res.data);
        const balance = res.data.totalAmount - res.data.paidAmount;
        setPaymentAmount(balance > 0 ? balance.toFixed(2) : "0");
        setIsModalOpen(true);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setIsProcessing(false);
    }
  }

  async function handleRecordPayment(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedInvoice) return;
    
    setIsProcessing(true);
    setError(null);
    
    const formData = new FormData();
    formData.append("invoiceId", selectedInvoice.id);
    formData.append("amount", paymentAmount);
    formData.append("method", paymentMethod);
    
    try {
      const res = await recordPayment(formData);
      if (res.error) {
        setError(res.error);
      } else {
        setIsModalOpen(false);
        setSelectedInvoice(null);
        loadData();
        alert("Payment recorded and checkout completed successfully!");
      }
    } catch (err) {
      console.error(err);
      setError("Payment processing failed");
    } finally {
      setIsProcessing(false);
    }
  }

  const filteredReservations = reservations.filter(res => {
    const fullName = `${res.guest?.firstName || ""} ${res.guest?.lastName || ""}`.toLowerCase();
    const roomNum = (res.room?.number || "").toLowerCase();
    const query = searchTerm.toLowerCase();
    return fullName.includes(query) || roomNum.includes(query);
  });

  return (
    <div className="space-y-6 pb-12">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">Billing & Checkout</h2>
          <p className="text-zinc-500 mt-1 text-sm">Generate invoices, process payments, and complete check-outs.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-zinc-200/60 flex justify-between items-center bg-zinc-50/50">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input 
              type="text" 
              placeholder="Search by room number or guest name..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900 text-sm bg-white"
            />
          </div>
        </div>

        <div className="p-6 min-h-[400px]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64 text-zinc-400 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-zinc-300" />
              <p className="text-sm font-medium">Loading checked-in guests...</p>
            </div>
          ) : filteredReservations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-zinc-500 gap-3">
              <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-2 border border-green-150">
                <CheckCircle className="w-5 h-5" />
              </div>
              <p className="text-sm font-bold text-zinc-800">No guests currently checked-in</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredReservations.map((res) => (
                <div key={res.id} className="relative flex items-center justify-between border border-zinc-200 rounded-2xl p-5 hover:border-zinc-450 hover:shadow-sm transition-all duration-300 bg-white overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
                  
                  <div className="flex items-center gap-6">
                    <div className="flex flex-col items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-tr from-zinc-900 via-zinc-800 to-zinc-950 text-white border border-zinc-800 shadow-sm">
                      <span className="text-[9px] font-bold text-zinc-450 uppercase tracking-widest">ROOM</span>
                      <span className="text-xl font-black">{res.room?.number}</span>
                    </div>
                    
                    <div>
                      <h3 className="font-extrabold text-zinc-900 text-lg">{res.guest?.firstName} {res.guest?.lastName}</h3>
                      <div className="flex gap-4 mt-1.5 text-xs text-zinc-500 font-semibold">
                        <p>Checked-in: <span className="font-bold text-zinc-700">{new Date(res.checkInDate).toLocaleDateString()}</span></p>
                        <p>Advance Paid: <span className="font-bold text-emerald-600 font-mono">${res.advancePayment}</span></p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <button 
                      onClick={() => handleGenerateInvoice(res.id)}
                      disabled={isProcessing}
                      className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-2.5 rounded-xl transition-all font-bold text-xs shadow-md shadow-indigo-100 disabled:opacity-50"
                    >
                      <Receipt className="w-4 h-4 text-white" />
                      View Invoice & Checkout
                      <ChevronRight className="w-4 h-4 text-white/80" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Invoice & Payment Modal */}
      {isModalOpen && selectedInvoice && (
        <div className="fixed inset-0 bg-zinc-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b border-zinc-100 bg-zinc-50/80">
              <div>
                <h3 className="text-lg font-bold text-zinc-900 tracking-tight flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-indigo-650 animate-pulse" />
                  Invoice {selectedInvoice.invoiceNumber}
                </h3>
                <p className="text-xs text-zinc-500 mt-1">For guest: <span className="font-bold text-zinc-800">{selectedInvoice.guestName}</span></p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-zinc-900 transition-colors p-2 hover:bg-zinc-100 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="overflow-y-auto p-6 flex-1 bg-zinc-50/10">
              {/* Invoice Breakdown */}
              <div className="bg-gradient-to-br from-indigo-50/40 to-blue-50/40 rounded-2xl p-5 border border-indigo-200/60 mb-6 shadow-sm">
                <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider mb-4 border-b border-indigo-200/50 pb-2">Billing Breakdown</h4>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-zinc-650 font-medium">
                    <span>Operational Room Charges (Subtotal)</span>
                    <span className="font-mono font-bold">${selectedInvoice.subTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-zinc-650 font-medium">
                    <span>GST (18%)</span>
                    <span className="font-mono font-bold">${selectedInvoice.gstAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-zinc-900 font-bold pt-3 border-t border-indigo-200/60">
                    <span>Total Bill Amount</span>
                    <span className="font-mono text-base">${selectedInvoice.totalAmount.toFixed(2)}</span>
                  </div>
                  
                  {selectedInvoice.paidAmount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-bold">
                      <span>Already Paid (Advance)</span>
                      <span className="font-mono">-${selectedInvoice.paidAmount.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-rose-700 bg-rose-50 border border-rose-200/60 p-3 rounded-xl font-bold text-lg pt-3 border-t border-zinc-900 mt-2">
                    <span>Balance Due</span>
                    <span className="font-mono">
                      ${Math.max(0, selectedInvoice.totalAmount - selectedInvoice.paidAmount).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Form */}
              {(selectedInvoice.totalAmount - selectedInvoice.paidAmount) > 0 ? (
                <form onSubmit={handleRecordPayment} className="space-y-4">
                  <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Record Payment</h4>
                  
                  {error && (
                    <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                      {error}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Payment Method</label>
                      <div className="grid grid-cols-3 gap-2 bg-white p-1 rounded-xl border border-zinc-200">
                        {['CARD', 'CASH', 'UPI'].map(method => (
                          <button
                            key={method}
                            type="button"
                            onClick={() => setPaymentMethod(method)}
                            className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                              paymentMethod === method 
                                ? "bg-zinc-900 text-white shadow-sm" 
                                : "text-zinc-600 hover:bg-zinc-50"
                            }`}
                          >
                            {method}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Amount to Pay ($)</label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <input 
                          type="number"
                          step="0.01"
                          required
                          value={paymentAmount}
                          onChange={(e) => setPaymentAmount(e.target.value)}
                          className="w-full pl-9 pr-4 py-1.5 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900 bg-white text-base font-mono font-bold"
                        />
                      </div>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    disabled={isProcessing}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-3 rounded-xl transition-all font-bold text-sm shadow-md"
                  >
                    {isProcessing ? "Processing..." : "Confirm Payment & Complete Checkout"}
                  </button>
                </form>
              ) : (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl p-6 text-center">
                  <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                  <h4 className="font-bold text-lg mb-1">Invoice Fully Paid</h4>
                  <p className="text-sm">There is no pending balance for this guest.</p>
                  
                  <button 
                    onClick={handleRecordPayment}
                    disabled={isProcessing}
                    className="mt-6 w-full flex items-center justify-center gap-2 bg-emerald-600 text-white px-5 py-3 rounded-xl hover:bg-emerald-700 transition-all font-bold text-sm shadow-sm disabled:opacity-50"
                  >
                    {isProcessing ? "Processing..." : "Complete Checkout Now"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
