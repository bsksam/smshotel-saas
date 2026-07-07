import { Save, Upload, Palette } from "lucide-react";

export default function HotelSettingsPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Hotel Settings</h2>
        <p className="text-gray-500 mt-1">Customize your hotel's branding, invoice formats, and operational settings.</p>
      </div>

      <div className="bg-white rounded-xl border shadow-sm">
        <div className="p-6 border-b">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Palette className="w-5 h-5 text-blue-600" />
            White Label & Branding
          </h3>
          <p className="text-sm text-gray-500 mt-1">Configure logo and colors used in your dashboard and invoices.</p>
        </div>
        
        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Hotel Logo</label>
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
                <span className="text-xs text-gray-400 font-medium text-center px-2">No Logo<br/>Uploaded</span>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                <Upload className="w-4 h-4" />
                Upload New Logo
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">Recommended size: 200x200px. Max 2MB.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hotel Name (Display)</label>
              <input 
                type="text" 
                defaultValue="Grand Taj Hotel"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Primary Brand Color</label>
              <div className="flex items-center gap-2">
                <input 
                  type="color" 
                  defaultValue="#2563eb"
                  className="h-10 w-14 rounded cursor-pointer"
                />
                <input 
                  type="text" 
                  defaultValue="#2563eb"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border shadow-sm">
        <div className="p-6 border-b">
          <h3 className="text-lg font-bold text-gray-900">Invoice & Tax Settings</h3>
          <p className="text-sm text-gray-500 mt-1">Configure your GST and invoice footer notes.</p>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">GST Number</label>
              <input 
                type="text" 
                placeholder="22AAAAA0000A1Z5"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Default GST Rate (%)</label>
              <input 
                type="number" 
                defaultValue="18"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Footer / Terms & Conditions</label>
            <textarea 
              rows={4}
              defaultValue="Thank you for your stay. Please visit again!&#10;All disputes subject to local jurisdiction only."
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            ></textarea>
          </div>
        </div>

        <div className="p-4 bg-gray-50 border-t flex justify-end rounded-b-xl">
          <button className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
