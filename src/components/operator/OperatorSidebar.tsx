import { NavLink } from "react-router-dom";
import {
  LayoutDashboard, Users, Truck, Bike, TrendingUp, User, MapPin
} from "lucide-react";
import { getStoredOperatorData } from "../../services/operatorService";

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

  return (
    <aside className="w-64 min-h-screen bg-gradient-to-b from-teal-900 to-teal-800 flex flex-col shadow-xl">
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

    </aside>
  );
};

export default OperatorSidebar;
