export default function CustomerDashboard() {
  return (
    <div className="grid grid-cols-1 gap-6">
      {/* Active Loans Section */}
      <section className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Active Loans
        </h2>
        <div className="space-y-4">
          {/* TODO: Replace with actual active loans data */}
          <div className="text-gray-500">No active loans found</div>
        </div>
      </section>

      {/* Inactive Loans Section */}
      <section className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Inactive Loans
        </h2>
        <div className="space-y-4">
          {/* TODO: Replace with actual inactive loans data */}
          <div className="text-gray-500">No inactive loans found</div>
        </div>
      </section>
    </div>
  );
}
