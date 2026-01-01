import { Routes, Route, Navigate } from "react-router-dom";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import UserDashboard from "@/pages/UserDashboard";
import DonationForm from "@/pages/DonationForm";
import AdminDashboard from "@/pages/AdminDashboard";
import CampaignManagement from "@/pages/CampaignManagement";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";
import ExploreCampaigns from "@/pages/ExploreCampaigns";

function App() {
  const token = localStorage.getItem("token");

  // ✅ SAFE user parsing (white screen fix)
  let user = null;
  try {
    const storedUser = localStorage.getItem("user");
    user = storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    console.error("Invalid user data in localStorage", error);
    user = null;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      {/* Navbar sirf login ke baad */}
   

      <Routes>
        {/* -------- Public Routes -------- */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* -------- Protected User Routes -------- */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/campaigns" element={<ExploreCampaigns />} />
          <Route path="/donate" element={<DonationForm />} />
        </Route>

        {/* -------- Protected Admin Routes -------- */}
        <Route element={<ProtectedRoute adminOnly={true} />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/campaigns" element={<CampaignManagement />} />
        </Route>

        {/* -------- Root Redirect -------- */}
        <Route
          path="/"
          element={
            token ? (
              user?.role === "admin" ? (
                <Navigate to="/admin/dashboard" replace />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* -------- Fallback -------- */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  );
}

export default App;
