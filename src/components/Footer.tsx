
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-dokirana-primary text-white pt-16 pb-8">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">DoKirana</h3>
            <p className="mb-6">Your neighborhood Kirana stores, now in your pocket. Connecting customers with local stores for convenient shopping with a community touch.</p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" className="hover:text-dokirana-light transition-colors" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="https://twitter.com" className="hover:text-dokirana-light transition-colors" aria-label="Twitter">
                <Twitter size={20} />
              </a>
              <a href="https://instagram.com" className="hover:text-dokirana-light transition-colors" aria-label="Instagram">
                <Instagram size={20} />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:text-dokirana-light transition-colors">Home</Link></li>
              <li><Link to="/about" className="hover:text-dokirana-light transition-colors">About Us</Link></li>
              <li><Link to="/how-it-works" className="hover:text-dokirana-light transition-colors">How It Works</Link></li>
              <li><Link to="/faq" className="hover:text-dokirana-light transition-colors">FAQ</Link></li>
              <li><Link to="/blog" className="hover:text-dokirana-light transition-colors">Blog</Link></li>
            </ul>
          </div>
          
          {/* For Store Owners */}
          <div>
            <h3 className="text-xl font-bold mb-4">For Store Owners</h3>
            <ul className="space-y-2">
              <li><a href="#join-network" className="hover:text-dokirana-light transition-colors">Join our Network</a></li>
              <li><a href="#partner-benefits" className="hover:text-dokirana-light transition-colors">Partner Benefits</a></li>
              <li><a href="#store-app" className="hover:text-dokirana-light transition-colors">Store App</a></li>
              <li><a href="#success-stories" className="hover:text-dokirana-light transition-colors">Success Stories</a></li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin size={20} className="mr-2 mt-1 flex-shrink-0" />
                <span>123 Main Street, City Center, State, Country - 10001</span>
              </li>
              <li className="flex items-center">
                <Phone size={20} className="mr-2 flex-shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center">
                <Mail size={20} className="mr-2 flex-shrink-0" />
                <span>support@dokirana.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-12 pt-8 text-center">
          <p>&copy; {new Date().getFullYear()} DoKirana. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
