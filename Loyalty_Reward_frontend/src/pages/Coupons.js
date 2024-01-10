import React from 'react';
import '../styles/Coupons.css'; // Importing the CSS file we previously defined
import Layout from '../components/Layout/Layout';

const Coupon = props => {
  const coupons = props.location?.state?.coupons || [];
  return (
    <Layout>
      <div className="coupons-page">
        <h1>Coupons</h1>
        <div className="coupons-list">
          {coupons.map((coupon, index) => (
            <div key={index} className="coupon">
              <p>{coupon}</p>
            </div>
          ))}
        </div>
        <a href="/wallet">Back to Wallet</a>
      </div>
    </Layout>
  );
};

export default Coupon;
