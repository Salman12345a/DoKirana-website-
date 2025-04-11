
import { Smartphone, Store, Truck } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      icon: <Smartphone className="w-12 h-12 text-dokirana-primary" />,
      title: "Order through the DoKirana app",
      description: "Browse products from your local Kirana stores and add items to your cart."
    },
    {
      icon: <Store className="w-12 h-12 text-dokirana-primary" />,
      title: "Kirana shopkeeper receives and prepares your order",
      description: "Your order is sent to the store where it's carefully prepared by the shopkeeper."
    },
    {
      icon: <Truck className="w-12 h-12 text-dokirana-primary" />,
      title: "Choose pickup or delivery",
      description: "Get your order delivered to your doorstep or pick it up from the store at your convenience."
    }
  ];

  return (
    <section id="how-it-works" className="section-padding bg-white">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-dokirana-primary mb-4">How It Works</h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Getting your groceries from local Kirana stores has never been easier. Follow these simple steps:
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow animate-fade-in"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="bg-dokirana-lighter w-20 h-20 rounded-full flex items-center justify-center mb-6 mx-auto">
                {step.icon}
              </div>
              <h3 className="text-xl font-semibold text-dokirana-primary mb-3 text-center">
                {index + 1}. {step.title}
              </h3>
              <p className="text-gray-700 text-center">{step.description}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <a href="#download" className="btn-primary">Download & Start Shopping</a>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
