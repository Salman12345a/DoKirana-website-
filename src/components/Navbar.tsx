import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Shield } from 'lucide-react';
import { isOperatorSessionValid } from '../services/operatorService';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOperatorLoggedIn, setIsOperatorLoggedIn] = useState(false);

  useEffect(() => {
    setIsOperatorLoggedIn(isOperatorSessionValid());
  }, []);
  
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
        <Link to="/" className="flex items-center gap-2.5 group">
          <img
            src="/assets/Logo.png"
            alt="DK Point Logo"
            className="w-9 h-9 sm:w-10 sm:h-10 object-contain rounded-xl shadow-xs group-hover:scale-105 transition-transform"
          />
          <span className="text-2xl font-extrabold tracking-tight text-dokirana-primary">DK Point</span>
        </Link>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-7">
          <Link to="/" className="text-gray-800 hover:text-dokirana-primary font-medium transition-colors">Home</Link>
          <Link to="/about" className="text-gray-800 hover:text-dokirana-primary font-medium transition-colors">About Us</Link>
          <Link to="/how-it-works" className="text-gray-800 hover:text-dokirana-primary font-medium transition-colors">How It Works</Link>
          <Link to="/faqs" className="text-gray-800 hover:text-dokirana-primary font-medium transition-colors">FAQ</Link>
          <Link to="/contact" className="text-gray-800 hover:text-dokirana-primary font-medium transition-colors">Contact</Link>
          <Link
            to={isOperatorLoggedIn ? "/operator/dashboard" : "/operator/register"}
            className="flex items-center gap-1.5 text-teal-700 hover:text-teal-900 bg-teal-50 hover:bg-teal-100 border border-teal-200/70 text-sm font-semibold px-3 py-1.5 rounded-full transition-all"
          >
            {isOperatorLoggedIn ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <Shield size={14} className="text-teal-700" />
                <span>Operators Club</span>
              </>
            ) : (
              <>
                <Shield size={14} className="text-teal-600" />
                <span>Operators Club</span>
              </>
            )}
          </Link>
          <a href="#download" className="btn-primary">Download App</a>
        </div>
        
        {/* Mobile Menu Button */}
        <button className="md:hidden text-dokirana-primary" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      
      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white w-full border-b border-gray-100 shadow-lg">
          <div className="container-custom flex flex-col py-4 space-y-4">
            <Link to="/" className="text-gray-800 hover:text-dokirana-primary font-medium transition-colors" onClick={() => setIsOpen(false)}>Home</Link>
            <Link to="/about" className="text-gray-800 hover:text-dokirana-primary font-medium transition-colors" onClick={() => setIsOpen(false)}>About Us</Link>
            <Link to="/how-it-works" className="text-gray-800 hover:text-dokirana-primary font-medium transition-colors" onClick={() => setIsOpen(false)}>How It Works</Link>
            <Link to="/faqs" className="text-gray-800 hover:text-dokirana-primary font-medium transition-colors" onClick={() => setIsOpen(false)}>FAQ</Link>
            <Link to="/contact" className="text-gray-800 hover:text-dokirana-primary font-medium transition-colors" onClick={() => setIsOpen(false)}>Contact</Link>
            <Link
              to={isOperatorLoggedIn ? "/operator/dashboard" : "/operator/register"}
              className="flex items-center justify-center gap-2 text-teal-800 font-semibold bg-teal-50 py-2.5 rounded-xl border border-teal-200"
              onClick={() => setIsOpen(false)}
            >
              {isOperatorLoggedIn && <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>}
              <Shield size={16} className="text-teal-600" />
              {isOperatorLoggedIn ? "Operators Club (Dashboard)" : "Operators Club"}
            </Link>
            <a href="#download" className="btn-primary text-center" onClick={() => setIsOpen(false)}>Download App</a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;