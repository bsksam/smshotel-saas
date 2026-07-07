"use client";

import { CheckCircle, UploadCloud } from "lucide-react";
import { useState } from "react";
import { createCheckIn } from "@/actions/hotel";

export default function CheckInPage() {
  const [formData, setFormData] = useState({
    guestName: "",
    guestPhone: "",
    guestEmail: "",
    roomId: "cm123", // Dummy default room ID
    checkInDate: new Date().toISOString().split('T')[0],
    expectedCheckOut: "",
    adults: 2,
    children: 0,
    advancePayment: 0,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // Use a hardcoded tenant ID for demo purposes
    // In production, this would come from the user's session
    const tenantId = "dummy-tenant-id"; 

    const res = await createCheckIn({
      ...formData,
      tenantId,
      adults: Number(formData.adults),
      children: Number(formData.children),
      advancePayment: Number(formData.advancePayment),
    });

    if (res.success) {
      setMessage("Guest checked in successfully!");
      // Reset form or redirect
    } else {
      setMessage("Error: " + res.error);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Guest Check-in</h2>
          <p className="text-gray-500 mt-1">Register new walk-in guest or process a reservation.</p>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-lg font-bold ${message.startsWith("Error") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Guest Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input required type="text" name="guestName" value={formData.guestName} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number *</label>
                <input required type="tel" name="guestPhone" value={formData.guestPhone} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input type="email" name="guestEmail" value={formData.guestEmail} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">ID Proof & Documents</h3>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50">
              <UploadCloud className="w-8 h-8 text-gray-400 mb-2" />
              <p className="text-sm font-medium text-gray-700">Click or drag document images to upload</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl border shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Room & Stay Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Room *</label>
                <select name="roomId" value={formData.roomId} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white">
                  <option value="cm123">101 - Deluxe (Available)</option>
                  <option value="cm124">105 - Deluxe (Available)</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Check-in</label>
                  <input type="date" name="checkInDate" value={formData.checkInDate} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg text-sm bg-gray-50" readOnly />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Check-out *</label>
                  <input required type="date" name="expectedCheckOut" value={formData.expectedCheckOut} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Adults</label>
                  <input type="number" name="adults" value={formData.adults} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Children</label>
                  <input type="number" name="children" value={formData.children} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Payment Collection</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Advance Amount</label>
                <input type="number" name="advancePayment" value={formData.advancePayment} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
              </div>
            </div>
            <button disabled={loading} type="submit" className="w-full mt-6 flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors font-bold text-lg shadow-sm">
              <CheckCircle className="w-5 h-5" />
              {loading ? "Processing..." : "Complete Check-in"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
