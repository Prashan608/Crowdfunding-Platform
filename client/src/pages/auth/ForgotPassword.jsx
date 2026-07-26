import { useForm } from "react-hook-form";
import { Box, Grid, Typography, Link } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import AuthLayout from "../../components/common/AuthLayout";
import CommonTextField from "../../components/common/CommonTextField";
import CommonButton from "../../components/common/CommonButton";
import { forgotPasswordThunk } from "../../redux/authSlice";

const ForgotPasswordPage = () => {
  const dispatch = useDispatch();

  const { loading } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      await toast.promise(dispatch(forgotPasswordThunk(data)).unwrap(), {
        loading: "Sending reset link...",
        success: (response) =>
          response?.message || "Password reset link sent to your email.",
        error: (error) =>
          error?.message ||
          error?.data?.message ||
          error ||
          "Failed to send reset link.",
      });

      reset();
    } catch {
      // toast.promise handles the error message
    }
  };

  return (
    <AuthLayout
      title="Forgot Password"
      subtitle="Enter your email and we will send you a password reset link."
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
            <CommonButton
              type="submit"
              loading={loading}
              size="medium"
              sx={{ py: 1 }}
            >
              Send Reset Link
            </CommonButton>
          </Grid>
        </Grid>
      </Box>

      <Typography variant="body2" sx={{ textAlign: "center", mt: 2 }}>
        Remember password?{" "}
        <Link component={RouterLink} to="/login" underline="hover">
          Login
        </Link>
      </Typography>
    </AuthLayout>
  );
};

export default ForgotPasswordPage;