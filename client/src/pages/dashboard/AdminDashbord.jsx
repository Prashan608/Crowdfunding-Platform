import { useEffect, useMemo } from "react";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Grid,
  LinearProgress,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import CampaignIcon from "@mui/icons-material/Campaign";
import CategoryIcon from "@mui/icons-material/Category";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import GroupsIcon from "@mui/icons-material/Groups";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
import PaymentsIcon from "@mui/icons-material/Payments";
import PersonIcon from "@mui/icons-material/Person";
import RefreshIcon from "@mui/icons-material/Refresh";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { Link as RouterLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import PublicNavbar from "../../components/common/PublicNavbar";
import CommonButton from "../../components/common/CommonButton";
import { fetchAdminDashboard } from "../../redux/dashboardSlice";

const formatCurrency = (amount = 0) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0);

const formatDate = (date) => {
  if (!date) return "N/A";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
};

const getFullName = (user) => {
  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(" ");
  return fullName || user?.name || "User";
};

const getCampaignProgress = (campaign) => {
  const raisedAmount = Number(campaign?.raisedAmount) || 0;
  const goalAmount = Number(campaign?.goalAmount) || 0;

  if (!goalAmount) return 0;

  return Math.min((raisedAmount / goalAmount) * 100, 100);
};

const getStatusMeta = (status = "") => {
  const normalizedStatus = status.toLowerCase();

  if (normalizedStatus === "active") {
    return {
      label: "Active",
      bgcolor: "#dcfce7",
      color: "#15803d",
    };
  }

  if (normalizedStatus === "completed") {
    return {
      label: "Completed",
      bgcolor: "#dbeafe",
      color: "#1d4ed8",
    };
  }

  if (normalizedStatus === "cancelled" || normalizedStatus === "failed") {
    return {
      label: status || "Failed",
      bgcolor: "#fee2e2",
      color: "#dc2626",
    };
  }

  if (normalizedStatus === "pending") {
    return {
      label: "Pending",
      bgcolor: "#fef3c7",
      color: "#b45309",
    };
  }

  if (normalizedStatus === "captured" || normalizedStatus === "success") {
    return {
      label: "Success",
      bgcolor: "#dcfce7",
      color: "#15803d",
    };
  }

  return {
    label: status || "Unknown",
    bgcolor: "#f3f4f6",
    color: "#374151",
  };
};

const StatCard = ({ title, value, subtitle, icon }) => {
  return (
    <Paper
      elevation={0}
      sx={{
        height: "100%",
        p: 2.5,
        borderRadius: 3,
        border: "1px solid #e5e7eb",
        bgcolor: "#ffffff",
        transition: "0.2s ease",
        "&:hover": {
          transform: "translateY(-3px)",
          boxShadow: "0 18px 45px rgba(15, 23, 42, 0.08)",
        },
      }}
    >
      <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
        <Avatar
          sx={{
            bgcolor: "#dcfce7",
            color: "#16a34a",
            width: 48,
            height: 48,
          }}
        >
          {icon}
        </Avatar>

        <Box>
          <Typography variant="body2" color="text.secondary">
            {title}
          </Typography>

          <Typography variant="h5" fontWeight={900}>
            {value}
          </Typography>

          {subtitle && (
            <Typography variant="caption" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>
      </Stack>
    </Paper>
  );
};

const EmptyState = ({ title, description }) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 3,
        border: "1px dashed #bbf7d0",
        bgcolor: "#f0fdf4",
        textAlign: "center",
      }}
    >
      <Avatar
        sx={{
          width: 58,
          height: 58,
          mx: "auto",
          bgcolor: "#dcfce7",
          color: "#16a34a",
        }}
      >
        <TrendingUpIcon />
      </Avatar>

      <Typography fontWeight={900} sx={{ mt: 1.5 }}>
        {title}
      </Typography>

      <Typography color="text.secondary" variant="body2" sx={{ mt: 0.5 }}>
        {description}
      </Typography>
    </Paper>
  );
};

