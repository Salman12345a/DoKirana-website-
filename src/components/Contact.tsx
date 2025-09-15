
import { useState } from 'react';
import { Mail, MapPin, Phone } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted', formData);
    // Reset form after submission
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
    alert('Thank you for your message. We will get back to you soon!');
  };

  return (
    <section id="contact" className="section-padding bg-white">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-dokirana-primary mb-4">Get in Touch</h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Have questions or feedback? We'd love to hear from you. Reach out to our team using the contact information below.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="bg-dokirana-primary text-white p-8 rounded-xl">
            <h3 className="text-2xl font-semibold mb-6">Contact Information</h3>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <MapPin className="mr-4 mt-1 flex-shrink-0" size={24} />
                <div>
                  <h4 className="font-medium">Our Location</h4>
                  <p className="text-white/80 mt-1">2-4-1113/75/A Nimboli adda,Kachiguda Hyderabad, Telangana, India - 500027</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Phone className="mr-4 mt-1 flex-shrink-0" size={24} />
                <div>
                  <h4 className="font-medium">Phone Number</h4>
                  <p className="text-white/80 mt-1">+91 6302675240</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Mail className="mr-4 mt-1 flex-shrink-0" size={24} />
                <div>
                  <h4 className="font-medium">Email Address</h4>
                  <p className="text-white/80 mt-1">syedsalman186org@gmail.com</p>
                </div>
              </div>
            </div>
            
            <div className="mt-12">
              <h4 className="font-medium mb-3">Business Hours</h4>
              <p className="text-white/80">Monday - Friday: 9:00 AM to 6:00 PM</p>
              <p className="text-white/80">Saturday: 10:00 AM to 4:00 PM</p>
              <p className="text-white/80">Sunday: Closed</p>
            </div>
          </div>
          
          {/* Contact Form */}
          <div>
            <h3 className="text-2xl font-semibold text-dokirana-primary mb-6">Send us a Message</h3>
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="name" className="block text-gray-700 mb-2">Your Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dokirana-primary focus:outline-none"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-gray-700 mb-2">Email Address</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dokirana-primary focus:outline-none"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="phone" className="block text-gray-700 mb-2">Phone Number</label>
                  <input 
                    type="tel" 
                    id="phone" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dokirana-primary focus:outline-none"
                  />
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-gray-700 mb-2">Subject</label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dokirana-primary focus:outline-none"
                    required
                  >
                    <option value="">Select a subject</option>
                    <option value="Customer Support">Customer Support</option>
                    <option value="Store Partnership">Store Partnership</option>
                    <option value="Feedback">Feedback</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              
              <div className="mb-6">
                <label htmlFor="message" className="block text-gray-700 mb-2">Your Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dokirana-primary focus:outline-none"
                  required
                ></textarea>
              </div>
              
              <button type="submit" className="btn-primary w-full">Send Message</button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
