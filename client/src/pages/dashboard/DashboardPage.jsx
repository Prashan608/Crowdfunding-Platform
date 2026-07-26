import { Box, CircularProgress } from "@mui/material";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const DashboardPage = () => {
  const { user, loading, isAuthenticated } = useSelector((state) => state.auth);
   
 console.log("Redux User:", user);
 console.log("Redux Role:", user?.role);
 
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

  if (user?.role === "admin") {
    return <Navigate to="/dashboard/admin" replace />;
  }

  if (user?.role === "creator") {
    return <Navigate to="/dashboard/creator" replace />;
  }

  return <Navigate to="/dashboard/supporter" replace />;
};

export default DashboardPage;