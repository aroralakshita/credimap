import React from 'react';
import { useNavigate } from 'react-router-dom';

function StudentDashboard({ user, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    onLogout();
    navigate('/login');
  };

  return (
    <div className="max-w-2xl mx-auto mt-16 bg-white p-8 rounded-xl shadow-lg text-center">
      <h1 className="text-3xl font-bold mb-4">Welcome, {user.name}!</h1>
      <p className="text-lg mb-6">You are logged in as: <span className="font-semibold">{user.role}</span></p>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Explore Organizations</h2>
        <button 
          onClick={() => navigate('/')} 
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Browse Map
        </button>
      </div>

      <button 
        onClick={handleLogout} 
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
      >
        Logout
      </button>
    </div>
  );
}

export default StudentDashboard;
