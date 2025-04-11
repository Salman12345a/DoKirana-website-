
import { useState } from 'react';
import { Minus, Plus } from 'lucide-react';

const FAQItem = ({ question, answer }: { question: string; answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="border-b border-gray-200 py-5">
      <button 
        className="flex justify-between items-center w-full text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="text-lg font-medium text-gray-900">{question}</h3>
        <span>
          {isOpen ? <Minus className="text-dokirana-primary" size={20} /> : <Plus className="text-dokirana-primary" size={20} />}
        </span>
      </button>
      
      {isOpen && (
        <div className="mt-3">
          <p className="text-gray-600">{answer}</p>
        </div>
      )}
    </div>
  );
};

const FAQ = () => {
  const faqs = [
    {
      question: "How does DoKirana work?",
      answer: "DoKirana connects you with local Kirana stores through our mobile app. You can browse products, place orders, and choose between pickup or delivery options. Your order is sent to the store, prepared by the shopkeeper, and then delivered to you or made available for pickup."
    },
    {
      question: "Is there a minimum order value?",
      answer: "Minimum order values vary by store. Each Kirana store on our platform sets their own minimum order requirement, which you can see when browsing the store's products."
    },
    {
      question: "How quickly will I receive my order?",
      answer: "Delivery times depend on the store's location, your delivery address, and current demand. Typically, orders are delivered within 1-3 hours, with some stores offering express delivery options."
    },
    {
      question: "What payment methods are accepted?",
      answer: "DoKirana accepts various payment methods including credit/debit cards, UPI, mobile wallets, and cash on delivery, depending on the store's preferences."
    },
    {
      question: "How can I join DoKirana as a store owner?",
      answer: "To join as a store owner, download the DoKirana Partner app, complete the registration process, upload the required documents, and our team will contact you for verification and onboarding."
    },
    {
      question: "Is there a fee for using DoKirana?",
      answer: "For customers, the app is free to download and use. A small delivery fee may apply depending on your location. For store owners, we charge a small commission on orders received through our platform."
    }
  ];

  return (
    <section id="faq" className="section-padding bg-dokirana-gray">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-dokirana-primary mb-4">Frequently Asked Questions</h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Got questions about DoKirana? Find answers to the most common questions below.
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-6 md:p-8">
          {faqs.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>
        
        <div className="text-center mt-12">
          <p className="text-lg mb-4">Still have questions?</p>
          <a href="/contact" className="btn-primary">Contact Us</a>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
