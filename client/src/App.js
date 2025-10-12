import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';


import OrgMap from './components/OrgMap';
import Navbar from './components/Navbar';
import OrgProfile from './pages/OrgProfile';
import OrgDashboard from './pages/OrgDashboard';
import Home from './pages/Home';
import ProtectedRoute from './components/ProtectedRoute';
import AuthPage from './pages/AuthPage';
import StudentDashboard from './pages/StudentDashboard';
import { useAuth } from "./context/AuthContext";


function App() {
  const { user, loading, logout, login } = useAuth();

  if (loading) return <div>Loading...</div>;

  return (
    <Router>
      <div className="bg-gray-100 min-h-screen">
      <Navbar user={user} onLogout={logout} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/orgmap" element={<OrgMap />} />
        <Route path="/org/:orgId" element={<OrgProfile user={user} />} />
        <Route path="/auth" element={<AuthPage onLogin={login} />} />
        <Route path="/dashboard" element={<OrgDashboard />} />
        <Route path="/studentdashboard" element={<StudentDashboard />} />
        <Route path="/protectedroute" element={<ProtectedRoute />} />
      </Routes>
     </div>
    </Router>
  );
}

export default App;
