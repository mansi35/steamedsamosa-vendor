import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRouteAdmin({ component: Component, ...rest }) {
  const user = JSON.parse(localStorage.getItem('profile'))?.user;

  if (user?.email === 'admin@raahee.app') {
    return <Component {...rest} />;
  }
  return (
    <Navigate to={
      {
        pathname: '/',
      }
    }
    />
  );
}

export default ProtectedRouteAdmin;
