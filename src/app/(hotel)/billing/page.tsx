import { Search, FileText, CreditCard, Download, CheckCircle, Clock } from "lucide-react";

export default function BillingPage() {
  const pendingBills = [
    { id: "INV-1001", room: "101", guest: "Rahul Sharma", amount: 4500, status: "UNPAID", type: "Checkout" },
    { id: "INV-1002", room: "102", guest: "Vikram Singh", amount: 1250, status: "PARTIAL", type: "Checkout" },
    { id: "RES-T2", room: "-", guest: "Walk-in", amount: 777, status: "UNPAID", type: "Restaurant" },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Billing & Checkout</h2>
          <p className="text-gray-500 mt-1">Generate final invoices, process payments, and checkout guests.</p>
        </div>
        <button className="flex items-center gap-2 bg-white border text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors font-medium">
          <FileText className="w-5 h-5" />
          View All Invoices
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-xl border shadow-sm flex flex-col">
            <div className="p-4 border-b flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-gray-900">Pending Bills</h3>
              <span className="bg-orange-100 text-orange-800 text-xs font-bold px-2 py-1 rounded-full">3 Pending</span>
            </div>
            <div className="p-4 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search room or guest..." 
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-2">
              {pendingBills.map(bill => (
                <button key={bill.id} className="w-full text-left p-3 rounded-lg border hover:border-blue-400 hover:bg-blue-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-gray-900">{bill.guest}</p>
                      <p className="text-xs text-gray-500 mt-0.5">Room {bill.room} • {bill.type}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">₹{bill.amount}</p>
                      <p className={`text-xs font-semibold mt-1 flex items-center justify-end gap-1 ${bill.status === 'UNPAID' ? 'text-red-600' : 'text-orange-600'}`}>
                        <Clock className="w-3 h-3" />
                        {bill.status}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border shadow-sm p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Final Invoice Details</h3>
                <p className="text-gray-500 text-sm mt-1">Room 101 • Rahul Sharma • Check-in: Jul 5</p>
              </div>
              <span className="bg-red-100 text-red-800 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider border border-red-200">
                Unpaid
              </span>
            </div>

            <div className="space-y-6">
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-4 py-3 font-semibold text-gray-700">Description</th>
                      <th className="px-4 py-3 font-semibold text-gray-700">Qty/Days</th>
                      <th className="px-4 py-3 font-semibold text-gray-700 text-right">Amount (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    <tr>
                      <td className="px-4 py-3">Room Charges (Deluxe)</td>
                      <td className="px-4 py-3">2 Days</td>
                      <td className="px-4 py-3 text-right">4,000.00</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3">Restaurant Bill (INV-R12)</td>
                      <td className="px-4 py-3">1</td>
                      <td className="px-4 py-3 text-right">740.00</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3">Laundry Services</td>
                      <td className="px-4 py-3">3 items</td>
                      <td className="px-4 py-3 text-right">150.00</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end">
                <div className="w-72 space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="font-semibold text-gray-800">4,890.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">CGST (9%)</span>
                    <span className="font-semibold text-gray-800">440.10</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">SGST (9%)</span>
                    <span className="font-semibold text-gray-800">440.10</span>
                  </div>
                  <div className="flex justify-between text-green-600 font-medium">
                    <span>Less: Advance Paid</span>
                    <span>- 2,000.00</span>
                  </div>
                  <div className="pt-3 border-t flex justify-between items-center">
                    <span className="font-bold text-gray-900 text-base">Net Payable</span>
                    <span className="font-bold text-2xl text-blue-600">₹3,770.20</span>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6 mt-6">
                <h4 className="font-bold text-gray-900 mb-4">Record Payment</h4>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount to Pay</label>
                    <input type="number" defaultValue="3770.20" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-50" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                    <select className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white">
                      <option>Credit Card</option>
                      <option>UPI</option>
                      <option>Cash</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <button className="flex-1 flex items-center justify-center gap-2 bg-white border-2 border-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-50 font-bold text-sm transition-colors">
                    <Download className="w-4 h-4" />
                    Preview Proforma
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-bold text-sm transition-colors shadow-sm">
                    <CreditCard className="w-4 h-4" />
                    Pay & Checkout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
