
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CTASection from "../components/CTASection";
import { Award, ChevronRight, Heart, Sparkles, Target, Users } from "lucide-react";

const About = () => {
  const team = [
    {
      name: "Syed Salman",
      role: "Founder & CEO",
      image: "https://dokiranaofficial.s3.ap-south-1.amazonaws.com/professional+photo.jpg"
    },
    {
      name: "Amrit Mattaparty",
      role: "Chief Marketing Officer (CMO)",
      image: "/lovable-uploads/a0d0b563-7fb6-4a6d-be40-4bc9358a403c.png"
    }
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main>
        {/* Hero Section */}
        <section className="pt-28 pb-16 md:pt-36 md:pb-24 bg-dokirana-lighter">
          <div className="container-custom">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold text-dokirana-primary mb-6">About DoKirana</h1>
              <p className="text-lg md:text-xl text-gray-700 mb-6">Bridging the gap between traditional Kirana stores and modern digital convenience.</p>
              <div className="flex justify-center gap-2 items-center text-dokirana-primary">
                <a href="/" className="hover:underline">Home</a>
                <ChevronRight size={16} />
                <span>About Us</span>
              </div>
            </div>
          </div>
        </section>
        
        {/* Our Story */}
        <section className="section-padding bg-white">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-dokirana-primary mb-6">Our Story</h2>
                <p className="text-gray-700 mb-4">
                  DoKirana was born from a simple observation: while Kirana stores have been the backbone of Indian neighborhoods for generations, they were being left behind in the digital revolution.
                </p>
                <p className="text-gray-700 mb-4">
                  Founded in 2023, our mission is to empower local Kirana stores with technology that helps them thrive in the digital age, while providing customers with the convenience they desire without losing the personal touch that makes Kirana shopping special.
                </p>
                <p className="text-gray-700">
                  We believe that by creating this bridge between traditional retail and modern technology, we can help preserve the cultural institution of Kirana stores while meeting the evolving needs of today's consumers.
                </p>
              </div>
              
              <div className="flex justify-center">
                <img 
                  src="/lovable-uploads/about.png" 
                  alt="DoKirana Story" 
                  className="max-w-full h-auto rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>
        
        {/* Our Values */}
        <section className="section-padding gradient-bg text-white">
          <div className="container-custom">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Values</h2>
              <p className="text-lg max-w-2xl mx-auto">
                At DoKirana, our core values drive everything we do as we work to connect communities with their local stores.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl border border-white/20 hover:bg-white/20 transition-colors">
                <div className="bg-dokirana-primary w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <Heart className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-center">Community First</h3>
                <p className="text-white/90 text-center">We prioritize strengthening local communities by supporting neighborhood businesses and creating meaningful connections.</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl border border-white/20 hover:bg-white/20 transition-colors">
                <div className="bg-dokirana-primary w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-center">Innovation with Purpose</h3>
                <p className="text-white/90 text-center">We develop technology that solves real problems for both customers and store owners, always with a clear purpose in mind.</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl border border-white/20 hover:bg-white/20 transition-colors">
                <div className="bg-dokirana-primary w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <Award className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-center">Quality & Trust</h3>
                <p className="text-white/90 text-center">We're committed to maintaining the highest standards in every interaction, building lasting trust with customers and store partners.</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Our Mission & Vision */}
        <section className="section-padding bg-white">
          <div className="container-custom">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="bg-dokirana-lighter p-8 rounded-xl">
                <div className="flex justify-center mb-6">
                  <div className="bg-dokirana-primary w-16 h-16 rounded-full flex items-center justify-center">
                    <Target className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-semibold text-dokirana-primary text-center mb-4">Our Mission</h3>
                <p className="text-gray-700 text-center">
                  To empower local Kirana stores with digital solutions that enhance their business while providing customers with the convenience of online shopping without losing the personal connection of neighborhood commerce.
                </p>
              </div>
              
              <div className="bg-dokirana-lighter p-8 rounded-xl">
                <div className="flex justify-center mb-6">
                  <div className="bg-dokirana-primary w-16 h-16 rounded-full flex items-center justify-center">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-semibold text-dokirana-primary text-center mb-4">Our Vision</h3>
                <p className="text-gray-700 text-center">
                  To create a future where local Kirana stores thrive in the digital economy, serving as vibrant centers of community commerce supported by technology that enhances rather than replaces the human connection.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Team Section */}
        <section className="section-padding bg-dokirana-gray">
          <div className="container-custom">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-dokirana-primary mb-4">Meet Our Team</h2>
              <p className="text-lg text-gray-700 max-w-2xl mx-auto">
                The passionate individuals driving DoKirana's mission to connect communities with local Kirana stores.
              </p>
            </div>
            
            <div className="flex justify-center items-center">
              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow text-center">
                <img 
                  src={team[0].image} 
                  alt={team[0].name} 
                  className="w-32 h-32 rounded-full object-cover mx-auto mb-4 border-4 border-dokirana-lighter"
                />
                <h3 className="text-2xl font-bold text-dokirana-primary mb-1">{team[0].name}</h3>
                <p className="text-dokirana-light font-medium">{team[0].role}</p>
              </div>
            </div>
          </div>
        </section>
        
        <CTASection />
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
