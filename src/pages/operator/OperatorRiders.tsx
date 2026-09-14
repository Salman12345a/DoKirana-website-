import { useState, useEffect } from "react";
import {
  Bike,
  Search,
  RefreshCw,
  Loader2,
  AlertCircle,
  Phone,
  CheckCircle2,
  XCircle,
  Shield,
  Truck,
} from "lucide-react";
import { getRiders, Rider } from "../../services/operatorService";

const OperatorRiders = () => {
  const [riders, setRiders] = useState<Rider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterAvailability, setFilterAvailability] = useState<"all" | "available" | "busy">("all");

  const fetchRiderList = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getRiders();
      if (res.status === "success") {
        setRiders(res.riders || []);
      } else {
        setError("Failed to load rider fleet");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to load riders";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRiderList();
  }, []);

  const availableCount = riders.filter((r) => r.isAvailable).length;
  const busyCount = riders.length - availableCount;

  const filteredRiders = riders.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(search.toLowerCase()) || r.phone.includes(search);
    if (!matchesSearch) return false;
    if (filterAvailability === "available") return r.isAvailable;
    if (filterAvailability === "busy") return !r.isAvailable;
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Territory Rider Fleet</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Active delivery riders registered and operating within your pincode zone
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchRiderList}
            disabled={loading}
            className="flex items-center gap-2 p-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all text-xs font-semibold"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            Refresh Fleet
          </button>
        </div>
      </div>

      {/* Roster KPI Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 font-medium">Total Registered Riders</p>
            <p className="text-2xl font-bold text-gray-900 mt-0.5">{riders.length}</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
            <Bike size={20} />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 font-medium">Available for Assignment</p>
            <p className="text-2xl font-bold text-emerald-600 mt-0.5">{availableCount}</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 size={20} />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 font-medium">Busy / On Delivery</p>
            <p className="text-2xl font-bold text-amber-600 mt-0.5">{busyCount}</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Truck size={20} />
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search riders by name or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
          />
        </div>

        <div className="flex items-center gap-1 bg-white border border-gray-200 p-1 rounded-xl text-xs font-medium">
          <button
            onClick={() => setFilterAvailability("all")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filterAvailability === "all"
                ? "bg-teal-700 text-white font-semibold"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            All ({riders.length})
          </button>
          <button
            onClick={() => setFilterAvailability("available")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filterAvailability === "available"
                ? "bg-emerald-600 text-white font-semibold"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Available ({availableCount})
          </button>
          <button
            onClick={() => setFilterAvailability("busy")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filterAvailability === "busy"
                ? "bg-amber-600 text-white font-semibold"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Busy ({busyCount})
          </button>
        </div>
      </div>

      {/* Fleet Table / Grid */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm">
          <Loader2 className="w-8 h-8 text-teal-600 animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-500">Loading rider fleet...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl flex items-center justify-between text-xs">
          <span>{error}</span>
          <button onClick={fetchRiderList} className="font-bold underline">
            Retry
          </button>
        </div>
      ) : filteredRiders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm max-w-lg mx-auto">
          <div className="w-12 h-12 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center mx-auto mb-3">
            <Bike size={24} />
          </div>
          <h3 className="font-bold text-gray-900">No Riders Found</h3>
          <p className="text-xs text-gray-500 mt-1">
            {search || filterAvailability !== "all"
              ? "No riders match your criteria."
              : "No riders are currently registered in your territory."}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 border-b border-gray-200 text-xs text-gray-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3.5 px-6">Rider</th>
                  <th className="py-3.5 px-6">Phone Number</th>
                  <th className="py-3.5 px-6">Vehicle Type</th>
                  <th className="py-3.5 px-6 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredRiders.map((rider) => (
                  <tr key={rider._id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
                          <Bike size={18} />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{rider.name}</p>
                          <p className="text-xs text-gray-400 font-mono">ID: {rider._id.slice(-6)}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6 text-xs text-gray-700 font-mono">
                      <div className="flex items-center gap-1.5">
                        <Phone size={13} className="text-gray-400" />
                        {rider.phone}
                      </div>
                    </td>

                    <td className="py-4 px-6 text-xs text-gray-600 capitalize">
                      {rider.vehicleType || "Motorcycle / Two-Wheeler"}
                    </td>

                    <td className="py-4 px-6 text-right">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                          rider.isAvailable
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                            : "bg-gray-100 text-gray-600 border border-gray-200"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            rider.isAvailable ? "bg-emerald-500" : "bg-gray-400"
                          }`}
                        />
                        {rider.isAvailable ? "Available" : "On Delivery"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default OperatorRiders;