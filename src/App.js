import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import { useDispatch } from 'react-redux';
import Auth from './pages/Auth/Auth';
import SchedulePage from './pages/SchedulePage/SchedulePage';
import Overview from './pages/OverviewPage/OverviewPage';
import EditProfilePage from './pages/EditProfilePage/EditProfilePage';
import AppointmentsPage from './pages/AppointmentsPage/AppointmentsPage';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import ProtectedRouteAdmin from './components/ProtectedRoute/ProtectedRouteAdmin';
import AdminProfile from './pages/Admin/Admin';
// import CouponsPage from './pages/CouponsPage/CouponsPage';
import WalletPage from './pages/WalletPage/WalletPage';
import GoogleAuthCallback from './pages/Auth/GoogleAuthCallback';
import Sidebar from './components/Sidebar/Sidebar';
import { getSchedule } from './actions/schedule';
import { getCoupons } from './actions/coupons';
import { getWorkExp } from './actions/workExps';
import { getMhps } from './actions/mhps';
import './App.scss';

function App() {
  const profile = JSON.parse(localStorage.getItem('profile'));
  const dispatch = useDispatch();

  useEffect(() => {
    if (profile?.user.email === 'admin@raahee.app') {
      dispatch(getMhps());
    } else if (profile?.jwt) {
      dispatch(getSchedule(profile?.user?.id));
      dispatch(getCoupons(profile?.user?.id));
      dispatch(getWorkExp(profile?.user?.id));
    }
  }, []);

  return (
    <SnackbarProvider maxSnack={3}>
      <Router>
        <div className="App">
          <Sidebar />
          <Routes>
            <Route exact path="/auth" element={<Auth />} />
            <Route exact path="/auth/google/callback" element={<GoogleAuthCallback />} />
            <Route exact path="/" element={<ProtectedRoute component={Overview} />} />
            <Route exact path="/appointments" element={<ProtectedRoute component={AppointmentsPage} />} />
            <Route exact path="/edit-profile" element={<ProtectedRoute component={EditProfilePage} />} />
            <Route exact path="/schedule" element={<ProtectedRoute component={SchedulePage} />} />
            <Route exact path="/admin" element={<ProtectedRouteAdmin component={AdminProfile} />} />
            { /* <Route exact path="/coupons" element={<ProtectedRoute component={CouponsPage} />} /> */}
            <Route exact path="/wallet" element={<ProtectedRoute component={WalletPage} />} />
          </Routes>
        </div>
      </Router>
    </SnackbarProvider>
  );
}

export default App;
