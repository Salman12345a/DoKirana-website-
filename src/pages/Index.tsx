
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import DKPointEcosystem from "../components/DKPointEcosystem";
import DKBranchSection from "../components/DKBranchSection";
import DKEatsSection from "../components/DKEatsSection";
import OperatorEcosystemSection from "../components/OperatorEcosystemSection";
import HowItWorks from "../components/HowItWorks";
import Benefits from "../components/Benefits";
import Testimonials from "../components/Testimonials";
import AppDownload from "../components/AppDownload";
import Features from "../components/Features";
import FAQ from "../components/FAQ";
import Contact from "../components/Contact";
import LocationFinder from "../components/LocationFinder";
import StoreOwners from "../components/StoreOwners";
import CTASection from "../components/CTASection";
import Footer from "../components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main>
        <Hero />
        <DKPointEcosystem />
        <DKEatsSection />
        <DKBranchSection />
        <OperatorEcosystemSection />
        <HowItWorks />
        <Benefits />
        <Features />
        <Testimonials />
        <LocationFinder />
        <StoreOwners />
        <FAQ />
        <AppDownload />
        <Contact />
        <CTASection />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
