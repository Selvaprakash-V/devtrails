import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Splash from './pages/Splash';
import Onboarding from './pages/Onboarding';
import OTPVerification from './pages/OTPVerification';
import Permissions from './pages/Permissions';
import Dashboard from './pages/Dashboard';
import Payouts from './pages/Payouts';

function ProtectedRoute({ children }) {
  const isAuthenticated = !!localStorage.getItem('workerToken');
  const hasLocationPermission = !!localStorage.getItem('locationPermission');

  if (!isAuthenticated) {
    return <Navigate to="/onboarding" replace />;
  }

  if (!hasLocationPermission) {
    return <Navigate to="/permissions" replace />;
  }

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/otp" element={<OTPVerification />} />
        <Route path="/permissions" element={<Permissions />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payouts"
          element={
            <ProtectedRoute>
              <Payouts />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
