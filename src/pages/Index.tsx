
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
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
