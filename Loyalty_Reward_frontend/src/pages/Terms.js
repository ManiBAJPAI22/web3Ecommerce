import React from 'react';
import '../styles/Terms.css';
import Layout from '../components/Layout/Layout';
const TermsAndConditions = () => {
  return (
    <Layout>
      <div className="terms-container" style={{ marginTop: '100px' }}>
        <h1>Terms and Conditions</h1>

        <section>
          <h2>Introduction</h2>
          <p>
            Welcome to Our E-commerce Platform. These terms and conditions
            outline the rules and regulations for the use of our website.
          </p>
        </section>
        <section>
          <h2>Expiration of Reward Points</h2>
          <p>
            Reward points accumulated through purchases or other activities on
            our platform are subject to weekly Expiration. Here are the key
            terms governing the Expiration of these points:
          </p>
          <ul>
            <li>
              All reward points earned during a given month will be valid for a
              specific period, as indicated within the user's account.
            </li>
            <li>
              Any unused points may be depleted or reduced at the end of each
              month, as per the prevailing policies.
            </li>
            <li>
              It is the responsibility of the user to review their points
              balance and redeem points within the applicable timeframe.
            </li>
            <li>
              We reserve the right to change the rules regarding the earning,
              usage, and expiration of reward points at any time. Any such
              changes will be communicated to the users through appropriate
              channels.
            </li>
            <li>
              Disputes, if any, regarding the expiration of reward points must
              be raised with our customer service team within a specified period
              after the expiration.
            </li>
          </ul>
          <p>
            Please review your account details regularly and contact our support
            team if you have any questions regarding the expiration of reward
            points.
          </p>
        </section>
        <section>
          <h2>Ordering and Payments</h2>
          <p>
            All orders placed on our platform are subject to product
            availability and will be processed within a specific timeframe.
            Payments can be made through various methods available on our
            website.
          </p>
        </section>

        <section>
          <h2>Returns and Refunds</h2>
          <p>
            Customers have the right to return purchased items within 30 days
            from the purchase date. Refunds will be processed once the returned
            item has been received and inspected.
          </p>
        </section>

        <section>
          <h2>Privacy Policy</h2>
          <p>
            We value your privacy. All personal information collected is used
            solely for processing your order and will not be shared with
            third-party entities.
          </p>
        </section>

        <section>
          <h2>Limitation of Liability</h2>
          <p>
            Our e-commerce platform shall not be held liable for any indirect
            damages that might arise from using our services or products.
          </p>
        </section>

        <section>
          <h2>Changes to Terms</h2>
          <p>
            We reserve the right to modify these terms and conditions at any
            time. Please review this page periodically to stay informed.
          </p>
        </section>

        <section>
          <h2>Contact Us</h2>
          <p>
            If you have any questions about these terms and conditions, please
            contact us.
          </p>
        </section>
      </div>
    </Layout>
  );
};

export default TermsAndConditions;
