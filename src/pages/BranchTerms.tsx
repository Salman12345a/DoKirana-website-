import React from 'react';

const BranchTerms: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6">Terms and Conditions for DoKirana Branch App</h1>
        <p className="text-gray-600 mb-4">Effective Date: 21-04-2025</p>

        <div className="space-y-6">
          <p className="mb-4">
            These Terms and Conditions ("Terms") govern your use of the DoKirana Branch App ("App"),
            owned and operated by DoKirana. By registering and using the App, you agree to comply
            with and be bound by these Terms.
          </p>

          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Eligibility</h2>
            <p>To use this App, you must:</p>
            <ul className="list-disc ml-6">
              <li>Be the rightful owner or authorized manager of a Kirana store.</li>
              <li>Be at least 18 years old.</li>
              <li>Provide accurate business and personal information.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Account Registration & Verification</h2>
            <ul className="list-disc ml-6">
              <li>You are required to submit valid documents and information for business verification.</li>
              <li>DoKirana reserves the right to approve or reject any branch registration.</li>
              <li>Your access may be revoked if the documents provided are invalid or fraudulent.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. Responsibilities of the Branch</h2>
            <p>As a store owner/manager, you agree to:</p>
            <ul className="list-disc ml-6">
              <li>Keep your store's profile, inventory, pricing, and delivery options up to date.</li>
              <li>Accept and process orders received via the App promptly.</li>
              <li>Maintain quality, hygiene, and timely packaging of items.</li>
              <li>Handle customer complaints professionally, if routed through the platform.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Order Management</h2>
            <ul className="list-disc ml-6">
              <li>Orders received through DoKirana must be processed through the App.</li>
              <li>
                Delivery responsibility is based on your selected preferences (self-delivery or
                platform-assigned delivery partner).
              </li>
              <li>Non-fulfillment or frequent delays may lead to temporary suspension.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Payments & Settlements</h2>
            <ul className="list-disc ml-6">
              <li>
                Payments collected from customers are settled to your registered bank/UPI account
                as per the settlement cycle.
              </li>
              <li>
                Any disputes or discrepancies in payments must be reported within 7 working days.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Commission and Charges</h2>
            <ul className="list-disc ml-6">
              <li>
                DoKirana may charge a service/commission fee per transaction, which will be
                communicated to you during onboarding or through updates.
              </li>
              <li>These charges may be revised with prior notice.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Content & Listings</h2>
            <ul className="list-disc ml-6">
              <li>
                You are solely responsible for the content (products, images, descriptions, prices) you
                upload.
              </li>
              <li>False or misleading listings can lead to account suspension.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Intellectual Property</h2>
            <ul className="list-disc ml-6">
              <li>The DoKirana logo, branding, and app design are the property of DoKirana.</li>
              <li>
                You may not use the brand or platform for unauthorized or competing services.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">9. Restrictions</h2>
            <p>You agree not to:</p>
            <ul className="list-disc ml-6">
              <li>Misuse or manipulate the platform for fraudulent activity.</li>
              <li>Share your login credentials with unauthorized persons.</li>
              <li>
                Engage in practices that harm customers, delivery partners, or DoKirana's reputation.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">10. Termination</h2>
            <ul className="list-disc ml-6">
              <li>
                DoKirana reserves the right to suspend or terminate your access to the App for any
                breach of these Terms.
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default BranchTerms;
