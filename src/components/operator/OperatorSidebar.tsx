import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Users, Truck, Bike, TrendingUp, User, LogOut, MapPin, AlertTriangle
} from "lucide-react";
import { clearOperatorSession, getStoredOperatorData } from "../../services/operatorService";

const navItems = [
  { to: "/operator/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/operator/partners",  icon: Users,           label: "My Partners" },
  { to: "/operator/dispatch",  icon: Truck,           label: "Live Dispatch" },
  { to: "/operator/riders",    icon: Bike,            label: "Riders" },
  { to: "/operator/earnings",  icon: TrendingUp,      label: "Earnings" },
  { to: "/operator/profile",   icon: User,            label: "Profile" },
];

const OperatorSidebar = () => {
  const navigate = useNavigate();
  const operator = getStoredOperatorData();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const confirmLogout = () => {
    clearOperatorSession();
    navigate("/operator/login");
  };

  return (
    <aside className="w-64 min-h-screen bg-gradient-to-b from-teal-900 to-teal-800 flex flex-col shadow-xl">
      {/* Logo / Brand */}
      <div className="px-6 py-6 border-b border-teal-700">
        <h1 className="text-white text-xl font-bold tracking-tight">DoKirana</h1>
        <p className="text-teal-300 text-xs mt-0.5 font-medium">Operators Club</p>
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
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
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

      {/* Logout */}
      <div className="px-3 pb-6">
        <button
          onClick={() => setShowLogoutConfirm(true)}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-teal-200 hover:bg-red-600 hover:text-white transition-all duration-150"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    
      {/* Confirmation Modal */}
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
              Are you sure you want to sign out of the Operator Dashboard? You will need your mobile OTP to log back in.
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
                onClick={confirmLogout}
                className="flex-1 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-sm transition-colors flex items-center justify-center gap-1.5"
              >
                <LogOut size={14} />
                Yes, Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default OperatorSidebar;
