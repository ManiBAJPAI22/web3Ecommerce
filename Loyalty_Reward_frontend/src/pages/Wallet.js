import Layout from '../components/Layout/Layout';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Wallet.css';

const Wallet = () => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    photo: '',
    wallets: [],
    totalLoyaltyPoints: 0,
  });
  useEffect(() => {
    const mockProfile = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      photo:
        'https://thumbs.dreamstime.com/z/vector-illustration-avatar-dummy-logo-collection-image-icon-stock-isolated-object-set-symbol-web-137160339.jpg',
      wallets: [
        {
          account: 'Account 1',
          coupons: ['Coupon 1', 'Coupon 2', 'Coupon 3', 'Coupon 4'],
        },
        { account: 'Account 2', coupons: ['Coupon 5', 'Coupon 6'] },
      ],
      totalLoyaltyPoints: 150,
    };

    setProfile(mockProfile);
  }, []);

  return (
    <Layout title={'Dashboard - Ecommerce App'}>
      <div className="wallet-page">
        <div className="profile-details">
          <img src={profile.photo} alt="Profile" />
          <h1>{profile.name}</h1>
          <p>{profile.email}</p>
        </div>
        <div className="wallets">
          {profile.wallets.map((wallet, index) => (
            <div key={index} className="wallet">
              <h2>{wallet.account}</h2>
              <div className="coupons">
                {wallet.coupons.slice(0, 2).map((coupon, i) => (
                  <p key={i}>{coupon}</p>
                ))}
              </div>
              <Link
                to={{
                  pathname: '/coupons',
                  state: { coupons: wallet.coupons },
                }}
              >
                View All Coupons
              </Link>
            </div>
          ))}
        </div>
        <div className="total-loyalty-points">
          <h2>Total Loyalty Points: {profile.totalLoyaltyPoints}</h2>
        </div>
      </div>
    </Layout>
  );
};

export default Wallet;

// export default Dashboard;
