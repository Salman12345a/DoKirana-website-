import { ReactElement } from 'react';
import { Helmet } from 'react-helmet';

const CustomerTerms: React.FC = (): ReactElement => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>Terms and Conditions - DoKirana</title>
        <meta name="description" content="DoKirana Customer Terms and Conditions" />
      </Helmet>
      
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6">Terms and Conditions for DoKirana Customers</h1>
        <p className="text-gray-600 mb-4">Effective Date: 21-04-2025</p>

        <div className="space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p className="mb-4">
              By using the DoKirana app or website, you agree to be bound by these Terms and Conditions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. User Registration</h2>
            <p className="mb-4">To use our services, you must:</p>
            <ul className="list-disc list-inside mb-4">
              <li>Be at least 13 years old</li>
              <li>Provide accurate and complete information during registration</li>
              <li>Maintain the confidentiality of your account credentials</li>
              <li>Notify us immediately of any unauthorized use of your account</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. Ordering Process</h2>
            <p className="mb-4">When placing orders:</p>
            <ul className="list-disc list-inside mb-4">
              <li>Review product prices and availability before placing an order</li>
              <li>Confirm your delivery address and contact information</li>
              <li>Understand that prices may vary between stores</li>
              <li>Be aware that some products may be out of stock</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Payment Terms</h2>
            <p className="mb-4">
              Payment is made at the time of order collection through our cash on delivery (COD) model. Please note:
            </p>
            <ul className="list-disc list-inside mb-4">
              <li>For delivery orders: Payment is due in full at the time of delivery to the delivery partner</li>
              <li>For self-pickup orders: Payment must be made directly to the Kirana store at the time of pickup</li>
              <li>Only Indian Rupees (₹) is accepted</li>
              <li>Exact change is appreciated but not required</li>
              <li>Delivery partner may not have change for large denominations</li>
              <li>Delivery partner will provide a receipt upon payment</li>
              <li>Orders will not be delivered/picked up without payment</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Order Types</h2>
            <p className="mb-4">DoKirana offers two types of order collection:</p>
            <ul className="list-disc list-inside mb-4">
              <li>Delivery Orders: Items are delivered to your doorstep by our delivery partners</li>
              <li>Self-Pickup Orders: You collect your order directly from the Kirana store</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Delivery and Cancellation</h2>
            <p className="mb-4">
              Delivery policies:
            </p>
            <ul className="list-disc list-inside mb-4">
              <li>Standard delivery time is within 30 min only, during business hours</li>
              <li>Delivery charges may apply based on location and order size</li>
              <li>Orders can be cancelled before they are picked up by the delivery partner</li>
              <li>No refunds for cancelled orders once picked up</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Returns and Refunds</h2>
            <p className="mb-4">
              Our return policy:
            </p>
            <ul className="list-disc list-inside mb-4">
              <li>Products must be returned within 24 hours of delivery</li>
              <li>Products must be in their original packaging</li>
              <li>No returns for perishable items or store-specific policies</li>
              <li>Refunds will be processed through the original payment method</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. User Conduct</h2>
            <p className="mb-4">
              You agree not to:
            </p>
            <ul className="list-disc list-inside mb-4">
              <li>Use false or misleading contact information</li>
              <li>Place fraudulent orders</li>
              <li>Harass or abuse store owners or delivery partners</li>
              <li>Violate any applicable laws or regulations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Intellectual Property</h2>
            <p className="mb-4">
              All content on the DoKirana platform, including but not limited to text, graphics, logos, and software, is the property of DoKirana and is protected by copyright and other intellectual property laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">9. Limitation of Liability</h2>
            <p className="mb-4">
              DoKirana is not liable for:
            </p>
            <ul className="list-disc list-inside mb-4">
              <li>Any delays or failures in delivery due to circumstances beyond our control</li>
              <li>Product availability or pricing errors</li>
              <li>Any indirect, incidental, or consequential damages</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">10. Changes to Terms</h2>
            <p className="mb-4">
              We may update these Terms and Conditions periodically. Significant changes will be communicated through the app or website. Continued use of our services after changes constitutes acceptance of the new terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">11. Contact Information</h2>
            <p className="mb-4">
              If you have any questions about these Terms and Conditions, please contact us at:
            </p>
            <ul className="list-disc list-inside mb-4">
              <li>Email: dokiranaorg@gmail.com</li>
              <li>Phone: +91 6302675240</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CustomerTerms;
