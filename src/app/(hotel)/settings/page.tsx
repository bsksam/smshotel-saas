"use client";

import { useEffect, useState } from "react";
import { Save, Palette, Loader2 } from "lucide-react";
import { getTenantSettings, updateTenantSettings } from "@/actions/hotel";

export default function HotelSettingsPage() {
  const [settings, setSettings] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    setIsLoading(true);
    const res = await getTenantSettings();
    if (res.success) {
      setSettings(res.data);
    } else {
      setError(res.error || "Failed to load settings");
    }
    setIsLoading(false);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccessMsg(null);
    const formData = new FormData(e.currentTarget);
    const res = await updateTenantSettings(formData);
    setIsSubmitting(false);
    
    if (res.success) {
      setSuccessMsg("Settings updated successfully!");
      setSettings(res.data);
      window.location.reload();
    } else {
      setError(res.error || "Failed to update settings");
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-300" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl pb-12">
      <div>
        <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">Hotel Settings</h2>
        <p className="text-zinc-500 mt-1 text-sm">Customize your hotel's branding and white-labeling.</p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 text-red-650 text-xs font-semibold rounded-xl border border-red-150">
          {error}
        </div>
      )}

      {successMsg && (
        <div className="p-3 bg-green-50 text-green-700 text-xs font-semibold rounded-xl border border-green-150">
          {successMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
          
          <div className="p-6 border-b border-zinc-100 bg-zinc-50/30">
            <h3 className="text-lg font-bold text-zinc-900 tracking-tight flex items-center gap-2">
              <Palette className="w-5 h-5 text-indigo-600 animate-pulse" />
              White Label & Branding
            </h3>
            <p className="text-xs text-zinc-500 mt-1">Configure name and color used in your dashboard and invoices.</p>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Hotel Name (Display)</label>
                <input 
                  required
                  name="name"
                  type="text" 
                  defaultValue={settings?.name}
                  className="w-full px-3 py-2 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900 text-sm bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Primary Brand Color</label>
                <div className="flex items-center gap-3">
                  <input 
                    name="primaryColor"
                    type="color" 
                    defaultValue={settings?.primaryColor || "#000000"}
                    className="h-10 w-14 rounded-xl border border-zinc-200 cursor-pointer bg-white"
                  />
                  <input 
                    type="text" 
                    disabled
                    value={settings?.primaryColor || "#000000"}
                    className="w-full px-3 py-2 border border-zinc-200 rounded-xl text-sm bg-zinc-50 font-mono text-zinc-400 font-bold"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-zinc-50/80 border-t border-zinc-200/60 flex justify-end">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-2.5 rounded-xl transition-all font-bold text-xs shadow-md shadow-indigo-100 disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : <Save className="w-4 h-4" />}
              Save Changes
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
