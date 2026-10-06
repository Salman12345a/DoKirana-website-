import React, { useState, useEffect } from "react";
import {
  IndianRupee,
  ShieldCheck,
  CheckCircle2,
  Clock,
  RefreshCw,
  Loader2,
  Store,
  UtensilsCrossed,
  Bike,
  Wallet,
  Send,
  AlertCircle,
  FileCheck,
  X,
} from "lucide-react";
import {
  getPendingCashHandovers,
  verifyCashHandover,
  settleToMerchant,
  getDailyClosingSummary,
  submitDailyClosing,
  getOperatorSettlementTransactions,
  getPendingMerchantSettlements,
  PendingMerchantGroup,
  PendingRiderCashGroup,
  DailyClosingSummary,
  SettlementTransaction,
} from "../../services/settlementService";

const OperatorSettlements: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"handovers" | "merchants" | "closing" | "transactions">("handovers");

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [pendingCashGroups, setPendingCashGroups] = useState<PendingRiderCashGroup[]>([]);
  const [totalPendingCash, setTotalPendingCash] = useState<number>(0);
  const [pendingMerchants, setPendingMerchants] = useState<PendingMerchantGroup[]>([]);
  const [totalVaultAmount, setTotalVaultAmount] = useState<number>(0);
  const [vaultTxns, setVaultTxns] = useState<SettlementTransaction[]>([]);

  const [settlingMerchant, setSettlingMerchant] = useState<PendingMerchantGroup | null>(null);
  const [settleNote, setSettleNote] = useState<string>("");
  const [submittingSettle, setSubmittingSettle] = useState(false);

  const [dailyClosing, setDailyClosing] = useState<DailyClosingSummary | null>(null);
  const [closingDate, setClosingDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [submittingClosing, setSubmittingClosing] = useState(false);

  const [transactions, setTransactions] = useState<SettlementTransaction[]>([]);
  const [txnFilterStatus, setTxnFilterStatus] = useState<string>("");

  const [selectedHandoverTxn, setSelectedHandoverTxn] = useState<SettlementTransaction | null>(null);
  const [actualAmountInput, setActualAmountInput] = useState<string>("");
  const [verificationNote, setVerificationNote] = useState<string>("");
  const [verifying, setVerifying] = useState(false);

  const fetchAllData = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const [cashRes, closingRes, txnRes, merchantsRes, vaultTxnRes] = await Promise.all([
        getPendingCashHandovers().catch(() => ({ status: "ERROR", data: { totalPending: 0, byRider: [], transactions: [] } })),
        getDailyClosingSummary(closingDate).catch(() => ({ status: "ERROR", data: null })),
        getOperatorSettlementTransactions({ status: txnFilterStatus || undefined, page: 1, limit: 50 }).catch(() => ({ status: "ERROR", data: { transactions: [], pagination: { total: 0, page: 1, limit: 50, pages: 1 } } })),
        getPendingMerchantSettlements().catch(() => ({ status: "ERROR", data: { totalMerchants: 0, totalTransactions: 0, totalVaultAmount: 0, merchants: [], transactions: [] } })),
        getOperatorSettlementTransactions({ status: "CASH_COLLECTED_BY_OPERATOR", limit: 100 }).catch(() => ({ status: "ERROR", data: { transactions: [] } })),
      ]);

      if (cashRes.status === "SUCCESS" && cashRes.data) {
        setPendingCashGroups(cashRes.data.byRider || []);
        setTotalPendingCash(cashRes.data.totalPending || 0);
      }

      if (closingRes.status === "SUCCESS" && closingRes.data) {
        setDailyClosing(closingRes.data);
      }

      if (txnRes.status === "SUCCESS" && txnRes.data) {
        setTransactions(txnRes.data.transactions || []);
      }
      if (merchantsRes.status === "SUCCESS" && merchantsRes.data) {
        setPendingMerchants(merchantsRes.data.merchants || []);
        setTotalVaultAmount(merchantsRes.data.totalVaultAmount || 0);
      }
      if (vaultTxnRes.status === "SUCCESS" && vaultTxnRes.data) {
        setVaultTxns(vaultTxnRes.data.transactions || []);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to load settlement data";
      setError(message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [closingDate, txnFilterStatus]);

  // Derived effective vault transactions (merges explicit vault transactions and ledger items)
  const allVaultTransactions = React.useMemo(() => {
    const map = new Map<string, SettlementTransaction>();
    for (const t of vaultTxns) {
      if (t.status === "CASH_COLLECTED_BY_OPERATOR" && !t.merchantSettlementId) {
        map.set(t._id || t.transactionId, t);
      }
    }
    for (const t of transactions) {
      if (t.status === "CASH_COLLECTED_BY_OPERATOR" && !t.merchantSettlementId) {
        map.set(t._id || t.transactionId, t);
      }
    }
    return Array.from(map.values());
  }, [vaultTxns, transactions]);

  const effectiveVaultAmount = React.useMemo(() => {
    const fromTxns = allVaultTransactions.reduce(
      (sum, t) => sum + (t.actualAmount !== undefined && t.actualAmount !== null ? t.actualAmount : (t.amount || 0)),
      0
    );
    return totalVaultAmount > 0 ? totalVaultAmount : fromTxns;
  }, [totalVaultAmount, allVaultTransactions]);

  const effectiveMerchants = React.useMemo(() => {
    if (pendingMerchants.length > 0) return pendingMerchants;
    if (allVaultTransactions.length === 0) return [];

    const byM: Record<string, PendingMerchantGroup> = {};
    for (const txn of allVaultTransactions) {
      const rawM = txn.merchantId;
      const mId = (typeof rawM === "object" ? (rawM as any)?._id : rawM) || "partner";
      if (!byM[mId]) {
        const mDoc = (typeof rawM === "object" ? rawM : {}) as any;
        const merchantName =
          mDoc?.restaurantName ||
          mDoc?.name ||
          mDoc?.branchName ||
          (txn.merchantType === "restaurant" ? "Restaurant Partner" : "Kirana Store");

        byM[mId] = {
          merchantId: mId,
          merchantType: txn.merchantType || (mDoc?.restaurantName ? "restaurant" : "branch"),
          merchantName,
          merchantPhone: mDoc?.phone || mDoc?.contactNumber || null,
          transactions: [],
          totalAmount: 0,
        };
      }
      byM[mId].transactions.push(txn);
      byM[mId].totalAmount += (txn.actualAmount !== undefined && txn.actualAmount !== null ? txn.actualAmount : (txn.amount || 0));
    }
    return Object.values(byM);
  }, [pendingMerchants, allVaultTransactions]);

  const handleOpenVerifyModal = (txn: SettlementTransaction) => {
    setSelectedHandoverTxn(txn);
    const expected = txn.cashHandoverId?.expectedAmount || txn.amount || 0;
    const reported = txn.cashHandoverId?.riderReportedAmount || expected;
    setActualAmountInput(String(reported));
    setVerificationNote("");
  };

  const handleConfirmVerify = async () => {
    if (!selectedHandoverTxn?.cashHandoverId?._id) return;
    const parsedAmount = parseFloat(actualAmountInput);
    if (isNaN(parsedAmount) || parsedAmount < 0) {
      setError("Please enter a valid received amount.");
      return;
    }

    setVerifying(true);
    setError(null);
    try {
      const res = await verifyCashHandover(selectedHandoverTxn.cashHandoverId._id, {
        actualAmountReceived: parsedAmount,
        note: verificationNote,
      });

      if (res.status === "SUCCESS") {
        setSuccessMsg("Cash handover verified successfully.");
        setSelectedHandoverTxn(null);
        fetchAllData(true);
      } else {
        setError(res.message || "Failed to verify cash handover");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error verifying cash handover");
    } finally {
      setVerifying(false);
    }
  };


  const handleOpenSettleModal = (m: PendingMerchantGroup) => {
    setSettlingMerchant(m);
    setSettleNote("");
  };

  const handleConfirmSettleToMerchant = async () => {
    if (!settlingMerchant) return;
    setSubmittingSettle(true);
    setError(null);
    try {
      const rawMId = settlingMerchant.merchantId;
      const mId = typeof rawMId === "object" ? (rawMId as any)?._id : rawMId;
      const res = await settleToMerchant({
        merchantId: mId,
        merchantType: settlingMerchant.merchantType || "restaurant",
        transactionIds: settlingMerchant.transactions.map((t) => t._id || t.transactionId),
        totalAmount: settlingMerchant.totalAmount,
        note: settleNote || undefined,
      });

      if (res.status === "SUCCESS") {
        setSuccessMsg(`Successfully settled ₹${settlingMerchant.totalAmount.toLocaleString("en-IN")} to ${settlingMerchant.merchantName}`);
        setSettlingMerchant(null);
        fetchAllData(true);
      } else {
        setError(res.message || "Failed to settle cash to merchant");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error settling cash to merchant");
    } finally {
      setSubmittingSettle(false);
    }
  };

  const handleSubmitClosing = async () => {
    if (!window.confirm(`Submit daily closing for ${closingDate}? Any unresolved transactions will be carried forward.`)) {
      return;
    }

    setSubmittingClosing(true);
    setError(null);
    try {
      const res = await submitDailyClosing(closingDate);
      if (res.status === "SUCCESS") {
        setSuccessMsg(`Daily closing completed. Carried forward: ${res.data?.carriedForwardCount || 0} items.`);
        fetchAllData(true);
      } else {
        setError(res.message || "Failed to complete daily closing");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error submitting daily closing");
    } finally {
      setSubmittingClosing(false);
    }
  };

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "CASH_COLLECTED_BY_RIDER":
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">Pending Handover</span>;
      case "CASH_COLLECTED_BY_OPERATOR":
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">In Operator Vault</span>;
      case "CASH_SETTLED_TO_MERCHANT":
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">Settled to Merchant</span>;
      case "CASH_SHORT":
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">Shortage</span>;
      case "CASH_EXCESS":
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">Excess</span>;
      case "ONLINE_COLLECTED":
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-teal-50 text-teal-700 border border-teal-200">Online Collected</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-gray-50 text-gray-700 border border-gray-200">{status}</span>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-teal-600 animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-500">Loading Cash & Settlement Ledger...</p>
        </div>
      </div>
    );
  }

  const pendingHandoverTotal = pendingCashGroups.reduce((sum, g) => sum + g.totalExpected, 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <AlertCircle size={15} />
            <span>{error}</span>
          </div>
          <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700">
            <X size={14} />
          </button>
        </div>
      )}

      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={15} />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg(null)} className="text-emerald-500 hover:text-emerald-700">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Primary KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500">Rider Cash to Receive</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Bike size={18} />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-gray-900">₹{pendingHandoverTotal.toLocaleString("en-IN")}</span>
            <p className="text-[11px] text-gray-400 mt-0.5">{pendingCashGroups.length} riders waiting for handover</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500">Received & In Hand</span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
              <Wallet size={18} />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-gray-900">₹{(effectiveVaultAmount || dailyClosing?.cashReceivedByOperator || 0).toLocaleString("en-IN")}</span>
            <p className="text-[11px] text-teal-600 mt-0.5">Verified operator cash</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500">Merchant Settlements Due</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Store size={18} />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-gray-900">₹{(effectiveVaultAmount || dailyClosing?.merchantSettlementPending || 0).toLocaleString("en-IN")}</span>
            <p className="text-[11px] text-gray-400 mt-0.5">Ready for restaurant/kirana payout</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500">Daily Closing Status</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <FileCheck size={18} />
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <div>
              <span className="text-sm font-bold text-gray-900">Date: {closingDate}</span>
              <p className="text-[11px] text-gray-400 mt-0.5">{dailyClosing?.exceptions?.length || 0} exceptions</p>
            </div>
            <button
              onClick={handleSubmitClosing}
              disabled={submittingClosing}
              className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
            >
              {submittingClosing ? "Closing..." : "Close Day"}
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-2 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab("handovers")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "handovers" ? "bg-teal-700 text-white shadow-xs" : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <Bike size={14} />
            <span>Rider Handovers ({pendingCashGroups.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("merchants")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "merchants" ? "bg-teal-700 text-white shadow-xs" : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <Store size={14} />
            <span>Merchant Payouts ({effectiveMerchants.length})</span>
            {effectiveVaultAmount > 0 && (
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${activeTab === "merchants" ? "bg-teal-800 text-teal-100" : "bg-amber-100 text-amber-800 font-bold"}`}>
                ₹{effectiveVaultAmount.toLocaleString("en-IN")}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("closing")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "closing" ? "bg-teal-700 text-white shadow-xs" : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Daily Reconciliation
          </button>
          <button
            onClick={() => setActiveTab("transactions")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "transactions" ? "bg-teal-700 text-white shadow-xs" : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Audit Ledger
          </button>
        </div>

        <button
          onClick={() => fetchAllData(true)}
          disabled={refreshing}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg hover:bg-gray-50"
        >
          <RefreshCw size={13} className={refreshing ? "animate-spin" : ""} />
          <span>Refresh</span>
        </button>
      </div>

      {/* TAB 1: RIDER CASH HANDOVERS */}
      {activeTab === "handovers" && (
        <div className="space-y-4">
          {pendingCashGroups.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 size={24} />
              </div>
              <h3 className="text-base font-bold text-gray-900">All Cash Collections are Verified</h3>
              <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                No riders currently have unverified cash handovers pending in your territory.
              </p>
            </div>
          ) : (
            pendingCashGroups.map((group) => (
              <div key={group.rider?._id || Math.random()} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
                <div className="p-4 bg-gray-50/80 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                      <Bike size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900">{group.rider?.name || "Territory Rider"}</h4>
                      <p className="text-[11px] text-gray-500">{group.rider?.phone || "Phone N/A"} • {group.transactions.length} Order(s) Collected</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="text-[10px] uppercase font-semibold text-gray-400 block">Total Pending Handover</span>
                      <span className="text-base font-bold text-gray-900">₹{group.totalExpected.toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                </div>

                <div className="divide-y divide-gray-100">
                  {group.transactions.map((txn) => {
                    const expected = txn.cashHandoverId?.expectedAmount || txn.amount;
                    const reported = txn.cashHandoverId?.riderReportedAmount || expected;

                    return (
                      <div key={txn._id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-gray-50/50 transition-colors">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-gray-900">{txn.orderRef || txn.orderId}</span>
                            {renderStatusBadge(txn.status)}
                          </div>
                          <p className="text-[11px] text-gray-400 mt-1">
                            Transaction: <span className="font-mono">{txn.transactionId}</span> • {new Date(txn.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <span className="text-xs font-bold text-gray-900 block">₹{expected}</span>
                            <span className="text-[10px] text-gray-400">Reported: ₹{reported}</span>
                          </div>

                          <button
                            onClick={() => handleOpenVerifyModal(txn)}
                            className="px-3.5 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1 shadow-xs"
                          >
                            <ShieldCheck size={14} />
                            <span>Verify & Accept</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      
      {/* TAB: MERCHANT PAYOUTS */}
      {activeTab === "merchants" && (
        <div className="space-y-4">
          {effectiveMerchants.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 size={24} />
              </div>
              <h3 className="text-base font-bold text-gray-900">All Merchant Cash is Settled</h3>
              <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                No verified cash collections are currently held in your vault awaiting payout to restaurants or kiranas.
              </p>
            </div>
          ) : (
            effectiveMerchants.map((m) => (
              <div key={m.merchantId} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
                <div className="p-4 bg-gray-50/80 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
                      {m.merchantType === "restaurant" ? <UtensilsCrossed size={20} /> : <Store size={20} />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-gray-900">{m.merchantName}</h4>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-200 text-gray-700 uppercase">
                          {m.merchantType}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500">
                        {m.merchantPhone || "Phone N/A"} • {m.transactions.length} Order(s) Verified in Vault
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="text-[10px] uppercase font-semibold text-gray-400 block">Total Due to Settle</span>
                      <span className="text-base font-bold text-emerald-700">₹{m.totalAmount.toLocaleString("en-IN")}</span>
                    </div>

                    <button
                      onClick={() => handleOpenSettleModal(m)}
                      className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
                    >
                      <Wallet size={14} />
                      <span>Settle to {m.merchantType === "restaurant" ? "Restaurant" : "Store"}</span>
                    </button>
                  </div>
                </div>

                <div className="divide-y divide-gray-100">
                  {m.transactions.map((txn) => (
                    <div key={txn._id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-gray-50/50 transition-colors">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-gray-900">{txn.orderRef || txn.orderId}</span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                            In Operator Vault
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-400 mt-1">
                          Delivery Partner: <span className="text-gray-700 font-semibold">{txn.riderId?.name || "Rider"}</span> • {new Date(txn.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-sm font-bold text-gray-900">₹{txn.actualAmount || txn.amount}</span>
                        <span className="text-[10px] text-gray-400 block">Collected in Cash</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 2: DAILY RECONCILIATION */}
      {activeTab === "closing" && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
            <div>
              <h3 className="text-base font-bold text-gray-900">Territory Daily Reconciliation (FR-11)</h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Audit cash collected vs verified vs settled. Unresolved discrepancies carry forward automatically.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="date"
                value={closingDate}
                onChange={(e) => setClosingDate(e.target.value)}
                className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 focus:outline-none focus:border-teal-600"
              />
              <button
                onClick={handleSubmitClosing}
                disabled={submittingClosing}
                className="px-4 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-bold transition-colors disabled:opacity-50"
              >
                {submittingClosing ? "Submitting..." : "Submit Closing"}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
              <span className="text-[11px] text-gray-400 block font-semibold">TOTAL COLLECTED BY RIDERS</span>
              <span className="text-xl font-bold text-gray-900 mt-1 block">
                ₹{(dailyClosing?.cashCollectedByRiders || 0).toLocaleString("en-IN")}
              </span>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
              <span className="text-[11px] text-gray-400 block font-semibold">VERIFIED BY OPERATOR</span>
              <span className="text-xl font-bold text-gray-900 mt-1 block">
                ₹{(dailyClosing?.cashReceivedByOperator || 0).toLocaleString("en-IN")}
              </span>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
              <span className="text-[11px] text-gray-400 block font-semibold">PENDING MERCHANT SETTLEMENT</span>
              <span className="text-xl font-bold text-gray-900 mt-1 block">
                ₹{(dailyClosing?.merchantSettlementPending || 0).toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: AUDIT LEDGER */}
      {activeTab === "transactions" && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-gray-900">All Transactions Audit Trail</h3>
              <p className="text-[11px] text-gray-400 mt-0.5">Filter by transaction status across your territory</p>
            </div>

            <select
              value={txnFilterStatus}
              onChange={(e) => setTxnFilterStatus(e.target.value)}
              className="text-xs font-semibold px-3 py-1.5 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:border-teal-600"
            >
              <option value="">All Statuses</option>
              <option value="CASH_COLLECTED_BY_RIDER">Pending Handover</option>
              <option value="CASH_COLLECTED_BY_OPERATOR">Operator Received</option>
              <option value="CASH_SETTLED_TO_MERCHANT">Merchant Settled</option>
              <option value="CASH_SHORT">Cash Short</option>
              <option value="CASH_EXCESS">Cash Excess</option>
              <option value="ONLINE_COLLECTED">Online Collected</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-semibold text-[10px] uppercase">
                <tr>
                  <th className="py-3 px-4">Transaction ID</th>
                  <th className="py-3 px-4">Order Ref</th>
                  <th className="py-3 px-4">Rider</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Payment Type</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-gray-400">
                      No transactions found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  transactions.map((txn) => (
                    <tr key={txn._id} className="hover:bg-gray-50/50">
                      <td className="py-3 px-4 font-mono font-semibold text-gray-900">{txn.transactionId}</td>
                      <td className="py-3 px-4 font-mono text-gray-700">{txn.orderRef || txn.orderId}</td>
                      <td className="py-3 px-4 text-gray-800">{txn.riderId?.name || "Rider N/A"}</td>
                      <td className="py-3 px-4 font-bold text-gray-900">₹{txn.actualAmount || txn.amount}</td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-gray-600">{txn.paymentType}</span>
                      </td>
                      <td className="py-3 px-4">{renderStatusBadge(txn.status)}</td>
                      <td className="py-3 px-4 text-gray-400 text-[11px]">
                        {new Date(txn.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      
      {/* SETTLE TO MERCHANT MODAL */}
      {settlingMerchant && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <Wallet className="text-emerald-600" size={20} />
                <h3 className="font-bold text-gray-900 text-sm">Settle Cash to Merchant</h3>
              </div>
              <button onClick={() => setSettlingMerchant(null)} className="text-gray-400 hover:text-gray-600">
                <X size={16} />
              </button>
            </div>

            <div className="bg-emerald-50 p-3 rounded-xl space-y-1 text-xs text-emerald-800">
              <p className="font-bold">{settlingMerchant.merchantName}</p>
              <p>Total Orders to Settle: {settlingMerchant.transactions.length}</p>
              <p className="text-base font-extrabold mt-1">Settlement Amount: ₹{settlingMerchant.totalAmount.toLocaleString("en-IN")}</p>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-gray-500 uppercase">Settlement Note (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Handed cash directly to hotel owner / cashier"
                value={settleNote}
                onChange={(e) => setSettleNote(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSettlingMerchant(null)}
                className="px-4 py-2 border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmSettleToMerchant}
                disabled={submittingSettle}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold disabled:opacity-50 flex items-center gap-1.5"
              >
                {submittingSettle ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={14} />
                    <span>Confirm Settlement (₹{settlingMerchant.totalAmount.toLocaleString("en-IN")})</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VERIFY CASH MODAL */}
      {selectedHandoverTxn && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="text-teal-600" size={20} />
                <h3 className="font-bold text-gray-900 text-sm">Verify Cash Handover</h3>
              </div>
              <button onClick={() => setSelectedHandoverTxn(null)} className="text-gray-400 hover:text-gray-600">
                <X size={16} />
              </button>
            </div>

            <div className="bg-gray-50 p-3 rounded-xl space-y-1.5 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Order Ref:</span>
                <span className="font-mono font-bold text-gray-900">{selectedHandoverTxn.orderRef || selectedHandoverTxn.orderId}</span>
              </div>
              <div className="flex justify-between">
                <span>Rider Name:</span>
                <span className="font-semibold text-gray-900">{selectedHandoverTxn.riderId?.name || "Rider"}</span>
              </div>
              <div className="flex justify-between">
                <span>Expected Amount:</span>
                <span className="font-bold text-gray-900">₹{selectedHandoverTxn.cashHandoverId?.expectedAmount || selectedHandoverTxn.amount}</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">
                Actual Cash Received from Rider (₹)
              </label>
              <input
                type="number"
                value={actualAmountInput}
                onChange={(e) => setActualAmountInput(e.target.value)}
                className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-sm font-bold text-gray-900 focus:outline-none focus:border-teal-600"
                placeholder="Enter exact received cash"
              />

              {(() => {
                const exp = selectedHandoverTxn.cashHandoverId?.expectedAmount || selectedHandoverTxn.amount || 0;
                const rec = parseFloat(actualAmountInput) || 0;
                const diff = rec - exp;

                if (diff < 0) {
                  return (
                    <div className="mt-2 text-xs font-semibold text-rose-700 bg-rose-50 p-2 rounded-lg border border-rose-200">
                      Shortage Warning: ₹{Math.abs(diff)} short. This shortage will be recorded against the rider.
                    </div>
                  );
                } else if (diff > 0) {
                  return (
                    <div className="mt-2 text-xs font-semibold text-purple-700 bg-purple-50 p-2 rounded-lg border border-purple-200">
                      Excess Received: ₹{diff} excess cash noted.
                    </div>
                  );
                } else {
                  return (
                    <div className="mt-2 text-xs font-semibold text-emerald-700 bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                      Exact match: ₹{rec} matches total order bill.
                    </div>
                  );
                }
              })()}
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">
                Operator Verification Note (Optional)
              </label>
              <input
                type="text"
                value={verificationNote}
                onChange={(e) => setVerificationNote(e.target.value)}
                className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-teal-600"
                placeholder="e.g. 500 note accepted, no torn notes"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedHandoverTxn(null)}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmVerify}
                disabled={verifying}
                className="flex-1 px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold transition-colors disabled:opacity-50"
              >
                {verifying ? "Verifying..." : "Confirm & Accept"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OperatorSettlements;
