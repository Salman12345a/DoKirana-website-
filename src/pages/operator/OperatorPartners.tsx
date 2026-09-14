import { useState, useEffect } from "react";
import {
  Users,
  Store,
  UtensilsCrossed,
  Search,
  Plus,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Filter,
  RefreshCw,
  Phone,
} from "lucide-react";
import { getPartners, linkPartner, Partner } from "../../services/operatorService";

const OperatorPartners = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");

  // Link partner form state
  const [phoneToLink, setPhoneToLink] = useState("");
  const [linking, setLinking] = useState(false);
  const [linkMsg, setLinkMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [showLinkModal, setShowLinkModal] = useState(false);

  const fetchPartnerList = async () => {
    setLoading(true);
    setError(null);
    try {
      const params: { type?: string; status?: string } = {};
      if (typeFilter) params.type = typeFilter;
      if (statusFilter) params.status = statusFilter;
      const res = await getPartners(params);
      if (res.status?.toLowerCase() === "success") {
        setPartners(res.partners || []);
      } else {
        setError((res as { message?: string }).message || "Failed to fetch partners");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to load partners";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartnerList();
  }, [typeFilter, statusFilter]);

  const handleLinkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneToLink.trim()) return;

    setLinking(true);
    setLinkMsg(null);
    try {
      await linkPartner(phoneToLink.trim());
      setLinkMsg({
        type: "success",
        text: `Partner with phone ${phoneToLink} successfully linked to your territory!`,
      });
      setPhoneToLink("");
      fetchPartnerList();
      setTimeout(() => setShowLinkModal(false), 2000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to link partner";
      setLinkMsg({ type: "error", text: message });
    } finally {
      setLinking(false);
    }
  };

  const filteredPartners = partners.filter((p) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      p.subscriberPhone.includes(term) ||
      p.subscriberType.toLowerCase().includes(term) ||
      (p.status && p.status.toLowerCase().includes(term))
    );
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Partner Network</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage kirana stores and food establishments mapped to your area
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchPartnerList}
            disabled={loading}
            className="p-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all"
            title="Refresh partners"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          </button>
          <button
            onClick={() => {
              setShowLinkModal(true);
              setLinkMsg(null);
            }}
            className="flex items-center gap-2 bg-teal-700 hover:bg-teal-800 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-all shadow-sm"
          >
            <Plus size={16} />
            Link New Partner
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by partner phone or type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <div className="flex items-center gap-1 bg-white border border-gray-200 p-1 rounded-xl text-xs font-medium">
            <button
              onClick={() => setTypeFilter("")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                typeFilter === "" ? "bg-teal-700 text-white font-semibold" : "text-gray-600 hover:bg-gray-100"
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
                typeFilter === "restaurant" ? "bg-teal-700 text-white font-semibold" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Restaurants
            </button>
          </div>

          <div className="flex items-center gap-1 bg-white border border-gray-200 p-1 rounded-xl text-xs font-medium">
            <button
              onClick={() => setStatusFilter("")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                statusFilter === "" ? "bg-teal-700 text-white font-semibold" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              All Statuses
            </button>
            <button
              onClick={() => setStatusFilter("active")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                statusFilter === "active" ? "bg-emerald-600 text-white font-semibold" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setStatusFilter("grace_period")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                statusFilter === "grace_period" ? "bg-amber-600 text-white font-semibold" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Grace Period
            </button>
          </div>
        </div>
      </div>

      {/* Link Modal */}
      {showLinkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-gray-100 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <Store size={18} className="text-teal-600" />
                Link Existing Partner
              </h3>
              <button
                onClick={() => setShowLinkModal(false)}
                className="text-gray-400 hover:text-gray-600 text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleLinkSubmit} className="mt-4 space-y-4">
              <p className="text-xs text-gray-500 leading-relaxed">
                Enter the registered phone number of a kirana branch or restaurant located in your pincode to claim territorial operator rights.
              </p>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Partner Registered Phone Number *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-gray-500 font-medium">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="9876543210"
                    value={phoneToLink}
                    onChange={(e) => setPhoneToLink(e.target.value.replace(/\D/g, ""))}
                    className="w-full pl-14 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 outline-none font-mono"
                  />
                </div>
              </div>

              {linkMsg && (
                <div
                  className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                    linkMsg.type === "success"
                      ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                      : "bg-red-50 text-red-800 border border-red-200"
                  }`}
                >
                  {linkMsg.type === "success" ? (
                    <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0" />
                  ) : (
                    <AlertCircle size={16} className="text-red-600 flex-shrink-0" />
                  )}
                  <span>{linkMsg.text}</span>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLinkModal(false)}
                  className="px-4 py-2 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={linking || phoneToLink.length !== 10}
                  className="flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 disabled:opacity-50 rounded-xl transition-colors shadow-sm"
                >
                  {linking && <Loader2 size={14} className="animate-spin" />}
                  {linking ? "Verifying..." : "Confirm & Link"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Partners List */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm">
          <Loader2 className="w-8 h-8 text-teal-600 animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-500">Loading your territory partners...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl flex items-center justify-between">
          <span className="text-sm">{error}</span>
          <button onClick={fetchPartnerList} className="text-xs font-bold underline">
            Retry
          </button>
        </div>
      ) : filteredPartners.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm max-w-lg mx-auto">
          <div className="w-12 h-12 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center mx-auto mb-3">
            <Users size={24} />
          </div>
          <h3 className="font-bold text-gray-900">No Partners Found</h3>
          <p className="text-xs text-gray-500 mt-1 mb-5">
            {searchTerm || typeFilter || statusFilter
              ? "No partners match your selected filters."
              : "You haven't linked any kirana stores or restaurants yet. Start building your network to earn ₹299/mo per partner."}
          </p>
          <button
            onClick={() => setShowLinkModal(true)}
            className="inline-flex items-center gap-2 bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-sm transition-all"
          >
            <Plus size={14} />
            Link Your First Partner
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50/80 border-b border-gray-200 text-xs text-gray-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3.5 px-6">Partner Details</th>
                  <th className="py-3.5 px-6">Type</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6">Renewal Date</th>
                  <th className="py-3.5 px-6 text-right">Earning Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredPartners.map((partner) => {
                  const isKirana = partner.subscriberType === "kirana_branch";
                  const status = partner.status || "active";
                  return (
                    <tr key={partner._id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold ${
                              isKirana ? "bg-teal-50 text-teal-700" : "bg-orange-50 text-orange-700"
                            }`}
                          >
                            {isKirana ? <Store size={18} /> : <UtensilsCrossed size={18} />}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5 font-semibold text-gray-900">
                              <Phone size={13} className="text-gray-400" />
                              {partner.subscriberPhone}
                            </div>
                            <p className="text-xs text-gray-400 font-mono">ID: {partner.subscriberId?.slice(-6) || partner._id?.slice(-6)}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                            isKirana
                              ? "bg-teal-50 text-teal-700 border border-teal-100"
                              : "bg-orange-50 text-orange-700 border border-orange-100"
                          }`}
                        >
                          {isKirana ? "Kirana Store" : "Restaurant"}
                        </span>
                      </td>

                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                            status === "active"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                              : status === "grace_period"
                              ? "bg-amber-50 text-amber-700 border border-amber-100"
                              : "bg-rose-50 text-rose-700 border border-rose-100"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              status === "active"
                                ? "bg-emerald-500"
                                : status === "grace_period"
                                ? "bg-amber-500"
                                : "bg-rose-500"
                            }`}
                          />
                          {status === "active"
                            ? "Active"
                            : status === "grace_period"
                            ? "Grace Period"
                            : "Suspended"}
                        </span>
                      </td>

                      <td className="py-4 px-6 text-gray-600 text-xs">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={14} className="text-gray-400" />
                          {partner.currentPeriodEnd
                            ? new Date(partner.currentPeriodEnd).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })
                            : "Ongoing"}
                        </div>
                      </td>

                      <td className="py-4 px-6 text-right">
                        <span className="font-bold text-gray-900">₹{partner.monthlyRate || 299}</span>
                        <span className="text-xs text-gray-400 block">/ month</span>
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

export default OperatorPartners;