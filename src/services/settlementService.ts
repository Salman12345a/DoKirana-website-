/**
 * Settlement Service
 * Front-end API integration for DKPoint Payment Collection, Verification & Settlement System.
 * Connects Operator Portal to /api/settlement/operator/* endpoints.
 */
import config from "../config/config";
import { getOperatorToken, clearOperatorSession } from "./operatorService";

const BASE = config.api.baseUrl;

async function settlementApiCall<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getOperatorToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE}${endpoint}`, { ...options, headers });
  const data = await res.json();

  if (!res.ok) {
    const message = data.message || `Request failed: ${res.status}`;
    if (res.status === 401 || res.status === 403) {
      clearOperatorSession();
      window.location.replace("/operator/login");
    }
    throw new Error(message);
  }

  return data;
}

export interface SettlementTransaction {
  _id: string;
  transactionId: string;
  orderId: string;
  orderRef?: string;
  amount: number;
  actualAmount?: number;
  paymentType: "CASH" | "ONLINE";
  status:
    | "INITIATED"
    | "CASH_COLLECTED_BY_RIDER"
    | "CASH_COLLECTED_BY_OPERATOR"
    | "CASH_SETTLED_TO_MERCHANT"
    | "CASH_SHORT"
    | "CASH_EXCESS"
    | "ONLINE_PROOF_SUBMITTED"
    | "ONLINE_UNDER_VERIFICATION"
    | "ONLINE_VERIFIED"
    | "ONLINE_COLLECTED"
    | "PROOF_REJECTED"
    | "DISPUTED";
  riderId?: {
    _id: string;
    name?: string;
    phone?: string;
  };
  merchantId?: string;
  merchantType?: "restaurant" | "branch";
  cashHandoverId?: {
    _id: string;
    expectedAmount: number;
    riderReportedAmount?: number;
    operatorReceivedAmount?: number;
    status: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface PendingRiderCashGroup {
  rider: {
    _id: string;
    name?: string;
    phone?: string;
  };
  transactions: SettlementTransaction[];
  totalExpected: number;
  totalReported: number;
}

export interface PendingCashResponse {
  status: string;
  data: {
    totalPending: number;
    byRider: PendingRiderCashGroup[];
    transactions: SettlementTransaction[];
  };
}

export interface DailyClosingSummary {
  date: string;
  totalTransactions: number;
  cashCollectedByRiders: number;
  cashReceivedByOperator: number;
  riderPendingCount: number;
  merchantSettlementPending: number;
  onlineVerificationPending: number;
  exceptions: Array<{ transactionId: string; reason: string }>;
  carriedForward: Array<{ transactionId: string }>;
}

export interface DailyClosingResponse {
  status: string;
  data: DailyClosingSummary;
}

export interface OperatorTransactionsResponse {
  status: string;
  data: {
    transactions: SettlementTransaction[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      pages: number;
    };
  };
}

// ─── API Methods ─────────────────────────────────────────────────────────────

/**
 * Fetch all rider cash handovers waiting for operator verification
 */
export async function getPendingCashHandovers(): Promise<PendingCashResponse> {
  return settlementApiCall<PendingCashResponse>("/api/settlement/operator/pending-cash");
}

/**
 * Operator approves or flags shortage/excess for a cash handover
 */
export async function verifyCashHandover(
  handoverId: string,
  payload: { actualAmountReceived: number; note?: string }
): Promise<{ status: string; message: string; data: any }> {
  return settlementApiCall<{ status: string; message: string; data: any }>(
    `/api/settlement/operator/verify-cash/${handoverId}`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );
}

/**
 * Settle cash batch to merchant (Restaurant or Kirana Branch)
 */
export async function settleToMerchant(payload: {
  merchantId: string;
  merchantType: "branch" | "restaurant";
  transactionIds: string[];
  totalAmount: number;
  note?: string;
}): Promise<{ status: string; message: string; data: any }> {
  return settlementApiCall<{ status: string; message: string; data: any }>(
    "/api/settlement/operator/settle",
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );
}

/**
 * Get daily closing and reconciliation summary
 */
export async function getDailyClosingSummary(date?: string): Promise<DailyClosingResponse> {
  const query = date ? `?date=${date}` : "";
  return settlementApiCall<DailyClosingResponse>(`/api/settlement/operator/daily-closing${query}`);
}

/**
 * Submit daily closing (carries forward unresolved discrepancies)
 */
export async function submitDailyClosing(
  date: string
): Promise<{ status: string; message: string; data: any }> {
  return settlementApiCall<{ status: string; message: string; data: any }>(
    "/api/settlement/operator/daily-closing/close",
    {
      method: "POST",
      body: JSON.stringify({ date }),
    }
  );
}

/**
 * Query all settlement transactions under operator scope
 */
export async function getOperatorSettlementTransactions(params?: {
  status?: string;
  page?: number;
  limit?: number;
  date?: string;
}): Promise<OperatorTransactionsResponse> {
  const q = new URLSearchParams();
  if (params?.status) q.append("status", params.status);
  if (params?.page) q.append("page", String(params.page));
  if (params?.limit) q.append("limit", String(params.limit));
  if (params?.date) q.append("date", params.date);

  const queryStr = q.toString() ? `?${q.toString()}` : "";
  return settlementApiCall<OperatorTransactionsResponse>(
    `/api/settlement/operator/transactions${queryStr}`
  );
}

export interface PendingMerchantGroup {
  merchantId: string;
  merchantType: "branch" | "restaurant";
  merchantName: string;
  merchantPhone?: string;
  merchantAddress?: string;
  transactions: SettlementTransaction[];
  totalAmount: number;
}

export interface PendingMerchantsResponse {
  status: string;
  data: {
    totalMerchants: number;
    totalTransactions: number;
    totalVaultAmount: number;
    merchants: PendingMerchantGroup[];
    transactions: SettlementTransaction[];
  };
}

/**
 * Fetch all verified cash collections in operator vault grouped by merchant ready for payout
 */
export async function getPendingMerchantSettlements(): Promise<PendingMerchantsResponse> {
  return settlementApiCall<PendingMerchantsResponse>("/api/settlement/operator/pending-merchants");
}
