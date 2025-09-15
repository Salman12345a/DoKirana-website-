
import { AppleIcon, Download, MonitorSmartphone } from 'lucide-react';

const AppDownload = () => {
  return (
    <section id="download" className="section-padding gradient-bg text-white">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Download the DoKirana App Today</h2>
            <p className="text-lg mb-8">
              Get started with DoKirana and experience the convenience of ordering from your favorite local Kirana stores with just a few taps.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
                <h3 className="text-xl font-semibold mb-2">For Customers</h3>
                <p className="mb-4 text-white/80">Order from local shops with ease</p>
                <div className="flex space-x-4">
                <a href="https://play.google.com/store/apps/details?id=com.dokirana&pcampaignid=web_share" target="_blank" rel="noopener noreferrer" className="bg-white text-dokirana-primary p-3 rounded-lg hover:bg-opacity-90 transition-colors">
                    <Download size={24} />
                  </a>
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
                <h3 className="text-xl font-semibold mb-2">For Store's</h3>
                <p className="mb-4 text-white/80">Manage orders & grow your business</p>
                <div className="flex space-x-4">
                  <a href="https://play.google.com/store/apps/details?id=com.dkbranch&pcampaignid=web_share" target="_blank" rel="noopener noreferrer" className="bg-white text-dokirana-primary p-3 rounded-lg hover:bg-opacity-90 transition-colors">
                    <Download size={24} />
                  </a>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <MonitorSmartphone size={36} className="text-white/80" />
              <p className="text-white/80">Available on Android devices</p>
            </div>
          </div>
          
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute -inset-2 bg-white/30 rounded-full blur-3xl"></div>
              <img 
                src="/lovable-uploads/phone.png" 
                alt="DoKirana App Screenshots" 
                className="relative z-10 max-w-full h-auto rounded-3xl shadow-xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppDownload;
