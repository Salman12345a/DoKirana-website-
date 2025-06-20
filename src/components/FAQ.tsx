
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
    // 🧾 General FAQs
    {
      question: "What is DoKirana?",
      answer: "DoKirana is a local online platform connecting nearby Kirana stores with customers for fast and convenient grocery delivery."
    },
    {
      question: "How does DoKirana work?",
      answer: "Customers place orders via the app, local Kirana stores fulfill them, and delivery partners handle home deliveries."
    },
    {
      question: "Where is DoKirana available?",
      answer: "Currently, DoKirana is serving Hyderabad. We're expanding to more localities soon."
    },
    {
      question: "What makes DoKirana different from other apps?",
      answer: "We focus on empowering local stores, provide fast deliveries, and ensure transparent pricing with no hidden costs."
    },

    // 👥 Customer FAQs
    {
      question: "How do I place an order?",
      answer: "Open the DoKirana app, select your location, choose a store, add products to your cart, and proceed to checkout."
    },
    {
      question: "Can I choose a specific store?",
      answer: "Yes. You can select from stores near your location (within 2 km), or continue shopping from your last selected store."
    },
    {
      question: "What if no store is available in my area?",
      answer: "You’ll see a message: 'We are coming soon in your location.' Stay tuned—we're growing fast!"
    },
    {
      question: "Is home delivery available?",
      answer: "Yes, if the selected Kirana store offers home delivery. You can also opt for self-pickup."
    },
    {
      question: "Can I track my order?",
      answer: "Yes, real-time order tracking is available in the app after placing the order."
    },
    {
      question: "What if I receive damaged or wrong items?",
      answer: "You can raise a complaint directly through the app, and our support team will resolve it promptly."
    },
    {
      question: "What payment methods are accepted?",
      answer: "We accept UPI, credit/debit cards, and cash on delivery (if allowed by the store)."
    },

    // 🏪 Kirana Store Owner FAQs
    {
      question: "How can I register my store on DoKirana?",
      answer: "Download the DoKirana Store app and complete the registration form. Our team will verify and approve your store."
    },
    {
      question: "Is there any onboarding fee?",
      answer: "No. Onboarding is completely free."
    },
    {
      question: "How do I upload my products?",
      answer: "You can upload products via the app, or our support team can help you upload in bulk."
    },
    {
      question: "Can I manage delivery myself?",
      answer: "Yes. You can handle delivery independently or request a delivery partner from DoKirana."
    },
    {
      question: "How do I receive payments?",
      answer: "Payments go directly to your bank account or preferred UPI, depending on your setup."
    },
    {
      question: "Can I temporarily close my store on the app?",
      answer: "Yes, there is a 'Pause Store' option available in your dashboard."
    },

    // 🛵 Delivery Partner FAQs
    {
      question: "How can I become a delivery partner?",
      answer: "Register through the DoKirana Rider app. After approval, you’ll start receiving delivery requests."
    },
    {
      question: "What documents are needed for registration?",
      answer: "You’ll need a government ID, address proof, and a clear photo. Driving license is required for motorbike riders."
    },
    {
      question: "Can my application be rejected?",
      answer: "Yes, if documents are invalid or unclear. You'll be notified with the reason and can re-apply after correction."
    },
    {
      question: "How do I get delivery requests?",
      answer: "Once online, you'll be notified when there's a nearby delivery available."
    },
    {
      question: "How much can I earn?",
      answer: "Earnings depend on the number of deliveries completed and distance covered. Incentives are provided for high performers."
    },

    // 🛠️ Technical & Support FAQs
    {
      question: "The app is not working. What should I do?",
      answer: "Try updating the app. If the issue persists, contact support via the in-app help section."
    },
    {
      question: "How do I reset my password?",
      answer: "Tap 'Forgot Password' on the login screen and follow the instructions."
    },
    {
      question: "How do I contact DoKirana support?",
      answer: "Use the in-app chat or email us at dokiranaorg@gmail.com."
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
