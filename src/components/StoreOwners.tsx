
const StoreOwners = () => {
  const benefits = [
    "Expand your customer base beyond your physical location",
    "Increase sales with additional online orders",
    "Simple order management system - no technical expertise required",
    "Valuable customer insights and analytics",
    "Build customer loyalty with consistent digital presence",
    "Free marketing and promotion through the DoKirana platform"
  ];

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-dokirana-primary mb-4">For Kirana Store Owners</h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Join the DoKirana network and grow your business by reaching more customers digitally.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <h3 className="text-2xl font-semibold text-dokirana-primary mb-6">Benefits of Joining DoKirana</h3>
            
            <ul className="space-y-4 mb-8">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-center">
                  <span className="bg-dokirana-primary text-white w-6 h-6 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                    {index + 1}
                  </span>
                  <span className="text-gray-700">{benefit}</span>
                </li>
              ))}
            </ul>
            
            <div className="bg-dokirana-lighter p-6 rounded-lg mb-8">
              <h4 className="text-lg font-medium text-dokirana-primary mb-3">Simple Onboarding Process</h4>
              <p className="text-gray-700">
                Getting started with DoKirana is easy. Download the Partner app, complete your registration, and our team will guide you through the setup process.
              </p>
            </div>
            
            <a href="#download" className="btn-primary">Become a Partner</a>
          </div>
          
          <div className="order-1 lg:order-2 flex justify-center">
            <img 
              src="/lovable-uploads/branch.png" 
              alt="DoKirana Store Partner App" 
              className="max-w-full h-auto rounded-lg shadow-xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default StoreOwners;
