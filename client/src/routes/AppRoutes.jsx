import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/auth/LoginPage";
import Register from "../pages/auth/RegisterPage";
import ForgotPasswordPage from "../pages/auth/ForgotPassword";
import ResetPasswordPage from "../pages/auth/ResetPassword";
// import DashboardPage from "../pages/dashboard/SupporterDashboardPage";
import CreatorDashboard from "../pages/dashboard/CreatorDashboard";
import DashboardPage from "../pages/dashboard/DashboardPage";
import CampaignListPage from "../pages/campaign/CampaignListPage";
import CampaignDetailPage from "../pages/campaign/CampaignDetailPage";
import CreateCampaignPage from "../pages/campaign/CreateCampaignPage";
import ProfilePage from "../pages/profile/ProfilePage";
import PaymentPage from "../pages/payment/PaymentPage";
import PaymentDetailPage from "../pages/payment/PaymentDetailsPage";
import NotificationPage from "../pages/notification/NotificationPage";
import PrivateRoute from "./PrivateRoute";
import RoleBasedRoute from "./RoleBasedRoute";
import SupporterDashboard from "../pages/dashboard/SupporterDashboardPage";
import AdminDashbord from "../pages/dashboard/AdminDashbord";
import AboutPage from "../pages/about/About";
import ContactPage from "../pages/contact/ContactPage";
function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
      <Route path="/campaigns" element={<CampaignListPage />} />
      <Route path="/campaigns/:id" element={<CampaignDetailPage />} />
      <Route path="/campaigns/create" element={<CreateCampaignPage />}/>
      <Route path="/contact" element={<ContactPage/>}/>
      <Route path="/about" element={<AboutPage/>}/>
       

      <Route element={<PrivateRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route element={<RoleBasedRoute allowedRoles={["creator"]} />}>
          <Route path="/dashboard/creator" element={<CreatorDashboard />} />
        </Route>
        <Route element={<RoleBasedRoute allowedRoles={["supporter"]} />}>
          <Route path="/dashboard/supporter" element={<SupporterDashboard />} />
        </Route>
        <Route element={<RoleBasedRoute allowedRoles={["admin"]} />}>
          <Route path="/dashboard/admin" element={<AdminDashbord/>} />
        </Route>

        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/payment/:id" element={<PaymentDetailPage />} />
        <Route path="/notifications" element={<NotificationPage />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
