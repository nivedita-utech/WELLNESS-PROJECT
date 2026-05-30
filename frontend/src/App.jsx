import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Login from './pages/Login';
import UserDashboard from './pages/UserDashboard';
import StaffDashboard from './pages/StaffDashboard';
import FranchiseDashboard from './pages/FranchiseDashboard';
import AdminDashboard from './pages/AdminDashboard';
import { Activity, LogOut } from 'lucide-react';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: '#10b981' }}>Loading Aura Platform...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

const DashboardRedirect = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: '#10b981' }}>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  switch (user.role) {
    case 'admin':
      return <Navigate to="/admin" replace />;
    case 'franchise':
      return <Navigate to="/franchise" replace />;
    case 'staff':
      return <Navigate to="/staff" replace />;
    case 'user':
    default:
      return <Navigate to="/user" replace />;
  }
};

const MainLayout = ({ children }) => {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="app-container">
      <nav className="navbar">
        <Link to="/" className="nav-brand">
          <Activity size={24} color="#10b981" />
          <span>AURA<span className="brand-accent">WELLNESS</span></span>
        </Link>
        {user && (
          <div className="nav-links">
            <span className="nav-link" style={{ cursor: 'default' }}>
              Hello, <strong>{user.name}</strong>
            </span>
            <span className="user-tag">{user.role}</span>
            <button onClick={logout} className="btn btn-secondary btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
              <LogOut size={14} />
              <span>Logout</span>
            </button>
          </div>
        )}
      </nav>
      <main style={{ flexGrow: 1 }}>{children}</main>
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route
            path="/user"
            element={
              <ProtectedRoute allowedRoles={['user']}>
                <MainLayout>
                  <UserDashboard />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/staff"
            element={
              <ProtectedRoute allowedRoles={['staff']}>
                <MainLayout>
                  <StaffDashboard />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/franchise"
            element={
              <ProtectedRoute allowedRoles={['franchise']}>
                <MainLayout>
                  <FranchiseDashboard />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <MainLayout>
                  <AdminDashboard />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route path="/dashboard" element={<DashboardRedirect />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
