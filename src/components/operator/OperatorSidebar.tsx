import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Truck,
  Bike,
  TrendingUp,
  User,
  MapPin,
  Sparkles,
  X,
  Clock,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import {
  getStoredOperatorData,
  startFreeTrial,
  getOperatorSubscriptions,
  OperatorSubscription,
} from "../../services/operatorService";

const navItems = [
  { to: "/operator/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/operator/partners",  icon: Users,           label: "My Partners" },
  { to: "/operator/dispatch",  icon: Truck,           label: "Live Dispatch" },
  { to: "/operator/riders",    icon: Bike,            label: "Riders" },
  { to: "/operator/earnings",  icon: TrendingUp,      label: "Earnings" },
  { to: "/operator/profile",   icon: User,            label: "Profile" },
];

const OperatorSidebar = () => {
  const operator = getStoredOperatorData();

  // Free Trial Modal State
  const [showTrialModal, setShowTrialModal] = useState(false);
  const [partnersList, setPartnersList] = useState<OperatorSubscription[]>([]);
  const [loadingPartners, setLoadingPartners] = useState(false);
  const [selectedPartnerId, setSelectedPartnerId] = useState<string>("");
  const [trialPhone, setTrialPhone] = useState("");
  const [trialDays, setTrialDays] = useState<number>(14);
  const [customDays, setCustomDays] = useState<string>("");
  const [trialSubmitting, setTrialSubmitting] = useState(false);
  const [trialError, setTrialError] = useState<string | null>(null);
  const [trialSuccess, setTrialSuccess] = useState<string | null>(null);

  // Fetch partners list when opening trial modal
  useEffect(() => {
    if (showTrialModal) {
      setLoadingPartners(true);
      getOperatorSubscriptions({ limit: 50 })
        .then((res) => {
          if (res.status?.toLowerCase() === "success" && res.subscriptions) {
            setPartnersList(res.subscriptions);
          }
        })
        .catch((err) => {
          console.warn("Could not fetch partner subscriptions for trial picker:", err);
        })
        .finally(() => setLoadingPartners(false));
    }
  }, [showTrialModal]);

  const openTrialModal = () => {
    setTrialError(null);
    setTrialSuccess(null);
    setTrialPhone("");
    setSelectedPartnerId("");
    setTrialDays(14);
    setCustomDays("");
    setShowTrialModal(true);
  };

  const handlePartnerSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedPartnerId(val);
    if (!val) {
      setTrialPhone("");
      return;
    }
    const found = partnersList.find((p) => p._id === val);
    if (found && found.subscriberPhone) {
      setTrialPhone(found.subscriberPhone);
    }
  };

  const handleGrantTrial = async (e: React.FormEvent) => {
    e.preventDefault();
    setTrialError(null);
    setTrialSuccess(null);

    const days = customDays ? parseInt(customDays, 10) : trialDays;
    if (isNaN(days) || days <= 0) {
      setTrialError("Please enter a valid trial duration in days (minimum 1 day).");
      return;
    }

    const cleanPhone = trialPhone.trim();
    if (!cleanPhone || cleanPhone.length < 10) {
      setTrialError("Please provide a valid 10-digit mobile number.");
      return;
    }

    setTrialSubmitting(true);
    try {
      const res = await startFreeTrial({ subscriberPhone: cleanPhone, trialDays: days });
      if (res.status?.toLowerCase() === "success") {
        setTrialSuccess(
          `Free trial of ${days} days granted successfully! Subscription active for ${cleanPhone}.`
        );
        // Dispatch update event to let Dashboard or Partners list refresh automatically
        window.dispatchEvent(new CustomEvent("operator-subscription-updated"));

        setTimeout(() => {
          setShowTrialModal(false);
          setTrialSuccess(null);
          setTrialPhone("");
          setSelectedPartnerId("");
        }, 1200);
      } else {
        setTrialError(res.message || "Failed to grant free trial");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to grant free trial";
      setTrialError(msg);
    } finally {
      setTrialSubmitting(false);
    }
  };

  const modalContent = showTrialModal ? (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
              <Sparkles size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">Grant Free Trial</h3>
              <p className="text-xs text-gray-500">
                Complimentary platform access for kirana or restaurant
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowTrialModal(false)}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {trialError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2">
            <AlertCircle size={15} className="flex-shrink-0 mt-0.5 text-red-500" />
            <span>{trialError}</span>
          </div>
        )}

        {trialSuccess && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-start gap-2">
            <CheckCircle2 size={15} className="flex-shrink-0 mt-0.5 text-emerald-600" />
            <span>{trialSuccess}</span>
          </div>
        )}

        <form onSubmit={handleGrantTrial} className="space-y-4">
          {/* Partner Dropdown Picker (Optional Quick Pick) */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Select Existing Partner (Optional)
            </label>
            <select
              value={selectedPartnerId}
              onChange={handlePartnerSelect}
              disabled={loadingPartners}
              className="w-full text-xs px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50 text-gray-800"
            >
              <option value="">-- Choose partner or enter phone manually --</option>
              {partnersList.map((p) => {
                const isKirana = p.subscriberType === "kirana_branch";
                return (
                  <option key={p._id} value={p._id}>
                    {p.partnerName || (isKirana ? "Kirana Store" : "Restaurant")} ({p.subscriberPhone})
                  </option>
                );
              })}
            </select>
          </div>

          {/* Phone Input */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Partner Mobile Number <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-xs text-gray-400 font-mono">+91</span>
              <input
                type="tel"
                required
                maxLength={10}
                placeholder="9876543210"
                value={trialPhone}
                onChange={(e) => {
                  setTrialPhone(e.target.value.replace(/\D/g, "").slice(0, 10));
                }}
                className="w-full text-xs pl-10 pr-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono"
              />
            </div>
            <p className="text-[10px] text-gray-400 mt-1">
              Phone number linked with their DoKirana Eats or DkBranch app account.
            </p>
          </div>

          {/* Trial Duration */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Trial Duration
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { days: 7, label: "7 Days", desc: "Quick Onboarding" },
                { days: 14, label: "14 Days", desc: "Standard (2 Weeks)" },
                { days: 30, label: "30 Days", desc: "Full Month Free" },
              ].map((preset) => {
                const isSelected = !customDays && trialDays === preset.days;
                return (
                  <button
                    key={preset.days}
                    type="button"
                    onClick={() => {
                      setTrialDays(preset.days);
                      setCustomDays("");
                    }}
                    className={`p-2 rounded-xl text-left border transition-colors cursor-pointer select-none ${
                      isSelected
                        ? "border-purple-600 bg-purple-50 text-purple-900 ring-1 ring-purple-600"
                        : "border-gray-200 hover:border-gray-300 text-gray-700 bg-white"
                    }`}
                  >
                    <div className="font-bold text-xs">{preset.label}</div>
                    <div className="text-[10px] text-gray-400">{preset.desc}</div>
                  </button>
                );
              })}
            </div>

            {/* Custom Days Input */}
            <div className="mt-2.5 flex items-center gap-2">
              <span className="text-xs text-gray-500">Or custom days:</span>
              <input
                type="number"
                min={1}
                max={180}
                placeholder="e.g. 45"
                value={customDays}
                onChange={(e) => setCustomDays(e.target.value)}
                className="w-24 text-xs px-2.5 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono"
              />
              <span className="text-xs text-gray-400">days</span>
            </div>
          </div>

          {/* Information Callout */}
          <div className="p-3 bg-purple-50/60 border border-purple-100 rounded-xl flex items-start gap-2 text-purple-900">
            <Clock size={15} className="text-purple-600 flex-shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              The partner gets full access with ₹0 dues for {customDays || trialDays} day(s). Paid renewals (₹299/mo) are completed directly by the store inside their app.
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={() => setShowTrialModal(false)}
              className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={trialSubmitting}
              className="flex items-center gap-1.5 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
            >
              {trialSubmitting ? (
                <>
                  <Loader2 size={13} className="animate-spin" />
                  Granting...
                </>
              ) : (
                <>
                  <Sparkles size={13} />
                  Grant {customDays || trialDays} Days Trial
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  ) : null;

  return (
    <>
      <aside className="w-64 flex-shrink-0 min-h-screen bg-gradient-to-b from-teal-900 to-teal-800 flex flex-col shadow-xl">
        {/* Logo / Brand */}
        <div className="px-6 py-5 border-b border-teal-700 flex items-center gap-3">
          <img
            src="/assets/Logo.png"
            alt="DK Point Logo"
            className="w-10 h-10 object-contain rounded-xl bg-white/10 p-1 shadow-sm"
          />
          <div>
            <h1 className="text-white text-xl font-bold tracking-tight">DK Point</h1>
            <p className="text-teal-300 text-xs mt-0.5 font-medium">Operators Club</p>
          </div>
        </div>

        {/* Operator info */}
        {operator && (
          <div className="px-6 py-4 border-b border-teal-700">
            <div className="w-10 h-10 rounded-full bg-teal-600 flex items-center justify-center mb-2">
              <span className="text-white font-bold text-lg">
                {operator.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <p className="text-white font-semibold text-sm truncate">{operator.name}</p>
            <p className="text-teal-300 text-xs flex items-center gap-1 mt-0.5">
              <MapPin size={10} />
              {operator.pincode} · {operator.city}
            </p>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-teal-600 text-white shadow-sm"
                    : "text-teal-200 hover:bg-teal-700 hover:text-white"
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Grant Free Trial Action in Sidebar */}
        <div className="px-3 py-4 border-t border-teal-700/60 bg-teal-950/20 flex-shrink-0">
          <button
            type="button"
            onClick={openTrialModal}
            className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs shadow-sm transition-colors cursor-pointer select-none active:bg-purple-800"
          >
            <Sparkles size={15} className="text-purple-200 pointer-events-none flex-shrink-0" />
            <span className="pointer-events-none">Grant Free Trial</span>
          </button>
          <p className="text-[10px] text-teal-300/70 text-center mt-1.5 font-medium pointer-events-none">
            Complimentary access for stores
          </p>
        </div>
      </aside>

      {/* Render modal directly into document.body to avoid any stacking context or sidebar flicker */}
      {typeof document !== "undefined" && modalContent ? createPortal(modalContent, document.body) : null}
    </>
  );
};

export default OperatorSidebar;
