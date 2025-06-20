import { ReactElement } from 'react';
import { Helmet } from 'react-helmet';

const PrivacyPolicy: React.FC = (): ReactElement => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>Privacy Policy - DoKirana</title>
        <meta name="description" content="DoKirana Customer Privacy Policy" />
      </Helmet>

      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy for DoKirana Customers</h1>
        <p className="text-gray-600 mb-4">Effective Date: 21-04-2025</p>

        <div className="space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
            <p className="mb-4">We collect the following information from you to deliver and improve our services:</p>
            <ul className="list-disc list-inside mb-4">
              <li>Name, phone number, and email address</li>
              <li>Delivery address and preferred store location</li>
              <li>Order history and cart preferences</li>
              <li>Real-time location (only with your consent)</li>
              <li>Device and app usage data (for performance analytics)</li>
              <li>Any communications with customer support or delivery agents</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
            <p className="mb-4">Your information is used to:</p>
            <ul className="list-disc list-inside mb-4">
              <li>Process orders and coordinate with Kirana store owners and delivery partners</li>
              <li>Offer personalized product recommendations</li>
              <li>Send order updates, OTPs, and delivery notifications</li>
              <li>Enable real-time tracking of delivery status</li>
              <li>Improve app features, usability, and service quality</li>
              <li>Ensure fraud prevention and account protection</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. Sharing of Information</h2>
            <p className="mb-4">We only share information when necessary for the functioning of the DoKirana platform:</p>
            <ul className="list-disc list-inside mb-4">
              <li>With store owners to fulfill your orders</li>
              <li>With delivery partners for accurate and timely deliveries</li>
              <li>With third-party services for analytics, payment processing, or notifications (under strict confidentiality agreements)</li>
              <li>As required by law or to protect legal rights</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Data Security</h2>
            <p className="mb-4">
              We use industry-standard encryption and secure server practices to protect your data. All sensitive information (e.g., location, payment data) is encrypted in transit and at rest. Only authorized personnel can access personal data when needed.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Your Rights</h2>
            <p className="mb-4">As a DoKirana user, you have the right to:</p>
            <ul className="list-disc list-inside mb-4">
              <li>Access and review your personal data</li>
              <li>Request correction or update of your profile information</li>
              <li>Withdraw location access at any time via device settings</li>
              <li>Request deletion of your account and related data</li>
              <li>Contact us for any concerns or clarifications at dokiranaorg@gmail.com</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Background Location Usage</h2>
            <p className="mb-4">
              We may access your location in the background to ensure seamless delivery tracking and store matching, but only when explicitly permitted by you. You can change this permission anytime from your device settings.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Changes to This Policy</h2>
            <p className="mb-4">
              We may periodically update this policy. Significant changes will be communicated through the DoKirana app or website.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
