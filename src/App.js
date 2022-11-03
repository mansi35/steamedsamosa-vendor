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
import WalletPage from './pages/WalletPage/WalletPage';
import Sidebar from './components/Sidebar/Sidebar';
import { getSchedule } from './actions/schedule';
import { getWorkExp } from './actions/workExps';
import './App.scss';

function App() {
  const profile = JSON.parse(localStorage.getItem('profile'));
  const dispatch = useDispatch();

  useEffect(() => {
    if (profile?.jwt) {
      dispatch(getSchedule(profile?.user?.id));
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
            <Route exact path="/" element={<ProtectedRoute component={Overview} />} />
            <Route exact path="/appointments" element={<ProtectedRoute component={AppointmentsPage} />} />
            <Route exact path="/edit-profile" element={<ProtectedRoute component={EditProfilePage} />} />
            <Route exact path="/schedule" element={<ProtectedRoute component={SchedulePage} />} />
            <Route exact path="/wallet" element={<ProtectedRoute component={WalletPage} />} />
          </Routes>
        </div>
      </Router>
    </SnackbarProvider>
  );
}

export default App;
