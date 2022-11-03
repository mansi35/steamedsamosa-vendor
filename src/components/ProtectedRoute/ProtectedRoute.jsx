import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ component: Component, ...rest }) {
  const profile = JSON.parse(localStorage.getItem('profile'));

  if (profile?.jwt && profile?.user?.email !== 'admin@raahee.app') {
    return <Component {...rest} />;
  } if (profile?.user?.email === 'admin@raahee.app') {
    return (
      <Navigate to={
        {
          pathname: '/admin',
        }
      }
      />
    );
  }
  return (
    <Navigate to={
      {
        pathname: '/auth',
      }
    }
    />
  );
}

export default ProtectedRoute;
