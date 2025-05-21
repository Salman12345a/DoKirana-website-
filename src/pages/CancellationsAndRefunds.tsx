import React from 'react';

const CancellationsAndRefunds: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6">Cancellations and Refunds Policy</h1>
        <p className="text-gray-600 mb-4">Effective Date: 21-04-2025</p>

        <div className="space-y-6">
          <section>
            <p className="mb-4">
              SYED SALMAN believes in helping its customers as far as possible, and has therefore a liberal cancellation policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Cancellation Policy</h2>
            <ul className="list-disc ml-6">
              <li className="mb-2">Cancellations will be considered only if the request is made within 3-5 days of placing the order.</li>
              <li className="mb-2">However, the cancellation request may not be entertained if the orders have been communicated to the vendors/merchants and they have initiated the process of shipping them.</li>
              <li className="mb-2">SYED SALMAN does not accept cancellation requests for perishable items like flowers, eatables etc.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Refund Policy</h2>
            <ul className="list-disc ml-6">
              <li className="mb-2">Refund/replacement can be made if the customer establishes that the quality of product delivered is not good.</li>
              <li className="mb-2">In case of receipt of damaged or defective items please report the same to our Customer Service team.</li>
              <li className="mb-2">The request will, however, be entertained once the merchant has checked and determined the same at his own end.</li>
              <li className="mb-2">This should be reported within 3-5 days of receipt of the products.</li>
              <li className="mb-2">In case you feel that the product received is not as shown on the site or as per your expectations, you must bring it to the notice of our customer service within 3-5 days of receiving the product.</li>
              <li className="mb-2">The Customer Service Team after looking into your complaint will take an appropriate decision.</li>
              <li className="mb-2">In case of complaints regarding products that come with a warranty from manufacturers, please refer the issue to them.</li>
              <li className="mb-2">In case of any Refunds approved by the SYED SALMAN, it'll take 3-5 days for the refund to be processed to the end customer.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <p>For any queries related to cancellations or refunds, please contact our customer service:</p>
            <div className="ml-4 mt-2">
              <p>📧 Email: dokiranaorg@gmail.com</p>
              <p>📞 Phone: +91 8121700697</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CancellationsAndRefunds;
