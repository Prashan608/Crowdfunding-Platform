import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Avatar,
  Box,
  Chip,
  Container,
  Divider,
  Grid,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import BadgeIcon from "@mui/icons-material/Badge";
import EmailIcon from "@mui/icons-material/Email";
import LockResetIcon from "@mui/icons-material/LockReset";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import SecurityIcon from "@mui/icons-material/Security";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import PublicNavbar from "../../components/common/PublicNavbar";
import CommonButton from "../../components/common/CommonButton";
import CommonTextField from "../../components/common/CommonTextField";
import {
  changePasswordThunk,
  fetchProfile,
  updateProfileThunk,
} from "../../redux/profileSlice";

const getFullName = (user) => {
  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(" ");
  return fullName || user?.name || "User";
};

const formatDate = (date) => {
  if (!date) return "N/A";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
};

const ProfileSkeleton = () => {
  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Skeleton variant="rounded" height={360} sx={{ borderRadius: 3 }} />
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <Skeleton variant="rounded" height={360} sx={{ borderRadius: 3 }} />
          <Skeleton
            variant="rounded"
            height={300}
            sx={{ borderRadius: 3, mt: 3 }}
          />
        </Grid>
      </Grid>
    </Container>
  );
};

const InfoItem = ({ icon, label, value }) => {
  return (
    <Stack direction="row" spacing={1.3} sx={{ alignItems: "center" }}>
      <Avatar
        sx={{
          width: 38,
          height: 38,
          bgcolor: "#dcfce7",
          color: "#16a34a",
        }}
      >
        {icon}
      </Avatar>

      <Box sx={{ minWidth: 0 }}>
        <Typography variant="caption" color="text.secondary">
          {label}
        </Typography>

        <Typography fontWeight={800} sx={{ wordBreak: "break-word" }}>
          {value || "N/A"}
        </Typography>
      </Box>
    </Stack>
  );
};

