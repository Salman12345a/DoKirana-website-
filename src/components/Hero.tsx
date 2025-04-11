import { ArrowRight, Download, ShoppingBag } from 'lucide-react';

const Hero = () => {
  return (
    <section className="pt-28 pb-16 md:pt-36 md:pb-24 bg-dokirana-lighter overflow-hidden">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1 animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-dokirana-primary mb-6">
              <span className="block">Apna Kirana,</span>
              <span className="block">Apni Dukan!</span>
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
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-dokirana-primary/20 to-dokirana-secondary/20 rounded-full blur-3xl group-hover:blur-4xl transition-all duration-500"></div>
              <div className="relative z-10 transform group-hover:scale-105 transition-transform duration-500">
                <img 
                  src="/lovable-uploads/phone.png" 
                  alt="DoKirana Mobile App Interface" 
                  className="max-w-full h-auto rounded-3xl shadow-2xl border-4 border-white/10"
                />
                <div className="absolute -bottom-4 -right-4 bg-dokirana-primary text-white p-4 rounded-full shadow-lg z-20 transform group-hover:scale-110 transition-transform duration-500">
                  <ShoppingBag size={32} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
