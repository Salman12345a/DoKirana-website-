import { 
  Store, 
  Package, 
  Layers, 
  Tag, 
  Receipt, 
  BookOpen, 
  Wallet, 
  CreditCard, 
  Truck, 
  Users2, 
  ShieldCheck,
  CheckCircle2,
  Download
} from 'lucide-react';

const DKBranchSection = () => {
  const branchCapabilities = [
    {
      icon: <Store className="w-6 h-6 text-dokirana-primary" />,
      title: "Digital Storefront",
      description: "Put your Kirana shop online with custom branding and instant catalog visibility for neighborhood customers."
    },
    {
      icon: <Package className="w-6 h-6 text-dokirana-primary" />,
      title: "Product Catalogue & Categories",
      description: "Comprehensive FMCG catalogue with barcode scanning, custom pricing, and rich categories."
    },
    {
      icon: <Layers className="w-6 h-6 text-dokirana-primary" />,
      title: "Inventory Management",
      description: "Real-time stock alerts, low-stock notifications, and automated quantity adjustments with every sale."
    },
    {
      icon: <Tag className="w-6 h-6 text-dokirana-primary" />,
      title: "Offers & Promotions",
      description: "Launch targeted discounts, combo deals, and festival offers to boost cart sizes and customer retention."
    },
    {
      icon: <Receipt className="w-6 h-6 text-dokirana-primary" />,
      title: "Order Processing",
      description: "Instant order alerts with rapid accept, pack, bill, and dispatch workflow on mobile or tablet."
    },
    {
      icon: <BookOpen className="w-6 h-6 text-dokirana-primary" />,
      title: "Digital Khata",
      description: "Replace paper registers with secure digital credit ledgers, automatic WhatsApp reminders, and payment tracking."
    },
    {
      icon: <Wallet className="w-6 h-6 text-dokirana-primary" />,
      title: "Merchant Wallet",
      description: "Consolidated wallet for payouts, customer cashbacks, subscription management, and settlements."
    },
    {
      icon: <CreditCard className="w-6 h-6 text-dokirana-primary" />,
      title: "Payment Tools & UPI",
      description: "Seamless QR code payments, UPI, cards, and cash-on-delivery reconciliation with zero hassle."
    },
    {
      icon: <Truck className="w-6 h-6 text-dokirana-primary" />,
      title: "Flexible Delivery",
      description: "Choose self-delivery by your store staff or click to request Operator-managed rider fulfillment."
    },
    {
      icon: <Users2 className="w-6 h-6 text-dokirana-primary" />,
      title: "Customer Management",
      description: "Detailed order histories, frequent shopper loyalty, and direct WhatsApp communication."
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-dokirana-primary" />,
      title: "Operator-Managed Delivery",
      description: "Direct tie-up with your local territory operator for on-demand dispatch and guaranteed delivery SLAs."
    }
  ];

  return (
    <section id="dkbranch" className="section-padding bg-white relative border-b border-gray-100">
      <div className="container-custom">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-dokirana-primary/10 text-dokirana-primary px-4 py-1.5 rounded-full mb-4">
            <Store size={15} />
            <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider">DKBranch Grocery Vertical</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-dokirana-primary mb-5 tracking-tight">
            Powering Local Grocery & Kirana Commerce
          </h2>
          <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
            DKBranch is the dedicated grocery operating system built specifically for traditional Kirana merchants, supermarkets, and local grocers.
          </p>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {branchCapabilities.map((item, index) => (
            <div
              key={index}
              className="bg-dokirana-lighter/50 hover:bg-dokirana-lighter p-6 rounded-2xl border border-dokirana-primary/10 transition-all duration-300 hover:shadow-md flex flex-col justify-start"
            >
              <div className="w-12 h-12 rounded-xl bg-white shadow-xs flex items-center justify-center mb-4 text-dokirana-primary border border-dokirana-primary/10">
                {item.icon}
              </div>
              <h3 className="text-lg font-bold text-dokirana-primary mb-2">
                {item.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        {/* Partner Box */}
        <div className="bg-gradient-to-r from-dokirana-primary to-[#4e1b82] text-white rounded-3xl p-8 sm:p-12 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-widest text-purple-200 bg-white/10 px-3 py-1 rounded-full">
              For Kirana Store Owners
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold mt-4 mb-3">
              Ready to take your Kirana store digital with DKBranch?
            </h3>
            <p className="text-purple-100 text-sm sm:text-base leading-relaxed mb-6">
              Join hundreds of retail merchants who are increasing daily sales, automating their Khata ledger, and servicing happy customers online.
            </p>
            <div className="flex flex-wrap gap-4 items-center">
              <a
                href="https://play.google.com/store/apps/details?id=com.dkbranch&pcampaignid=web_share"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-dokirana-primary hover:bg-purple-50 px-6 py-3.5 rounded-xl font-bold text-sm inline-flex items-center gap-2 shadow-md transition-all"
              >
                <Download size={18} />
                Download DKBranch Partner App
              </a>
              <a
                href="#contact"
                className="border border-white/40 hover:bg-white/10 text-white px-6 py-3.5 rounded-xl font-medium text-sm transition-all"
              >
                Request Store Demo
              </a>
            </div>
          </div>
          <div className="w-full lg:w-auto flex justify-center">
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 text-center max-w-xs">
              <div className="text-3xl font-extrabold text-white mb-1">Zero</div>
              <div className="text-purple-200 text-sm font-medium mb-3">Technical expertise needed</div>
              <div className="text-xs text-purple-100 border-t border-white/20 pt-3">
                Simple mobile interface with vernacular support & 24/7 partner assistance.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DKBranchSection;
