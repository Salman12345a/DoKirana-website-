import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  Users,
  Store,
  UtensilsCrossed,
  Bike,
  IndianRupee,
  Activity,
  ArrowRight,
  TrendingUp,
  RefreshCw,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { getDashboard, DashboardData, getStoredOperatorData } from "../../services/operatorService";
import OperatorStatCard from "../../components/operator/OperatorStatCard";

const OperatorDashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const storedOperator = getStoredOperatorData();

  const fetchDashboard = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);
    try {
      const res = await getDashboard();
      if ((res.status?.toLowerCase() === "success") && res.dashboard) {
        setData(res.dashboard);
      } else {
        setError((res as { message?: string }).message || "Failed to load dashboard data");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to load dashboard data";
      setError(message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-9 h-9 text-teal-600 animate-spin mb-3" />
        <p className="text-gray-500 font-medium">Loading your operator dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Territory & Welcome Banner */}
      <div className="bg-gradient-to-r from-teal-800 to-teal-600 rounded-2xl p-6 sm:p-8 text-white shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-teal-900/40 text-teal-100 text-xs px-3 py-1 rounded-full font-medium mb-3 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Active Operator Zone
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold">
            Welcome back, {storedOperator?.name || "Operator"}!
          </h2>
          <div className="flex flex-wrap items-center gap-4 text-teal-100 text-sm mt-2">
            <span className="flex items-center gap-1.5">
              <MapPin size={16} className="text-teal-300" />
              {data?.area ? `${data.area}, ${data.city}` : storedOperator?.city || "Territory assigned"}
            </span>
            <span className="bg-teal-700/60 px-2.5 py-0.5 rounded text-xs font-semibold">
              PIN: {data?.pincode || storedOperator?.pincode || "---"}
            </span>
            <span className="bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 px-2.5 py-0.5 rounded text-xs font-mono font-bold tracking-wide">
              ID: {data?.operatorId || storedOperator?.operatorId || "DK-OP-1001"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchDashboard(true)}
            disabled={refreshing}
            className="flex items-center gap-2 bg-teal-700/50 hover:bg-teal-700 text-white text-sm px-4 py-2.5 rounded-xl border border-teal-500/30 transition-all font-medium backdrop-blur-sm"
          >
            <RefreshCw size={15} className={refreshing ? "animate-spin" : ""} />
            Refresh
          </button>
          <Link
            to="/operator/partners"
            className="flex items-center gap-2 bg-white text-teal-800 hover:bg-teal-50 text-sm px-4 py-2.5 rounded-xl font-semibold transition-all shadow-sm"
          >
            View Partners
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 flex items-center justify-between">
          <div className="flex items-center gap-3 text-sm">
            <AlertCircle size={18} className="text-amber-600 flex-shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={() => fetchDashboard()}
            className="text-xs font-semibold text-amber-900 underline hover:no-underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* Primary Key Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <OperatorStatCard
          title="Total Active Partners"
          value={data?.partners?.total ?? 0}
          subtitle={`${data?.partners?.kirana ?? 0} Kirana · ${data?.partners?.restaurant ?? 0} Restaurants`}
          icon={Users}
          color="teal"
        />
        <OperatorStatCard
          title="Today's Earnings"
          value={`₹${data?.today?.earnings?.toLocaleString("en-IN") ?? 0}`}
          subtitle={`${data?.today?.transactions ?? 0} transaction${(data?.today?.transactions ?? 0) === 1 ? "" : "s"} today`}
          icon={IndianRupee}
          color="green"
        />
        <OperatorStatCard
          title="Pending Payout"
          value={`₹${data?.pendingPayout?.toLocaleString("en-IN") ?? 0}`}
          subtitle="Ready for disbursement"
          icon={TrendingUp}
          color="amber"
        />
        <OperatorStatCard
          title="Active Riders"
          value={data?.riderCount ?? 0}
          subtitle="Registered in territory"
          icon={Bike}
          color="blue"
        />
      </div>

      {/* Partner Breakdown & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Partner breakdown card */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <Store size={18} className="text-teal-600" />
                Network Composition
              </h3>
              <Link
                to="/operator/partners"
                className="text-xs font-semibold text-teal-600 hover:text-teal-800 flex items-center gap-1"
              >
                View all
                <ArrowRight size={12} />
              </Link>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-gray-50 border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
                    <Store size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Kirana Stores</p>
                    <p className="text-xs text-gray-500">Retail grocery partners</p>
                  </div>
                </div>
                <span className="text-lg font-bold text-gray-900">{data?.partners?.kirana ?? 0}</span>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-gray-50 border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-orange-100 text-orange-700 flex items-center justify-center font-bold">
                    <UtensilsCrossed size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Restaurants & Cloud Kitchens</p>
                    <p className="text-xs text-gray-500">Food delivery partners</p>
                  </div>
                </div>
                <span className="text-lg font-bold text-gray-900">{data?.partners?.restaurant ?? 0}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span>Subscription earning per partner</span>
            <span className="font-semibold text-gray-800">₹299 / month</span>
          </div>
        </div>

        {/* Live Operations & Dispatch quick glance */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <Activity size={18} className="text-teal-600" />
                Live Dispatch Desk
              </h3>
              <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Ready
              </span>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              Monitor active orders, pending food pick-ups, and assign available delivery riders within your territory.
            </p>
            <div className="bg-teal-50 border border-teal-100 rounded-xl p-4 text-xs text-teal-800 space-y-1.5">
              <p className="font-semibold flex items-center gap-1.5">
                <Bike size={14} className="text-teal-600" />
                Riders On Call: {data?.riderCount ?? 0}
              </p>
              <p className="text-teal-700/80">
                Operator handling fee applies automatically upon successful order delivery.
              </p>
            </div>
          </div>

          <div className="mt-6">
            <Link
              to="/operator/dispatch"
              className="w-full flex items-center justify-center gap-2 bg-teal-700 hover:bg-teal-800 text-white font-medium py-2.5 px-4 rounded-xl text-sm transition-colors shadow-sm"
            >
              Open Live Dispatch
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>

        {/* Quick Help & Payout Rules */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-3">
              <TrendingUp size={18} className="text-teal-600" />
              Operator Economics
            </h3>
            <div className="space-y-3 text-xs text-gray-600">
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <span className="font-semibold text-gray-800 block text-sm">Monthly Subscription</span>
                Earn ₹299 for every active kirana store and restaurant linked to your territory each month.
              </div>
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <span className="font-semibold text-gray-800 block text-sm">Order Handling Commission</span>
                Get paid on every successfully dispatched order coordinated through your fleet.
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100">
            <Link
              to="/operator/earnings"
              className="text-xs font-semibold text-teal-700 hover:text-teal-900 flex items-center justify-between"
            >
              <span>View full financial ledger</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OperatorDashboard;