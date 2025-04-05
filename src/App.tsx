import { ConfigProvider, Layout, theme } from 'antd';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Header from './components/Header';
import LoginPage from './components/LoginPage';
import RegistrationPage from './components/RegistrationPage';
import { AuthProvider, PublicRoute, useAuth, ProtectedRoute } from './context/AuthContext';
import { LoadingProvider, useLoading } from './context/LoadingContext';
import { LazyNoticeBoard, LazyNoticeDetails, LazyCreateNotice } from './features/notices';

// Layout wrapper for authenticated pages
const AuthenticatedLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Layout className="min-h-screen">
      <Header />
      <Layout.Content className="bg-yt-black">
        {children}
      </Layout.Content>
    </Layout>
  );
};

function App() {
  return (
    <Router>
      <ConfigProvider
        theme={{
          algorithm: theme.darkAlgorithm,
        }}
      >
        <LoadingProvider>
          <AuthProvider>
            <Routes>
              {/* Public Routes */}
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <LoginPage />
                  </PublicRoute>
                }
              />
              <Route
                path="/register"
                element={
                  <PublicRoute>
                    <RegistrationPage />
                  </PublicRoute>
                }
              />

              {/* Protected Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <AuthenticatedLayout>
                      <Dashboard />
                    </AuthenticatedLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/notice-board"
                element={
                  <ProtectedRoute>
                    <AuthenticatedLayout>
                      <LazyNoticeBoard />
                    </AuthenticatedLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/notices/create"
                element={
                  <ProtectedRoute requiredPermission="create:notice">
                    <AuthenticatedLayout>
                      <LazyCreateNotice />
                    </AuthenticatedLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/notices/:id"
                element={
                  <ProtectedRoute>
                    <AuthenticatedLayout>
                      <LazyNoticeDetails />
                    </AuthenticatedLayout>
                  </ProtectedRoute>
                }
              />

              {/* Default Route */}
              <Route
                path="/"
                element={<DefaultRoute />}
              />

              {/* Catch all other routes */}
              <Route
                path="*"
                element={<DefaultRoute />}
              />
            </Routes>
          </AuthProvider>
        </LoadingProvider>
      </ConfigProvider>
    </Router>
  );
}

// Helper component for default routing
const DefaultRoute = () => {
  const { isAuthenticated } = useAuth();
  const { isLoading } = useLoading();

  if (isLoading) {
    return null;
  }

  return isAuthenticated ? 
    <Navigate to="/dashboard" replace /> : 
    <Navigate to="/login" replace />;
};

export default App;
