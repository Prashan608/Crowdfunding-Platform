import { useForm } from "react-hook-form";
import { Box, Grid, Typography, Link } from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import AuthLayout from "../../components/common/AuthLayout";
import CommonTextField from "../../components/common/CommonTextField";
import CommonButton from "../../components/common/CommonButton";
import { register } from "../../redux/authSlice";

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading } = useSelector((state) => state.auth);

  const {
    register: registerField,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password");

  const onSubmit = async (data) => {
    try {
      await toast.promise(dispatch(register(data)).unwrap(), {
        loading: "Creating your account...",
        success: (response) =>
          response?.message || "Registration successful.",
        error: (error) =>
          error?.message ||
          error?.data?.message ||
          error ||
          "Registration failed.",
      });

      navigate("/login");
    } catch {
      // toast.promise handles the error message
    }
  };

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Join our Crowdfunding Platform"
    >
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={1.5}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <CommonTextField
              label="First Name"
              size="small"
              error={!!errors.firstName}
              helperText={errors.firstName?.message}
              {...registerField("firstName", {
                required: "First name is required",
              })}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <CommonTextField
              label="Last Name"
              size="small"
              error={!!errors.lastName}
              helperText={errors.lastName?.message}
              {...registerField("lastName", {
                required: "Last name is required",
              })}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <CommonTextField
              label="Email"
              type="email"
              size="small"
              error={!!errors.email}
              helperText={errors.email?.message}
              {...registerField("email", {
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
              label="Phone Number"
              size="small"
              error={!!errors.phone}
              helperText={errors.phone?.message}
              {...registerField("phone", {
                required: "Phone number is required",
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: "Enter a valid 10 digit phone number",
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
              {...registerField("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <CommonTextField
              label="Confirm Password"
              type="password"
              size="small"
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
              {...registerField("confirmPassword", {
                required: "Confirm password is required",
                validate: (value) =>
                  value === password || "Passwords do not match",
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
              Register
            </CommonButton>
          </Grid>
        </Grid>
      </Box>

      <Typography variant="body2" sx={{ textAlign: "center", mt: 2 }}>
        Already have an account?{" "}
        <Link component={RouterLink} to="/login" underline="hover">
          Login
        </Link>
      </Typography>
    </AuthLayout>
  );
};

export default Register;










































































































































// import { useForm } from "react-hook-form";
// import { Box, Container, Grid, Paper, Typography, Link } from "@mui/material";
// import { Link as RouterLink, useNavigate } from "react-router-dom";
// import { toast } from "react-hot-toast";
// import { useDispatch, useSelector } from "react-redux";
// import CommonTextField from "../../components/common/CommonTextField";
// import CommonButton from "../../components/common/CommonButton";
// import { register } from "../../redux/authSlice";

// const Register = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const { loading } = useSelector((state) => state.auth);

//   const {
//     register: registerField,
//     handleSubmit,
//     watch,
//     formState: { errors },
//   } = useForm();

//   const password = watch("password");

//   const onSubmit = async (data) => {
//     try {
//       console.log(data);
//       const response = await dispatch(register(data)).unwrap();

//       toast.success(response.message || "Registration successful.");

//       navigate("/login");
//     } catch (error) {
//       const message =
//         error?.message ||
//         error?.data?.message ||
//         error ||
//         "Registration failed.";

//       toast.error(message);
//       console.log(message);
//     }
//   };

//   return (
//     <Container maxWidth="sm">
//       <Box
//         minHeight="100vh"
//         display="flex"
//         justifyContent="center"
//         alignItems="center"
//       >
//         <Paper
//           elevation={3}
//           sx={{
//             width: "100%",
//             p: 4,
//             borderRadius: 3,
//           }}
//         >
//           <Typography
//             variant="h4"
//             fontWeight={700}
//             textAlign="center"
//             gutterBottom
//           >
//             Create Account
//           </Typography>

//           <Typography
//             variant="body2"
//             color="text.secondary"
//             textAlign="center"
//             mb={3}
//           >
//             Join our Crowdfunding Platform
//           </Typography>

//           <Box component="form" onSubmit={handleSubmit(onSubmit)}>
//             <Grid container spacing={2}>
//               <Grid size={{ xs: 12, md: 6 }}>
//                 <CommonTextField
//                   label="First Name"
//                   error={!!errors.firstName}
//                   helperText={errors.firstName?.message}
//                   {...registerField("firstName", {
//                     required: "First name is required",
//                   })}
//                 />
//               </Grid>

//               <Grid size={{ xs: 12, md: 6 }}>
//                 <CommonTextField
//                   label="Last Name"
//                   error={!!errors.lastName}
//                   helperText={errors.lastName?.message}
//                   {...registerField("lastName", {
//                     required: "Last name is required",
//                   })}
//                 />
//               </Grid>

//               <Grid size={{ xs: 12 }}>
//                 <CommonTextField
//                   label="Email"
//                   type="email"
//                   error={!!errors.email}
//                   helperText={errors.email?.message}
//                   {...registerField("email", {
//                     required: "Email is required",
//                   })}
//                 />
//               </Grid>

//               <Grid size={{ xs: 12 }}>
//                 <CommonTextField
//                   label="Phone Number"
//                   error={!!errors.phone}
//                   helperText={errors.phone?.message}
//                   {...registerField("phone", {
//                     required: "Phone number is required",
//                   })}
//                 />
//               </Grid>

//               <Grid size={{ xs: 12 }}>
//                 <CommonTextField
//                   label="Password"
//                   type="password"
//                   error={!!errors.password}
//                   helperText={errors.password?.message}
//                   {...registerField("password", {
//                     required: "Password is required",
//                     minLength: {
//                       value: 6,
//                       message: "Password must be at least 6 characters",
//                     },
//                   })}
//                 />
//               </Grid>

//               <Grid size={{ xs: 12 }}>
//                 <CommonTextField
//                   label="Confirm Password"
//                   type="password"
//                   error={!!errors.confirmPassword}
//                   helperText={errors.confirmPassword?.message}
//                   {...registerField("confirmPassword", {
//                     required: "Confirm Password is required",
//                     validate: (value) =>
//                       value === password || "Passwords do not match",
//                   })}
//                 />
//               </Grid>

//               <Grid size={{ xs: 12 }}>
//                 <CommonButton type="submit" loading={loading}>
//                   Register
//                 </CommonButton>
//               </Grid>
//             </Grid>
//           </Box>

//           <Typography textAlign="center" mt={3}>
//             Already have an account?{" "}
//             <Link component={RouterLink} to="/login" underline="hover">
//               Login
//             </Link>
//           </Typography>
//         </Paper>
//       </Box>
//     </Container>
//   );
// };

// export default Register;
