import React from 'react';
import OrgDashboard from './OrgDashboard';
import StudentDashboard from './StudentDashboard';
import { useNavigate } from 'react-router-dom';

function DashboardRouter({ user, onLogout }) {
  const navigate = useNavigate();

  if (!user) {
    navigate('/login');
    return null;
  }

  if (user.role === 'organization') {
    return <OrgDashboard user={user} onLogout={onLogout} />;
  }

  if (user.role === 'student') {
    return <StudentDashboard user={user} onLogout={onLogout} />;
  }

  return <p className="text-center mt-10">Unknown user role.</p>;
}

export default DashboardRouter;
