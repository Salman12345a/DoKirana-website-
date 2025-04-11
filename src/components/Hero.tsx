
import { ArrowRight, Download, ShoppingBag } from 'lucide-react';

const Hero = () => {
  return (
    <section className="pt-28 pb-16 md:pt-36 md:pb-24 bg-dokirana-lighter overflow-hidden">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1 animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-dokirana-primary mb-6">
              Your Neighborhood Kirana, Now in Your Pocket
            </h1>
            <p className="text-lg md:text-xl mb-8 text-gray-700 max-w-lg">
              Connect with local Kirana stores and place orders through our app with options for pickup or delivery. Support local, shop conveniently.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#download" className="btn-download">
                <Download size={20} />
                Download App
              </a>
              <a href="#how-it-works" className="btn-secondary flex items-center justify-center gap-2">
                How It Works
                <ArrowRight size={18} />
              </a>
            </div>
          </div>
          
          <div className="order-1 lg:order-2 flex justify-center">
            <div className="relative">
              <div className="absolute -inset-1 bg-dokirana-primary/20 rounded-full blur-3xl"></div>
              <img 
                src="/lovable-uploads/8d3fda97-ba38-42cc-9ea5-1ae1c2bb0a2f.png" 
                alt="DoKirana Mobile App Interface" 
                className="relative z-10 max-w-full h-auto rounded-3xl shadow-xl"
              />
              <div className="absolute -bottom-4 -right-4 bg-dokirana-primary text-white p-4 rounded-full shadow-lg z-20">
                <ShoppingBag size={32} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
