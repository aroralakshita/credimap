import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';

import Register from './pages/Register';
import Login from './pages/Login';
import DashboardRouter from './pages/DashboardRouter';
import OrgMap from './components/OrgMap';
import Navbar from './components/Navbar';
import OrgProfile from './pages/OrgProfile';
import OrgDashboard from './pages/OrgDashboard';
import Home from './pages/Home';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // show loading screen before we know if user is logged in

  // ✅ Run once on page load
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });

        setUser(res.data.user);
      } catch (err) {
        console.error('Invalid or expired token');
        localStorage.removeItem('token'); // Remove bad token
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);
  };

const handleLogout = () => {
  localStorage.removeItem("token");
  setUser(null);
};



  if (loading) return <div>Loading...</div>;

  return (
    <Router>
      <div className="bg-gray-100 min-h-screen">
      <Navbar user={user} onLogout={() => {
        setUser(null);
        localStorage.removeItem('token');
      }} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/orgmap" element={<OrgMap />} />
        <Route path="/register" element={<Register />} />
        <Route path="/protectedroute" element={<ProtectedRoute />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/org/:orgId" element={<OrgProfile user={user} />} />

        
        <Route
  path="/dashboard"
  element={
    user ? (
      <OrgDashboard />
    ) : (
      <div className="p-6 text-center text-red-600">You must be logged in to view this page.</div>
    )
  }
/>
      
      </Routes>
     </div>
    </Router>
  );
}

export default App;
