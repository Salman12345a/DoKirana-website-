
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FAQ from "../components/FAQ";
import CTASection from "../components/CTASection";
import Contact from "../components/Contact";
import { ChevronRight } from "lucide-react";

const FAQPage = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main>
        {/* Hero Section */}
        <section className="pt-28 pb-16 md:pt-36 md:pb-24 bg-dokirana-lighter">
          <div className="container-custom">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold text-dokirana-primary mb-6">Frequently Asked Questions</h1>
              <p className="text-lg md:text-xl text-gray-700 mb-6">Find answers to common questions about DoKirana.</p>
              <div className="flex justify-center gap-2 items-center text-dokirana-primary">
                <a href="/" className="hover:underline">Home</a>
                <ChevronRight size={16} />
                <span>FAQ</span>
              </div>
            </div>
          </div>
        </section>
        
        <FAQ />
        <Contact />
        <CTASection />
      </main>
      
      <Footer />
    </div>
  );
};

export default FAQPage;
