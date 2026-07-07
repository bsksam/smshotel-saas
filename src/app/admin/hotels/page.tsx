export default function HotelsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Hotels Management</h2>
          <p className="text-gray-500 mt-1">Manage onboarding and configuration for all hotel tenants.</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
          + Add New Hotel
        </button>
      </div>
      <div className="bg-white rounded-xl border p-12 text-center shadow-sm">
        <p className="text-gray-500">Hotels data table will be populated from the database here.</p>
      </div>
    </div>
  );
}
