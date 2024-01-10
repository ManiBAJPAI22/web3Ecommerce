import React from 'react';
import { NavLink } from 'react-router-dom';

const UserMenu = () => {
  return (
    <div>
      <div className="text-center">
        <div className="list-group dashboard-menu">
          <NavLink to="/dashboard/user" style={{ textDecoration: 'none' }}>
            <h4>Dashboard</h4>
          </NavLink>
          <NavLink
            to="/dashboard/user/profile"
            className="list-group-item list-group-item-action"
          >
            Profile
          </NavLink>
          <NavLink
            to="/dashboard/user/orders"
            className="list-group-item list-group-item-action"
          >
            Orders
          </NavLink>
          <NavLink
            to="/dashboard/user/nftsEarned"
            className="list-group-item list-group-item-action"
          >
            NFTs Earned
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default UserMenu;
