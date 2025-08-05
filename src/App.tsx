import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useAppContext } from './context/AppContext';
import Navigation from './components/layout/Navigation';
import Login from './components/auth/Login';
import DealerDashboard from './components/dealer/DealerDashboard';
import ParkingSlotManager from './components/dealer/ParkingSlotManager';
import CreateLot from './components/dealer/CreateLot';
import LocationSearch from './components/customer/LocationSearch';
import BookingInterface from './components/customer/BookingInterface';
import BookingConfirmation from './components/customer/BookingConfirmation';
import MyBookings from './components/customer/MyBookings';

const ProtectedRoute: React.FC<{ children: React.ReactNode; userType?: 'dealer' | 'customer' }> = ({
  children,
  userType
}) => {
  const { currentUser } = useAppContext();

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  if (userType && currentUser.type !== userType) {
    return <Navigate to={currentUser.type === 'dealer' ? '/dealer/dashboard' : '/customer/search'} />;
  }

  return <>{children}</>;
};

const AppContent: React.FC = () => {
  const { currentUser } = useAppContext();

  return (
    <div className="min-h-screen bg-gray-50">
      {currentUser && <Navigation />}

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={
          <Navigate to={currentUser ? (currentUser.type === 'dealer' ? '/dealer/dashboard' : '/customer/search') : '/login'} />
        } />

        {/* Dealer Routes */}
        <Route path="/dealer/dashboard" element={
          <ProtectedRoute userType="dealer">
            <DealerDashboard />
          </ProtectedRoute>
        } />
        <Route path="/dealer/slots" element={
          <ProtectedRoute userType="dealer">
            <ParkingSlotManager />
          </ProtectedRoute>
        } />
        <Route path="/dealer/create-lot" element={
          <ProtectedRoute userType="dealer">
            <CreateLot />
          </ProtectedRoute>
        } />

        {/* Customer Routes */}
        <Route path="/customer/search" element={
          <ProtectedRoute userType="customer">
            <LocationSearch />
          </ProtectedRoute>
        } />
        <Route path="/customer/booking/:locationId" element={
          <ProtectedRoute userType="customer">
            <BookingInterface />
          </ProtectedRoute>
        } />
        <Route path="/customer/confirmation" element={
          <ProtectedRoute userType="customer">
            <BookingConfirmation />
          </ProtectedRoute>
        } />
        <Route path="/customer/bookings" element={
          <ProtectedRoute userType="customer">
            <MyBookings />
          </ProtectedRoute>
        } />
      </Routes>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <Router>
        <AppContent />
      </Router>
    </AppProvider>
  );
};

export default App;