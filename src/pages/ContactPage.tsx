
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Contact from "../components/Contact";
import { ChevronRight, MapPin } from "lucide-react";

const ContactPage = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main>
        {/* Hero Section */}
        <section className="pt-28 pb-16 md:pt-36 md:pb-24 bg-dokirana-lighter">
          <div className="container-custom">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold text-dokirana-primary mb-6">Contact Us</h1>
              <p className="text-lg md:text-xl text-gray-700 mb-6">Get in touch with our team for support or inquiries.</p>
              <div className="flex justify-center gap-2 items-center text-dokirana-primary">
                <a href="/" className="hover:underline">Home</a>
                <ChevronRight size={16} />
                <span>Contact</span>
              </div>
            </div>
          </div>
        </section>
        
        <Contact />
        
        {/* Map Section */}
        <section className="py-12 bg-dokirana-gray">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-dokirana-primary mb-4">Find Us</h2>
              <p className="text-lg text-gray-700 flex items-center justify-center gap-2">
                <MapPin size={20} className="text-dokirana-primary" />
                2-4-1113/75/A Nimboli adda, Kachiguda Hyderabad, Telangana, India - 500027
              </p>
            </div>
            
            <div className="bg-white p-2 rounded-xl shadow-md">
              <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
                <div className="w-full h-[400px] rounded-lg overflow-hidden">
                  <iframe
                    title="DoKirana Location"
                    src="https://maps.google.com/maps?q=17.386739,78.495694&z=16&output=embed"
                    className="w-full h-full border-0"
                    allowFullScreen
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default ContactPage;
