import React from 'react';

const BranchPrivacyPolicy: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy for DoKirana Branch App</h1>
        <p className="text-gray-600 mb-4">Effective Date: 21-04-2025</p>

        <div className="space-y-6">
          <section>
            <p className="mb-4">
              Welcome to DoKirana! This Privacy Policy describes how we collect, use, and protect the
              personal information of Kirana store owners and branch managers ("you") when you use the
              DoKirana Branch App ("App").
            </p>
            <p className="mb-4">
              By using the App, you agree to the collection and use of your information in accordance with
              this Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
            <div className="ml-4">
              <h3 className="text-xl font-medium mb-2">a. Personal Information</h3>
              <ul className="list-disc ml-6 mb-4">
                <li>Name</li>
                <li>Mobile Number</li>
                <li>Email Address (optional)</li>
                <li>Business Registration Documents</li>
                <li>Profile Photo</li>
              </ul>

              <h3 className="text-xl font-medium mb-2">b. Business Information</h3>
              <ul className="list-disc ml-6 mb-4">
                <li>Store Name</li>
                <li>Store Address and Location Coordinates</li>
                <li>GST Number (if applicable)</li>
                <li>Product Listings and Inventory Details</li>
                <li>Bank Account/UPI Details (for settlements)</li>
              </ul>

              <h3 className="text-xl font-medium mb-2">c. Usage Data</h3>
              <ul className="list-disc ml-6 mb-4">
                <li>App Activity Logs</li>
                <li>Login Timestamps</li>
                <li>Device Information (OS, model, IP address)</li>
              </ul>

              <h3 className="text-xl font-medium mb-2">d. Location Data</h3>
              <ul className="list-disc ml-6">
                <li>Real-time location (to verify store location and enable services like delivery tracking)</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
            <ul className="list-disc ml-6">
              <li>Verifying your store registration and documents</li>
              <li>Displaying your store to nearby customers</li>
              <li>Managing orders, payments, and delivery coordination</li>
              <li>Sending important notifications (order updates, payout status, etc.)</li>
              <li>Improving app features and user experience</li>
              <li>Legal compliance and fraud prevention</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. Sharing of Information</h2>
            <p className="mb-4">We do not sell your information. We may share limited information with:</p>
            <ul className="list-disc ml-6">
              <li>DoKirana Admin Team for verification and support</li>
              <li>Delivery Partners to coordinate order pickups and deliveries</li>
              <li>Payment Gateways (e.g., Razorpay) for transaction processing</li>
              <li>Government Authorities if required by law</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Data Security</h2>
            <p>
              We use industry-standard measures to secure your data. Your information is encrypted and
              stored securely in our cloud databases.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Your Choices</h2>
            <ul className="list-disc ml-6">
              <li>You can update or delete your profile information in the App.</li>
              <li>You may contact us at [syed.com] to deactivate your account.</li>
              <li>Location access can be disabled from your phone settings, but it may affect app functionality.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Children's Privacy</h2>
            <p>
              This App is intended for business users only. We do not knowingly collect data from
              individuals under 18 years of age.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy. Any changes will be notified through the App or via
              SMS/Email.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Contact Us</h2>
            <p>For any privacy-related queries, contact us at:</p>
            <div className="ml-4 mt-2">
              <p>📧 Email: dokiranaorg@gmail.com</p>
              <p>📍 Address: 2-4-1113/75/A nimboli adda kachiguda Hyderabad Telangana</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default BranchPrivacyPolicy;
