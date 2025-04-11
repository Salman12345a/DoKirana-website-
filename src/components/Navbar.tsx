import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full top-0 left-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'}`}>
      <div className="container-custom flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <img 
            src="/lovable-uploads/438c0994-b4c5-4443-8ed0-a2a98758359f.png" 
            alt="DoKirana Logo" 
            className="h-16 w-auto bg-dokirana-primary/10 p-2 rounded-lg" 
          />
        </Link>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-gray-800 hover:text-dokirana-primary font-medium transition-colors">Home</Link>
          <Link to="/about" className="text-gray-800 hover:text-dokirana-primary font-medium transition-colors">About Us</Link>
          <Link to="/how-it-works" className="text-gray-800 hover:text-dokirana-primary font-medium transition-colors">How It Works</Link>
          <Link to="/faq" className="text-gray-800 hover:text-dokirana-primary font-medium transition-colors">FAQ</Link>
          <Link to="/contact" className="text-gray-800 hover:text-dokirana-primary font-medium transition-colors">Contact</Link>
          <Link to="/blog" className="text-gray-800 hover:text-dokirana-primary font-medium transition-colors">Blog</Link>
          <a href="#download" className="btn-primary">Download App</a>
        </div>
        
        {/* Mobile Menu Button */}
        <button className="md:hidden text-dokirana-primary" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      
      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white w-full">
          <div className="container-custom flex flex-col py-4 space-y-4">
            <Link to="/" className="text-gray-800 hover:text-dokirana-primary font-medium transition-colors" onClick={() => setIsOpen(false)}>Home</Link>
            <Link to="/about" className="text-gray-800 hover:text-dokirana-primary font-medium transition-colors" onClick={() => setIsOpen(false)}>About Us</Link>
            <Link to="/how-it-works" className="text-gray-800 hover:text-dokirana-primary font-medium transition-colors" onClick={() => setIsOpen(false)}>How It Works</Link>
            <Link to="/faq" className="text-gray-800 hover:text-dokirana-primary font-medium transition-colors" onClick={() => setIsOpen(false)}>FAQ</Link>
            <Link to="/contact" className="text-gray-800 hover:text-dokirana-primary font-medium transition-colors" onClick={() => setIsOpen(false)}>Contact</Link>
            <Link to="/blog" className="text-gray-800 hover:text-dokirana-primary font-medium transition-colors" onClick={() => setIsOpen(false)}>Blog</Link>
            <a href="#download" className="btn-primary text-center" onClick={() => setIsOpen(false)}>Download App</a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
