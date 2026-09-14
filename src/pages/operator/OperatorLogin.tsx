import { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Loader2, Phone, ShieldCheck, ArrowLeft, Clock, AlertCircle, ArrowRight } from "lucide-react";
import { initiateLogin, verifyLogin, setOperatorSession, isOperatorSessionValid } from "../../services/operatorService";

type Step = "phone" | "otp" | "pending";

const OperatorLogin = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pendingMsg, setPendingMsg] = useState("");
  const [notRegistered, setNotRegistered] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setNotRegistered(false);
    try {
      const res = await initiateLogin(phone) as any;
      if (res.status === "PENDING") {
        setPendingMsg(res.message);
        setStep("pending");
      } else {
        if (res.sessionId) setSessionId(res.sessionId);
        setStep("otp");
      }
    } catch (err: any) {
      const msg = err.message || "Failed to send OTP";
      setError(msg);
      if (err.code === "NOT_REGISTERED" || msg.toLowerCase().includes("not registered")) {
        setNotRegistered(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...otp]; next[index] = value; setOtp(next);
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
    if (index === 5 && value) {
      const code = [...next].join("");
      if (code.length === 6) handleOtpVerify(code);
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) otpRefs.current[index - 1]?.focus();
  };

  const handleOtpVerify = async (code?: string) => {
    const otpCode = code || otp.join("");
    if (otpCode.length < 6) return;
    setLoading(true); setError("");
    try {
      const res = await verifyLogin(phone, otpCode, sessionId || undefined) as any;
      setOperatorSession(res.accessToken, res.operator);
      navigate("/operator/dashboard", { replace: true });
    } catch (err: any) {
      setError(err.message || "Invalid OTP");
      setOtp(["", "", "", "", "", ""]);
      otpRefs.current[0]?.focus();
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-900 via-teal-800 to-teal-700 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-teal-700 to-teal-600 px-8 py-8 text-white">
            <p className="text-teal-300 text-xs font-semibold uppercase tracking-widest mb-1">Operators Club</p>
            <h1 className="text-2xl font-bold">Operator Login</h1>
            <p className="text-teal-200 text-sm mt-1">
              {step === "phone" ? "Enter your registered phone number" :
               step === "otp" ? `OTP sent to +91 ${phone}` : "Application under review"}
            </p>
          </div>

          <div className="px-8 py-8">
            {error && (
              <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm rounded-2xl p-4 mb-5 space-y-2.5">
                <div className="flex items-start gap-2.5">
                  <AlertCircle size={17} className="text-rose-600 mt-0.5 flex-shrink-0" />
                  <span className="font-medium leading-relaxed">{error}</span>
                </div>
                {notRegistered && (
                  <div className="pt-2.5 border-t border-rose-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span className="text-xs text-rose-700 font-medium">Claim your area territory now:</span>
                    <Link
                      to="/operator/apply"
                      className="inline-flex items-center justify-center gap-1.5 bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold px-3 py-1.5 rounded-xl transition-all shadow-xs"
                    >
                      Register as Operator <ArrowRight size={13} />
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Step: Phone */}
            {step === "phone" && (
              <form onSubmit={handlePhoneSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg text-gray-600 text-sm">+91</span>
                    <input
                      type="tel" value={phone} onChange={e => setPhone(e.target.value.replace(/\D/, "").slice(0, 10))}
                      placeholder="9876543210" required maxLength={10}
                      className="flex-1 px-4 py-2.5 border border-gray-300 rounded-r-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>
                <button
                  type="submit" disabled={loading || phone.length < 10}
                  className="w-full bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 size={18} className="animate-spin" /> : <Phone size={18} />}
                  {loading ? "Sending OTP..." : "Send OTP"}
                </button>
              </form>
            )}

            {/* Step: OTP */}
            {step === "otp" && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3 text-center">Enter 6-digit OTP</label>
                  <div className="flex gap-2 justify-center">
                    {otp.map((digit, i) => (
                      <input
                        key={i}
                        ref={el => { otpRefs.current[i] = el; }}
                        type="text" inputMode="numeric" maxLength={1} value={digit}
                        onChange={e => handleOtpChange(i, e.target.value)}
                        onKeyDown={e => handleOtpKeyDown(i, e)}
                        className="w-11 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:outline-none focus:border-teal-500 transition-colors"
                      />
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => handleOtpVerify()} disabled={loading || otp.join("").length < 6}
                  className="w-full bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 size={18} className="animate-spin" /> : <ShieldCheck size={18} />}
                  {loading ? "Verifying..." : "Verify OTP"}
                </button>
                <button onClick={() => { setStep("phone"); setOtp(["","","","","",""]); setError(""); }}
                  className="w-full text-sm text-gray-500 hover:text-teal-600 flex items-center justify-center gap-1">
                  <ArrowLeft size={14} /> Change phone number
                </button>
              </div>
            )}

            {/* Step: Pending */}
            {step === "pending" && (
              <div className="text-center space-y-4">
                <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center mx-auto">
                  <Clock className="text-amber-600" size={28} />
                </div>
                <h3 className="font-bold text-gray-900">Application Under Review</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{pendingMsg}</p>
                <button onClick={() => { setStep("phone"); setPhone(""); setError(""); }}
                  className="text-sm text-teal-600 hover:underline flex items-center justify-center gap-1 mx-auto">
                  <ArrowLeft size={14} /> Try a different number
                </button>
              </div>
            )}

            <p className="text-center text-xs text-gray-400 mt-6">
              Not an operator yet?{" "}
              <Link to="/operator/apply" className="text-teal-600 font-bold hover:underline">Apply / Register here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OperatorLogin;
