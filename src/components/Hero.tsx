import { ArrowRight, Download, ShoppingBag, Star, TrendingUp, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <section className="pt-28 pb-16 md:pt-36 md:pb-24 bg-gradient-to-b from-dokirana-lighter to-white overflow-hidden">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="order-2 lg:order-1"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-dokirana-primary/10 text-dokirana-primary px-4 py-2 rounded-full mb-6">
              <Star size={16} className="text-yellow-500" />
              <span className="text-sm font-semibold">India's Growing Kirana Network</span>
            </div>

            {/* Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="block text-dokirana-primary">
                Apna Kirana,
              </span>
              <span className="block bg-gradient-to-r from-dokirana-primary to-dokirana-secondary bg-clip-text text-transparent">
                Apni Dukan!
              </span>
            </h1>

            {/* Description */}
            <p className="text-lg md:text-xl mb-8 text-gray-700 max-w-lg leading-relaxed">
              Transforming local Kirana stores into digital powerhouses. Order easily, support local businesses, and enjoy convenient delivery options.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <a href="https://play.google.com/store/apps/details?id=com.dokirana" className="btn-download group">
                <Download size={20} className="group-hover:scale-110 transition-transform" />
                <span>
                  <span className="block text-xs opacity-80">Get Started With</span>
                  Download App
                </span>
              </a>
              <a href="#how-it-works" className="btn-secondary flex items-center justify-center gap-2 group">
                How It Works
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 bg-dokirana-primary/10 rounded-full">
                  <ShoppingBag size={20} className="text-dokirana-primary" />
                </div>
                <h4 className="text-2xl font-bold text-gray-900">10+</h4>
                <p className="text-sm text-gray-600">Active Stores</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 bg-dokirana-primary/10 rounded-full">
                  <Users size={20} className="text-dokirana-primary" />
                </div>
                <h4 className="text-2xl font-bold text-gray-900">50+</h4>
                <p className="text-sm text-gray-600">Happy Customers</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 bg-dokirana-primary/10 rounded-full">
                  <TrendingUp size={20} className="text-dokirana-primary" />
                </div>
                <h4 className="text-2xl font-bold text-gray-900">₹100K+</h4>
                <p className="text-sm text-gray-600">Monthly GMV</p>
              </div>
            </div>
          </motion.div>
          
          {/* Right Content - Hero Image */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="order-1 lg:order-2 flex justify-center"
          >
            <div className="relative group">
              {/* Background Gradient Blob */}
              <div className="absolute -inset-1 bg-gradient-to-r from-dokirana-primary/20 to-dokirana-secondary/20 rounded-full blur-3xl group-hover:blur-4xl transition-all duration-500"></div>
              
              {/* Hero Image Container */}
              <div className="relative z-10 transform group-hover:scale-105 transition-transform duration-500">
                <img 
                  src="/lovable-uploads/phone.png" 
                  alt="DoKirana Mobile App Interface" 
                  className="w-full max-w-lg"
                />
                
                {/* Floating Elements */}
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="absolute -top-6 -left-6 bg-white p-4 rounded-lg shadow-xl animate-float"
                >
                  <ShoppingBag className="text-dokirana-primary w-6 h-6" />
                </motion.div>
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="absolute -bottom-6 -right-6 bg-white p-4 rounded-lg shadow-xl animate-float-delayed"
                >
                  <Star className="text-yellow-500 w-6 h-6" />
                </motion.div>

                {/* Additional Floating Elements */}
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.9 }}
                  className="absolute top-1/2 -right-4 transform -translate-y-1/2 bg-white p-3 rounded-lg shadow-xl animate-float"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-xs font-medium text-gray-600">Live Orders</span>
                  </div>
                </motion.div>

                {/* Success Message */}
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1.2 }}
                  className="absolute -left-4 bottom-1/3 bg-white px-4 py-2 rounded-lg shadow-xl animate-float-delayed"
                >
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-1">
                      <div className="w-6 h-6 rounded-full bg-dokirana-primary/20 flex items-center justify-center">
                        <ShoppingBag size={12} className="text-dokirana-primary" />
                      </div>
                      <div className="w-6 h-6 rounded-full bg-dokirana-primary/20 flex items-center justify-center">
                        <Users size={12} className="text-dokirana-primary" />
                      </div>
                    </div>
                    <span className="text-xs font-medium text-gray-600">Order Delivered!</span>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
