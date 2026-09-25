import { 
  Utensils, 
  Coffee, 
  Hotel, 
  Flame, 
  ChefHat, 
  QrCode, 
  Sliders, 
  Tag, 
  ShoppingBag, 
  Clock, 
  TrendingUp, 
  WalletCards, 
  Bike, 
  CheckCircle2, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

const DKEatsSection = () => {
  const establishments = [
    { label: "Restaurants", icon: <Utensils size={16} /> },
    { label: "Cafés", icon: <Coffee size={16} /> },
    { label: "Hotels", icon: <Hotel size={16} /> },
    { label: "Bakeries", icon: <Sparkles size={16} /> },
    { label: "Cloud Kitchens", icon: <ChefHat size={16} /> },
    { label: "Dhabas", icon: <Flame size={16} /> }
  ];

  const eatsFeatures = [
    {
      icon: <Utensils className="w-6 h-6 text-[#fd4914]" />,
      title: "Restaurant Discovery",
      description: "Get highlighted to local foodies looking for dine-in menus, quick takeout, or direct home delivery."
    },
    {
      icon: <QrCode className="w-6 h-6 text-[#fd4914]" />,
      title: "Digital Menus & QR Ordering",
      description: "Interactive contactless digital menus with appetizing photos, descriptions, and dietary badges."
    },
    {
      icon: <Sliders className="w-6 h-6 text-[#fd4914]" />,
      title: "Menu Customization & Variants",
      description: "Manage crust types, spice levels, portions, combos, and custom add-ons effortlessly."
    },
    {
      icon: <Tag className="w-6 h-6 text-[#fd4914]" />,
      title: "Targeted Offers & Discounts",
      description: "Create happy hour deals, flat discounts, festive coupons, and complimentary dish promotions."
    },
    {
      icon: <ShoppingBag className="w-6 h-6 text-[#fd4914]" />,
      title: "Online Ordering & Management",
      description: "Clean tablet/mobile POS interface to accept, modify, schedule, and process incoming food tickets."
    },
    {
      icon: <Clock className="w-6 h-6 text-[#fd4914]" />,
      title: "Kitchen Workflow (KOT)",
      description: "Kitchen order display and printing to streamline prep time, cook status, and dispatch handoffs."
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-[#fd4914]" />,
      title: "Sales Visibility & Analytics",
      description: "Live item-wise sales, peak hour analytics, customer preferences, and high-margin dish insights."
    },
    {
      icon: <WalletCards className="w-6 h-6 text-[#fd4914]" />,
      title: "Transparent Payout Tracking",
      description: "Daily automated settlements directly to your bank account with complete transparency on every order."
    },
    {
      icon: <Bike className="w-6 h-6 text-[#fd4914]" />,
      title: "Flexible Delivery Options",
      description: "Choose Self-delivery by your own staff or leverage Operator-managed dedicated delivery fleets."
    }
  ];

  return (
    <section id="dkeats" className="section-padding bg-slate-50/60 relative border-b border-gray-100">
      <div className="container-custom">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-[#fd4914]/10 text-[#fd4914] px-4 py-1.5 rounded-full mb-4 border border-[#fd4914]/20">
            <Utensils size={15} />
            <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider">DKEats Food Vertical</span>
          </div>
          
          <div className="flex items-center justify-center gap-3 mb-4">
            <img 
              src="/assets/dkeats-logo.png" 
              alt="DKEats Logo" 
              className="w-12 h-12 object-contain rounded-xl shadow-xs"
            />
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-dokirana-primary tracking-tight">
              Powering Local Food & Restaurant Commerce
            </h2>
          </div>

          <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
            DKEats is DKPoint's dedicated food ecosystem designed to empower local eateries with digital ordering, kitchen intelligence, and delivery dispatch.
          </p>

          {/* Establishments Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 mt-8">
            <span className="text-xs font-semibold text-gray-500 uppercase mr-1">Built for:</span>
            {establishments.map((est, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1.5 bg-white border border-gray-200 text-gray-800 text-xs sm:text-sm font-medium px-3.5 py-1.5 rounded-full shadow-2xs hover:border-[#fd4914]/50 hover:text-[#fd4914] transition-colors"
              >
                <span className="text-[#fd4914]">{est.icon}</span>
                {est.label}
              </span>
            ))}
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {eatsFeatures.map((feature, index) => (
            <div
              key={index}
              className="bg-white hover:border-[#fd4914]/30 p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-start group"
            >
              <div className="w-12 h-12 rounded-xl bg-[#fd4914]/10 flex items-center justify-center mb-4 text-[#fd4914] group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold text-dokirana-primary group-hover:text-[#fd4914] transition-colors mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Highlight Callout Box with Scoped DKEats Accent */}
        <div className="bg-gradient-to-r from-dokirana-primary via-[#411266] to-dokirana-primary text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-purple-900/40 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-[#fd4914] text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4 shadow-sm">
              Restaurant & Food Partner Onboarding
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold mb-3">
              Serve more diners with your own digital ordering channel
            </h3>
            <p className="text-purple-100 text-sm sm:text-base leading-relaxed mb-6">
              Retain your loyal customer base, manage dining and takeout in one place, and offer prompt delivery with zero exorbitant commission lock-ins.
            </p>
            <div className="flex flex-wrap gap-4 items-center">
              <a
                href="#contact"
                className="bg-[#fd4914] hover:bg-[#e03d0d] text-white px-7 py-3.5 rounded-xl font-bold text-sm inline-flex items-center gap-2 shadow-lg shadow-[#fd4914]/30 transition-all transform hover:-translate-y-0.5"
              >
                Join DKEats as Food Partner
                <ArrowRight size={17} />
              </a>
              <a
                href="#how-it-works"
                className="border border-white/40 hover:bg-white/10 text-white px-6 py-3.5 rounded-xl font-medium text-sm transition-all"
              >
                How Delivery Works
              </a>
            </div>
          </div>

          <div className="w-full lg:w-auto flex justify-center">
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 text-center max-w-xs">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#fd4914] animate-pulse"></span>
                <span className="text-sm font-semibold text-white">Self or Operator Delivery</span>
              </div>
              <p className="text-xs text-purple-100 leading-relaxed border-t border-white/20 pt-3">
                Deliver using your in-house staff, or let local DKPoint Operators take care of quick doorstep drops.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DKEatsSection;
