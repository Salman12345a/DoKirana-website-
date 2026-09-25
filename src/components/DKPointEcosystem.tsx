import { motion } from 'framer-motion';
import { ShoppingBag, Utensils, Shield, ArrowRight, Store, Bike, Users, ChevronDown } from 'lucide-react';

const DKPointEcosystem = () => {
  return (
    <section id="ecosystem" className="section-padding bg-slate-50/70 relative border-b border-gray-100">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-dokirana-primary/10 text-dokirana-primary px-4 py-1.5 rounded-full mb-4">
            <span className="w-2 h-2 rounded-full bg-dokirana-primary animate-pulse"></span>
            <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider">The DKPoint Ecosystem</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-dokirana-primary mb-5 tracking-tight">
            One Platform. Local Commerce.
          </h2>
          <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
            DKPoint connects local businesses, customers, riders and operators through one connected commerce ecosystem.
          </p>
        </div>

        {/* 3 Core Ecosystem Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {/* Card 1: DKEats */}
          <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl border border-gray-100 transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-[#fd4914]/10 flex items-center justify-center text-[#fd4914] group-hover:scale-110 transition-transform">
                  <Utensils className="w-7 h-7" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-[#fd4914]/10 text-[#fd4914]">
                  Food Vertical
                </span>
              </div>
              <h3 className="text-2xl font-bold text-dokirana-primary mb-3">DKEats</h3>
              <p className="text-gray-900 font-semibold mb-2">Powering local food and restaurant commerce</p>
              <p className="text-gray-600 text-sm leading-relaxed mb-6">
                Enabling restaurants, cafés, bakeries, and cloud kitchens with digital menus, online orders, kitchen workflows, and quick customer delivery.
              </p>
            </div>
            <a
              href="#dkeats"
              className="inline-flex items-center gap-2 text-sm font-bold text-[#fd4914] hover:opacity-80 group-hover:translate-x-1 transition-all"
            >
              Explore DKEats <ArrowRight size={16} />
            </a>
          </div>

          {/* Card 2: DKBranch */}
          <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl border border-gray-100 transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-dokirana-lighter flex items-center justify-center text-dokirana-primary group-hover:scale-110 transition-transform">
                  <ShoppingBag className="w-7 h-7" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-dokirana-lighter text-dokirana-primary">
                  Grocery Vertical
                </span>
              </div>
              <h3 className="text-2xl font-bold text-dokirana-primary mb-3">DKBranch</h3>
              <p className="text-gray-900 font-semibold mb-2">Powering local grocery and kirana commerce</p>
              <p className="text-gray-600 text-sm leading-relaxed mb-6">
                Equipping neighborhood Kirana stores with digital catalogues, real-time inventory, digital Khata ledger, and smart billing to compete and win.
              </p>
            </div>
            <a
              href="#dkbranch"
              className="inline-flex items-center gap-2 text-sm font-bold text-dokirana-primary hover:text-dokirana-light group-hover:translate-x-1 transition-all"
            >
              Explore DKBranch <ArrowRight size={16} />
            </a>
          </div>

          {/* Card 3: Operators */}
          <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl border border-gray-100 transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-700 group-hover:scale-110 transition-transform">
                  <Shield className="w-7 h-7" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-teal-50 text-teal-700">
                  Operations Layer
                </span>
              </div>
              <h3 className="text-2xl font-bold text-dokirana-primary mb-3">Operators</h3>
              <p className="text-gray-900 font-semibold mb-2">Connecting businesses with local delivery networks</p>
              <p className="text-gray-600 text-sm leading-relaxed mb-6">
                Local territory managers who onboard stores, coordinate neighborhood rider fleets, oversee live dispatch, and power high-speed local fulfillment.
              </p>
            </div>
            <a
              href="#operators"
              className="inline-flex items-center gap-2 text-sm font-bold text-teal-700 hover:text-teal-900 group-hover:translate-x-1 transition-all"
            >
              Explore Operators <ArrowRight size={16} />
            </a>
          </div>
        </div>

        {/* Visual Ecosystem Architecture (Diagram) */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-lg border border-gray-200/80 max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-xl sm:text-2xl font-bold text-dokirana-primary">
              How the DKPoint Ecosystem Connects
            </h3>
            <p className="text-gray-600 text-sm mt-1">
              An integrated local commerce network orchestrating demand, merchants, operations, and delivery.
            </p>
          </div>

          {/* Diagram Flow */}
          <div className="flex flex-col items-center">
            {/* Top: DKPoint */}
            <div className="bg-dokirana-primary text-white px-8 py-3.5 rounded-2xl shadow-md font-bold text-lg flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-white/40"></span>
              DKPoint
              <span className="text-xs font-normal text-purple-200 bg-white/10 px-2 py-0.5 rounded-full">Core Platform</span>
            </div>

            {/* Down Connector */}
            <div className="w-0.5 h-7 bg-gray-300 my-1"></div>

            {/* Split Horizontal Bar */}
            <div className="w-full max-w-md relative flex justify-between items-center">
              <div className="absolute top-0 left-1/4 right-1/4 h-0.5 bg-gray-300"></div>
              
              {/* Left Branch: DKEats (Food First) */}
              <div className="flex flex-col items-center w-1/2">
                <div className="w-0.5 h-6 bg-gray-300"></div>
                <div className="bg-[#fd4914]/5 border-2 border-[#fd4914]/30 text-gray-900 p-4 rounded-2xl text-center w-40 sm:w-48 shadow-xs">
                  <div className="flex justify-center mb-1 text-[#fd4914]">
                    <Utensils size={22} />
                  </div>
                  <div className="font-bold text-base text-[#fd4914]">DKEats</div>
                  <div className="text-xs text-gray-600 font-medium">Food / Restaurants</div>
                </div>
                <div className="w-0.5 h-6 bg-gray-300"></div>
              </div>

              {/* Right Branch: DKBranch (Grocery Second) */}
              <div className="flex flex-col items-center w-1/2">
                <div className="w-0.5 h-6 bg-gray-300"></div>
                <div className="bg-dokirana-lighter border-2 border-dokirana-primary/20 text-dokirana-primary p-4 rounded-2xl text-center w-40 sm:w-48 shadow-xs">
                  <div className="flex justify-center mb-1 text-dokirana-primary">
                    <Store size={22} />
                  </div>
                  <div className="font-bold text-base">DKBranch</div>
                  <div className="text-xs text-gray-600 font-medium">Grocery / Kirana</div>
                </div>
              </div>
            </div>

            {/* Merger Bar */}
            <div className="w-full max-w-md relative flex justify-center">
              <div className="w-1/2 border-b-2 border-gray-300 -mt-0.5"></div>
            </div>

            {/* Down Connector */}
            <div className="w-0.5 h-7 bg-gray-300 my-1"></div>

            {/* Operator Node */}
            <div className="bg-teal-50 border-2 border-teal-300 text-teal-900 px-6 py-3 rounded-2xl shadow-xs text-center w-64">
              <div className="flex items-center justify-center gap-2 font-bold text-base text-teal-800">
                <Shield size={18} className="text-teal-600" />
                Local Operator
              </div>
              <div className="text-xs text-teal-700 mt-0.5">Territory & Dispatch Management</div>
            </div>

            {/* Down Connector */}
            <div className="w-0.5 h-7 bg-gray-300 my-1"></div>

            {/* Rider Network Node */}
            <div className="bg-indigo-50 border border-indigo-200 text-indigo-900 px-6 py-2.5 rounded-2xl text-center w-56">
              <div className="flex items-center justify-center gap-2 font-semibold text-sm">
                <Bike size={16} className="text-indigo-600" />
                Rider Network
              </div>
              <div className="text-[11px] text-indigo-600">Local Delivery Fleet</div>
            </div>

            {/* Down Connector */}
            <div className="w-0.5 h-7 bg-gray-300 my-1"></div>

            {/* Customer Node */}
            <div className="bg-emerald-50 border-2 border-emerald-300 text-emerald-950 px-8 py-2.5 rounded-2xl text-center shadow-xs">
              <div className="flex items-center justify-center gap-2 font-bold text-sm text-emerald-800">
                <Users size={16} className="text-emerald-600" />
                Happy Customer
              </div>
              <div className="text-xs text-emerald-700">Convenient Doorstep Delivery & Pickup</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DKPointEcosystem;
