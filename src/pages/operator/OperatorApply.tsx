import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Shield,
  CheckCircle,
  AlertCircle,
  Loader2,
  Phone,
  User,
  MapPin,
  CreditCard,
  Building,
  Camera,
  ArrowRight,
  ArrowLeft,
  Lock,
  Check,
  RotateCcw,
} from "lucide-react";
import {
  applyAsOperator,
  uploadOperatorDocument,
  sendOperatorOTP,
  verifyOperatorOTP,
  OperatorApplyPayload,
} from "../../services/operatorService";

interface DocState {
  file: File | null;
  url: string;
  uploading: boolean;
  error: string | null;
}

const initialDocState = (): DocState => ({
  file: null,
  url: "",
  uploading: false,
  error: null,
});


const DRAFT_KEY = "dokirana_operator_apply_draft";

interface OperatorApplyDraft {
  currentStep: number;
  name: string;
  phone: string;
  email: string;
  phoneVerified: boolean;
  pincode: string;
  city: string;
  area: string;
  operatingAddress: string;
  panNumber: string;
  aadhaarNumber: string;
  bankAccountNumber: string;
  bankIfscCode: string;
  upiId: string;
  selfieUrl: string;
  panCardUrl: string;
  aadhaarUrl: string;
  bankProofUrl: string;
  addressProofUrl: string;
}

