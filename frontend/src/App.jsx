import { Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';

import Landing        from '@/pages/Landing';
import Login          from '@/pages/Login';
import Register       from '@/pages/Register';
import DashboardLayout from '@/layouts/DashboardLayout';

// Worker pages
import WorkerDashboard from '@/pages/worker/Dashboard';
import WorkerPolicy    from '@/pages/worker/Policy';
import WorkerClaims    from '@/pages/worker/Claims';
import ClaimAutomation from '@/pages/worker/ClaimAutomation';

// Admin pages
import AdminDashboard  from '@/pages/admin/Dashboard';
import AdminAnalytics  from '@/pages/admin/Analytics';
import AdminFraud      from '@/pages/admin/FraudAlerts';
import AdminWorkers    from '@/pages/admin/Workers';

const PrivateRoute = ({ children, role }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;
  return children;
};

export default function App() {
  return (
    <AnimatePresence mode="wait">
      <Routes>
        {/* Public */}
        <Route path="/"         element={<Landing />} />
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Worker */}
        <Route path="/dashboard" element={
          <PrivateRoute role="worker">
            <DashboardLayout role="worker" />
          </PrivateRoute>
        }>
          <Route index element={<WorkerDashboard />} />
          <Route path="policy"    element={<WorkerPolicy />} />
          <Route path="claims"    element={<WorkerClaims />} />
          <Route path="triggers"  element={<ClaimAutomation />} />
        </Route>

        {/* Admin */}
        <Route path="/admin" element={
          <PrivateRoute role="admin">
            <DashboardLayout role="admin" />
          </PrivateRoute>
        }>
          <Route index element={<AdminDashboard />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="fraud"     element={<AdminFraud />} />
          <Route path="workers"   element={<AdminWorkers />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}
