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
  Clock,
  Sparkles,
  History,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  X,
  Phone,
  ShieldCheck,
  CalendarPlus,
  Receipt,
  Smartphone,
} from "lucide-react";
import {
  getDashboard,
  DashboardData,
  getStoredOperatorData,
  getOperatorSubscriptions,
  getActionRequiredSubscriptions,
  getSubscriptionDetails,
  OperatorSubscription,
} from "../../services/operatorService";
import OperatorStatCard from "../../components/operator/OperatorStatCard";

const OperatorDashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [subscriptions, setSubscriptions] = useState<OperatorSubscription[]>([]);
  const [actionRequiredList, setActionRequiredList] = useState<OperatorSubscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedSubForHistory, setSelectedSubForHistory] = useState<OperatorSubscription | null>(null);
  const [loadingHistoryDetails, setLoadingHistoryDetails] = useState(false);

  const storedOperator = getStoredOperatorData();

  const fetchDashboardData = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);
    try {
      const [dashRes, subsRes, actionRes] = await Promise.all([
        getDashboard(),
        getOperatorSubscriptions({ limit: 10 }),
        getActionRequiredSubscriptions().catch(() => ({ status: "ERROR", subscriptions: [] })),
      ]);

      if (dashRes.status?.toLowerCase() === "success" && dashRes.dashboard) {
        setData(dashRes.dashboard);
      } else {
        setError((dashRes as { message?: string }).message || "Failed to load dashboard data");
      }

      if (subsRes.status?.toLowerCase() === "success") {
        setSubscriptions(subsRes.subscriptions || []);
      }

      if (actionRes.status?.toLowerCase() === "success") {
        setActionRequiredList(actionRes.subscriptions || []);
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
    fetchDashboardData();
    const handleUpdate = () => fetchDashboardData(true);
    window.addEventListener("operator-subscription-updated", handleUpdate);
    return () => {
      window.removeEventListener("operator-subscription-updated", handleUpdate);
    };
  }, []);

  // Open History / Receipts Modal
  const openHistoryModal = async (sub: OperatorSubscription) => {
    setSelectedSubForHistory(sub);
    setLoadingHistoryDetails(true);
    try {
      const detailRes = await getSubscriptionDetails(sub._id);
      if (detailRes.status?.toLowerCase() === "success" && detailRes.subscription) {
        setSelectedSubForHistory(detailRes.subscription);
      }
    } catch (err) {
      console.warn("Could not fetch full audit history:", err);
    } finally {
      setLoadingHistoryDetails(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-teal-600 animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-500">Loading Operator Territory Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {storedOperator?.name || "Operator"}
            </h1>
            <span className="bg-teal-50 text-teal-700 border border-teal-200 text-xs px-2.5 py-0.5 rounded-full font-semibold">
              Live Territory
            </span>
          </div>
          <p className="text-xs text-gray-500 flex items-center gap-1.5 mt-1">
            <MapPin size={12} className="text-teal-600" />
            Zone: <span className="font-medium text-gray-700">{storedOperator?.area || "Central Zone"}</span> &bull;
            Pincode: <span className="font-medium text-gray-700">{storedOperator?.pincode}</span> &bull;
            City: <span className="font-medium text-gray-700">{storedOperator?.city}</span>
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => fetchDashboardData(true)}
            disabled={refreshing}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-medium transition-all shadow-sm"
            title="Refresh dashboard metrics"
          >
            <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2 text-sm">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
          <button
            onClick={() => fetchDashboardData(true)}
            className="text-xs font-semibold text-red-700 underline hover:no-underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* Primary KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <OperatorStatCard
          title="Linked Partners"
          value={data?.partners?.total ?? 0}
          subtitle={`${data?.partners?.kirana ?? 0} Kirana stores • ${data?.partners?.restaurant ?? 0} Food establishments`}
          icon={Users}
          badge={{ text: "Active Network", color: "green" }}
        />
        <OperatorStatCard
          title="Delivery Fleet"
          value={data?.riderCount ?? 0}
          subtitle="Registered territory riders on call"
          icon={Bike}
          badge={{ text: "Ready to Dispatch", color: "blue" }}
        />
        <OperatorStatCard
          title="Orders Handled"
          value={data?.orders?.total ?? 0}
          subtitle={`${data?.orders?.completed ?? 0} successfully delivered`}
          icon={Activity}
          badge={{ text: "Territory Orders", color: "purple" }}
        />
        <OperatorStatCard
          title="Total Lifetime Earnings"
          value={`₹${((data?.earnings?.totalEarnings ?? 0)).toLocaleString("en-IN")}`}
          subtitle={`₹${(data?.earnings?.subscriptionEarnings ?? 0).toLocaleString("en-IN")} subs · ₹${(data?.earnings?.orderEarnings ?? 0).toLocaleString("en-IN")} food orders (₹1/ea)`}
          icon={IndianRupee}
          badge={{ text: "100% Retained", color: "green" }}
        />
      </div>

      {/* Action-Required Banner if any partner is expiring or suspended */}
      {actionRequiredList.length > 0 && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center flex-shrink-0">
              <AlertTriangle size={20} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wide">
                Renewal Attention ({actionRequiredList.length} Partner{actionRequiredList.length > 1 ? "s" : ""})
              </h4>
              <p className="text-xs text-amber-800 mt-0.5">
                Some linked stores have pending subscription dues. Stores can pay the ₹299 monthly fee inside their app, or you can grant complimentary trial days.
              </p>
            </div>
          </div>
          <Link
            to="/operator/partners"
            className="self-start sm:self-auto text-xs font-bold text-amber-900 bg-white hover:bg-amber-100/80 px-3.5 py-2 rounded-xl border border-amber-300 transition-colors shadow-sm whitespace-nowrap"
          >
            Manage Partners &rarr;
          </Link>
        </div>
      )}

      {/* Partner Subscriptions Overview Section */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-gray-900">Partner Subscriptions & Platform Dues</h2>
              <span className="bg-teal-50 text-teal-700 border border-teal-200 text-[10px] px-2 py-0.5 rounded-full font-semibold">
                Territory Oversight
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Check days remaining, track store app payment statuses, view revenue receipts, and grant complimentary trial days.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/operator/partners"
              className="text-xs font-semibold text-teal-700 hover:text-teal-900 flex items-center gap-1"
            >
              <span>View All Partners ({subscriptions.length})</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>

        {subscriptions.length === 0 ? (
          <div className="p-12 text-center max-w-sm mx-auto">
            <div className="w-12 h-12 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center mx-auto mb-3">
              <Store size={22} />
            </div>
            <h4 className="font-bold text-gray-900 text-sm">No Active Subscriptions</h4>
            <p className="text-xs text-gray-500 mt-1 mb-4">
              Add local kirana branches or hotels to your territory and grant them a complimentary trial to get started.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase tracking-wider font-semibold text-[10px]">
                <tr>
                  <th className="py-3 px-4">Partner Store</th>
                  <th className="py-3 px-4">Status & Dues</th>
                  <th className="py-3 px-4">Days Left & Days Used</th>
                  <th className="py-3 px-4">Expiry / Renewal Date</th>
                  <th className="py-3 px-4 text-center">Receipts</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {subscriptions.slice(0, 8).map((sub) => {
                  const isKirana = sub.subscriberType === "kirana_branch";
                  const totalDays = sub.status === "trial" ? (sub.trialDurationDays || 14) : 30;
                  const daysUsed = sub.daysUsed ?? 0;
                  const daysLeft = sub.daysRemaining ?? 0;

                  return (
                    <tr key={sub._id} className="hover:bg-gray-50/60 transition-colors">
                      {/* Store */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 font-bold ${
                              isKirana ? "bg-teal-50 text-teal-700" : "bg-orange-50 text-orange-700"
                            }`}
                          >
                            {isKirana ? <Store size={16} /> : <UtensilsCrossed size={16} />}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900 text-xs">
                              {sub.partnerName || (isKirana ? "Kirana Store" : "Restaurant / Hotel")}
                            </div>
                            <div className="text-[11px] text-gray-400 font-mono flex items-center gap-1">
                              <Phone size={10} />
                              {sub.subscriberPhone}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Status & Dues */}
                      <td className="py-3.5 px-4">
                        {sub.status === "trial" && (
                          <div className="space-y-0.5">
                            <span className="px-2 py-0.5 rounded-full font-semibold text-[11px] bg-purple-50 text-purple-700 border border-purple-200 inline-block">
                              Free Trial
                            </span>
                            <div className="text-[10px] text-gray-400">₹0 Dues (Complimentary)</div>
                          </div>
                        )}
                        {sub.status === "active" && (
                          <div className="space-y-0.5">
                            <span className="px-2 py-0.5 rounded-full font-semibold text-[11px] bg-emerald-50 text-emerald-700 border border-emerald-200 inline-flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 " />
                              Active (Paid)
                            </span>
                            <div className="text-[10px] text-emerald-700 font-medium">✓ Paid via Store App</div>
                          </div>
                        )}
                        {sub.status === "grace_period" && (
                          <div className="space-y-0.5">
                            <span className="px-2 py-0.5 rounded-full font-semibold text-[11px] bg-amber-50 text-amber-800 border border-amber-200 inline-block">
                              Grace Period
                            </span>
                            <div className="text-[10px] text-amber-700 font-bold">₹299 Due (Pay via App)</div>
                          </div>
                        )}
                        {sub.status === "suspended" && (
                          <div className="space-y-0.5">
                            <span className="px-2 py-0.5 rounded-full font-semibold text-[11px] bg-rose-50 text-rose-700 border border-rose-200 inline-block">
                              Service Paused
                            </span>
                            <div className="text-[10px] text-rose-700 font-bold">₹299 Overdue (Pay via App)</div>
                          </div>
                        )}
                      </td>

                      {/* Days Left and Days Used */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5 font-bold text-gray-900 text-xs">
                            <Clock size={12} className="text-teal-600" />
                            <span>{daysLeft > 0 ? `${daysLeft}d left` : "0d left"}</span>
                          </div>
                          <div className="text-[11px] text-gray-400">
                            {daysUsed}d used of {totalDays}d
                          </div>
                        </div>
                      </td>

                      {/* Cycle Dates */}
                      <td className="py-3.5 px-4 text-gray-600">
                        {sub.status === "trial" ? (
                          <div>
                            <span className="text-[10px] text-gray-400 block font-semibold">TRIAL ENDS</span>
                            <span className="font-semibold text-gray-900">
                              {sub.trialEndAt
                                ? new Date(sub.trialEndAt).toLocaleDateString("en-IN", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  })
                                : "N/A"}
                            </span>
                          </div>
                        ) : (
                          <div>
                            <span className="text-[10px] text-gray-400 block font-semibold">RENEWAL DUE</span>
                            <span className="font-semibold text-gray-900">
                              {sub.currentPeriodEnd
                                ? new Date(sub.currentPeriodEnd).toLocaleDateString("en-IN", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  })
                                : "N/A"}
                            </span>
                          </div>
                        )}
                      </td>

                      {/* HISTORY / RECEIPTS BUTTON */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => openHistoryModal(sub)}
                          className="inline-flex items-center gap-1.5 bg-gray-100 hover:bg-teal-50 text-gray-700 hover:text-teal-800 border border-gray-200 hover:border-teal-300 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-xs"
                          title="View store payment receipts & audit log"
                        >
                          <Receipt size={13} className="text-teal-600" />
                          <span>Receipts</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
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
                <span>Manage</span>
                <ArrowRight size={12} />
              </Link>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3.5 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
                    <Store size={16} />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-gray-800 block">Kirana Stores</span>
                    <span className="text-[11px] text-gray-500">Retail grocery partners</span>
                  </div>
                </div>
                <span className="text-lg font-bold text-gray-900">{data?.partners?.kirana ?? 0}</span>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-700 flex items-center justify-center font-bold">
                    <UtensilsCrossed size={16} />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-gray-800 block">Restaurants & Hotels</span>
                    <span className="text-[11px] text-gray-500">DoKirana Eats establishments</span>
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
                Live Dispatch Monitor
              </h3>
              <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 " />
                Live Radar
              </span>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              Monitor active grocery and food orders, track automated rider dispatching, and view delivery fulfillment across your territory.
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
                <span className="font-semibold text-gray-800 block text-sm">Per-Order Delivery Earnings</span>
                Earn ₹1 on every restaurant food order delivered by your territory's delivery partners (grocery orders have ₹0 commission).
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

      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* 2. AUDIT HISTORY & BILLING RECEIPTS MODAL                             */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      {selectedSubForHistory && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-gray-100 animate-scale-up max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
                  <Receipt size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">
                    Online Payment Receipts & Lifecycle Audit
                  </h3>
                  <p className="text-xs text-gray-500">
                    {selectedSubForHistory.partnerName || "Partner"} ({selectedSubForHistory.subscriberPhone})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedSubForHistory(null)}
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100"
              >
                <X size={18} />
              </button>
            </div>

            {loadingHistoryDetails ? (
              <div className="py-12 text-center">
                <Loader2 className="w-6 h-6 text-teal-600 animate-spin mx-auto mb-2" />
                <p className="text-xs text-gray-400">Loading audit & receipts...</p>
              </div>
            ) : (
              <div className="overflow-y-auto py-4 space-y-5 flex-1 pr-1">
                {/* Billing Receipts */}
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Receipt size={14} className="text-teal-600" />
                      App Payment Receipts (₹299/Cycle)
                    </h4>
                    <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded">
                      100% Operator Revenue
                    </span>
                  </div>

                  {!selectedSubForHistory.billingHistory || selectedSubForHistory.billingHistory.length === 0 ? (
                    <div className="bg-gray-50 border border-gray-200/80 rounded-xl p-4 text-center">
                      <p className="text-xs text-gray-400 italic">No app payments recorded yet for this partner.</p>
                      <p className="text-[11px] text-gray-500 mt-1">
                        When the restaurant or store pays their ₹299 monthly subscription in their app, the receipt and 100% revenue will appear here automatically.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {selectedSubForHistory.billingHistory.map((bill, idx) => (
                        <div
                          key={idx}
                          className="bg-white border border-gray-200 rounded-xl p-3.5 flex items-center justify-between text-xs shadow-xs"
                        >
                          <div>
                            <div className="font-bold text-gray-900 flex items-center gap-1.5">
                              <span className="text-emerald-700">₹{bill.amountPaid}</span>
                              <span className="text-gray-300">•</span>
                              <span className="text-[11px] font-medium text-gray-600">
                                {bill.note || "App Subscription Payment"}
                              </span>
                            </div>
                            <div className="text-[11px] text-gray-400 mt-1">
                              Cycle: {new Date(bill.cycleStartDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} &rarr;{" "}
                              {new Date(bill.cycleEndDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="inline-block text-emerald-700 font-bold bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded text-[10px] uppercase">
                              {bill.status || "Paid"}
                            </span>
                            <div className="text-[10px] text-gray-400 mt-1 font-mono">
                              {new Date(bill.paidAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* State Transition Audit Log */}
                <div className="pt-2 border-t border-gray-100">
                  <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <History size={14} className="text-teal-600" />
                    Lifecycle Audit Log
                  </h4>
                  {!selectedSubForHistory.lifecycleEvents || selectedSubForHistory.lifecycleEvents.length === 0 ? (
                    <p className="text-xs text-gray-400 italic">No lifecycle transition events recorded yet.</p>
                  ) : (
                    <div className="space-y-2.5 max-h-48 overflow-y-auto">
                      {selectedSubForHistory.lifecycleEvents.map((event, idx) => (
                        <div
                          key={idx}
                          className="bg-gray-50/80 border border-gray-200/80 rounded-xl p-3 text-xs"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-bold text-gray-900 capitalize">
                              {event.action?.replace("_", " ")}
                            </span>
                            <span className="text-[11px] text-gray-400 font-mono">
                              {new Date(event.transitionAt).toLocaleString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-1.5">
                            {event.fromStatus && (
                              <>
                                <span className="px-2 py-0.5 rounded bg-gray-200 text-gray-700 text-[10px] font-semibold uppercase">
                                  {event.fromStatus}
                                </span>
                                <ArrowRight size={12} className="text-gray-400" />
                              </>
                            )}
                            <span className="px-2 py-0.5 rounded bg-teal-100 text-teal-800 text-[10px] font-semibold uppercase">
                              {event.toStatus}
                            </span>
                            <span className="text-[11px] text-gray-500 ml-auto">
                              By: <strong className="capitalize">{event.actorRole}</strong>
                            </span>
                          </div>
                          {event.reason && (
                            <p className="text-gray-600 mt-1.5 text-[11px]">{event.reason}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
              <button
                onClick={() => setSelectedSubForHistory(null)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl text-xs font-semibold transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OperatorDashboard;
