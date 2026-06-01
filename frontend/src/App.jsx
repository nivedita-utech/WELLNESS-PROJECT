import React, { useContext, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Login from './pages/Login';
import UserDashboard from './pages/UserDashboard';
import StaffDashboard from './pages/StaffDashboard';
import FranchiseDashboard from './pages/FranchiseDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Members from './pages/Members';
import Billing from './pages/Billing';
import Settings from './pages/Settings';
import { Activity, LogOut, LayoutDashboard, Bell, Search, Menu, X, Settings as SettingsIcon, Users, CreditCard } from 'lucide-react';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div className="flex justify-center items-center h-screen bg-slate-50 text-brand-teal font-semibold">Loading Aura Platform...</div>;
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
    return <div className="flex justify-center items-center h-screen bg-slate-50 text-brand-teal font-semibold">Loading...</div>;
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

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  if (!user) return null;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-slate-200 z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6">
            <Link to="/" className="flex items-center gap-2">
              <div className="p-2 bg-brand-teal rounded-xl">
                <Activity size={24} className="text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-800">
                Aura<span className="text-brand-teal">Wellness</span>
              </span>
            </Link>
            <button onClick={() => setIsOpen(false)} className="lg:hidden text-slate-500 hover:text-slate-800">
              <X size={24} />
            </button>
          </div>

          <div className="px-6 py-4">
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-teal to-brand-sky flex items-center justify-center text-white font-bold text-lg">
                {user.name.charAt(0)}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-semibold text-slate-800 truncate">{user.name}</p>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{user.role}</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
            <Link to="/dashboard" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${['/dashboard', '/admin', '/user', '/staff', '/franchise'].includes(location.pathname) ? 'bg-brand-teal/10 text-brand-teal' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
              <LayoutDashboard size={20} />
              Overview
            </Link>
            {/* These can be conditionally rendered based on role later */}
            {['admin', 'franchise'].includes(user.role) && (
              <Link to="/members" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${location.pathname.startsWith('/members') ? 'bg-brand-teal/10 text-brand-teal' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
                <Users size={20} />
                Members
              </Link>
            )}
            {['admin', 'franchise', 'user'].includes(user.role) && (
              <Link to="/billing" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${location.pathname.startsWith('/billing') ? 'bg-brand-teal/10 text-brand-teal' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
                <CreditCard size={20} />
                Billing
              </Link>
            )}
            {['admin', 'franchise', 'user'].includes(user.role) && (
              <Link to="/settings" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${location.pathname.startsWith('/settings') ? 'bg-brand-teal/10 text-brand-teal' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
                <SettingsIcon size={20} />
                Settings
              </Link>
            )}
          </nav>

          <div className="p-4 border-t border-slate-100">
            <button
              onClick={logout}
              className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-slate-600 hover:bg-red-50 hover:text-red-600 font-medium transition-colors"
            >
              <LogOut size={20} />
              Sign Out
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

const Header = ({ setIsOpen }) => {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30 px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsOpen(true)}
          className="lg:hidden p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <Menu size={24} />
        </button>
        <div className="hidden sm:flex items-center px-3 py-2 bg-slate-100 rounded-lg text-slate-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-brand-sky/20 focus-within:text-slate-800 transition-all">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent border-none outline-none ml-2 text-sm w-64 placeholder:text-slate-400"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
      </div>
    </header>
  );
};

const MainLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className="flex-1 flex flex-col lg:pl-64 min-w-0 transition-all duration-300">
        <Header setIsOpen={setIsSidebarOpen} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
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

          <Route
            path="/members"
            element={
              <ProtectedRoute allowedRoles={['admin', 'franchise']}>
                <MainLayout>
                  <Members />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/billing"
            element={
              <ProtectedRoute allowedRoles={['admin', 'franchise', 'user']}>
                <MainLayout>
                  <Billing />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <ProtectedRoute allowedRoles={['admin', 'franchise', 'user']}>
                <MainLayout>
                  <Settings />
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

