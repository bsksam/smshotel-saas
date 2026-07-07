export default function UsersPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">User Administration</h2>
          <p className="text-gray-500 mt-1">Global directory of all system and hotel-level users.</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
          + Create System User
        </button>
      </div>
      <div className="bg-white rounded-xl border p-12 text-center shadow-sm">
        <p className="text-gray-500">Global users datagrid will be rendered here.</p>
      </div>
    </div>
  );
}
