
import { Clock, Heart, ShoppingBag, Store } from 'lucide-react';

const Benefits = () => {
  const benefits = [
    {
      icon: <Store className="w-12 h-12 text-white" />,
      title: "Support local businesses",
      description: "Help neighborhood Kirana stores thrive in the digital era while enjoying personalized service."
    },
    {
      icon: <Clock className="w-12 h-12 text-white" />,
      title: "Save time with convenient ordering",
      description: "Skip the lines and shop from your favorite local stores with just a few taps."
    },
    {
      icon: <ShoppingBag className="w-12 h-12 text-white" />,
      title: "Flexible fulfillment options",
      description: "Choose between home delivery or pickup based on your schedule and needs."
    },
    {
      icon: <Heart className="w-12 h-12 text-white" />,
      title: "Familiar products from stores you trust",
      description: "Continue shopping from the same Kirana stores you've always loved, now with added digital convenience."
    }
  ];

  return (
    <section className="section-padding gradient-bg text-white">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose DoKirana</h2>
          <p className="text-lg max-w-2xl mx-auto">
            DoKirana combines the personal touch of neighborhood shopping with modern digital convenience.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <div 
              key={index} 
              className="bg-white/10 backdrop-blur-sm p-8 rounded-xl border border-white/20 hover:bg-white/20 transition-colors animate-fade-in"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="bg-dokirana-primary w-20 h-20 rounded-full flex items-center justify-center mb-6 mx-auto shadow-lg">
                {benefit.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3 text-center">{benefit.title}</h3>
              <p className="text-white/90 text-center">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;
