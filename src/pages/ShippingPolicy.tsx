import React from 'react';

const ShippingPolicy: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6">Shipping Policy</h1>
        <p className="text-gray-600 mb-4">Effective Date: 21-04-2025</p>

        <div className="space-y-6">
          <section>
            <p className="mb-4">
              This Shipping Policy outlines how SYED SALMAN handles the shipping and delivery of products ordered through our platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Delivery Methods</h2>
            <ul className="list-disc ml-6">
              <li className="mb-2">For International buyers, orders are shipped and delivered through registered international courier companies and/or International speed post only.</li>
              <li className="mb-2">For domestic buyers, orders are shipped through registered domestic courier companies and/or speed post only.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Shipping Timeframes</h2>
            <ul className="list-disc ml-6">
              <li className="mb-2">Orders are shipped within 1-2 days or as per the delivery date agreed at the time of order confirmation.</li>
              <li className="mb-2">Delivery of the shipment is subject to Courier Company / post office norms.</li>
              <li className="mb-2">SYED SALMAN is not liable for any delay in delivery by the courier company / postal authorities and only guarantees to hand over the consignment to the courier company or postal authorities within 1-2 days from the date of the order and payment or as per the delivery date agreed at the time of order confirmation.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Delivery Address</h2>
            <p className="mb-4">
              Delivery of all orders will be to the address provided by the buyer. Delivery of our services will be confirmed on your mail ID as specified during registration.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Customer Support</h2>
            <p className="mb-4">
              For any issues in utilizing our services you may contact our helpdesk:
            </p>
            <div className="ml-4 mt-2">
              <p>📞 Phone: +91 6302675240</p>
              <p>📧 Email: dokiranaorg@gmail.com</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ShippingPolicy;
