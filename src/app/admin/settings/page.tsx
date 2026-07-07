import { Save } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">System Settings</h2>
        <p className="text-gray-500 mt-1">Configure global platform settings, SMS, and Email integrations.</p>
      </div>

      <div className="bg-white rounded-xl border shadow-sm">
        <div className="p-6 border-b">
          <h3 className="text-lg font-bold text-gray-900">SMS Configuration</h3>
          <p className="text-sm text-gray-500 mt-1">Configure the SMS gateway API keys for notifications.</p>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">SMS Provider</label>
            <select className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Fast2SMS</option>
              <option>Twilio</option>
              <option>TextLocal</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">API Key</label>
            <input 
              type="password" 
              placeholder="Enter your API key" 
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sender ID</label>
            <input 
              type="text" 
              placeholder="e.g. SMSHTL" 
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="p-4 bg-gray-50 border-t flex justify-end rounded-b-xl">
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
            <Save className="w-4 h-4" />
            Save SMS Settings
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border shadow-sm">
        <div className="p-6 border-b">
          <h3 className="text-lg font-bold text-gray-900">Email Configuration</h3>
          <p className="text-sm text-gray-500 mt-1">Configure the SMTP or Email API settings.</p>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Provider</label>
            <select className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>SendGrid</option>
              <option>AWS SES</option>
              <option>SMTP</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">API Key / SMTP Password</label>
            <input 
              type="password" 
              placeholder="Enter your API key or password" 
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="p-4 bg-gray-50 border-t flex justify-end rounded-b-xl">
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
            <Save className="w-4 h-4" />
            Save Email Settings
          </button>
        </div>
      </div>
    </div>
  );
}
