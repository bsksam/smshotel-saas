"use client";

import { useEffect, useState } from "react";
import { Search, Receipt, CreditCard, CheckCircle, ChevronRight, Loader2, X, Wallet, DollarSign } from "lucide-react";
import { getCheckedInGuests, generateInvoice, recordPayment } from "@/actions/hotel";

export default function BillingPage() {
  const [reservations, setReservations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
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
      } else {
        setSelectedInvoice(res.data);
        // Pre-fill amount with remaining balance
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
        loadData(); // Refresh list (checked out guests will disappear)
        alert("Payment recorded successfully!");
      }
    } catch (err) {
      console.error(err);
      setError("Payment processing failed");
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">Billing & Checkout</h2>
          <p className="text-zinc-500 mt-1 text-sm">Generate invoices, process payments, and complete check-outs.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-zinc-200/60 flex justify-between items-center bg-zinc-50/50">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input 
              type="text" 
              placeholder="Search by room number or guest name..." 
              className="w-full pl-10 pr-4 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 text-sm bg-white"
            />
          </div>
        </div>

        <div className="p-4 min-h-[400px]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64 text-zinc-400 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-zinc-300" />
              <p className="text-sm font-medium">Loading checked-in guests...</p>
            </div>
          ) : reservations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-zinc-500 gap-3">
              <div className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center mb-2">
                <CheckCircle className="w-5 h-5 text-zinc-400" />
              </div>
              <p className="text-sm font-medium">No guests currently checked-in</p>
              <p className="text-xs text-zinc-400">Arriving guests need to be checked in first.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {reservations.map((res) => (
                <div key={res.id} className="flex items-center justify-between border border-zinc-200 rounded-xl p-5 hover:border-zinc-300 transition-colors shadow-sm bg-white">
                  <div className="flex items-center gap-6">
                    <div className="flex flex-col items-center justify-center w-16 h-16 rounded-xl bg-zinc-900 text-white border border-zinc-800">
                      <span className="text-xs font-semibold text-zinc-400">ROOM</span>
                      <span className="text-xl font-bold">{res.room?.number}</span>
                    </div>
                    
                    <div>
                      <h3 className="font-bold text-zinc-900 text-lg">{res.guest?.firstName} {res.guest?.lastName}</h3>
                      <div className="flex gap-4 mt-1 text-sm text-zinc-500">
                        <p>In: <span className="font-semibold text-zinc-700">{new Date(res.checkInDate).toLocaleDateString()}</span></p>
                        <p>Adv Paid: <span className="font-semibold text-green-600">${res.advancePayment}</span></p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <button 
                      onClick={() => handleGenerateInvoice(res.id)}
                      disabled={isProcessing}
                      className="flex items-center gap-2 bg-white text-zinc-900 border border-zinc-200 px-5 py-2.5 rounded-lg hover:bg-zinc-50 transition-colors font-medium shadow-sm disabled:opacity-50"
                    >
                      <Receipt className="w-4 h-4 text-zinc-500" />
                      View Invoice & Checkout
                      <ChevronRight className="w-4 h-4 text-zinc-400" />
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
                <h3 className="text-xl font-bold text-zinc-900 tracking-tight flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-zinc-400" />
                  Invoice {selectedInvoice.invoiceNumber}
                </h3>
                <p className="text-sm text-zinc-500 mt-1">For {selectedInvoice.guestName}</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-zinc-900 transition-colors p-2 hover:bg-zinc-100 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="overflow-y-auto p-6 flex-1">
              {/* Invoice Breakdown */}
              <div className="bg-zinc-50 rounded-xl p-5 border border-zinc-200 mb-8">
                <h4 className="text-sm font-bold text-zinc-900 uppercase tracking-wider mb-4 border-b border-zinc-200 pb-2">Billing Breakdown</h4>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-zinc-600">
                    <span>Room Charges (Subtotal)</span>
                    <span className="font-mono">${selectedInvoice.subTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-zinc-600">
                    <span>GST (18%)</span>
                    <span className="font-mono">${selectedInvoice.gstAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-zinc-900 font-semibold pt-3 border-t border-zinc-200">
                    <span>Total Amount</span>
                    <span className="font-mono">${selectedInvoice.totalAmount.toFixed(2)}</span>
                  </div>
                  
                  {selectedInvoice.paidAmount > 0 && (
                    <div className="flex justify-between text-green-600 font-medium">
                      <span>Already Paid (Advance)</span>
                      <span className="font-mono">-${selectedInvoice.paidAmount.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-zinc-900 font-bold text-lg pt-3 border-t border-zinc-900">
                    <span>Balance Due</span>
                    <span className="font-mono">
                      ${Math.max(0, selectedInvoice.totalAmount - selectedInvoice.paidAmount).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Form */}
              {(selectedInvoice.totalAmount - selectedInvoice.paidAmount) > 0 ? (
                <form onSubmit={handleRecordPayment}>
                  <h4 className="text-sm font-bold text-zinc-900 uppercase tracking-wider mb-4">Record Payment</h4>
                  
                  {error && (
                    <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                      {error}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Payment Method</label>
                      <div className="grid grid-cols-3 gap-2">
                        {['CARD', 'CASH', 'UPI'].map(method => (
                          <button
                            key={method}
                            type="button"
                            onClick={() => setPaymentMethod(method)}
                            className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                              paymentMethod === method 
                                ? "border-zinc-900 bg-zinc-900 text-white shadow-sm" 
                                : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300"
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
                          className="w-full pl-9 pr-4 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 bg-white text-lg font-mono font-bold"
                        />
                      </div>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    disabled={isProcessing}
                    className="w-full flex items-center justify-center gap-2 bg-zinc-900 text-white px-5 py-3 rounded-xl hover:bg-zinc-800 transition-all font-bold shadow-md disabled:opacity-50"
                  >
                    {isProcessing ? "Processing..." : "Confirm Payment & Complete Checkout"}
                  </button>
                </form>
              ) : (
                <div className="bg-green-50 border border-green-200 text-green-800 rounded-xl p-6 text-center">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                  <h4 className="font-bold text-lg mb-1">Invoice Fully Paid</h4>
                  <p className="text-sm">There is no pending balance for this guest.</p>
                  
                  <button 
                    onClick={handleRecordPayment}
                    disabled={isProcessing}
                    className="mt-6 w-full flex items-center justify-center gap-2 bg-green-600 text-white px-5 py-3 rounded-xl hover:bg-green-700 transition-all font-bold shadow-sm disabled:opacity-50"
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
