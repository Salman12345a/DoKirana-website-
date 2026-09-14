import { useState, useEffect } from "react";
import {
  TrendingUp,
  IndianRupee,
  Calendar,
  Filter,
  CheckCircle2,
  Clock,
  RefreshCw,
  Loader2,
  AlertCircle,
  ArrowDownLeft,
  ArrowUpRight,
  Store,
  Truck,
} from "lucide-react";
import { getEarnings, LedgerEntry, EarningsSummary } from "../../services/operatorService";
import OperatorStatCard from "../../components/operator/OperatorStatCard";

const OperatorEarnings = () => {
  const [entries, setEntries] = useState<LedgerEntry[]>([]);
  const [summary, setSummary] = useState<EarningsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [eventTypeFilter, setEventTypeFilter] = useState<string>("");
  const [payoutStatusFilter, setPayoutStatusFilter] = useState<string>("");

  const fetchEarningsData = async () => {
    setLoading(true);
    setError(null);
    try {
      const params: { eventType?: string; payoutStatus?: string } = {};
      if (eventTypeFilter) params.eventType = eventTypeFilter;
      if (payoutStatusFilter) params.payoutStatus = payoutStatusFilter;

      const res = await getEarnings(params);
      if (res.status?.toLowerCase() === "success") {
        setEntries(res.entries || []);
        setSummary(res.summary || null);
      } else {
        setError((res as { message?: string }).message || "Failed to load earnings ledger");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to load earnings";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEarningsData();
  }, [eventTypeFilter, payoutStatusFilter]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner & Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Earnings & Financial Ledger</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Transparent territorial commission breakdown for subscriptions & fulfillment handling
          </p>
        </div>

        <button
          onClick={fetchEarningsData}
          disabled={loading}
          className="flex items-center gap-2 p-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all text-xs font-semibold self-start sm:self-auto"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          Refresh Ledger
        </button>
      </div>

      {/* Financial KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <OperatorStatCard
          title="Total Lifetime Earnings"
          value={`₹${summary?.totalEarnings?.toLocaleString("en-IN") || 0}`}
          subtitle="Cumulative territory revenue"
          icon={IndianRupee}
          color="teal"
        />
        <OperatorStatCard
          title="Subscription Income"
          value={`₹${summary?.subscriptionEarnings?.toLocaleString("en-IN") || 0}`}
          subtitle="Fixed monthly partner dues"
          icon={Store}
          color="blue"
        />
        <OperatorStatCard
          title="Handling Charge Income"
          value={`₹${summary?.handlingChargeEarnings?.toLocaleString("en-IN") || 0}`}
          subtitle="Order dispatch fees"
          icon={Truck}
          color="green"
        />
        <OperatorStatCard
          title="Pending Payout"
          value={`₹${summary?.pendingPayout?.toLocaleString("en-IN") || 0}`}
          subtitle={`Paid out: ₹${summary?.paidOut?.toLocaleString("en-IN") || 0}`}
          icon={Clock}
          color="amber"
        />
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1 bg-white border border-gray-200 p-1 rounded-xl text-xs font-medium">
          <button
            onClick={() => setEventTypeFilter("")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              eventTypeFilter === "" ? "bg-teal-700 text-white font-semibold" : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            All Transactions
          </button>
          <button
            onClick={() => setEventTypeFilter("subscription_payment")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              eventTypeFilter === "subscription_payment"
                ? "bg-teal-700 text-white font-semibold"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Subscriptions (₹299)
          </button>
          <button
            onClick={() => setEventTypeFilter("handling_charge_operator")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              eventTypeFilter === "handling_charge_operator"
                ? "bg-teal-700 text-white font-semibold"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Order Handling
          </button>
        </div>

        <div className="flex items-center gap-1 bg-white border border-gray-200 p-1 rounded-xl text-xs font-medium">
          <button
            onClick={() => setPayoutStatusFilter("")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              payoutStatusFilter === ""
                ? "bg-teal-700 text-white font-semibold"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            All Statuses
          </button>
          <button
            onClick={() => setPayoutStatusFilter("paid")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              payoutStatusFilter === "paid"
                ? "bg-emerald-600 text-white font-semibold"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Paid
          </button>
          <button
            onClick={() => setPayoutStatusFilter("pending")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              payoutStatusFilter === "pending"
                ? "bg-amber-600 text-white font-semibold"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Pending
          </button>
        </div>
      </div>

      {/* Ledger Table */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm">
          <Loader2 className="w-8 h-8 text-teal-600 animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-500">Loading financial ledger...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl flex items-center justify-between text-xs">
          <span>{error}</span>
          <button onClick={fetchEarningsData} className="font-bold underline">
            Retry
          </button>
        </div>
      ) : entries.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm max-w-lg mx-auto">
          <div className="w-12 h-12 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center mx-auto mb-3">
            <TrendingUp size={24} />
          </div>
          <h3 className="font-bold text-gray-900">No Ledger Entries Yet</h3>
          <p className="text-xs text-gray-500 mt-1">
            As your linked partners renew their subscriptions and orders are fulfilled in your zone, earnings will record here automatically.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 border-b border-gray-200 text-xs text-gray-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3.5 px-6">Date</th>
                  <th className="py-3.5 px-6">Description / Source</th>
                  <th className="py-3.5 px-6">Gross Amount</th>
                  <th className="py-3.5 px-6">Your Earning</th>
                  <th className="py-3.5 px-6 text-right">Payout Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {entries.map((entry) => {
                  const isSub = entry.eventType === "subscription_payment";
                  return (
                    <tr key={entry._id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="py-4 px-6 text-xs text-gray-500">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={13} className="text-gray-400" />
                          {new Date(entry.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </div>
                        <span className="text-[11px] text-gray-400 block mt-0.5">
                          {new Date(entry.createdAt).toLocaleTimeString("en-IN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </td>

                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                              isSub ? "bg-teal-50 text-teal-700" : "bg-blue-50 text-blue-700"
                            }`}
                          >
                            {isSub ? <Store size={15} /> : <Truck size={15} />}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 text-xs">{entry.description}</p>
                            <span className="text-[10px] text-gray-400 uppercase tracking-wider font-mono">
                              {entry.eventType.replace(/_/g, " ")}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6 text-xs text-gray-600 font-mono">
                        ₹{entry.grossAmount?.toLocaleString("en-IN") || 0}
                      </td>

                      <td className="py-4 px-6">
                        <span className="font-bold text-emerald-700 text-sm font-mono">
                          +₹{entry.operatorEarning?.toLocaleString("en-IN") || 0}
                        </span>
                      </td>

                      <td className="py-4 px-6 text-right">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                            entry.payoutStatus === "paid"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                              : "bg-amber-50 text-amber-700 border border-amber-100"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              entry.payoutStatus === "paid" ? "bg-emerald-500" : "bg-amber-500"
                            }`}
                          />
                          {entry.payoutStatus === "paid" ? "Paid" : "Pending Payout"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default OperatorEarnings;