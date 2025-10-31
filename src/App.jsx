import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./context/AuthProvider";
import { useAuth } from "./context/useAuth";
import PrivateRoute from "./components/PrivateRoute";
import Layout from "./layout/Layout";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import AuditList from "./pages/AuditList";
import AuditDetail from "./pages/AuditDetail";

// Auth pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import VerifyEmail from "./pages/auth/VerifyEmail";
import Otp from "./pages/auth/Otp";
import Recovery from "./pages/auth/Recovery";
import ResetPassword from "./pages/auth/ResetPassword";

import NotFound from "./pages/NotFound";
import Spinner from "./components/Spinner";

function Shell({ title, children }) {
  return <Layout title={title}>{children}</Layout>;
}

function Gate() {
  const { ready } = useAuth();
  if (!ready) return <Spinner />;
  return (
    <Routes>
      {/* Público */}
      <Route path="/auth/login" element={<Login />} />
      <Route path="/auth/register" element={<Register />} />
      <Route path="/auth/verify-email" element={<VerifyEmail />} />
      <Route path="/auth/otp" element={<Otp />} />
      <Route path="/auth/recovery" element={<Recovery />} />
      <Route path="/auth/reset-password" element={<ResetPassword />} />

      {/* Restrito */}
      <Route element={<PrivateRoute />}>
        <Route path="/" element={<Shell title="Home"><Home /></Shell>} />
        <Route path="/dashboard" element={<Shell title="Dashboard"><Dashboard /></Shell>} />
        <Route path="/audit" element={<Shell title="Audit Events"><AuditList /></Shell>} />
        <Route path="/audit/:id" element={<Shell title="Audit Detail"><AuditDetail /></Shell>} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Gate />
      </BrowserRouter>
      <ToastContainer position="top-right" newestOnTop closeOnClick pauseOnHover autoClose={1500} />
    </AuthProvider>
  );
}
