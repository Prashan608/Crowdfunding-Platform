import { Box, CircularProgress } from "@mui/material";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const getDashboardPathByRole = (role) => {
  if (role === "admin") return "/dashboard/admin";
  if (role === "creator") return "/dashboard/creator";
  return "/dashboard/supporter";
};

const RoleBasedRoute = ({ allowedRoles = [] }) => {
  const { user, loading, isAuthenticated } = useSelector((state) => state.auth);
  
console.log("Loading:", loading);
console.log("Authenticated:", isAuthenticated);
console.log("User:", user);
console.log("Allowed Roles:", allowedRoles);

  if (loading) {
    return (
      <Box
        sx={{
          width: "100%",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#f8fafc",
        }}
      >
        <CircularProgress sx={{ color: "#16a34a" }} />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user?.role) {
    return <Navigate to="/dashboard" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={getDashboardPathByRole(user.role)} replace />;
  }

  return <Outlet />;
};

export default RoleBasedRoute;