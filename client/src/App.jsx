import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import SessionsListPage from './pages/SessionsListPage';
import MySessionsPage from './pages/MySessionsPage';
import CreateSessionPage from './pages/CreateSessionPage';
import Navbar from './components/Navbar';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <div className="container mx-auto py-4">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/sessions" element={<SessionsListPage />} />
            <Route path="/my-sessions" element={<MySessionsPage />} />
            <Route path="/create-session" element={<CreateSessionPage />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

