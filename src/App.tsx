import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Auth from './pages/Auth';
import SelectAnalysis from './pages/SelectAnalysis';
import IndividualAnalysis from './pages/IndividualAnalysis';
import GroupAnalysis from './pages/GroupAnalysis';

function AuthRedirect() {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  return user ? <Navigate to="/select-analysis" replace /> : <Navigate to="/auth" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<AuthRedirect />} />
          <Route path="/auth" element={<Auth />} />
          <Route
            path="/select-analysis"
            element={
              <ProtectedRoute>
                <SelectAnalysis />
              </ProtectedRoute>
            }
          />
          <Route
            path="/individual-analysis"
            element={
              <ProtectedRoute>
                <IndividualAnalysis />
              </ProtectedRoute>
            }
          />
          <Route
            path="/group-analysis"
            element={
              <ProtectedRoute>
                <GroupAnalysis />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
