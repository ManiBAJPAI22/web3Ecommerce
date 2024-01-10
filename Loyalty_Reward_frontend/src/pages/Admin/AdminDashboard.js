import React from 'react';
import AdminMenu from '../../components/Layout/AdminMenu';
import Layout from './../../components/Layout/Layout';
import { useAuth } from '../../context/auth';
import { ShareComponent } from '../../components/shareComponent';

const AdminDashboard = () => {
  const [auth] = useAuth();
  return (
    <Layout>
      <div className="container-fluid m-3 p-3 dashboard">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <div className="card w-75 p-3">
              <div>
                <img
                  src={`${auth?.user?.imgUrl}`}
                  alt="Profile-Pic"
                  className="profile-pic"
                  style={{
                    width: '150px',
                    height: '150px',
                    borderRadius: '50%',
                  }}
                />
              </div>
              <div className="text-content">
                <div className="user-info">
                  <span className="user-info-label">Your Name:</span>{' '}
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
                  <span className="user-info-label">Phone:</span>{' '}
                  {auth?.user?.phone}
                </div>
                <ShareComponent code={auth.user.refCode} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
