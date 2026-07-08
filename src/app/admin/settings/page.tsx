"use client";

import { useEffect, useState } from "react";
import { Save, Loader2 } from "lucide-react";
import { getSystemSettings, saveSystemSettings } from "@/actions/admin";

export default function SettingsPage() {
  const [settings, setSettings] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    setIsLoading(true);
    const res = await getSystemSettings();
    if (res.success) {
      setSettings(res.data);
    }
    setIsLoading(false);
  }

  async function handleSaveSMS(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMsg(null);
    setErrorMsg(null);
    
    const formData = new FormData(e.currentTarget);
    const updated = {
      ...settings,
      smsProvider: formData.get("smsProvider") as string,
      smsApiKey: formData.get("smsApiKey") as string,
      smsSenderId: formData.get("smsSenderId") as string,
    };

    const res = await saveSystemSettings(updated);
    setIsSubmitting(false);
    if (res.success) {
      setSuccessMsg("SMS settings saved successfully!");
      setSettings(res.data);
    } else {
      setErrorMsg(res.error || "Failed to save SMS settings");
    }
  }

  async function handleSaveEmail(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMsg(null);
    setErrorMsg(null);
    
    const formData = new FormData(e.currentTarget);
    const updated = {
      ...settings,
      emailProvider: formData.get("emailProvider") as string,
      emailApiKey: formData.get("emailApiKey") as string,
    };

    const res = await saveSystemSettings(updated);
    setIsSubmitting(false);
    if (res.success) {
      setSuccessMsg("Email settings saved successfully!");
      setSettings(res.data);
    } else {
      setErrorMsg(res.error || "Failed to save email settings");
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
        <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">System Settings</h2>
        <p className="text-zinc-500 mt-1 text-sm">Configure global platform integrations, SMS, and Email servers.</p>
      </div>

      {successMsg && (
        <div className="p-3 bg-green-50 text-green-700 text-sm rounded-lg border border-green-100">
          {successMsg}
        </div>
      )}

      {errorMsg && (
        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
          {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 gap-8">
        {/* SMS settings */}
        <form onSubmit={handleSaveSMS} className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-zinc-100 bg-zinc-50/30">
            <h3 className="text-lg font-bold text-zinc-900 tracking-tight">SMS Configuration</h3>
            <p className="text-xs text-zinc-500 mt-1">Configure the SMS gateway API keys for platform notifications.</p>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">SMS Provider</label>
              <select name="smsProvider" defaultValue={settings?.smsProvider} className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 text-sm bg-white text-zinc-800">
                <option value="Fast2SMS">Fast2SMS</option>
                <option value="Twilio">Twilio</option>
                <option value="TextLocal">TextLocal</option>
              </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">API Key</label>
                <input 
                  name="smsApiKey"
                  type="password" 
                  defaultValue={settings?.smsApiKey}
                  placeholder="Enter your API key" 
                  className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 text-sm bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Sender ID</label>
                <input 
                  name="smsSenderId"
                  type="text" 
                  defaultValue={settings?.smsSenderId}
                  placeholder="e.g. SMSHTL" 
                  className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 text-sm bg-white"
                />
              </div>
            </div>
          </div>
          <div className="p-4 bg-zinc-50/80 border-t border-zinc-200/60 flex justify-end">
            <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 bg-zinc-900 text-white px-4 py-2 rounded-lg hover:bg-zinc-800 transition-colors font-semibold text-xs shadow-sm">
              <Save className="w-4 h-4" />
              Save SMS Settings
            </button>
          </div>
        </form>

        {/* Email settings */}
        <form onSubmit={handleSaveEmail} className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-zinc-100 bg-zinc-50/30">
            <h3 className="text-lg font-bold text-zinc-900 tracking-tight">Email Configuration</h3>
            <p className="text-xs text-zinc-500 mt-1">Configure SMTP or Email gateway platform integrations.</p>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Email Provider</label>
              <select name="emailProvider" defaultValue={settings?.emailProvider} className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 text-sm bg-white text-zinc-800">
                <option value="SendGrid">SendGrid</option>
                <option value="AWS SES">AWS SES</option>
                <option value="SMTP">SMTP</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">API Key / SMTP Password</label>
              <input 
                name="emailApiKey"
                type="password" 
                defaultValue={settings?.emailApiKey}
                placeholder="Enter your API key or SMTP password" 
                className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 text-sm bg-white"
              />
            </div>
          </div>
          <div className="p-4 bg-zinc-50/80 border-t border-zinc-200/60 flex justify-end">
            <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 bg-zinc-900 text-white px-4 py-2 rounded-lg hover:bg-zinc-800 transition-colors font-semibold text-xs shadow-sm">
              <Save className="w-4 h-4" />
              Save Email Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