const loadSavedDraft = (): Partial<OperatorApplyDraft> => {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const OperatorApply = () => {
  const savedDraft = loadSavedDraft();
  const [currentStep, setCurrentStep] = useState(savedDraft.currentStep || 1);

  // Form Fields
  const [name, setName] = useState(savedDraft.name || "");
  const [phone, setPhone] = useState(savedDraft.phone || "");
  const [email, setEmail] = useState(savedDraft.email || "");

  // OTP Verification
  const [otp, setOtp] = useState("");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [otpSent, setOtpSent] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(Boolean(savedDraft.phoneVerified && savedDraft.phone));
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);

  // Territory
  const [pincode, setPincode] = useState(savedDraft.pincode || "");
  const [city, setCity] = useState(savedDraft.city || "");
  const [area, setArea] = useState(savedDraft.area || "");
  const [operatingAddress, setOperatingAddress] = useState(savedDraft.operatingAddress || "");

  // Identification & Tax
  const [panNumber, setPanNumber] = useState(savedDraft.panNumber || "");
  const [aadhaarNumber, setAadhaarNumber] = useState(savedDraft.aadhaarNumber || "");

  // Financial
  const [bankAccountNumber, setBankAccountNumber] = useState(savedDraft.bankAccountNumber || "");
  const [bankIfscCode, setBankIfscCode] = useState(savedDraft.bankIfscCode || "");
  const [upiId, setUpiId] = useState(savedDraft.upiId || "");

  // Document Uploads (Stored in GCP bucket: dk-branch-auth / operators)
  const [selfieDoc, setSelfieDoc] = useState<DocState>(() => ({ file: null, url: savedDraft.selfieUrl || "", uploading: false, error: null }));
  const [panDoc, setPanDoc] = useState<DocState>(() => ({ file: null, url: savedDraft.panCardUrl || "", uploading: false, error: null }));
  const [aadhaarDoc, setAadhaarDoc] = useState<DocState>(() => ({ file: null, url: savedDraft.aadhaarUrl || "", uploading: false, error: null }));
  const [bankDoc, setBankDoc] = useState<DocState>(() => ({ file: null, url: savedDraft.bankProofUrl || "", uploading: false, error: null }));
  const [addressDoc, setAddressDoc] = useState<DocState>(() => ({ file: null, url: savedDraft.addressProofUrl || "", uploading: false, error: null }));

  // Submit State
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [createdPincode, setCreatedPincode] = useState("");


  // Auto-save registration progress to localStorage on any state change
  useEffect(() => {
    if (submitted) {
      localStorage.removeItem(DRAFT_KEY);
      return;
    }
    const draft: OperatorApplyDraft = {
      currentStep,
      name,
      phone,
      email,
      phoneVerified,
      pincode,
      city,
      area,
      operatingAddress,
      panNumber,
      aadhaarNumber,
      bankAccountNumber,
      bankIfscCode,
      upiId,
      selfieUrl: selfieDoc.url,
      panCardUrl: panDoc.url,
      aadhaarUrl: aadhaarDoc.url,
      bankProofUrl: bankDoc.url,
      addressProofUrl: addressDoc.url,
    };
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    } catch {
      // localStorage fallback
    }
  }, [
    currentStep,
    name,
    phone,
    email,
    phoneVerified,
    pincode,
    city,
    area,
    operatingAddress,
    panNumber,
    aadhaarNumber,
    bankAccountNumber,
    bankIfscCode,
    upiId,
    selfieDoc.url,
    panDoc.url,
    aadhaarDoc.url,
    bankDoc.url,
    addressDoc.url,
    submitted,
  ]);

  const handleResetDraft = () => {
    if (window.confirm("Are you sure you want to clear your saved registration progress and start from Step 1?")) {
      localStorage.removeItem(DRAFT_KEY);
      setCurrentStep(1);
      setName("");
      setPhone("");
      setEmail("");
      setPhoneVerified(false);
      setOtp("");
      setOtpSent(false);
      setPincode("");
      setCity("");
      setArea("");
      setOperatingAddress("");
      setPanNumber("");
      setAadhaarNumber("");
      setBankAccountNumber("");
      setBankIfscCode("");
      setUpiId("");
      setSelfieDoc(initialDocState());
      setPanDoc(initialDocState());
      setAadhaarDoc(initialDocState());
      setBankDoc(initialDocState());
      setAddressDoc(initialDocState());
      setSubmitError(null);
    }
  };

  // Document Upload Handler
  const handleFileUpload = async (
    file: File,
    docType: "selfie" | "panCard" | "aadhaar" | "bankProof" | "addressProof",
    setDocState: React.Dispatch<React.SetStateAction<DocState>>
  ) => {
    setDocState((prev) => ({ ...prev, file, uploading: true, error: null }));
    try {
      const res = await uploadOperatorDocument(file, docType, phone || "unassigned");
      if (res.status === "SUCCESS" && res.url) {
        setDocState({ file, url: res.url, uploading: false, error: null });
      } else {
        throw new Error(res.message || "Upload failed");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to upload document to GCP";
      setDocState((prev) => ({ ...prev, uploading: false, error: message }));
    }
  };

  // Send OTP
  const handleSendOTP = async () => {
    if (!phone || phone.length !== 10) {
      setOtpError("Enter a valid 10-digit mobile number");
      return;
    }
    setOtpLoading(true);
    setOtpError(null);
    try {
      const res = await sendOperatorOTP(phone);
      if (res.sessionId) setSessionId(res.sessionId);
      setOtpSent(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to send OTP";
      setOtpError(message);
    } finally {
      setOtpLoading(false);
    }
  };

  // Verify OTP
  const handleVerifyOTP = async () => {
    if (!otp || otp.length < 4) {
      setOtpError("Enter the 6-digit OTP sent to your phone");
      return;
    }
    setOtpLoading(true);
    setOtpError(null);
    try {
      const res = await verifyOperatorOTP(phone, otp, sessionId || undefined);
      if (res.verified) {
        setPhoneVerified(true);
      } else {
        setOtpError("Invalid OTP. Please check and try again.");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Invalid or expired OTP";
      setOtpError(message);
    } finally {
      setOtpLoading(false);
    }
  };

  // Validate current step before proceeding
  const handleNextStep = () => {
    setSubmitError(null);
    if (currentStep === 1) {
      if (!name.trim()) return setSubmitError("Please enter your full name.");
      if (!phone || phone.length !== 10) return setSubmitError("Please enter a valid 10-digit mobile number.");
      if (!phoneVerified) return setSubmitError("Please verify your mobile number with OTP before continuing.");
      if (!email.trim()) return setSubmitError("Please enter a valid email address for official notices.");
    } else if (currentStep === 2) {
      if (!pincode || pincode.length !== 6) return setSubmitError("Please enter a valid 6-digit territory pincode.");
      if (!city.trim()) return setSubmitError("Please enter your city.");
      if (!area.trim()) return setSubmitError("Please enter your operating locality/area.");
    } else if (currentStep === 3) {
      if (!selfieDoc.url) return setSubmitError("Please upload your live selfie photo for fraud prevention.");
      if (!panNumber.trim() || panNumber.length !== 10) return setSubmitError("Please enter a valid 10-character PAN number.");
      if (!panDoc.url) return setSubmitError("Please upload your PAN card document photo.");
      if (!aadhaarNumber.trim() || aadhaarNumber.length < 12) return setSubmitError("Please enter a valid Aadhaar / Govt ID number.");
      if (!aadhaarDoc.url) return setSubmitError("Please upload your Aadhaar / Govt ID document photo.");
    }
    setCurrentStep((prev) => Math.min(prev + 1, 4));
  };

  // Final Application Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!bankAccountNumber.trim()) return setSubmitError("Please enter your bank account number.");
    if (!bankIfscCode.trim()) return setSubmitError("Please enter your bank IFSC code.");
    if (!bankDoc.url) return setSubmitError("Please upload a photo of your bank passbook or cancelled cheque.");

    const payload: OperatorApplyPayload = {
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim().toLowerCase(),
      panNumber: panNumber.trim().toUpperCase(),
      panCardUrl: panDoc.url,
      aadhaarNumber: aadhaarNumber.trim(),
      aadhaarUrl: aadhaarDoc.url,
      selfieUrl: selfieDoc.url,
      pincode: pincode.trim(),
      city: city.trim(),
      area: area.trim(),
      operatingAddress: operatingAddress.trim() || `${area}, ${city}`,
      addressProofUrl: addressDoc.url || undefined,
      bankAccountNumber: bankAccountNumber.trim(),
      bankIfscCode: bankIfscCode.trim().toUpperCase(),
      bankProofUrl: bankDoc.url,
      upiId: upiId.trim() || undefined,
    };

    setSubmitting(true);
    try {
      await applyAsOperator(payload);
      localStorage.removeItem(DRAFT_KEY);
      setCreatedPincode(pincode.trim());
      setSubmitted(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to submit operator application";
      setSubmitError(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-950 via-teal-900 to-teal-800 flex items-center justify-center px-4 py-16">
        <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-12 max-w-lg w-full text-center border border-teal-100">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
            <CheckCircle size={38} />
          </div>

          <span className="text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
            Application Under Review
          </span>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-4 mb-2">
            Territory Application Lodged!
          </h2>

          <p className="text-gray-600 text-sm leading-relaxed mb-6">
            Your verification documents (PAN, Aadhaar, Selfie, Bank Proof) have been securely archived in GCP cloud storage (bucket: <strong>dk-branch-auth / operators</strong>).
          </p>

          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 text-left text-xs space-y-2 mb-6">
            <div className="flex justify-between">
              <span className="text-gray-500">Applicant:</span>
              <span className="font-semibold text-gray-800">{name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Verified Mobile:</span>
              <span className="font-mono font-semibold text-gray-800">+91 {phone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Requested Territory PIN:</span>
              <span className="font-mono font-bold text-teal-800">{createdPincode}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Review Turnaround:</span>
              <span className="font-semibold text-emerald-700">Within 48 Hours</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/operator/login"
              className="flex-1 bg-teal-700 hover:bg-teal-800 text-white font-semibold py-3 px-4 rounded-xl text-xs transition-all shadow-md shadow-teal-700/20 flex items-center justify-center gap-2"
            >
              Operator Login Portal
              <ArrowRight size={14} />
            </Link>
            <Link
              to="/"
              className="px-5 py-3 border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold rounded-xl text-xs transition-all"
            >
              Return Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/60 pb-24">
      {/* Top Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl font-black text-teal-800">DoKirana</span>
            <span className="text-xs bg-teal-50 text-teal-800 px-2 py-0.5 rounded-full border border-teal-200 font-bold">
              Operators Club
            </span>
          </Link>

          <div className="flex items-center gap-3 text-xs">
            <Link to="/operator/register" className="text-gray-500 hover:text-gray-800 font-medium hidden sm:inline">
              Overview & Calculator
            </Link>
            <Link
              to="/operator/login"
              className="text-teal-700 hover:text-teal-900 font-bold bg-teal-50 px-3 py-1.5 rounded-xl border border-teal-200"
            >
              Operator Login
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 pt-10">
        {/* Title & Exclusivity Banner */}
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-1.5 bg-teal-100 text-teal-800 text-xs font-bold px-3.5 py-1 rounded-full uppercase tracking-wider border border-teal-200">
            <Shield size={13} className="text-teal-600" />
            Official Registration Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-3">
            Area Operator Application & Verification
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-1.5">
            Complete the 4-stage identity and territorial verification to claim exclusive operator rights in your pincode.
          </p>
        </div>

        {/* Step Indicator */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm mb-6">
          <div className="grid grid-cols-4 gap-2 text-center">
            {[
              { num: 1, label: "Identity & Phone" },
              { num: 2, label: "Territory" },
              { num: 3, label: "Documents" },
              { num: 4, label: "Banking" },
            ].map((s) => (
              <div
                key={s.num}
                onClick={() => {
                  if (s.num < currentStep) setCurrentStep(s.num);
                }}
                className={`flex flex-col items-center cursor-pointer transition-all ${
                  currentStep === s.num
                    ? "text-teal-800 font-bold"
                    : currentStep > s.num
                    ? "text-emerald-600 font-semibold"
                    : "text-gray-400 font-medium"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs mb-1 transition-all ${
                    currentStep === s.num
                      ? "bg-teal-700 text-white ring-4 ring-teal-100"
                      : currentStep > s.num
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {currentStep > s.num ? <Check size={14} /> : s.num}
                </div>
                <span className="text-[11px] truncate max-w-full">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        
        {Boolean(name || phone || selfieDoc.url || panDoc.url || bankDoc.url) && (
          <div className="flex items-center justify-between bg-teal-50 border border-teal-200/80 rounded-2xl px-4 py-2.5 mb-6 text-xs text-teal-800 shadow-2xs">
            <span className="flex items-center gap-2 font-medium">
              <CheckCircle size={15} className="text-teal-600 flex-shrink-0" />
              Registration draft auto-saved & restored (Step {currentStep} of 4)
            </span>
            <button
              type="button"
              onClick={handleResetDraft}
              className="inline-flex items-center gap-1 text-rose-600 hover:text-rose-800 font-semibold underline text-[11px] transition-colors"
            >
              <RotateCcw size={12} />
              Reset Draft
            </button>
          </div>
        )}

        {submitError && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm rounded-2xl p-4 mb-6 flex items-center gap-3">
            <AlertCircle size={18} className="text-rose-600 flex-shrink-0" />
            <span>{submitError}</span>
          </div>
        )}

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm">
          {/* STEP 1: Personal & Mobile OTP Verification */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="border-b border-gray-100 pb-3">
                <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
                  <User size={18} className="text-teal-600" />
                  Applicant Identity & Mobile Verification
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Mobile verification is required to establish ownership of the operator dispatch account.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Full Legal Name (as on PAN/Aadhaar) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Salman Ahmed Khan"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 outline-none"
                />
              </div>

              {/* Mobile + OTP Verification */}
              <div className="p-4 rounded-2xl bg-teal-50/50 border border-teal-100 space-y-3">
                <label className="block text-xs font-semibold text-gray-800">
                  Mobile Number (OTP Verification Mandatory) *
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-gray-500 font-medium">
                      +91
                    </span>
                    <input
                      type="tel"
                      maxLength={10}
                      disabled={phoneVerified}
                      placeholder="9876543210"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value.replace(/\D/g, ""));
                        setPhoneVerified(false);
                        setOtpSent(false);
                      }}
                      className="w-full pl-14 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-white font-mono focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 outline-none disabled:bg-gray-100"
                    />
                  </div>

                  {!phoneVerified ? (
                    <button
                      type="button"
                      onClick={handleSendOTP}
                      disabled={otpLoading || phone.length !== 10}
                      className="bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold px-4 py-2.5 rounded-xl disabled:opacity-50 transition-all flex items-center gap-1.5 shadow-sm"
                    >
                      {otpLoading && <Loader2 size={13} className="animate-spin" />}
                      {otpSent ? "Resend OTP" : "Send OTP"}
                    </button>
                  ) : (
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-200">
                      <CheckCircle size={15} />
                      Verified
                    </div>
                  )}
                </div>

                {otpSent && !phoneVerified && (
                  <div className="space-y-2 pt-2 border-t border-teal-100">
                    <p className="text-xs text-teal-800">Enter the 6-digit OTP sent to +91 {phone}:</p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        maxLength={6}
                        placeholder="123456"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                        className="w-36 px-4 py-2 text-center text-sm font-mono tracking-widest rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleVerifyOTP}
                        disabled={otpLoading || otp.length < 4}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-xl disabled:opacity-50 transition-all shadow-sm"
                      >
                        {otpLoading ? "Verifying..." : "Verify OTP"}
                      </button>
                    </div>
                  </div>
                )}

                {otpError && (
                  <p className="text-xs text-rose-600 font-medium flex items-center gap-1">
                    <AlertCircle size={12} /> {otpError}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Official Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="operator@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 outline-none"
                />
              </div>
            </div>
          )}

          {/* STEP 2: Territory Declaration */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="border-b border-gray-100 pb-3">
                <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
                  <MapPin size={18} className="text-teal-600" />
                  Territory & Operating Pincode Declaration
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Every Area Operator holds exclusive operational management for exactly one pincode.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Target Territory Pincode (6 digits) *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="e.g. 500034"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-mono tracking-wider focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 outline-none"
                  />
                  <span className="text-[11px] text-gray-400 mt-1 block">
                    Exclusivity rule: 1 Operator per Pincode.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Hyderabad"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Operating Locality / Area *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Banjara Hills Road No. 12"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Operating / Correspondence Physical Address (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Floor / Building / Landmark in the operating zone..."
                  value={operatingAddress}
                  onChange={(e) => setOperatingAddress(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 outline-none"
                />
              </div>
            </div>
          )}

          {/* STEP 3: Verification Documents */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="border-b border-gray-100 pb-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
                    <Shield size={18} className="text-teal-600" />
                    Identity & Compliance Documents
                  </h3>
                  <span className="text-[11px] bg-teal-50 text-teal-800 border border-teal-200 px-2.5 py-0.5 rounded-full font-mono">
                    GCP dk-branch-auth / operators
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  All documents are directly uploaded and verified against fraud prevention databases.
                </p>
              </div>

              {/* 1. Live Selfie */}
              <div className="p-4 rounded-2xl border border-gray-200 bg-gray-50/50 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                    <Camera size={15} className="text-teal-600" />
                    1. Live Selfie / Passport Photo *
                  </label>
                  {selfieDoc.url && (
                    <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle size={13} /> Uploaded to GCP
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-gray-500">
                  A clear front-facing photograph to mitigate fake/duplicate accounts.
                </p>
                <div className="flex items-center gap-3 pt-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        handleFileUpload(e.target.files[0], "selfie", setSelfieDoc);
                      }
                    }}
                    className="text-xs text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-teal-700 file:text-white hover:file:bg-teal-800 cursor-pointer"
                  />
                  {selfieDoc.uploading && <Loader2 size={16} className="text-teal-600 animate-spin" />}
                </div>
                {selfieDoc.error && <p className="text-xs text-rose-600 font-medium">{selfieDoc.error}</p>}
              </div>

              {/* 2. PAN Card */}
              <div className="p-4 rounded-2xl border border-gray-200 bg-gray-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                    <CreditCard size={15} className="text-teal-600" />
                    2. PAN Card (Tax & Identity Verification) *
                  </label>
                  {panDoc.url && (
                    <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle size={13} /> Uploaded to GCP
                    </span>
                  )}
                </div>

                <div>
                  <input
                    type="text"
                    maxLength={10}
                    placeholder="PAN Number (e.g. ABCDE1234F)"
                    value={panNumber}
                    onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-mono uppercase bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 outline-none"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        handleFileUpload(e.target.files[0], "panCard", setPanDoc);
                      }
                    }}
                    className="text-xs text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-teal-700 file:text-white hover:file:bg-teal-800 cursor-pointer"
                  />
                  {panDoc.uploading && <Loader2 size={16} className="text-teal-600 animate-spin" />}
                </div>
                {panDoc.error && <p className="text-xs text-rose-600 font-medium">{panDoc.error}</p>}
              </div>

              {/* 3. Aadhaar / Govt Valid ID */}
              <div className="p-4 rounded-2xl border border-gray-200 bg-gray-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                    <Shield size={15} className="text-teal-600" />
                    3. Aadhaar / Officially Valid Govt ID *
                  </label>
                  {aadhaarDoc.url && (
                    <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle size={13} /> Uploaded to GCP
                    </span>
                  )}
                </div>

                <div>
                  <input
                    type="text"
                    maxLength={16}
                    placeholder="Aadhaar / ID Number (12-16 digits)"
                    value={aadhaarNumber}
                    onChange={(e) => setAadhaarNumber(e.target.value.replace(/\D/g, ""))}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-mono bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 outline-none"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        handleFileUpload(e.target.files[0], "aadhaar", setAadhaarDoc);
                      }
                    }}
                    className="text-xs text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-teal-700 file:text-white hover:file:bg-teal-800 cursor-pointer"
                  />
                  {aadhaarDoc.uploading && <Loader2 size={16} className="text-teal-600 animate-spin" />}
                </div>
                {aadhaarDoc.error && <p className="text-xs text-rose-600 font-medium">{aadhaarDoc.error}</p>}
              </div>

              {/* 4. Address Proof */}
              <div className="p-4 rounded-2xl border border-gray-200 bg-gray-50/50 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                    <Building size={15} className="text-gray-500" />
                    4. Operating Address Proof (Optional / if different from ID)
                  </label>
                  {addressDoc.url && (
                    <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle size={13} /> Uploaded to GCP
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-gray-500">
                  Electricity bill, rent agreement, or lease in the designated pincode.
                </p>
                <div className="flex items-center gap-3 pt-1">
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        handleFileUpload(e.target.files[0], "addressProof", setAddressDoc);
                      }
                    }}
                    className="text-xs text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-gray-700 file:text-white hover:file:bg-gray-800 cursor-pointer"
                  />
                  {addressDoc.uploading && <Loader2 size={16} className="text-teal-600 animate-spin" />}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Bank Account & Passbook Proof */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="border-b border-gray-100 pb-3">
                <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
                  <CreditCard size={18} className="text-teal-600" />
                  Banking Credentials & Passbook Proof
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Direct automated disbursement account for â‚¹299 partner subscriptions and dispatch handling fees.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Bank Account Number *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 123456789012"
                    value={bankAccountNumber}
                    onChange={(e) => setBankAccountNumber(e.target.value.replace(/\D/g, ""))}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-mono focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Bank IFSC Code *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={11}
                    placeholder="e.g. HDFC0001234"
                    value={bankIfscCode}
                    onChange={(e) => setBankIfscCode(e.target.value.toUpperCase())}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-mono uppercase focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  UPI ID for Instant Settlement (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. mobile@upi or name@okhdfcbank"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-mono focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 outline-none"
                />
              </div>

              {/* Passbook / Cheque photo upload */}
              <div className="p-4 rounded-2xl border border-gray-200 bg-gray-50/50 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                    <Building size={15} className="text-teal-600" />
                    Bank Account Proof (Passbook Photo / Cancelled Cheque) *
                  </label>
                  {bankDoc.url && (
                    <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle size={13} /> Uploaded to GCP
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-gray-500">
                  Must clearly show the operator's legal name, bank account number, and branch IFSC.
                </p>
                <div className="flex items-center gap-3 pt-1">
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        handleFileUpload(e.target.files[0], "bankProof", setBankDoc);
                      }
                    }}
                    className="text-xs text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-teal-700 file:text-white hover:file:bg-teal-800 cursor-pointer"
                  />
                  {bankDoc.uploading && <Loader2 size={16} className="text-teal-600 animate-spin" />}
                </div>
                {bankDoc.error && <p className="text-xs text-rose-600 font-medium">{bankDoc.error}</p>}
              </div>

              <div className="p-4 bg-teal-50/60 rounded-2xl border border-teal-100 text-xs text-teal-900 space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <Lock size={13} className="text-teal-700" />
                  Territory Exclusivity & Legal Declaration
                </p>
                <p className="text-teal-800/80 leading-relaxed">
                  By submitting this application, you declare that all uploaded government identity documents (PAN, Aadhaar) and bank proofs belong to you and correspond to the exclusive territory pincode requested.
                </p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-8 mt-6 border-t border-gray-100">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={() => setCurrentStep((p) => p - 1)}
                className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900 px-4 py-2.5 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft size={14} />
                Previous Step
              </button>
            ) : (
              <div />
            )}

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="flex items-center gap-2 bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold px-6 py-3 rounded-xl transition-all shadow-md shadow-teal-700/20"
              >
                Continue to Step {currentStep + 1}
                <ArrowRight size={14} />
              </button>
            ) : (
              <button
                type="submit"
                disabled={submitting || !bankDoc.url}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-7 py-3 rounded-xl transition-all shadow-md shadow-emerald-600/20 disabled:opacity-50"
              >
                {submitting && <Loader2 size={15} className="animate-spin" />}
                {submitting ? "Submitting Application..." : "Submit Verified Application"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default OperatorApply;
