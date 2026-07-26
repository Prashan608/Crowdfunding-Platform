import { useForm } from "react-hook-form";
import { Box, Grid, Typography, Link } from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import AuthLayout from "../../components/common/AuthLayout";
import CommonTextField from "../../components/common/CommonTextField";
import CommonButton from "../../components/common/CommonButton";
import { login } from "../../redux/authSlice";

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      await toast.promise(dispatch(login(data)).unwrap(), {
        loading: "Logging in...",
        success: (response) => response?.message || "Login successful.",
        error: (error) =>
          error?.message || error?.data?.message || error || "Login failed.",
      });

      navigate("/dashboard");
    } catch {
      // toast.promise handles the error message
      await toast.promise("Something went wrong");
    }
  };

  return (
    <AuthLayout
      title="Login"
      subtitle="Welcome back to Crowdfunding Platform"
    >
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={1.5}>
          <Grid size={{ xs: 12 }}>
            <CommonTextField
              label="Email"
              type="email"
              size="small"
              error={!!errors.email}
              helperText={errors.email?.message}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email address",
                },
              })}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <CommonTextField
              label="Password"
              type="password"
              size="small"
              error={!!errors.password}
              helperText={errors.password?.message}
              {...register("password", {
                required: "Password is required",
              })}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <CommonButton
              type="submit"
              loading={loading}
              size="medium"
              sx={{ py: 1 }}
            >
              Login
            </CommonButton>
          </Grid>
        </Grid>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mt: 2,
          gap: 2,
        }}
      >
        <Link
          component={RouterLink}
          to="/forgot-password"
          underline="hover"
          variant="body2"
        >
          Forgot password?
        </Link>

        <Typography variant="body2">
          New user?{" "}
          <Link component={RouterLink} to="/register" underline="hover">
            Register
          </Link>
        </Typography>
      </Box>
    </AuthLayout>
  );
};

export default LoginPage;


















































// import { useForm } from "react-hook-form";
// import { Box, Container, Grid, Paper, Typography, Link } from "@mui/material";
// import { Link as RouterLink, useNavigate } from "react-router-dom";
// import { toast } from "react-hot-toast";
// import { useDispatch, useSelector } from "react-redux";
// import CommonTextField from "../../components/common/CommonTextField";
// import CommonButton from "../../components/common/CommonButton";
// import { login } from "../../redux/authSlice";

// const LoginPage = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const { loading } = useSelector((state) => state.auth);

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm({
//     defaultValues: {
//       email: "",
//       password: "",
//     },
//   });

//   const onSubmit = async (data) => {
//     try {
//       const response = await dispatch(login(data)).unwrap();

//       toast.success(response.message || "Login successful.");

//       navigate("/dashboard");
//     } catch (error) {
//       const message =
//         error?.message || error?.data?.message || error || "Login failed.";

//       toast.error(message);
//     }
//   };

//   return (
//     <Container maxWidth="xs">
//       <Box
//         minHeight="100vh"
//         display="flex"
//         justifyContent="center"
//         alignItems="center"
//         py={3}
//       >
//         <Paper
//           elevation={3}
//           sx={{
//             width: "100%",
//             p: { xs: 2.5, sm: 3 },
//             borderRadius: 2,
//           }}
//         >
//           <Typography variant="h5" fontWeight={700} textAlign="center">
//             Login
//           </Typography>

//           <Typography
//             variant="body2"
//             color="text.secondary"
//             textAlign="center"
//             mb={2}
//           >
//             Welcome back to Crowdfunding Platform
//           </Typography>

//           <Box component="form" onSubmit={handleSubmit(onSubmit)}>
//             <Grid container spacing={1.5}>
//               <Grid size={{ xs: 12 }}>
//                 <CommonTextField
//                   label="Email"
//                   type="email"
//                   size="small"
//                   error={!!errors.email}
//                   helperText={errors.email?.message}
//                   {...register("email", {
//                     required: "Email is required",
//                     pattern: {
//                       value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
//                       message: "Enter a valid email address",
//                     },
//                   })}
//                 />
//               </Grid>

//               <Grid size={{ xs: 12 }}>
//                 <CommonTextField
//                   label="Password"
//                   type="password"
//                   size="small"
//                   error={!!errors.password}
//                   helperText={errors.password?.message}
//                   {...register("password", {
//                     required: "Password is required",
//                   })}
//                 />
//               </Grid>

//               <Grid size={{ xs: 12 }}>
//                 <CommonButton
//                   type="submit"
//                   loading={loading}
//                   size="medium"
//                   sx={{ py: 1 }}
//                 >
//                   Login
//                 </CommonButton>
//               </Grid>
//             </Grid>
//           </Box>

//           <Box
//             display="flex"
//             justifyContent="space-between"
//             alignItems="center"
//             mt={2}
//             gap={2}
//           >
//             <Link
//               component={RouterLink}
//               to="/forgot-password"
//               underline="hover"
//               variant="body2"
//             >
//               Forgot password?
//             </Link>

//             <Typography variant="body2">
//               New user?{" "}
//               <Link component={RouterLink} to="/register" underline="hover">
//                 Register
//               </Link>
//             </Typography>
//           </Box>
//         </Paper>
//       </Box>
//     </Container>
//   );
// };

// export default LoginPage;