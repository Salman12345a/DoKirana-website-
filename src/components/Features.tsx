
import { CheckCircle } from 'lucide-react';

const Features = () => {
  const customerFeatures = [
    "Browse products from multiple local Kirana stores",
    "Create shopping lists for quick reordering",
    "Track order status in real-time",
    "Flexible payment options",
    "Schedule deliveries at convenient times",
    "Save favorite products and stores"
  ];
  
  const storeFeatures = [
    "Simple order management system",
    "Inventory tracking and updates",
    "Customer insights and analytics",
    "Marketing tools to attract more customers",
    "Easy payment collection",
    "Delivery coordination"
  ];

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-dokirana-primary mb-4">Powerful Features for Everyone</h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            DoKirana offers an intuitive experience for both customers and store owners.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Customer Features */}
          <div className="bg-dokirana-lighter p-8 rounded-xl animate-fade-in">
            <div className="flex items-center justify-center mb-8">
              <img 
                src="/lovable-uploads/fb48dfd0-69fe-4e9b-b085-d8a0cce0f63f.png" 
                alt="Customer App Interface" 
                className="max-w-full h-auto rounded-lg shadow-md"
              />
            </div>
            <h3 className="text-2xl font-semibold text-dokirana-primary text-center mb-6">For Customers</h3>
            <ul className="space-y-4">
              {customerFeatures.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle className="text-dokirana-primary mr-3 mt-0.5 flex-shrink-0" size={20} />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Store Owner Features */}
          <div className="bg-dokirana-lighter p-8 rounded-xl animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <div className="flex items-center justify-center mb-8">
              <img 
                src="/lovable-uploads/896ffabb-96c9-4710-b03b-867e60339335.png" 
                alt="Store Owner App Interface" 
                className="max-w-full h-auto rounded-lg shadow-md"
              />
            </div>
            <h3 className="text-2xl font-semibold text-dokirana-primary text-center mb-6">For Store Owners</h3>
            <ul className="space-y-4">
              {storeFeatures.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle className="text-dokirana-primary mr-3 mt-0.5 flex-shrink-0" size={20} />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