const ProfilePage = () => {
  const dispatch = useDispatch();

  const { profile, loading, actionLoading, passwordLoading, error } =
    useSelector((state) => state.profile);

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    reset: resetProfileForm,
    formState: { errors: profileErrors },
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPasswordForm,
    watch,
    formState: { errors: passwordErrors },
  } = useForm({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const newPassword = watch("newPassword");

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      resetProfileForm({
        firstName: profile?.firstName || "",
        lastName: profile?.lastName || "",
        phone: profile?.phone || "",
      });
    }
  }, [profile, resetProfileForm]);

  const onUpdateProfile = async (data) => {
    try {
      await toast.promise(dispatch(updateProfileThunk(data)).unwrap(), {
        loading: "Updating profile...",
        success: (response) =>
          response?.message || "Profile updated successfully.",
        error: (err) =>
          err?.message ||
          err?.data?.message ||
          err ||
          "Failed to update profile.",
      });
    } catch {
      // toast.promise handles the error message
    }
  };

  const onChangePassword = async (data) => {
    try {
      await toast.promise(dispatch(changePasswordThunk(data)).unwrap(), {
        loading: "Changing password...",
        success: (response) =>
          response?.message || "Password changed successfully.",
        error: (err) =>
          err?.message ||
          err?.data?.message ||
          err ||
          "Failed to change password.",
      });

      resetPasswordForm();
    } catch {
      // toast.promise handles the error message
    }
  };

  const dashboardPath =
    profile?.role === "admin"
      ? "/dashboard/admin"
      : profile?.role === "creator"
      ? "/dashboard/creator"
      : "/dashboard/supporter";

  return (
    <Box
      component="main"
      sx={{
        width: "100%",
        minHeight: "100vh",
        bgcolor: "#f8fafc",
        overflowX: "hidden",
      }}
    >
      <PublicNavbar />

      <Box
        component="section"
        sx={{
          bgcolor: "#ffffff",
          borderBottom: "1px solid #e5e7eb",
          py: { xs: 4, md: 6 },
        }}
      >
        <Container maxWidth="lg">
          <Chip
            label="Profile"
            sx={{
              bgcolor: "#dcfce7",
              color: "#15803d",
              fontWeight: 900,
              mb: 1.5,
            }}
          />

          <Typography
            variant="h3"
            sx={{
              fontWeight: 900,
              fontSize: { xs: "2rem", md: "3rem" },
              letterSpacing: "-0.5px",
            }}
          >
            Account Settings
          </Typography>

          <Typography color="text.secondary" sx={{ mt: 1, maxWidth: 680 }}>
            Manage your personal details, account information and password.
          </Typography>
        </Container>
      </Box>

      {loading && <ProfileSkeleton />}

      {!loading && error && (
        <Container maxWidth="md" sx={{ py: { xs: 3, md: 5 } }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              border: "1px solid #fecaca",
              bgcolor: "#fef2f2",
              textAlign: "center",
            }}
          >
            <Typography variant="h5" fontWeight={900} color="error">
              Failed to load profile
            </Typography>

            <Typography color="text.secondary" sx={{ mt: 1 }}>
              {error}
            </Typography>

            <CommonButton
              fullWidth={false}
              onClick={() => dispatch(fetchProfile())}
              sx={{
                mt: 3,
                px: 3,
                bgcolor: "#16a34a",
                "&:hover": { bgcolor: "#15803d" },
              }}
            >
              Try Again
            </CommonButton>
          </Paper>
        </Container>
      )}

      {!loading && !error && profile && (
        <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 2.5, md: 3 },
                  borderRadius: 3,
                  border: "1px solid #e5e7eb",
                  bgcolor: "#ffffff",
                  position: { md: "sticky" },
                  top: { md: 96 },
                }}
              >
                <Stack sx={{ alignItems: "center", textAlign: "center" }}>
                  <Avatar
                    sx={{
                      width: 96,
                      height: 96,
                      bgcolor: "#16a34a",
                      fontSize: 36,
                      fontWeight: 900,
                    }}
                  >
                    {getFullName(profile).charAt(0)}
                  </Avatar>

                  <Typography variant="h5" fontWeight={900} sx={{ mt: 2 }}>
                    {getFullName(profile)}
                  </Typography>

                  <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                    {profile?.email}
                  </Typography>

                  <Chip
                    label={profile?.role || "user"}
                    sx={{
                      mt: 1.5,
                      bgcolor: "#dcfce7",
                      color: "#15803d",
                      fontWeight: 900,
                      textTransform: "capitalize",
                    }}
                  />
                </Stack>

                <Divider sx={{ my: 3 }} />

                <Stack spacing={2}>
                  <InfoItem
                    icon={<EmailIcon fontSize="small" />}
                    label="Email"
                    value={profile?.email}
                  />

                  <InfoItem
                    icon={<PhoneIcon fontSize="small" />}
                    label="Phone"
                    value={profile?.phone}
                  />

                  <InfoItem
                    icon={<BadgeIcon fontSize="small" />}
                    label="Role"
                    value={profile?.role}
                  />

                  <InfoItem
                    icon={<AccountCircleIcon fontSize="small" />}
                    label="Joined"
                    value={formatDate(profile?.createdAt)}
                  />
                </Stack>

                <CommonButton
                  fullWidth
                  sx={{
                    mt: 3,
                    bgcolor: "#111827",
                    "&:hover": { bgcolor: "#020617" },
                  }}
                  onClick={() => {
                    window.location.href = dashboardPath;
                  }}
                >
                  Go to Dashboard
                </CommonButton>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, md: 8 }}>
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 2.5, md: 3 },
                  borderRadius: 3,
                  border: "1px solid #e5e7eb",
                  bgcolor: "#ffffff",
                }}
              >
                <Stack direction="row" spacing={1.2} sx={{ alignItems: "center" }}>
                  <Avatar sx={{ bgcolor: "#dcfce7", color: "#16a34a" }}>
                    <PersonIcon />
                  </Avatar>

                  <Box>
                    <Typography variant="h5" fontWeight={900}>
                      Personal Information
                    </Typography>

                    <Typography color="text.secondary" variant="body2">
                      Update your public account details.
                    </Typography>
                  </Box>
                </Stack>

                <Box
                  component="form"
                  onSubmit={handleProfileSubmit(onUpdateProfile)}
                  sx={{ mt: 3 }}
                >
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <CommonTextField
                        label="First Name"
                        error={!!profileErrors.firstName}
                        helperText={profileErrors.firstName?.message}
                        {...registerProfile("firstName", {
                          required: "First name is required",
                          minLength: {
                            value: 2,
                            message: "First name must be at least 2 characters",
                          },
                          maxLength: {
                            value: 50,
                            message:
                              "First name must not exceed 50 characters",
                          },
                        })}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                      <CommonTextField
                        label="Last Name"
                        error={!!profileErrors.lastName}
                        helperText={profileErrors.lastName?.message}
                        {...registerProfile("lastName", {
                          required: "Last name is required",
                          minLength: {
                            value: 2,
                            message: "Last name must be at least 2 characters",
                          },
                          maxLength: {
                            value: 50,
                            message:
                              "Last name must not exceed 50 characters",
                          },
                        })}
                      />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                      <CommonTextField
                        label="Phone"
                        error={!!profileErrors.phone}
                        helperText={profileErrors.phone?.message}
                        {...registerProfile("phone", {
                          pattern: {
                            value: /^[0-9+\-\s()]{7,20}$/,
                            message: "Enter a valid phone number",
                          },
                        })}
                      />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                      <CommonButton
                        type="submit"
                        loading={actionLoading}
                        sx={{
                          mt: 1,
                          bgcolor: "#16a34a",
                          "&:hover": { bgcolor: "#15803d" },
                        }}
                      >
                        Save Changes
                      </CommonButton>
                    </Grid>
                  </Grid>
                </Box>
              </Paper>

              <Paper
                elevation={0}
                sx={{
                  mt: 3,
                  p: { xs: 2.5, md: 3 },
                  borderRadius: 3,
                  border: "1px solid #e5e7eb",
                  bgcolor: "#ffffff",
                }}
              >
                <Stack direction="row" spacing={1.2} sx={{ alignItems: "center" }}>
                  <Avatar sx={{ bgcolor: "#dcfce7", color: "#16a34a" }}>
                    <SecurityIcon />
                  </Avatar>

                  <Box>
                    <Typography variant="h5" fontWeight={900}>
                      Change Password
                    </Typography>

                    <Typography color="text.secondary" variant="body2">
                      Keep your account secure with a strong password.
                    </Typography>
                  </Box>
                </Stack>

                <Box
                  component="form"
                  onSubmit={handlePasswordSubmit(onChangePassword)}
                  sx={{ mt: 3 }}
                >
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12 }}>
                      <CommonTextField
                        label="Current Password"
                        type="password"
                        error={!!passwordErrors.currentPassword}
                        helperText={passwordErrors.currentPassword?.message}
                        {...registerPassword("currentPassword", {
                          required: "Current password is required",
                        })}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                      <CommonTextField
                        label="New Password"
                        type="password"
                        error={!!passwordErrors.newPassword}
                        helperText={passwordErrors.newPassword?.message}
                        {...registerPassword("newPassword", {
                          required: "New password is required",
                          minLength: {
                            value: 6,
                            message:
                              "New password must be at least 6 characters",
                          },
                        })}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                      <CommonTextField
                        label="Confirm Password"
                        type="password"
                        error={!!passwordErrors.confirmPassword}
                        helperText={passwordErrors.confirmPassword?.message}
                        {...registerPassword("confirmPassword", {
                          required: "Confirm password is required",
                          validate: (value) =>
                            value === newPassword || "Passwords do not match",
                        })}
                      />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                      <CommonButton
                        type="submit"
                        loading={passwordLoading}
                        startIcon={<LockResetIcon />}
                        sx={{
                          mt: 1,
                          bgcolor: "#16a34a",
                          "&:hover": { bgcolor: "#15803d" },
                        }}
                      >
                        Change Password
                      </CommonButton>
                    </Grid>
                  </Grid>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      )}
    </Box>
  );
};

export default ProfilePage;