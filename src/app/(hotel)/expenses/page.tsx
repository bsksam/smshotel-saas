"use client";

import { useEffect, useState } from "react";
import { Plus, Search, Loader2, IndianRupee, X } from "lucide-react";
import { getExpenses, addExpense, getExpenseCategories, addExpenseCategory } from "@/actions/hotel";

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setIsLoading(true);
    try {
      const [expRes, catRes] = await Promise.all([
        getExpenses(),
        getExpenseCategories()
      ]);
      if (expRes.success) setExpenses(expRes.data);
      if (catRes.success) setCategories(catRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleAddExpense(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    const res = await addExpense(formData);
    
    if (res.error) {
      setError(res.error);
    } else {
      setIsModalOpen(false);
      loadData();
    }
    setIsSubmitting(false);
  }

  async function handleAddCategory(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    const form = e.currentTarget;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value;
    const res = await addExpenseCategory(name);
    
    if (res.error) {
      setError(res.error);
    } else {
      setIsCategoryModalOpen(false);
      loadData();
    }
    setIsSubmitting(false);
  }

  const getModeBadge = (mode: string) => {
    switch (mode) {
      case "CASH": return "bg-emerald-50 text-emerald-700 border border-emerald-200";
      case "CARD": return "bg-blue-50 text-blue-700 border border-blue-200";
      case "UPI": return "bg-fuchsia-50 text-fuchsia-700 border border-fuchsia-200";
      default: return "bg-indigo-50 text-indigo-700 border border-indigo-200";
    }
  };

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  const filteredExpenses = expenses.filter(exp => {
    const matchesSearch = (exp.description || "").toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (exp.category?.name || "").toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="space-y-6 pb-12">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 tracking-tight flex items-center gap-2">
            <IndianRupee className="w-6 h-6 text-rose-500 animate-pulse" />
            Expenses Ledger
          </h2>
          <p className="text-zinc-500 mt-1 text-sm">Track money out: salaries, supplies, and maintenance.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setIsCategoryModalOpen(true)}
            className="flex items-center gap-2 bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100/80 px-4 py-2 rounded-xl transition-all font-semibold text-xs shadow-sm"
          >
            Manage Categories
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2 rounded-xl transition-all font-semibold text-xs shadow-md shadow-indigo-100"
          >
            <Plus className="w-4 h-4" />
            Record Expense
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="relative overflow-hidden bg-gradient-to-br from-rose-500 to-red-600 p-6 rounded-3xl border border-red-400/20 shadow-md shadow-rose-100 text-white flex items-center justify-between">
          <div className="absolute right-0 top-0 -mr-10 -mt-10 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-85 mb-1">Total Expenses (All Time)</p>
            <p className="text-3xl font-extrabold tracking-tight font-mono">₹{totalExpenses.toFixed(2)}</p>
          </div>
          <div className="p-3 rounded-2xl bg-white/10 border border-white/10">
            <IndianRupee className="w-6 h-6" />
          </div>
        </div>
        
        <div className="md:col-span-2 bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm flex items-center justify-between text-zinc-400 text-xs font-semibold italic">
          Additional expense categorization graphs and monthly summaries are currently being prepared.
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-zinc-200/60 flex justify-between items-center bg-zinc-50/50">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input 
              type="text" 
              placeholder="Search expenses by category or description..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900 text-sm bg-white"
            />
          </div>
        </div>

        <div className="overflow-x-auto min-h-[400px]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64 text-zinc-400 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-zinc-300" />
              <p className="text-sm font-medium">Loading ledger...</p>
            </div>
          ) : filteredExpenses.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-zinc-500 gap-3">
              <div className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center mb-2">
                <IndianRupee className="w-5 h-5 text-zinc-400" />
              </div>
              <p className="text-sm font-bold text-zinc-800">No expenses recorded yet.</p>
            </div>
          ) : (
            <table className="w-full text-left text-sm text-zinc-650">
              <thead className="bg-zinc-50/80 text-zinc-700 font-bold border-b border-zinc-200">
                <tr>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Description</th>
                  <th className="px-6 py-4">Mode</th>
                  <th className="px-6 py-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {filteredExpenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-zinc-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap font-semibold text-zinc-500">{new Date(exp.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 font-bold text-zinc-900">{exp.category?.name}</td>
                    <td className="px-6 py-4 max-w-xs truncate font-medium text-zinc-600">{exp.description || "-"}</td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${getModeBadge(exp.paymentMode)}`}>
                        {exp.paymentMode}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-extrabold text-red-600 font-mono text-base">
                      -₹{exp.amount.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Add Expense Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-zinc-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-zinc-100 bg-zinc-50/30">
              <h3 className="text-lg font-bold text-zinc-900 tracking-tight">Record Expense</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-zinc-900 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddExpense} className="p-6 space-y-4">
              {error && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 mb-4">
                  {error}
                </div>
              )}
              <div>
                <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">Category</label>
                <select required name="categoryId" className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 text-sm bg-white text-zinc-800">
                  <option value="">Select Category</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">Amount (₹)</label>
                  <input required name="amount" type="number" step="0.01" placeholder="0.00" className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 text-sm bg-white font-mono" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">Payment Mode</label>
                  <select required name="paymentMode" className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 text-sm bg-white text-zinc-800">
                    <option value="CASH">CASH</option>
                    <option value="CARD">CARD</option>
                    <option value="UPI">UPI</option>
                    <option value="BANK_TRANSFER">BANK TRANSFER</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">Description (Optional)</label>
                <textarea name="description" rows={2} className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 text-sm bg-white resize-none" placeholder="E.g. Plumber fee..."></textarea>
              </div>
              <div className="mt-8 flex gap-3 pt-4 border-t border-zinc-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2 text-sm font-medium text-zinc-700 bg-zinc-100 hover:bg-zinc-200 rounded-lg transition-colors">
                  Cancel
                </button>
                <button disabled={isSubmitting || categories.length === 0} type="submit" className="flex-1 px-4 py-2 text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors disabled:opacity-50">
                  {isSubmitting ? "Recording..." : "Record Expense"}
                </button>
              </div>
              {categories.length === 0 && (
                <p className="text-xs text-red-500 mt-2 text-center">You must add an Expense Category first.</p>
              )}
            </form>
          </div>
        </div>
      )}

      {/* Add Category Modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 bg-zinc-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-zinc-100 bg-zinc-50/30">
              <h3 className="text-lg font-bold text-zinc-900 tracking-tight">New Category</h3>
              <button onClick={() => setIsCategoryModalOpen(false)} className="text-zinc-400 hover:text-zinc-900 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddCategory} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">Category Name</label>
                <input required name="name" type="text" placeholder="E.g. Salaries" className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 text-sm bg-white" />
              </div>
              <div className="mt-8 flex gap-3 pt-4 border-t border-zinc-100">
                <button type="button" onClick={() => setIsCategoryModalOpen(false)} className="flex-1 px-4 py-2 text-sm font-medium text-zinc-700 bg-zinc-100 hover:bg-zinc-200 rounded-lg transition-colors">
                  Cancel
                </button>
                <button disabled={isSubmitting} type="submit" className="flex-1 px-4 py-2 text-sm font-medium text-white bg-zinc-900 hover:bg-zinc-800 rounded-lg transition-colors disabled:opacity-50">
                  {isSubmitting ? "Saving..." : "Save Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
