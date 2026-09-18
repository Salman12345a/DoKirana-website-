import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Shield,
  Store,
  UtensilsCrossed,
  Truck,
  IndianRupee,
  Sparkles,
  ArrowRight,
  Calculator,
  CheckCircle2,
  Lock,
  ChevronRight,
  FileCheck,
  Building,
} from "lucide-react";

const steps = [
  {
    step: "1",
    title: "Apply Online",
    desc: "Submit your details & upload identity proofs (PAN, Aadhaar, Bank Proof) on our secure verification portal.",
  },
  {
    step: "2",
    title: "Territory Verification",
    desc: "Our operations desk verifies your pincode exclusivity and compliance documents within 48 hours.",
  },
  {
    step: "3",
    title: "Start Earning",
    desc: "Link kirana stores & hotels in your pincode — earn ₹299/mo per partner plus per-order delivery dispatch fees.",
  },
];

const PRESETS = [
  { label: "Starter Zone", kiranas: 5, hotels: 3, ordersPerHotel: 10 },
  { label: "Active Suburb", kiranas: 15, hotels: 8, ordersPerHotel: 20 },
  { label: "Busy Commercial Hub", kiranas: 30, hotels: 15, ordersPerHotel: 35 },
];

const OperatorRegister = () => {
  // Earnings Calculator State
  const [kiranaCount, setKiranaCount] = useState(10);
  const [hotelCount, setHotelCount] = useState(5);
  const [ordersPerHotelDaily, setOrdersPerHotelDaily] = useState(15);

  // Earnings calculations
  const kiranaSubEarnings = kiranaCount * 299;
  const hotelSubEarnings = hotelCount * 299;
  const totalSubEarnings = kiranaSubEarnings + hotelSubEarnings;

  const dailyHotelOrders = hotelCount * ordersPerHotelDaily;
  const monthlyHotelOrders = dailyHotelOrders * 30;
  const monthlyHandlingEarnings = monthlyHotelOrders * 1; // ₹1/food order

  const totalMonthlyEarnings = totalSubEarnings + monthlyHandlingEarnings;
  const totalYearlyEarnings = totalMonthlyEarnings * 12;

  const applyPreset = (preset: typeof PRESETS[0]) => {
    setKiranaCount(preset.kiranas);
    setHotelCount(preset.hotels);
    setOrdersPerHotelDaily(preset.ordersPerHotel);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-teal-950 via-teal-900 to-teal-800 text-white pt-28 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <span className="inline-flex items-center gap-1.5 bg-teal-800/80 text-teal-200 text-xs font-semibold px-4 py-1.5 rounded-full mb-6 tracking-wider uppercase border border-teal-600/40 backdrop-blur-sm shadow-sm">
            <Shield size={13} className="text-teal-400" />
            DK Point Operators Club
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight mb-6">
            Own Your Territory.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-200 via-emerald-300 to-teal-100">
              Build Monthly Recurring Income.
            </span>
          </h1>
          <p className="text-teal-100/90 text-base md:text-lg max-w-2xl mx-auto leading-relaxed mb-10">
            Become an exclusive Area Operator for your pincode. Coordinate deliveries for neighborhood kiranas and restaurants — keep 100% of partner subscription fees plus per-order handling fees.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto mb-10">
            <div className="bg-teal-900/40 border border-teal-700/40 rounded-2xl p-5 backdrop-blur-sm">
              <p className="text-3xl md:text-4xl font-black text-emerald-300">₹299</p>
              <p className="text-teal-100 text-xs font-medium mt-1">Per Partner Every Month</p>
              <p className="text-teal-300/70 text-[11px] mt-0.5">100% credited to you</p>
            </div>
            <div className="bg-teal-900/40 border border-teal-700/40 rounded-2xl p-5 backdrop-blur-sm">
              <p className="text-3xl md:text-4xl font-black text-teal-200">₹1</p>
              <p className="text-teal-100 text-xs font-medium mt-1">Per Food Order Handled</p>
              <p className="text-teal-300/70 text-[11px] mt-0.5">Dispatched via your fleet</p>
            </div>
            <div className="bg-teal-900/40 border border-teal-700/40 rounded-2xl p-5 backdrop-blur-sm">
              <p className="text-3xl md:text-4xl font-black text-amber-300">100%</p>
              <p className="text-teal-100 text-xs font-medium mt-1">Pincode Exclusivity</p>
              <p className="text-teal-300/70 text-[11px] mt-0.5">First-come territory rights</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/operator/apply"
              className="bg-emerald-400 hover:bg-emerald-300 text-teal-950 font-extrabold px-7 py-3.5 rounded-xl transition-all shadow-lg shadow-emerald-500/20 text-sm flex items-center gap-2"
            >
              Start Operator Registration
              <ArrowRight size={16} />
            </Link>
            <a
              href="#calculator"
              className="bg-teal-800/80 hover:bg-teal-800 text-white font-semibold px-6 py-3.5 rounded-xl transition-all border border-teal-600/50 text-sm flex items-center gap-2"
            >
              <Calculator size={16} />
              Calculate Your Earnings
            </a>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-5xl mx-auto py-20 px-4">
        <div className="text-center max-w-xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-100">
            Simple 3-Step Onboarding
          </span>
          <h2 className="text-3xl font-extrabold text-gray-900 mt-3">How The Operator Model Works</h2>
          <p className="text-gray-500 text-sm mt-2">
            No heavy upfront capital required. You coordinate fulfillment using local delivery partners.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((s) => (
            <div
              key={s.step}
              className="bg-gray-50/70 rounded-2xl border border-gray-100 p-8 text-center hover:shadow-md transition-shadow relative"
            >
              <div className="w-12 h-12 rounded-2xl bg-teal-700 text-white text-lg font-bold flex items-center justify-center mx-auto mb-5 shadow-md shadow-teal-700/20">
                {s.step}
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">{s.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Earnings Calculator */}
      <section id="calculator" className="bg-gradient-to-b from-teal-50/70 to-emerald-50/40 py-20 px-4 border-y border-teal-100/80">
        <div className="max-w-4xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-100/70 px-3 py-1 rounded-full border border-teal-200">
              <Sparkles size={13} className="text-teal-600" />
              Interactive Income Modeler
            </span>
            <h2 className="text-3xl font-extrabold text-gray-900 mt-3">Estimate Your Territory Revenue</h2>
            <p className="text-gray-600 text-sm mt-2">
              Adjust the sliders below for kiranas, hotels/restaurants, and daily order volumes to project your monthly take-home.
            </p>

            {/* Presets */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
              <span className="text-xs text-gray-500 font-medium mr-1">Quick Scenarios:</span>
              {PRESETS.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => applyPreset(p)}
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white hover:bg-teal-50 text-teal-800 border border-teal-200/80 transition-all shadow-sm"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-xl border border-teal-100/80 p-6 sm:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Sliders Side */}
              <div className="lg:col-span-7 space-y-7">
                {/* 1. Kirana Stores Slider */}
                <div className="bg-gray-50/80 p-5 rounded-2xl border border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-800">
                      <div className="w-7 h-7 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center">
                        <Store size={16} />
                      </div>
                      Kirana Stores in Pincode
                    </label>
                    <span className="text-lg font-black text-teal-800 bg-teal-50 px-3 py-0.5 rounded-lg border border-teal-200/60 font-mono">
                      {kiranaCount} <span className="text-xs font-semibold text-teal-600">stores</span>
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={50}
                    step={1}
                    value={kiranaCount}
                    onChange={(e) => setKiranaCount(Number(e.target.value))}
                    className="w-full accent-teal-600 h-2 bg-gray-200 rounded-lg cursor-pointer mt-2"
                  />
                  <div className="flex justify-between text-[11px] text-gray-400 mt-1 font-medium">
                    <span>0 stores</span>
                    <span className="text-teal-700 font-semibold">₹299 / store / mo</span>
                    <span>50 stores</span>
                  </div>
                </div>

                {/* 2. Hotel & Restaurant Slider */}
                <div className="bg-gray-50/80 p-5 rounded-2xl border border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-800">
                      <div className="w-7 h-7 rounded-lg bg-orange-100 text-orange-700 flex items-center justify-center">
                        <UtensilsCrossed size={16} />
                      </div>
                      Hotels & Restaurants
                    </label>
                    <span className="text-lg font-black text-orange-800 bg-orange-50 px-3 py-0.5 rounded-lg border border-orange-200/60 font-mono">
                      {hotelCount} <span className="text-xs font-semibold text-orange-600">hotels</span>
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={50}
                    step={1}
                    value={hotelCount}
                    onChange={(e) => setHotelCount(Number(e.target.value))}
                    className="w-full accent-orange-600 h-2 bg-gray-200 rounded-lg cursor-pointer mt-2"
                  />
                  <div className="flex justify-between text-[11px] text-gray-400 mt-1 font-medium">
                    <span>0 hotels</span>
                    <span className="text-orange-700 font-semibold">₹299 / hotel / mo</span>
                    <span>50 hotels</span>
                  </div>
                </div>

                {/* 3. Daily Orders per Hotel Slider */}
                <div className="bg-gray-50/80 p-5 rounded-2xl border border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-800">
                      <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                        <Truck size={16} />
                      </div>
                      Avg. Orders / Day per Hotel
                    </label>
                    <span className="text-lg font-black text-blue-800 bg-blue-50 px-3 py-0.5 rounded-lg border border-blue-200/60 font-mono">
                      {ordersPerHotelDaily} <span className="text-xs font-semibold text-blue-600">orders</span>
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={5}
                    value={ordersPerHotelDaily}
                    onChange={(e) => setOrdersPerHotelDaily(Number(e.target.value))}
                    className="w-full accent-blue-600 h-2 bg-gray-200 rounded-lg cursor-pointer mt-2"
                  />
                  <div className="flex justify-between text-[11px] text-gray-400 mt-1 font-medium">
                    <span>0 orders/day</span>
                    <span className="text-blue-700 font-semibold">₹1 handling fee per food order</span>
                    <span>100 orders/day</span>
                  </div>
                </div>
              </div>

              {/* Earnings Result Display Card */}
              <div className="lg:col-span-5 bg-gradient-to-br from-teal-900 to-teal-800 rounded-2xl p-6 sm:p-7 text-white shadow-xl border border-teal-700 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-4 border-b border-teal-700/60">
                    <span className="text-xs font-bold uppercase tracking-wider text-teal-300">
                      Projected Take-Home
                    </span>
                    <span className="text-[11px] bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-md font-semibold">
                      Monthly Recurring
                    </span>
                  </div>

                  {/* Big Number */}
                  <div className="my-5">
                    <p className="text-xs text-teal-200">Estimated Total Income</p>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                        ₹{totalMonthlyEarnings.toLocaleString("en-IN")}
                      </span>
                      <span className="text-teal-300 text-sm font-medium">/ month</span>
                    </div>
                    <p className="text-xs text-emerald-300 mt-1.5 flex items-center gap-1 font-medium">
                      <Sparkles size={13} />
                      ₹{totalYearlyEarnings.toLocaleString("en-IN")} / year run-rate
                    </p>
                  </div>

                  {/* Itemized Breakdown */}
                  <div className="space-y-3 pt-4 border-t border-teal-700/60 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-teal-200 flex items-center gap-1.5">
                        <Store size={13} className="text-teal-400" />
                        Kirana Subscriptions ({kiranaCount} × ₹299)
                      </span>
                      <span className="font-bold text-white font-mono">
                        ₹{kiranaSubEarnings.toLocaleString("en-IN")}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-teal-200 flex items-center gap-1.5">
                        <UtensilsCrossed size={13} className="text-orange-400" />
                        Hotel Subscriptions ({hotelCount} × ₹299)
                      </span>
                      <span className="font-bold text-white font-mono">
                        ₹{hotelSubEarnings.toLocaleString("en-IN")}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-teal-200 flex items-center gap-1.5">
                        <Truck size={13} className="text-blue-400" />
                        Food Order Handling ({monthlyHotelOrders.toLocaleString("en-IN")} orders × ₹1)
                      </span>
                      <span className="font-bold text-white font-mono">
                        ₹{monthlyHandlingEarnings.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-teal-700/60">
                  <p className="text-[11px] text-teal-200/80 leading-relaxed mb-4">
                    Based on {dailyHotelOrders} orders/day across {hotelCount} restaurants plus {kiranaCount + hotelCount} active partner subscriptions in your territory.
                  </p>
                  <Link
                    to="/operator/apply"
                    className="w-full flex items-center justify-center gap-2 bg-emerald-400 hover:bg-emerald-300 text-teal-950 font-bold py-3 rounded-xl text-sm transition-all shadow-md"
                  >
                    Proceed to Registration
                    <ArrowRight size={15} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Verification Requirements Breakdown Section */}
      <section className="max-w-4xl mx-auto py-20 px-4">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-100">
            Compliance & Verification
          </span>
          <h2 className="text-3xl font-extrabold text-gray-900 mt-3">What You Will Need to Register</h2>
          <p className="text-gray-500 text-sm mt-2">
            To ensure trust and fraud prevention, operators undergo a swift 4-step verified onboarding.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl border border-gray-200 bg-gray-50/50 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center flex-shrink-0">
              <FileCheck size={20} />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm">PAN Card</p>
              <p className="text-xs text-gray-500 mt-0.5">
                Tax and legal entity identification. Upload clear photo/PDF of your PAN card.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-gray-200 bg-gray-50/50 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center flex-shrink-0">
              <Shield size={20} />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm">Aadhaar / Officially Valid ID</p>
              <p className="text-xs text-gray-500 mt-0.5">
                Government photo ID for identity and address verification.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-gray-200 bg-gray-50/50 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center flex-shrink-0">
              <Building size={20} />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm">Bank Account Proof</p>
              <p className="text-xs text-gray-500 mt-0.5">
                Passbook photo or cancelled cheque displaying operator name and account details.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-gray-200 bg-gray-50/50 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center flex-shrink-0">
              <Lock size={20} />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm">Selfie & Territory Pincode</p>
              <p className="text-xs text-gray-500 mt-0.5">
                Live selfie photo for anti-fraud security and your chosen 6-digit territory pincode.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Card leading to dedicated application page */}
        <div className="mt-14 bg-gradient-to-r from-teal-900 via-teal-800 to-teal-700 rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-300 bg-teal-950/40 px-3 py-1 rounded-full border border-teal-600/40">
              Ready to Claim Your Territory?
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold mt-3">
              Open Your Operator Application
            </h3>
            <p className="text-teal-100/90 text-sm max-w-lg mt-2 leading-relaxed">
              Fill out the dedicated registration form, upload your verification documents, and get approved within 48 hours.
            </p>
          </div>

          <Link
            to="/operator/apply"
            className="flex items-center gap-2 bg-emerald-400 hover:bg-emerald-300 text-teal-950 font-extrabold px-8 py-4 rounded-2xl text-sm transition-all shadow-lg shadow-emerald-500/20 whitespace-nowrap self-stretch md:self-auto justify-center"
          >
            Apply on Verification Portal
            <ArrowRight size={17} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default OperatorRegister;
