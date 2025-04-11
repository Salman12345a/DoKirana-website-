
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CTASection from "../components/CTASection";
import AppDownload from "../components/AppDownload";
import { ChevronRight, Smartphone, CreditCard, Clock, CheckCircle, Store, Truck, ShieldCheck, Bell, Package, ShoppingBag } from "lucide-react";

const HowItWorksPage = () => {
  const customerSteps = [
    {
      icon: <Smartphone className="w-12 h-12 text-white" />,
      title: "Download & Register",
      description: "Download the DoKirana app from the App Store or Google Play and create your account with simple steps."
    },
    {
      icon: <Store className="w-12 h-12 text-white" />,
      title: "Browse Local Stores",
      description: "Find Kirana stores near you and browse their available products by category."
    },
    {
      icon: <ShoppingBag className="w-12 h-12 text-white" />,
      title: "Add Items to Cart",
      description: "Select the products you want to purchase and add them to your shopping cart."
    },
    {
      icon: <CreditCard className="w-12 h-12 text-white" />,
      title: "Checkout & Payment",
      description: "Review your order, choose pickup or delivery, and select your preferred payment method."
    },
    {
      icon: <Clock className="w-12 h-12 text-white" />,
      title: "Order Processing",
      description: "The Kirana store receives your order and begins preparing it for pickup or delivery."
    },
    {
      icon: <Truck className="w-12 h-12 text-white" />,
      title: "Receive Your Order",
      description: "Get your groceries delivered to your doorstep or pick them up at your convenience."
    }
  ];
  
  const storeSteps = [
    {
      icon: <Smartphone className="w-12 h-12 text-white" />,
      title: "Join the Network",
      description: "Download the DoKirana Partner app and complete the registration process for your store."
    },
    {
      icon: <ShieldCheck className="w-12 h-12 text-white" />,
      title: "Verification",
      description: "Our team verifies your store details and helps set up your digital storefront."
    },
    {
      icon: <Store className="w-12 h-12 text-white" />,
      title: "Manage Inventory",
      description: "Add your products, prices, and available quantities to your digital store inventory."
    },
    {
      icon: <Bell className="w-12 h-12 text-white" />,
      title: "Receive Orders",
      description: "Get notified instantly when customers place orders for your products."
    },
    {
      icon: <Package className="w-12 h-12 text-white" />,
      title: "Process Orders",
      description: "Prepare orders for pickup or delivery according to customer preferences."
    },
    {
      icon: <CreditCard className="w-12 h-12 text-white" />,
      title: "Get Paid",
      description: "Receive secure payments directly to your account with transparent transactions."
    }
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main>
        {/* Hero Section */}
        <section className="pt-28 pb-16 md:pt-36 md:pb-24 bg-dokirana-lighter">
          <div className="container-custom">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold text-dokirana-primary mb-6">How DoKirana Works</h1>
              <p className="text-lg md:text-xl text-gray-700 mb-6">A detailed look at the process for both customers and store owners.</p>
              <div className="flex justify-center gap-2 items-center text-dokirana-primary">
                <a href="/" className="hover:underline">Home</a>
                <ChevronRight size={16} />
                <span>How It Works</span>
              </div>
            </div>
          </div>
        </section>
        
        {/* Customer Journey */}
        <section className="section-padding bg-white">
          <div className="container-custom">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-dokirana-primary mb-4">Customer Journey</h2>
              <p className="text-lg text-gray-700 max-w-2xl mx-auto">
                Experience the convenience of ordering from your local Kirana stores in just a few simple steps.
              </p>
            </div>
            
            <div className="relative">
              <div className="hidden lg:block absolute left-1/2 top-0 h-full w-1 bg-dokirana-lighter transform -translate-x-1/2"></div>
              
              <div className="space-y-12">
                {customerSteps.map((step, index) => (
                  <div key={index} className="relative">
                    <div className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-8`}>
                      <div className="hidden lg:flex items-center justify-center w-8">
                        <div className="w-8 h-8 rounded-full bg-dokirana-primary text-white flex items-center justify-center font-medium z-10">
                          {index + 1}
                        </div>
                      </div>
                      
                      <div className={`w-full lg:w-5/12 p-6 bg-dokirana-lighter rounded-xl ${index % 2 === 0 ? 'lg:text-right' : 'lg:text-left'}`}>
                        <h3 className="text-xl font-semibold text-dokirana-primary mb-3">{step.title}</h3>
                        <p className="text-gray-700">{step.description}</p>
                      </div>
                      
                      <div className="lg:hidden flex items-center justify-center">
                        <div className="w-8 h-8 rounded-full bg-dokirana-primary text-white flex items-center justify-center font-medium">
                          {index + 1}
                        </div>
                      </div>
                      
                      <div className={`w-full lg:w-5/12 flex ${index % 2 === 0 ? 'lg:justify-start' : 'lg:justify-end'} items-center`}>
                        <div className="bg-dokirana-primary w-20 h-20 rounded-full flex items-center justify-center shadow-lg">
                          {step.icon}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-16 text-center bg-dokirana-lighter p-8 rounded-xl">
              <h3 className="text-2xl font-semibold text-dokirana-primary mb-4">Customer App Features</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  "Store search and filtering",
                  "Product categories and search",
                  "Shopping lists and favorites",
                  "Real-time order tracking",
                  "Multiple payment options",
                  "Order history and reordering",
                  "Store ratings and reviews",
                  "Special offers and discounts",
                  "Scheduled deliveries"
                ].map((feature, index) => (
                  <div key={index} className="flex items-start">
                    <CheckCircle className="text-dokirana-primary mr-2 mt-1 flex-shrink-0" size={18} />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        
        {/* Store Owner Process */}
        <section className="section-padding gradient-bg text-white">
          <div className="container-custom">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Store Owner Process</h2>
              <p className="text-lg max-w-2xl mx-auto">
                Join the DoKirana network and transform your Kirana store with our simple digital platform.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {storeSteps.map((step, index) => (
                <div 
                  key={index} 
                  className="bg-white/10 backdrop-blur-sm p-8 rounded-xl border border-white/20 hover:bg-white/20 transition-colors"
                >
                  <div className="bg-dokirana-primary w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto relative">
                    <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white text-dokirana-primary flex items-center justify-center font-bold">
                      {index + 1}
                    </span>
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-center">{step.title}</h3>
                  <p className="text-white/90 text-center">{step.description}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-16 text-center">
              <a href="#download" className="btn-primary bg-white text-dokirana-primary hover:bg-dokirana-lighter">Become a Partner</a>
            </div>
          </div>
        </section>
        
        {/* Payment & Security */}
        <section className="section-padding bg-white">
          <div className="container-custom">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-dokirana-primary mb-4">Payment & Security</h2>
              <p className="text-lg text-gray-700 max-w-2xl mx-auto">
                We prioritize secure transactions and offer flexible payment options for your convenience.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-semibold text-dokirana-primary mb-6">Payment Options</h3>
                <ul className="space-y-4">
                  {[
                    "Credit & Debit Cards",
                    "UPI Payments",
                    "Mobile Wallets",
                    "Cash on Delivery",
                    "Net Banking"
                  ].map((option, index) => (
                    <li key={index} className="flex items-center">
                      <CheckCircle className="text-dokirana-primary mr-3" size={20} />
                      <span className="text-gray-700">{option}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="text-2xl font-semibold text-dokirana-primary mb-6">Security Measures</h3>
                <ul className="space-y-4">
                  {[
                    "End-to-end encrypted transactions",
                    "Secure payment gateways",
                    "No storage of sensitive card information",
                    "Verified store partners",
                    "Privacy-focused data handling"
                  ].map((measure, index) => (
                    <li key={index} className="flex items-center">
                      <ShieldCheck className="text-dokirana-primary mr-3" size={20} />
                      <span className="text-gray-700">{measure}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
        
        <AppDownload />
        <CTASection />
      </main>
      
      <Footer />
    </div>
  );
};

export default HowItWorksPage;
