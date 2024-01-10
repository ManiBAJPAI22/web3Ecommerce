import React from 'react';
import Layout from '../../components/Layout/Layout';
import UserMenu from '../../components/Layout/UserMenu';
import { useAuth } from '../../context/auth';
import '../../styles/UserDashboard.css';
import { ShareComponent } from '../../components/shareComponent';

const Dashboard = () => {
  const [auth] = useAuth();
  return (
    <Layout title={'Dashboard - Ecommerce App'}>
      <div className="container-fluid m-3 p-3 dashboard">
        <div className="row">
          <div className="col-md-3">
            <UserMenu />
          </div>
          <div className="col-md-9">
            <div className="card w-75 p-3">
              <div className="profile-picture">
                <img
                  src={`${auth?.user?.imgUrl}`}
                  alt="Profile-Pic"
                  style={{ width: '150px', height: '150px' }}
                />
              </div>
              <div className="user-info">
                <span className="user-info-label">Name:</span>{' '}
                {auth?.user?.name}
              </div>
              <div className="user-info">
                <span className="user-info-label">Email:</span>{' '}
                {auth?.user?.email}
              </div>
              <div className="user-info">
                <span className="user-info-label">Address:</span>{' '}
                {auth?.user?.address}
              </div>
              <div className="user-info">
                <span className="user-info-label">Phone No:</span>{' '}
                {auth?.user?.phone}
              </div>
              <ShareComponent code={auth.user.refCode}/>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
