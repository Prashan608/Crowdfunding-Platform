import { useForm } from "react-hook-form";
import { Box, Container, Grid, Paper, Typography, Link } from "@mui/material";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import CommonTextField from "../../components/common/CommonTextField";
import CommonButton from "../../components/common/CommonButton";
import { resetPasswordThunk } from "../../redux/authSlice";

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password");

  const onSubmit = async (data) => {
    try {
      const payload = {
        password: data.password,
        confirmPassword: data.confirmPassword,
      };

      const response = await dispatch(
        resetPasswordThunk({ token, data: payload })
      ).unwrap();

      toast.success(response?.message || "Password reset successful.");

      navigate("/login");
    } catch (error) {
      const message =
        error?.message ||
        error?.data?.message ||
        error ||
        "Password reset failed.";

      toast.error(message);
    }
  };

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          py: 3,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            width: "100%",
            p: { xs: 2.5, sm: 3 },
            borderRadius: 2,
          }}
        >
          <Typography
            variant="h5"
            fontWeight={700}
            sx={{ textAlign: "center" }}
          >
            Reset Password
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              textAlign: "center",
              mt: 0.5,
              mb: 2,
            }}
          >
            Enter your new password below.
          </Typography>

          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={1.5}>
              <Grid size={{ xs: 12 }}>
                <CommonTextField
                  label="New Password"
                  type="password"
                  size="small"
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  {...register("password", {
                    required: "New password is required",
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
                  {...register("confirmPassword", {
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
                  Reset Password
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
        </Paper>
      </Box>
    </Container>
  );
};

export default ResetPasswordPage;
