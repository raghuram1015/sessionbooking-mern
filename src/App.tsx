import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import SignIn from './components/Auth/SignIn';
import SignUp from './components/Auth/SignUp';
import MainLayout from './components/Layout/MainLayout';
import BrowseSessions from './pages/BrowseSessions';
import HostSession from './pages/HostSession';
import MyBookings from './pages/MyBookings';
import MySessions from './pages/MySessions';

function AppContent() {
  const [showSignUp, setShowSignUp] = useState(false);
  const [currentPage, setCurrentPage] = useState('browse');
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return showSignUp ? (
      <SignUp onToggle={() => setShowSignUp(false)} />
    ) : (
      <SignIn onToggle={() => setShowSignUp(true)} />
    );
  }

  return (
    <MainLayout currentPage={currentPage} onNavigate={setCurrentPage}>
      {currentPage === 'browse' && <BrowseSessions />}
      {currentPage === 'host' && <HostSession onNavigate={setCurrentPage} />}
      {currentPage === 'bookings' && <MyBookings />}
      {currentPage === 'sessions' && <MySessions />}
    </MainLayout>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
