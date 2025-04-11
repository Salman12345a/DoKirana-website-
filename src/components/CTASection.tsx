
import { ArrowRight, PhoneCall } from 'lucide-react';

const CTASection = () => {
  return (
    <section className="py-20 gradient-bg">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto text-center text-white">
          <div className="flex justify-center mb-6">
            <img 
              src="/lovable-uploads/438c0994-b4c5-4443-8ed0-a2a98758359f.png" 
              alt="DoKirana Logo" 
            className="h-44 w-auto p-4 rounded-xl"
            />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Shopping Experience?</h2>
          <p className="text-lg mb-8">
            Join thousands of satisfied customers and local Kirana stores on the DoKirana platform. Download the app today and experience the perfect blend of traditional shopping with modern convenience.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="#download" className="btn-download bg-white text-dokirana-primary hover:bg-dokirana-lighter">
              <ArrowRight size={20} />
              Download the App
            </a>
            <a href="#contact" className="btn-download border border-white hover:bg-white/10">
              <PhoneCall size={20} />
              Contact Sales
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
