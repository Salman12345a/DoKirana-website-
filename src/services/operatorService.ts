/**
 * Operator Service
 * All API calls for the Operator portal (self-registration, auth, dashboard).
 * Uses operatorAccessToken - never touches the admin accessToken.
 */
import config from "../config/config";

const BASE = config.api.baseUrl;

// ── Token helpers ──
export const getOperatorToken = (): string | null =>
  localStorage.getItem(config.auth.operatorTokenKey);

export const setOperatorSession = (token: string, operatorData: object) => {
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + 7);
  localStorage.setItem(config.auth.operatorTokenKey, token);
  localStorage.setItem(config.auth.operatorTokenExpiryKey, expiry.toString());
  localStorage.setItem(config.auth.operatorDataKey, JSON.stringify(operatorData));
};

export const clearOperatorSession = () => {
  localStorage.removeItem(config.auth.operatorTokenKey);
  localStorage.removeItem(config.auth.operatorTokenExpiryKey);
  localStorage.removeItem(config.auth.operatorDataKey);
};

export const isOperatorSessionValid = (): boolean => {
  const token = getOperatorToken();
  const expiry = localStorage.getItem(config.auth.operatorTokenExpiryKey);
  if (!token) return false;
  if (expiry && new Date(expiry) < new Date()) { clearOperatorSession(); return false; }
  return true;
};

export const getStoredOperatorData = () => {
  const raw = localStorage.getItem(config.auth.operatorDataKey);
  return raw ? JSON.parse(raw) : null;
};

async function apiCall<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getOperatorToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${BASE}${endpoint}`, { ...options, headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || `Request failed: ${res.status}`);
  if (data && typeof data.status === "string" && data.status.toUpperCase() === "SUCCESS") {
    data.status = "success";
  }
  return data;
}

export interface OperatorApplyPayload {
  name: string;
  phone: string;
  email: string;
  panNumber: string;
  panCardUrl: string;
  aadhaarNumber: string;
  aadhaarUrl: string;
  selfieUrl: string;
  pincode: string;
  city: string;
  area: string;
  operatingAddress?: string;
  addressProofUrl?: string;
  bankAccountNumber: string;
  bankIfscCode: string;
  bankProofUrl: string;
  upiId?: string;
}

export const applyAsOperator = (payload: OperatorApplyPayload) =>
  apiCall(config.api.operator.apply, { method: "POST", body: JSON.stringify(payload) });

/**
 * Upload Operator Verification Document to GCP bucket dk-branch-auth / operators/ folder
 */
export const uploadOperatorDocument = async (
  file: File,
  docType: "panCard" | "aadhaar" | "selfie" | "bankProof" | "addressProof" | string,
  phone?: string
): Promise<{ status: string; url: string; key: string; docType: string; message: string }> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("docType", docType);
  if (phone) formData.append("phone", phone);

  const cleanPhone = phone ? phone.replace(/\D/g, "") : "unassigned";
  const endpoint = `${BASE}${config.api.operator.uploadDoc}?docType=${encodeURIComponent(docType)}&phone=${encodeURIComponent(cleanPhone)}`;

  const res = await fetch(endpoint, {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || `Failed to upload ${docType} to GCP storage`);
  return data;
};

/**
 * Send OTP for registration mobile verification
 */
export const sendOperatorOTP = (phone: string) =>
  apiCall<{ status: string; message: string; sessionId?: string; phone?: string }>(
    config.api.operator.sendOtp,
    { method: "POST", body: JSON.stringify({ phone }) }
  );

/**
 * Verify OTP for registration mobile verification
 */
export const verifyOperatorOTP = (phone: string, otp: string, sessionId?: string) =>
  apiCall<{ status: string; verified: boolean; message: string }>(
    config.api.operator.verifyOtp,
    { method: "POST", body: JSON.stringify({ phone, otp, sessionId }) }
  );

export const initiateLogin = (phone: string) =>
  apiCall<{ status: string; message: string; sessionId?: string; applicationStatus?: string }>(
    config.api.operator.authInitiate, { method: "POST", body: JSON.stringify({ phone }) }
  );

export const verifyLogin = (phone: string, otp: string, sessionId?: string) =>
  apiCall<{ status: string; accessToken: string; operator: OperatorProfile }>(
    config.api.operator.authVerify, { method: "POST", body: JSON.stringify({ phone, otp, sessionId }) }
  );

export interface DashboardData {
  pincode: string; city: string; area: string;
  partners: { kirana: number; restaurant: number; total: number };
  today: { earnings: number; transactions: number };
  pendingPayout: number; riderCount: number;
}
export const getDashboard = () =>
  apiCall<{ status: string; dashboard: DashboardData }>(config.api.operator.dashboard);

export interface Partner {
  _id: string; subscriberType: "kirana_branch" | "restaurant";
  subscriberPhone: string; subscriberId: string; status: string;
  currentPeriodEnd: string; monthlyRate: number;
}
export const getPartners = (params?: { type?: string; status?: string }) => {
  const qs = new URLSearchParams(params as Record<string, string>).toString();
  return apiCall<{ status: string; total: number; partners: Partner[] }>(
    `${config.api.operator.partners}${qs ? "?" + qs : ""}`
  );
};
export const linkPartner = (subscriberPhone: string) =>
  apiCall(config.api.operator.linkPartner, { method: "POST", body: JSON.stringify({ subscriberPhone }) });

export interface LedgerEntry {
  _id: string; eventType: string; grossAmount: number;
  operatorEarning: number; platformEarning: number;
  payoutStatus: string; description: string; createdAt: string;
}
export interface EarningsSummary {
  totalEarnings: number; subscriptionEarnings: number;
  handlingChargeEarnings: number; pendingPayout: number; paidOut: number;
}
export const getEarnings = (params?: { page?: number; limit?: number; eventType?: string; payoutStatus?: string }) => {
  const qs = new URLSearchParams(Object.entries(params || {}).filter(([,v])=>v!==undefined).map(([k,v])=>[k,String(v)])).toString();
  return apiCall<{ status: string; total: number; entries: LedgerEntry[]; summary: EarningsSummary }>(
    `${config.api.operator.earnings}${qs ? "?" + qs : ""}`
  );
};

export interface Rider { _id: string; name: string; phone: string; isAvailable: boolean; vehicleType?: string; }
export const getRiders = () =>
  apiCall<{ status: string; riders: Rider[]; total: number }>(config.api.operator.riders);

export interface OperatorProfile {
  _id: string; name: string; phone: string; email?: string; pincode: string;
  city: string; area: string; bankAccountNumber?: string; bankIfscCode?: string;
  upiId?: string; activeSubscriberCount: number; lastLoginAt?: string; createdAt: string;
}
export const getProfile = () =>
  apiCall<{ status: string; operator: OperatorProfile }>(config.api.operator.profile);

export interface FoodOrder {
  _id: string; orderId: string; status: string; createdAt: string;
  restaurant?: { name: string; address: string; phone: string }; totalPrice: number;
}
export interface KiranaOrder { _id: string; status: string; createdAt: string; totalPrice: number; }
export const getActiveOrders = () =>
  apiCall<{ status: string; activeOrders: { foodOrders: FoodOrder[]; kiranaOrders: KiranaOrder[] }; total: number }>(
    config.api.operator.activeOrders
  );
export const assignRider = (payload: { orderId: string; riderId: string; orderType: string }) =>
  apiCall(config.api.operator.assignRider, { method: "POST", body: JSON.stringify(payload) });