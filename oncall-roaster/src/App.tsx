import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import CreateRoster from "./pages/CreateRoster";
import Availability from "./pages/Availability";
import Teams from "./pages/Teams";
import Members from "./pages/Members";
import ResetPassword from "./pages/ResetPassword";
import { useAuth } from "./context/AuthContext";

const App = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/create-roster"
        element={
          <ProtectedRoute>
            <Layout>
              <CreateRoster />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/availability"
        element={
          <ProtectedRoute>
            <Layout>
              <Availability />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/teams"
        element={
          <ProtectedRoute>
            <Layout>
              <Teams />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/members"
        element={
          <ProtectedRoute>
            <Layout>
              <Members />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Default Route */}
      <Route
        path="*"
        element={
          <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />
        }
      />
    </Routes>
  );
};

export default App;
