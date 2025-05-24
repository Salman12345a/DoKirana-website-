
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
      answer: "There is no restriction on minimum order value. You can order any amount through DoKirana."
    },
    {
      question: "How quickly will I receive my order?",
      answer: "Your order will be delivered within 30 minutes of placing the order."
    },
    {
      question: "What payment methods are accepted?",
      answer: "As for now, DoKirana accepts only cash on delivery payment method."
    },
    {
      question: "How can I join DoKirana as a branch?",
      answer: "To join as a DoKirana branch, download the dkbranch app from the PlayStore or contact us at +918121700697."
    },
    {
      question: "Is there a fee for using DoKirana?",
      answer: "There is only a one rupee fee for each order if the order value is within 1000 rupees. The fee increases by one rupee for every 1000 rupees exceeded in each order."
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
