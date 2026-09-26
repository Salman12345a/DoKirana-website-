import { useState, useEffect } from "react";
import {
  Users,
  Store,
  UtensilsCrossed,
  Search,
  Loader2,
  AlertCircle,
  RefreshCw,
  Phone,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  History,
  X,
  ArrowRight,
  ShieldCheck,
  Receipt,
  CreditCard,
  Smartphone,
} from "lucide-react";
import {
  getOperatorSubscriptions,
  getActionRequiredSubscriptions,
  getSubscriptionDetails,
  OperatorSubscription,
} from "../../services/operatorService";

const OperatorPartners = () => {
  const [subscriptions, setSubscriptions] = useState<OperatorSubscription[]>([]);
  const [actionRequiredList, setActionRequiredList] = useState<OperatorSubscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");

  // Audit History & Receipts Modal State
  const [selectedSubForHistory, setSelectedSubForHistory] = useState<OperatorSubscription | null>(null);
  const [loadingHistoryDetails, setLoadingHistoryDetails] = useState(false);

  const fetchSubscriptions = async () => {
    setLoading(true);
    setError(null);
    try {
      const params: { status?: string; search?: string } = {};
      if (statusFilter && statusFilter !== "action_required") {
        params.status = statusFilter;
      }
      if (searchTerm) {
        params.search = searchTerm;
      }

      const [subsRes, actionRes] = await Promise.all([
        getOperatorSubscriptions(params),
        getActionRequiredSubscriptions().catch(() => ({ status: "ERROR", subscriptions: [] })),
      ]);

      if (subsRes.status?.toLowerCase() === "success") {
        setSubscriptions(subsRes.subscriptions || []);
      } else {
        setError((subsRes as { message?: string }).message || "Failed to fetch subscriptions");
      }

      if (actionRes.status?.toLowerCase() === "success") {
        setActionRequiredList(actionRes.subscriptions || []);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to load partner subscriptions";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
    const handleUpdate = () => fetchSubscriptions();
    window.addEventListener('operator-subscription-updated', handleUpdate);
    return () => {
      window.removeEventListener('operator-subscription-updated', handleUpdate);
    };
  }, [statusFilter]);

  // Filtering
  const displayedSubscriptions = subscriptions.filter((sub) => {
    if (statusFilter === "action_required") {
      if (!sub.actionRequired) return false;
    }
    if (typeFilter && sub.subscriberType !== typeFilter) {
      return false;
    }
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const phoneMatch = sub.subscriberPhone?.includes(term);
      const nameMatch = sub.partnerName?.toLowerCase().includes(term);
      const typeMatch = sub.subscriberType?.toLowerCase().includes(term);
      return phoneMatch || nameMatch || typeMatch;
    }
    return true;
  });

  // Aggregated Counts
  const trialCount = subscriptions.filter((s) => s.status === "trial").length;
  const activeCount = subscriptions.filter((s) => s.status === "active").length;
  const graceCount = subscriptions.filter((s) => s.status === "grace_period").length;
  const suspendedCount = subscriptions.filter((s) => s.status === "suspended").length;
  const urgentCount = actionRequiredList.length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner / Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-gray-900">Partner Subscriptions</h2>
            <span className="bg-teal-50 text-teal-700 border border-teal-200 text-xs px-2.5 py-0.5 rounded-full font-semibold">
              Platform Fee & Trial Oversight
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Monitor partner subscription statuses and pending dues. Payments are completed directly by stores via their app, and you can grant complimentary trial days.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchSubscriptions}
            disabled={loading}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-medium transition-all shadow-sm"
            title="Refresh list"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </div>

      {/* Metric Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div
          onClick={() => setStatusFilter("trial")}
          className={`cursor-pointer p-4 rounded-xl border transition-all ${
            statusFilter === "trial"
              ? "bg-purple-50/80 border-purple-400 ring-2 ring-purple-300"
              : "bg-white border-gray-200 hover:border-purple-200"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-purple-700">Free Trials</span>
            <Clock size={16} className="text-purple-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mt-2">{trialCount}</div>
          <span className="text-[11px] text-gray-400 block mt-0.5">₹0 Dues (Complimentary)</span>
        </div>

        <div
          onClick={() => setStatusFilter("active")}
          className={`cursor-pointer p-4 rounded-xl border transition-all ${
            statusFilter === "active"
              ? "bg-emerald-50/80 border-emerald-400 ring-2 ring-emerald-300"
              : "bg-white border-gray-200 hover:border-emerald-200"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-700">Active (Paid)</span>
            <ShieldCheck size={16} className="text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mt-2">{activeCount}</div>
          <span className="text-[11px] text-gray-400 block mt-0.5">Paid via store app</span>
        </div>

        <div
          onClick={() => setStatusFilter("grace_period")}
          className={`cursor-pointer p-4 rounded-xl border transition-all ${
            statusFilter === "grace_period"
              ? "bg-amber-50/80 border-amber-400 ring-2 ring-amber-300"
              : "bg-white border-gray-200 hover:border-amber-200"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-700">Payment Pending (Grace)</span>
            <AlertTriangle size={16} className="text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mt-2">{graceCount}</div>
          <span className="text-[11px] text-amber-600 font-medium block mt-0.5">₹299 due via store app</span>
        </div>

        <div
          onClick={() => setStatusFilter("action_required")}
          className={`cursor-pointer p-4 rounded-xl border transition-all ${
            statusFilter === "action_required"
              ? "bg-rose-50/80 border-rose-400 ring-2 ring-rose-300"
              : "bg-white border-gray-200 hover:border-rose-200"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-700">Action Required</span>
            <AlertCircle size={16} className="text-rose-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mt-2">{urgentCount || suspendedCount}</div>
          <span className="text-[11px] text-rose-600 font-medium block mt-0.5">Awaiting store app payment</span>
        </div>
      </div>

      {/* Action-Required Banner if any partner is expiring or suspended */}
      {(urgentCount > 0 || suspendedCount > 0) && statusFilter !== "action_required" && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center flex-shrink-0">
              <AlertTriangle size={20} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wide">
                Subscriptions Pending Payment ({urgentCount || suspendedCount} Store{(urgentCount || suspendedCount) > 1 ? "s" : ""})
              </h4>
              <p className="text-xs text-amber-800 mt-0.5">
                Some linked stores have pending subscription dues. Stores can clear dues directly inside their DoKirana Eats or Branch mobile app, or you can grant complimentary trial days.
              </p>
            </div>
          </div>
          <button
            onClick={() => setStatusFilter("action_required")}
            className="self-start sm:self-auto text-xs font-bold text-amber-900 bg-white hover:bg-amber-100/80 px-3.5 py-2 rounded-xl border border-amber-300 transition-colors shadow-sm whitespace-nowrap"
          >
            Review Stores &rarr;
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by store name, phone, or type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 shadow-sm"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          {/* Status Pills */}
          <div className="flex items-center gap-1 bg-white border border-gray-200 p-1 rounded-xl text-xs font-medium shadow-sm">
            <button
              onClick={() => setStatusFilter("")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                statusFilter === "" ? "bg-teal-700 text-white font-semibold" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter("trial")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                statusFilter === "trial" ? "bg-purple-700 text-white font-semibold" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Trial ({trialCount})
            </button>
            <button
              onClick={() => setStatusFilter("active")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                statusFilter === "active" ? "bg-emerald-600 text-white font-semibold" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Active ({activeCount})
            </button>
            <button
              onClick={() => setStatusFilter("grace_period")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                statusFilter === "grace_period" ? "bg-amber-600 text-white font-semibold" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Grace ({graceCount})
            </button>
            <button
              onClick={() => setStatusFilter("suspended")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                statusFilter === "suspended" ? "bg-rose-600 text-white font-semibold" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Suspended ({suspendedCount})
            </button>
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-1 bg-white border border-gray-200 p-1 rounded-xl text-xs font-medium shadow-sm">
            <button
              onClick={() => setTypeFilter("")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                typeFilter === "" ? "bg-gray-900 text-white font-semibold" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              All Types
            </button>
            <button
              onClick={() => setTypeFilter("kirana_branch")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                typeFilter === "kirana_branch" ? "bg-teal-700 text-white font-semibold" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Kirana
            </button>
            <button
              onClick={() => setTypeFilter("restaurant")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                typeFilter === "restaurant" ? "bg-orange-600 text-white font-semibold" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Eats / Hotels
            </button>
          </div>
        </div>
      </div>

      {/* Subscriptions Table */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm">
          <Loader2 className="w-8 h-8 text-teal-600 animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-500">Loading partner subscriptions...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl flex items-center justify-between">
          <span className="text-sm">{error}</span>
          <button onClick={fetchSubscriptions} className="text-xs font-bold underline">
            Retry
          </button>
        </div>
      ) : displayedSubscriptions.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm max-w-lg mx-auto">
          <div className="w-12 h-12 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center mx-auto mb-3">
            <Users size={24} />
          </div>
          <h3 className="font-bold text-gray-900">No Subscriptions Found</h3>
          <p className="text-xs text-gray-500 mt-1 mb-4">
            {searchTerm || typeFilter || statusFilter
              ? "No partner subscriptions match your chosen filter."
              : "No partner subscriptions found for your franchise area."}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50/80 border-b border-gray-200 text-[11px] text-gray-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3.5 px-6">Partner Store / Hotel</th>
                  <th className="py-3.5 px-6">Status & Payment Dues</th>
                  <th className="py-3.5 px-6">Cycle Duration</th>
                  <th className="py-3.5 px-6">Next Billing / Expiry</th>
                  <th className="py-3.5 px-6 text-right">Receipts & Audit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {displayedSubscriptions.map((sub) => {
                  const isKirana = sub.subscriberType === "kirana_branch";
                  const totalDays = sub.status === "trial" ? (sub.trialDurationDays || 14) : 30;
                  const daysUsed = sub.daysUsed ?? 0;
                  const daysLeft = sub.daysRemaining ?? 0;
                  const progressPercent = Math.min(1, Math.max(0, daysUsed / totalDays));

                  return (
                    <tr key={sub._id} className="hover:bg-gray-50/70 transition-colors">
                      {/* Partner Store Info */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 font-bold ${
                              isKirana ? "bg-teal-50 text-teal-700" : "bg-orange-50 text-orange-700"
                            }`}
                          >
                            {isKirana ? <Store size={20} /> : <UtensilsCrossed size={20} />}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900 text-sm">
                              {sub.partnerName || (isKirana ? "Kirana Store" : "Restaurant / Hotel")}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                              <span className="flex items-center gap-1 font-mono">
                                <Phone size={12} className="text-gray-400" />
                                {sub.subscriberPhone}
                              </span>
                              <span className="text-gray-300">•</span>
                              <span
                                className={`px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase ${
                                  isKirana ? "bg-teal-50 text-teal-700" : "bg-orange-50 text-orange-700"
                                }`}
                              >
                                {isKirana ? "Kirana" : "Eats / Hotel"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Status & Dues */}
                      <td className="py-4 px-6">
                        {sub.status === "trial" && (
                          <div className="space-y-1">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                              <Sparkles size={13} className="text-purple-600" />
                              Free Trial
                            </span>
                            <div className="text-[11px] text-gray-400 font-medium">₹0 Dues (Complimentary)</div>
                          </div>
                        )}
                        {sub.status === "active" && (
                          <div className="space-y-1">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 " />
                              Active (Paid)
                            </span>
                            <div className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                              <CheckCircle2 size={12} />
                              Paid via App (₹{sub.monthlyRate || 299}/mo)
                            </div>
                          </div>
                        )}
                        {sub.status === "grace_period" && (
                          <div className="space-y-1">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                              <AlertTriangle size={13} className="text-amber-600" />
                              Grace Period
                            </span>
                            <div className="text-[11px] text-amber-700 font-bold flex items-center gap-1">
                              <Smartphone size={12} />
                              ₹{sub.monthlyRate || 299} Due (Pay via App)
                            </div>
                          </div>
                        )}
                        {sub.status === "suspended" && (
                          <div className="space-y-1">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                              Service Paused
                            </span>
                            <div className="text-[11px] text-rose-700 font-bold flex items-center gap-1">
                              <AlertCircle size={12} />
                              ₹{sub.monthlyRate || 299} Overdue (Pay via App)
                            </div>
                          </div>
                        )}
                      </td>

                      {/* Days Left & Days Used */}
                      <td className="py-4 px-6">
                        <div className="space-y-1.5 w-44">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-gray-900 flex items-center gap-1">
                              <Clock size={12} className="text-teal-600" />
                              {daysLeft > 0 ? `${daysLeft}d left` : "0d left"}
                            </span>
                            <span className="text-[11px] text-gray-400">
                              {daysUsed}d / {totalDays}d
                            </span>
                          </div>
                          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                sub.status === "suspended"
                                  ? "bg-rose-500 w-full"
                                  : sub.status === "grace_period"
                                  ? "bg-amber-500"
                                  : sub.status === "trial"
                                  ? "bg-purple-600"
                                  : "bg-emerald-500"
                              }`}
                              style={{
                                width: sub.status === "suspended" ? "100%" : `${progressPercent * 100}%`,
                              }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Period Dates */}
                      <td className="py-4 px-6 text-xs text-gray-600">
                        {sub.status === "trial" ? (
                          <div>
                            <div className="text-gray-400 text-[10px] font-semibold">TRIAL EXPIRES</div>
                            <div className="font-semibold text-gray-900 mt-0.5">
                              {sub.trialEndAt
                                ? new Date(sub.trialEndAt).toLocaleDateString("en-IN", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  })
                                : "N/A"}
                            </div>
                            <span className="text-[10px] text-purple-600 font-medium">
                              {sub.trialDurationDays || 14}-day complimentary
                            </span>
                          </div>
                        ) : (
                          <div>
                            <div className="text-gray-400 text-[10px] font-semibold">RENEWAL DUE</div>
                            <div className="font-semibold text-gray-900 mt-0.5">
                              {sub.currentPeriodEnd
                                ? new Date(sub.currentPeriodEnd).toLocaleDateString("en-IN", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  })
                                : "N/A"}
                            </div>
                            <span className="text-[10px] text-gray-400">30-day billing cycle</span>
                          </div>
                        )}
                      </td>

                      {/* Audit History & Receipts Button */}
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => openHistoryModal(sub)}
                          className="inline-flex items-center gap-1.5 bg-gray-100 hover:bg-teal-50 text-gray-700 hover:text-teal-800 border border-gray-200 hover:border-teal-300 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-xs"
                          title="View online payment receipts & audit history"
                        >
                          <Receipt size={14} className="text-teal-600" />
                          <span>Receipts</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}{/* 2. AUDIT HISTORY & BILLING RECEIPTS MODAL                             */}
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
                      <CreditCard size={14} className="text-teal-600" />
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

            <div className="pt-3 border-t border-gray-100 flex items-center justify-end">
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

export default OperatorPartners;