const DashboardSkeleton = () => {
  return (
    <Container maxWidth="xl" sx={{ py: { xs: 3, md: 5 } }}>
      <Grid container spacing={2.5}>
        {[1, 2, 3, 4].map((item) => (
          <Grid key={item} size={{ xs: 12, sm: 6, lg: 3 }}>
            <Skeleton variant="rounded" height={118} sx={{ borderRadius: 3 }} />
          </Grid>
        ))}

        <Grid size={{ xs: 12, lg: 8 }}>
          <Skeleton variant="rounded" height={460} sx={{ borderRadius: 3 }} />
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <Skeleton variant="rounded" height={460} sx={{ borderRadius: 3 }} />
        </Grid>
      </Grid>
    </Container>
  );
};

const AdminDashboard = () => {
  const dispatch = useDispatch();

  const { adminDashboard, loading, error } = useSelector(
    (state) => state.dashboard
  );

  const { user } = useSelector((state) => state.auth);

  const statistics = adminDashboard?.statistics || {};
  const analytics = adminDashboard?.analytics || {};
  const recentData = adminDashboard?.recentData || {};

  const paymentStats = statistics?.paymentStats || {};

  const recentUsers = recentData?.recentUsers || [];
  const recentCampaigns = recentData?.recentCampaigns || [];
  const recentDonations = recentData?.recentDonations || [];
  const recentPayments = recentData?.recentPayments || [];
  const topCampaignsByRaised = analytics?.topCampaignsByRaised || [];
  const topDonors = analytics?.topDonors || [];
  const categoryWiseCampaigns = analytics?.categoryWiseCampaigns || [];

  const adminName = useMemo(() => getFullName(user), [user]);

  useEffect(() => {
    dispatch(fetchAdminDashboard());
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(fetchAdminDashboard());
  };

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
        <Container maxWidth="xl">
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={2}
            sx={{
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", md: "center" },
            }}
          >
            <Box>
              <Chip
                label="Admin Dashboard"
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
                Welcome back, {adminName}
              </Typography>

              <Typography color="text.secondary" sx={{ mt: 1, maxWidth: 720 }}>
                Monitor platform growth, campaigns, donations, users and payment
                activity from one operations dashboard.
              </Typography>
            </Box>

            <CommonButton
              fullWidth={false}
              size="medium"
              startIcon={<RefreshIcon />}
              loading={loading}
              onClick={handleRefresh}
              sx={{
                px: 2.5,
                bgcolor: "#16a34a",
                "&:hover": { bgcolor: "#15803d" },
              }}
            >
              Refresh
            </CommonButton>
          </Stack>
        </Container>
      </Box>

      {loading && <DashboardSkeleton />}

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
              Failed to load admin dashboard
            </Typography>

            <Typography color="text.secondary" sx={{ mt: 1 }}>
              {error}
            </Typography>

            <Button
              onClick={handleRefresh}
              variant="contained"
              sx={{
                mt: 3,
                bgcolor: "#16a34a",
                textTransform: "none",
                borderRadius: 2,
                fontWeight: 900,
                "&:hover": { bgcolor: "#15803d" },
              }}
            >
              Try Again
            </Button>
          </Paper>
        </Container>
      )}

      {!loading && !error && adminDashboard && (
        <Container maxWidth="xl" sx={{ py: { xs: 3, md: 5 } }}>
          <Grid container spacing={2.5}>
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <StatCard
                title="Total Revenue"
                value={formatCurrency(statistics?.totalRevenue)}
                subtitle="Successful donations"
                icon={<CurrencyRupeeIcon />}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <StatCard
                title="Total Users"
                value={statistics?.totalUsers || 0}
                subtitle={`${statistics?.totalCreators || 0} creators, ${
                  statistics?.totalSupporters || 0
                } supporters`}
                icon={<GroupsIcon />}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <StatCard
                title="Total Campaigns"
                value={statistics?.totalCampaigns || 0}
                subtitle={`${statistics?.activeCampaigns || 0} active`}
                icon={<CampaignIcon />}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <StatCard
                title="Total Donations"
                value={statistics?.totalDonations || 0}
                subtitle="Successful donation records"
                icon={<VolunteerActivismIcon />}
              />
            </Grid>

            <Grid size={{ xs: 12, lg: 8 }}>
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 2.5, md: 3 },
                  borderRadius: 3,
                  border: "1px solid #e5e7eb",
                  bgcolor: "#ffffff",
                  height: "100%",
                }}
              >
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={1.5}
                  sx={{
                    justifyContent: "space-between",
                    alignItems: { xs: "flex-start", sm: "center" },
                    mb: 2,
                  }}
                >
                  <Box>
                    <Typography variant="h5" fontWeight={900}>
                      Top Campaigns
                    </Typography>
                    <Typography color="text.secondary" variant="body2">
                      Highest raised campaigns on the platform.
                    </Typography>
                  </Box>

                  <Button
                    component={RouterLink}
                    to="/campaigns"
                    sx={{
                      color: "#16a34a",
                      textTransform: "none",
                      fontWeight: 900,
                    }}
                  >
                    View Campaigns
                  </Button>
                </Stack>

                {topCampaignsByRaised.length === 0 && (
                  <EmptyState
                    title="No campaign data"
                    description="Campaign performance data will appear here."
                  />
                )}

                {topCampaignsByRaised.length > 0 && (
                  <Stack spacing={2}>
                    {topCampaignsByRaised.map((campaign) => {
                      const progress = getCampaignProgress(campaign);
                      const statusMeta = getStatusMeta(campaign?.status);

                      return (
                        <Paper
                          key={campaign?.id}
                          elevation={0}
                          sx={{
                            p: 2,
                            borderRadius: 2.5,
                            border: "1px solid #e5e7eb",
                            bgcolor: "#ffffff",
                          }}
                        >
                          <Stack
                            direction={{ xs: "column", md: "row" }}
                            spacing={2}
                            sx={{
                              justifyContent: "space-between",
                              alignItems: { xs: "flex-start", md: "center" },
                            }}
                          >
                            <Box sx={{ flex: 1 }}>
                              <Stack
                                direction={{ xs: "column", sm: "row" }}
                                spacing={1}
                                sx={{
                                  alignItems: {
                                    xs: "flex-start",
                                    sm: "center",
                                  },
                                  mb: 1,
                                }}
                              >
                                <Typography fontWeight={900}>
                                  {campaign?.title || "Campaign"}
                                </Typography>

                                <Chip
                                  label={statusMeta.label}
                                  sx={{
                                    bgcolor: statusMeta.bgcolor,
                                    color: statusMeta.color,
                                    fontWeight: 800,
                                  }}
                                />
                              </Stack>

                              <Typography variant="body2" color="text.secondary">
                                {campaign?.category || "General"} • Creator:{" "}
                                {getFullName(campaign?.creator)}
                              </Typography>

                              <LinearProgress
                                variant="determinate"
                                value={progress}
                                sx={{
                                  mt: 1.5,
                                  height: 8,
                                  borderRadius: 99,
                                  bgcolor: "#e5e7eb",
                                  "& .MuiLinearProgress-bar": {
                                    bgcolor: "#16a34a",
                                    borderRadius: 99,
                                  },
                                }}
                              />

                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {formatCurrency(campaign?.raisedAmount)} raised
                                of {formatCurrency(campaign?.goalAmount)}
                              </Typography>
                            </Box>

                            <Button
                              component={RouterLink}
                              to={`/campaigns/${campaign?.id}`}
                              sx={{
                                color: "#16a34a",
                                textTransform: "none",
                                fontWeight: 900,
                              }}
                            >
                              Details
                            </Button>
                          </Stack>
                        </Paper>
                      );
                    })}
                  </Stack>
                )}
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, lg: 4 }}>
              <Stack spacing={2.5}>
                <Paper
                  elevation={0}
                  sx={{
                    p: { xs: 2.5, md: 3 },
                    borderRadius: 3,
                    border: "1px solid #e5e7eb",
                    bgcolor: "#ffffff",
                  }}
                >
                  <Typography variant="h5" fontWeight={900}>
                    Payment Summary
                  </Typography>

                  <Typography color="text.secondary" variant="body2" sx={{ mt: 0.5 }}>
                    Platform-wide payment status.
                  </Typography>

                  <Stack spacing={1.5} sx={{ mt: 2 }}>
                    {[
                      {
                        label: "Successful",
                        value: paymentStats?.successfulPayments || 0,
                        icon: <CheckCircleIcon fontSize="small" />,
                        color: "#16a34a",
                        bgcolor: "#dcfce7",
                      },
                      {
                        label: "Pending",
                        value: paymentStats?.pendingPayments || 0,
                        icon: <HourglassTopIcon fontSize="small" />,
                        color: "#b45309",
                        bgcolor: "#fef3c7",
                      },
                      {
                        label: "Failed",
                        value: paymentStats?.failedPayments || 0,
                        icon: <WarningAmberIcon fontSize="small" />,
                        color: "#dc2626",
                        bgcolor: "#fee2e2",
                      },
                    ].map((item) => (
                      <Stack
                        key={item.label}
                        direction="row"
                        spacing={1.5}
                        sx={{
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                          <Avatar
                            sx={{
                              width: 34,
                              height: 34,
                              bgcolor: item.bgcolor,
                              color: item.color,
                            }}
                          >
                            {item.icon}
                          </Avatar>
                          <Typography fontWeight={800}>{item.label}</Typography>
                        </Stack>

                        <Typography fontWeight={900}>{item.value}</Typography>
                      </Stack>
                    ))}
                  </Stack>
                </Paper>

                <Paper
                  elevation={0}
                  sx={{
                    p: { xs: 2.5, md: 3 },
                    borderRadius: 3,
                    border: "1px solid #e5e7eb",
                    bgcolor: "#ffffff",
                  }}
                >
                  <Typography variant="h5" fontWeight={900}>
                    Category Mix
                  </Typography>

                  <Typography color="text.secondary" variant="body2" sx={{ mt: 0.5 }}>
                    Campaigns by category.
                  </Typography>

                  <Divider sx={{ my: 2 }} />

                  {categoryWiseCampaigns.length === 0 && (
                    <Typography color="text.secondary">
                      No category data available.
                    </Typography>
                  )}

                  {categoryWiseCampaigns.length > 0 && (
                    <Stack spacing={1.5}>
                      {categoryWiseCampaigns.map((item) => (
                        <Stack
                          key={item?.category}
                          direction="row"
                          spacing={1.5}
                          sx={{
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                            <Avatar
                              sx={{
                                width: 34,
                                height: 34,
                                bgcolor: "#dcfce7",
                                color: "#16a34a",
                              }}
                            >
                              <CategoryIcon fontSize="small" />
                            </Avatar>
                            <Typography fontWeight={800}>
                              {item?.category || "Other"}
                            </Typography>
                          </Stack>

                          <Typography fontWeight={900}>
                            {item?.count || 0}
                          </Typography>
                        </Stack>
                      ))}
                    </Stack>
                  )}
                </Paper>
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, lg: 6 }}>
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 2.5, md: 3 },
                  borderRadius: 3,
                  border: "1px solid #e5e7eb",
                  bgcolor: "#ffffff",
                  height: "100%",
                }}
              >
                <Typography variant="h5" fontWeight={900}>
                  Top Donors
                </Typography>

                <Typography color="text.secondary" variant="body2" sx={{ mt: 0.5 }}>
                  Highest contributors on the platform.
                </Typography>

                <Divider sx={{ my: 2 }} />

                {topDonors.length === 0 && (
                  <EmptyState
                    title="No donor data"
                    description="Top donor data will appear after successful donations."
                  />
                )}

                {topDonors.length > 0 && (
                  <Stack spacing={1.5}>
                    {topDonors.map((donor) => (
                      <Stack
                        key={donor?.id}
                        direction="row"
                        spacing={1.5}
                        sx={{
                          justifyContent: "space-between",
                          alignItems: "center",
                          p: 2,
                          borderRadius: 2,
                          bgcolor: "#f8fafc",
                          border: "1px solid #e5e7eb",
                        }}
                      >
                        <Stack direction="row" spacing={1.2} sx={{ alignItems: "center" }}>
                          <Avatar sx={{ bgcolor: "#dcfce7", color: "#16a34a" }}>
                            <PersonIcon />
                          </Avatar>

                          <Box>
                            <Typography fontWeight={900}>
                              {getFullName(donor)}
                            </Typography>

                            <Typography variant="body2" color="text.secondary">
                              {donor?.email}
                            </Typography>
                          </Box>
                        </Stack>

                        <Box sx={{ textAlign: "right" }}>
                          <Typography fontWeight={900}>
                            {formatCurrency(donor?.totalDonated)}
                          </Typography>

                          <Typography variant="caption" color="text.secondary">
                            {donor?.donationCount || 0} donations
                          </Typography>
                        </Box>
                      </Stack>
                    ))}
                  </Stack>
                )}
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, lg: 6 }}>
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 2.5, md: 3 },
                  borderRadius: 3,
                  border: "1px solid #e5e7eb",
                  bgcolor: "#ffffff",
                  height: "100%",
                }}
              >
                <Typography variant="h5" fontWeight={900}>
                  Recent Users
                </Typography>

                <Typography color="text.secondary" variant="body2" sx={{ mt: 0.5 }}>
                  Latest registered users.
                </Typography>

                <Divider sx={{ my: 2 }} />

                {recentUsers.length === 0 && (
                  <EmptyState
                    title="No recent users"
                    description="Recently registered users will appear here."
                  />
                )}

                {recentUsers.length > 0 && (
                  <Stack spacing={1.5}>
                    {recentUsers.map((item) => (
                      <Stack
                        key={item?.id}
                        direction="row"
                        spacing={1.5}
                        sx={{
                          justifyContent: "space-between",
                          alignItems: "center",
                          p: 2,
                          borderRadius: 2,
                          bgcolor: "#f8fafc",
                          border: "1px solid #e5e7eb",
                        }}
                      >
                        <Stack direction="row" spacing={1.2} sx={{ alignItems: "center" }}>
                          <Avatar sx={{ bgcolor: "#dcfce7", color: "#16a34a" }}>
                            {getFullName(item).charAt(0)}
                          </Avatar>

                          <Box>
                            <Typography fontWeight={900}>
                              {getFullName(item)}
                            </Typography>

                            <Typography variant="body2" color="text.secondary">
                              {item?.email}
                            </Typography>
                          </Box>
                        </Stack>

                        <Box sx={{ textAlign: "right" }}>
                          <Chip
                            label={item?.role || "user"}
                            sx={{
                              bgcolor: "#dcfce7",
                              color: "#15803d",
                              fontWeight: 900,
                              textTransform: "capitalize",
                            }}
                          />

                          <Typography
                            variant="caption"
                            color="text.secondary"
                            display="block"
                            sx={{ mt: 0.5 }}
                          >
                            {formatDate(item?.createdAt)}
                          </Typography>
                        </Box>
                      </Stack>
                    ))}
                  </Stack>
                )}
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, lg: 6 }}>
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 2.5, md: 3 },
                  borderRadius: 3,
                  border: "1px solid #e5e7eb",
                  bgcolor: "#ffffff",
                  height: "100%",
                }}
              >
                <Typography variant="h5" fontWeight={900}>
                  Recent Campaigns
                </Typography>

                <Typography color="text.secondary" variant="body2" sx={{ mt: 0.5 }}>
                  Latest campaigns created on the platform.
                </Typography>

                <Divider sx={{ my: 2 }} />

                {recentCampaigns.length === 0 && (
                  <EmptyState
                    title="No recent campaigns"
                    description="New campaigns will appear here."
                  />
                )}

                {recentCampaigns.length > 0 && (
                  <Stack spacing={1.5}>
                    {recentCampaigns.map((campaign) => {
                      const statusMeta = getStatusMeta(campaign?.status);

                      return (
                        <Stack
                          key={campaign?.id}
                          direction={{ xs: "column", sm: "row" }}
                          spacing={1.5}
                          sx={{
                            justifyContent: "space-between",
                            alignItems: { xs: "flex-start", sm: "center" },
                            p: 2,
                            borderRadius: 2,
                            bgcolor: "#f8fafc",
                            border: "1px solid #e5e7eb",
                          }}
                        >
                          <Box>
                            <Typography fontWeight={900}>
                              {campaign?.title || "Campaign"}
                            </Typography>

                            <Typography variant="body2" color="text.secondary">
                              {campaign?.category || "General"} •{" "}
                              {formatCurrency(campaign?.raisedAmount)} raised
                            </Typography>
                          </Box>

                          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                            <Chip
                              label={statusMeta.label}
                              sx={{
                                bgcolor: statusMeta.bgcolor,
                                color: statusMeta.color,
                                fontWeight: 900,
                              }}
                            />

                            <Button
                              component={RouterLink}
                              to={`/campaigns/${campaign?.id}`}
                              sx={{
                                color: "#16a34a",
                                textTransform: "none",
                                fontWeight: 900,
                              }}
                            >
                              View
                            </Button>
                          </Stack>
                        </Stack>
                      );
                    })}
                  </Stack>
                )}
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, lg: 6 }}>
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 2.5, md: 3 },
                  borderRadius: 3,
                  border: "1px solid #e5e7eb",
                  bgcolor: "#ffffff",
                  height: "100%",
                }}
              >
                <Typography variant="h5" fontWeight={900}>
                  Recent Payments
                </Typography>

                <Typography color="text.secondary" variant="body2" sx={{ mt: 0.5 }}>
                  Latest platform payment transactions.
                </Typography>

                <Divider sx={{ my: 2 }} />

                {recentPayments.length === 0 && (
                  <EmptyState
                    title="No payment records"
                    description="Recent payments will appear here."
                  />
                )}

                {recentPayments.length > 0 && (
                  <Stack spacing={1.5}>
                    {recentPayments.map((payment) => {
                      const statusMeta = getStatusMeta(payment?.status);

                      return (
                        <Stack
                          key={payment?.id}
                          direction={{ xs: "column", sm: "row" }}
                          spacing={1.5}
                          sx={{
                            justifyContent: "space-between",
                            alignItems: { xs: "flex-start", sm: "center" },
                            p: 2,
                            borderRadius: 2,
                            bgcolor: "#f8fafc",
                            border: "1px solid #e5e7eb",
                          }}
                        >
                          <Stack direction="row" spacing={1.2} sx={{ alignItems: "center" }}>
                            <Avatar sx={{ bgcolor: "#dcfce7", color: "#16a34a" }}>
                              <PaymentsIcon />
                            </Avatar>

                            <Box>
                              <Typography fontWeight={900}>
                                {payment?.donation?.campaign?.title ||
                                  "Campaign"}
                              </Typography>

                              <Typography variant="body2" color="text.secondary">
                                {payment?.donation?.donor
                                  ? getFullName(payment.donation.donor)
                                  : "Supporter"}{" "}
                                • {formatDate(payment?.createdAt)}
                              </Typography>
                            </Box>
                          </Stack>

                          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                            <Typography fontWeight={900}>
                              {formatCurrency(payment?.amount)}
                            </Typography>

                            <Chip
                              label={statusMeta.label}
                              sx={{
                                bgcolor: statusMeta.bgcolor,
                                color: statusMeta.color,
                                fontWeight: 900,
                              }}
                            />
                          </Stack>
                        </Stack>
                      );
                    })}
                  </Stack>
                )}
              </Paper>
            </Grid>
          </Grid>
        </Container>
      )}
    </Box>
  );
};

export default AdminDashboard;