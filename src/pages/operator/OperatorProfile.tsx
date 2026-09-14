import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Phone,
  Mail,
  MapPin,
  Building,
  CreditCard,
  ShieldCheck,
  Calendar,
  LogOut,
  Loader2,
  AlertCircle,
  Users,
} from "lucide-react";
import {
  getProfile,
  clearOperatorSession,
  OperatorProfile as ProfileType,
} from "../../services/operatorService";

const OperatorProfile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getProfile();
        if ((res.status?.toLowerCase() === "success") && res.operator) {
          setProfile(res.operator);
        } else {
          setError((res as { message?: string }).message || "Failed to load operator profile");
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Failed to load profile";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const handleLogout = () => {
    clearOperatorSession();
    navigate("/operator/login");
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-teal-600 animate-spin mb-3" />
        <p className="text-sm text-gray-500">Loading your profile information...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Card */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-teal-700 to-teal-500 text-white flex items-center justify-center text-2xl font-bold shadow-md shadow-teal-500/20">
              {profile?.name?.charAt(0).toUpperCase() || "O"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-gray-900">{profile?.name || "Operator"}</h2>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                  <ShieldCheck size={12} />
                  Verified Operator
                </span>
                <span className="inline-flex items-center text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-900 border border-teal-200">
                  {profile?.operatorId || "DK-OP-1001"}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1 flex items-center gap-1.5 font-mono">
                <Phone size={12} className="text-gray-400" />
                {profile?.phone}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowLogoutConfirm(true)}
            className="flex items-center gap-2 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-4 py-2 rounded-xl border border-rose-200 transition-colors self-start sm:self-auto"
          >
            <LogOut size={14} />
            Sign Out
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 text-red-800 rounded-xl text-xs flex items-center gap-2 border border-red-200">
            <AlertCircle size={15} className="text-red-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Territory Allocation (Read-only security notice) */}
        <div className="mt-6">
          <h3 className="text-xs uppercase tracking-wider font-bold text-gray-400 mb-3">
            Assigned Territory (Locked)
          </h3>
          <div className="p-4 rounded-xl bg-teal-50/60 border border-teal-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <MapPin size={20} className="text-teal-700 mt-0.5" />
              <div>
                <p className="font-bold text-teal-950 text-sm">
                  {profile?.area || "Designated Zone"}, {profile?.city || "City"}
                </p>
                <p className="text-xs text-teal-700 mt-0.5">
                  Exclusive Operator Territory PIN: <span className="font-mono font-bold">{profile?.pincode}</span>
                </p>
              </div>
            </div>
            <span className="text-[11px] bg-teal-100 text-teal-800 font-semibold px-2.5 py-1 rounded-lg self-start sm:self-auto">
              Admin Assigned
            </span>
          </div>
        </div>

        {/* Banking & Payout Credentials */}
        <div className="mt-8">
          <h3 className="text-xs uppercase tracking-wider font-bold text-gray-400 mb-3">
            Settlement & Bank Details
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-gray-100 bg-gray-50/70 space-y-1">
              <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                <CreditCard size={14} className="text-gray-400" />
                Bank Account Number
              </div>
              <p className="font-mono font-bold text-gray-900 text-sm">
                {profile?.bankAccountNumber ? `••••••••${profile.bankAccountNumber.slice(-4)}` : "Not provided"}
              </p>
              {profile?.bankIfscCode && (
                <p className="text-[11px] text-gray-400 font-mono">IFSC: {profile.bankIfscCode}</p>
              )}
            </div>

            <div className="p-4 rounded-xl border border-gray-100 bg-gray-50/70 space-y-1">
              <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                <Building size={14} className="text-gray-400" />
                UPI ID (Instant Settlement)
              </div>
              <p className="font-mono font-bold text-gray-900 text-sm">
                {profile?.upiId || "Not provided"}
              </p>
              <p className="text-[11px] text-gray-400">Weekly automated revenue payout</p>
            </div>
          </div>
        </div>

        {/* Account Metadata */}
        <div className="mt-8 pt-6 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <Users size={15} className="text-teal-600" />
            <span>Active Partners: <strong className="text-gray-900">{profile?.activeSubscriberCount ?? 0}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={15} className="text-teal-600" />
            <span>Joined: {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString("en-IN", { month: "short", year: "numeric" }) : "Recently"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail size={15} className="text-teal-600" />
            <span className="truncate">{profile?.email || "No email on file"}</span>
          </div>
        </div>
      </div>

      {/* Sign Out Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 max-w-sm w-full p-6 text-center animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4 border border-rose-100">
              <AlertTriangle size={24} />
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-1">
              Sign Out Confirmation
            </h3>
            <p className="text-xs text-gray-500 mb-6 leading-relaxed">
              Are you sure you want to sign out of the Operator Dashboard? You will need to verify with OTP to log back in.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-xs font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="flex-1 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-sm transition-colors flex items-center justify-center gap-1.5"
              >
                <LogOut size={14} />
                Yes, Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OperatorProfile;