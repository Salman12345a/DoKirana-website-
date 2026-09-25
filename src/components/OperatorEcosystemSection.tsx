import { Link } from 'react-router-dom';
import { 
  Shield, 
  Bike, 
  Store, 
  Utensils, 
  Users, 
  MapPin, 
  Cpu, 
  LayoutDashboard, 
  Radio, 
  Bell, 
  Receipt, 
  BarChart3, 
  Headphones, 
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

const OperatorEcosystemSection = () => {
  const operatorResponsibilities = [
    "Build local merchant relationships and maintain trusted connections",
    "Onboard local food establishments (DKEats) and Kirana stores (DKBranch)",
    "Recruit, roster, and manage neighborhood delivery riders",
    "Manage day-to-day delivery fulfillment & monitor dispatch SLAs",
    "Provide hands-on operational assistance and support to local merchants",
    "Operate within an assigned, protected pincode or territory"
  ];

  const platformCapabilities = [
    {
      icon: <Cpu className="w-5 h-5 text-teal-600" />,
      title: "Full Technology Suite",
      description: "Robust, enterprise-grade cloud ordering and dispatch infrastructure."
    },
    {
      icon: <Bike className="w-5 h-5 text-teal-600" />,
      title: "Rider Mobile App",
      description: "Dedicated Android app for delivery agents with live routing and POD."
    },
    {
      icon: <LayoutDashboard className="w-5 h-5 text-teal-600" />,
      title: "Operator Dashboard",
      description: "Comprehensive live control tower for partners, fleet, and territories."
    },
    {
      icon: <Radio className="w-5 h-5 text-teal-600" />,
      title: "Automated Dispatch",
      description: "Smart algorithmic delivery assignment optimizing transit time."
    },
    {
      icon: <Bell className="w-5 h-5 text-teal-600" />,
      title: "Real-time Notifications",
      description: "Instant order updates, dispatch pings, and delivery confirmations."
    },
    {
      icon: <Receipt className="w-5 h-5 text-teal-600" />,
      title: "Ledger & Payout Engine",
      description: "Automated fee accounting, handling fee splits, and weekly payouts."
    },
    {
      icon: <BarChart3 className="w-5 h-5 text-teal-600" />,
      title: "Territory Analytics",
      description: "Granular insights on volume trends, partner revenue, and fleet efficiency."
    },
    {
      icon: <Headphones className="w-5 h-5 text-teal-600" />,
      title: "Operational Support",
      description: "Dedicated account manager and technical backing from DKPoint HQ."
    }
  ];

  return (
    <section id="operators" className="section-padding bg-white relative border-b border-gray-100">
      <div className="container-custom">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-teal-50 text-teal-800 border border-teal-200 px-4 py-1.5 rounded-full mb-4">
            <Shield size={15} className="text-teal-600" />
            <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider">Local Operations & Delivery</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-dokirana-primary mb-5 tracking-tight">
            The Operator Ecosystem
          </h2>
          <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
            Operators are the local ground backbone of DKPoint, connecting food and grocery partners with trusted rider fleets for seamless neighborhood delivery.
          </p>
        </div>

        {/* The Connection Flow Visual */}
        <div className="bg-slate-50 border border-gray-200/80 rounded-3xl p-6 sm:p-8 mb-16 shadow-xs">
          <div className="text-center mb-6">
            <span className="text-xs font-bold uppercase tracking-widest text-teal-800 bg-teal-100 px-3 py-1 rounded-full">
              Fulfillment Architecture
            </span>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 max-w-4xl mx-auto">
            {/* Step 1: Merchants */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-xs text-center w-full md:w-56">
              <div className="flex justify-center gap-2 mb-2">
                <Utensils size={20} className="text-[#fd4914]" />
                <Store size={20} className="text-dokirana-primary" />
              </div>
              <div className="font-bold text-gray-900 text-sm">DKEats + DKBranch</div>
              <div className="text-xs text-gray-500 mt-1">Restaurants & Kirana Stores</div>
            </div>

            <div className="text-gray-400 font-bold hidden md:block">→</div>
            <div className="text-gray-400 font-bold md:hidden">↓</div>

            {/* Step 2: Local Operator */}
            <div className="bg-teal-50 border-2 border-teal-500/40 p-4 sm:p-5 rounded-2xl shadow-xs text-center w-full md:w-60">
              <div className="flex justify-center mb-2 text-teal-700">
                <Shield size={24} />
              </div>
              <div className="font-bold text-teal-900 text-sm">Local Operator</div>
              <div className="text-xs text-teal-700 mt-1">Territory & Dispatch Hub</div>
            </div>

            <div className="text-gray-400 font-bold hidden md:block">→</div>
            <div className="text-gray-400 font-bold md:hidden">↓</div>

            {/* Step 3: Rider Network */}
            <div className="bg-indigo-50 border border-indigo-200 p-4 sm:p-5 rounded-2xl shadow-xs text-center w-full md:w-56">
              <div className="flex justify-center mb-2 text-indigo-700">
                <Bike size={24} />
              </div>
              <div className="font-bold text-indigo-950 text-sm">Rider Network</div>
              <div className="text-xs text-indigo-700 mt-1">Local Delivery Fleet</div>
            </div>

            <div className="text-gray-400 font-bold hidden md:block">→</div>
            <div className="text-gray-400 font-bold md:hidden">↓</div>

            {/* Step 4: Customer */}
            <div className="bg-emerald-50 border border-emerald-200 p-4 sm:p-5 rounded-2xl shadow-xs text-center w-full md:w-56">
              <div className="flex justify-center mb-2 text-emerald-700">
                <Users size={24} />
              </div>
              <div className="font-bold text-emerald-950 text-sm">Doorstep Customer</div>
              <div className="text-xs text-emerald-700 mt-1">Fast & Reliable Drop</div>
            </div>
          </div>
        </div>

        {/* Two Columns: What Operator Does & What DKPoint Provides */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 items-start">
          {/* Left Column: What Operator Does */}
          <div className="lg:col-span-5 bg-teal-900 text-white p-8 rounded-3xl shadow-lg flex flex-col justify-between h-full">
            <div>
              <div className="inline-flex items-center gap-2 bg-teal-800 text-teal-100 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-4">
                <MapPin size={14} />
                Your Role as Operator
              </div>
              <h3 className="text-2xl font-bold mb-4">
                Run local commerce operations in your territory
              </h3>
              <p className="text-teal-200 text-sm leading-relaxed mb-6">
                Become the digital commerce franchise leader for your neighborhood. Earn subscription revenues and dispatch handling fees on every completed order.
              </p>

              <ul className="space-y-3.5 mb-8">
                {operatorResponsibilities.map((resp, index) => (
                  <li key={index} className="flex items-start text-sm text-teal-50">
                    <CheckCircle2 size={18} className="text-teal-400 mr-2.5 mt-0.5 flex-shrink-0" />
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-6 border-t border-teal-800 flex flex-wrap gap-3">
              <Link
                to="/operator/register"
                className="bg-white text-teal-950 hover:bg-teal-50 px-5 py-2.5 rounded-xl font-bold text-sm inline-flex items-center gap-2 shadow-sm transition-all"
              >
                Register as Operator <ArrowRight size={16} />
              </Link>
              <Link
                to="/operator/login"
                className="border border-teal-400 text-teal-100 hover:bg-teal-800/60 px-5 py-2.5 rounded-xl font-medium text-sm transition-all"
              >
                Operator Login
              </Link>
            </div>
          </div>

          {/* Right Column: What DKPoint Provides */}
          <div className="lg:col-span-7 bg-white p-8 rounded-3xl border border-gray-100 shadow-md">
            <div className="mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-dokirana-primary bg-dokirana-lighter px-3 py-1 rounded-full">
                DKPoint Infrastructure
              </span>
              <h3 className="text-2xl font-bold text-dokirana-primary mt-3">
                Everything DKPoint Powers For You
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                You bring local relationships and fleet management; DKPoint provides the entire technology, routing, and payment engine.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {platformCapabilities.map((cap, index) => (
                <div
                  key={index}
                  className="bg-slate-50 hover:bg-teal-50/50 p-4 rounded-xl border border-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-2.5 mb-1.5">
                    {cap.icon}
                    <h4 className="font-bold text-gray-900 text-sm">{cap.title}</h4>
                  </div>
                  <p className="text-gray-600 text-xs leading-relaxed pl-7">
                    {cap.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OperatorEcosystemSection;
