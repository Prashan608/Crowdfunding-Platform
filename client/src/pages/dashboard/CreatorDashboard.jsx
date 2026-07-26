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
import AddCircleIcon from "@mui/icons-material/AddCircle";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CampaignIcon from "@mui/icons-material/Campaign";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import GroupsIcon from "@mui/icons-material/Groups";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
import PaymentsIcon from "@mui/icons-material/Payments";
import RefreshIcon from "@mui/icons-material/Refresh";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { Link as RouterLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import PublicNavbar from "../../components/common/PublicNavbar";
import CommonButton from "../../components/common/CommonButton";
import { fetchCreatorDashboard } from "../../redux/dashboardSlice";

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

const getCreatorName = (user) => {
  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(" ");
  return fullName || user?.name || "Creator";
};

const getProgress = (campaign) => {
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

  if (normalizedStatus === "cancelled") {
    return {
      label: "Cancelled",
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

  return {
    label: status || "Unknown",
    bgcolor: "#f3f4f6",
    color: "#374151",
  };
};

const getPaymentStatusMeta = (status = "") => {
  const normalizedStatus = status.toLowerCase();

  if (normalizedStatus === "captured" || normalizedStatus === "success") {
    return {
      label: "Success",
      bgcolor: "#dcfce7",
      color: "#15803d",
    };
  }

  if (normalizedStatus === "pending") {
    return {
      label: "Pending",
      bgcolor: "#fef3c7",
      color: "#b45309",
    };
  }

  if (normalizedStatus === "failed") {
    return {
      label: "Failed",
      bgcolor: "#fee2e2",
      color: "#dc2626",
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

const EmptyState = ({ title, description, buttonText, to }) => {
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
        <CampaignIcon />
      </Avatar>

      <Typography fontWeight={900} sx={{ mt: 1.5 }}>
        {title}
      </Typography>

      <Typography color="text.secondary" variant="body2" sx={{ mt: 0.5 }}>
        {description}
      </Typography>

      {buttonText && to && (
        <Button
          component={RouterLink}
          to={to}
          variant="contained"
          sx={{
            mt: 2,
            bgcolor: "#16a34a",
            textTransform: "none",
            borderRadius: 2,
            fontWeight: 900,
            "&:hover": { bgcolor: "#15803d" },
          }}
        >
          {buttonText}
        </Button>
      )}
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

const CreatorDashboard = () => {
  const dispatch = useDispatch();

  const { creatorDashboard, loading, error } = useSelector(
    (state) => state.dashboard
  );

  const { user } = useSelector((state) => state.auth);

  const statistics = creatorDashboard?.statistics || {};
  const analytics = creatorDashboard?.analytics || {};
  const recentData = creatorDashboard?.recentData || {};

  const campaignAnalytics = analytics?.campaignAnalytics || {};
  const paymentStats = statistics?.paymentStats || {};

  const recentCampaigns = recentData?.recentCampaigns || [];
  const recentDonations = recentData?.recentDonations || [];
  const recentPayments = recentData?.recentPayments || [];
  const endingSoonCampaigns = campaignAnalytics?.campaignEndingSoon || [];

  const creatorName = useMemo(() => getCreatorName(user), [user]);

  useEffect(() => {
    dispatch(fetchCreatorDashboard());
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(fetchCreatorDashboard());
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
                label="Creator Dashboard"
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
                Welcome back, {creatorName}
              </Typography>

              <Typography color="text.secondary" sx={{ mt: 1, maxWidth: 700 }}>
                Monitor your campaigns, donations, payments and performance from
                one focused creator workspace.
              </Typography>
            </Box>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1.2}
              sx={{ width: { xs: "100%", md: "auto" } }}
            >
              <Button
                component={RouterLink}
                to="/campaigns/create"
                variant="contained"
                startIcon={<AddCircleIcon />}
                sx={{
                  bgcolor: "#16a34a",
                  textTransform: "none",
                  borderRadius: 2,
                  fontWeight: 900,
                  "&:hover": { bgcolor: "#15803d" },
                }}
              >
                Create Campaign
              </Button>

              <CommonButton
                fullWidth={false}
                size="medium"
                startIcon={<RefreshIcon />}
                loading={loading}
                onClick={handleRefresh}
                sx={{
                  px: 2.5,
                  bgcolor: "#111827",
                  "&:hover": { bgcolor: "#020617" },
                }}
              >
                Refresh
              </CommonButton>
            </Stack>
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
              Failed to load dashboard
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

      {!loading && !error && creatorDashboard && (
        <Container maxWidth="xl" sx={{ py: { xs: 3, md: 5 } }}>
          <Grid container spacing={2.5}>
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <StatCard
                title="Total Raised"
                value={formatCurrency(statistics?.totalRaised)}
                subtitle="Across successful donations"
                icon={<CurrencyRupeeIcon />}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <StatCard
                title="Total Campaigns"
                value={statistics?.totalCampaigns || 0}
                subtitle={`${statistics?.activeCampaigns || 0} active campaigns`}
                icon={<CampaignIcon />}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <StatCard
                title="Total Donors"
                value={statistics?.totalDonors || 0}
                subtitle={`${statistics?.totalDonations || 0} total donations`}
                icon={<GroupsIcon />}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <StatCard
                title="Goal Completion"
                value={`${campaignAnalytics?.goalCompletionPercentage || 0}%`}
                subtitle="Across all campaigns"
                icon={<TrendingUpIcon />}
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
                      My Recent Campaigns
                    </Typography>
                    <Typography color="text.secondary" variant="body2">
                      Latest campaigns created by you.
                    </Typography>
                  </Box>

                  <Button
                    component={RouterLink}
                    to="/campaigns"
                    endIcon={<ArrowForwardIcon />}
                    sx={{
                      color: "#16a34a",
                      textTransform: "none",
                      fontWeight: 900,
                    }}
                  >
                    View All
                  </Button>
                </Stack>

                {recentCampaigns.length === 0 && (
                  <EmptyState
                    title="No campaigns yet"
                    description="Create your first campaign and start collecting support."
                    buttonText="Create Campaign"
                    to="/campaigns/create"
                  />
                )}

                {recentCampaigns.length > 0 && (
                  <Stack spacing={2}>
                    {recentCampaigns.map((campaign) => {
                      const progress = getProgress(campaign);
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
                                {campaign?.category || "General"} • Ends{" "}
                                {formatDate(campaign?.endDate)}
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
                                of {formatCurrency(campaign?.goalAmount)} goal
                              </Typography>
                            </Box>

                            <Button
                              component={RouterLink}
                              to={`/campaigns/${campaign?.id}`}
                              endIcon={<ArrowForwardIcon />}
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
                    Campaign payment status overview.
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

                  <Button
                    component={RouterLink}
                    to="/payment"
                    fullWidth
                    variant="contained"
                    sx={{
                      mt: 2.5,
                      bgcolor: "#16a34a",
                      textTransform: "none",
                      borderRadius: 2,
                      fontWeight: 900,
                      "&:hover": { bgcolor: "#15803d" },
                    }}
                  >
                    Open Payments
                  </Button>
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
                    Top Campaign
                  </Typography>

                  <Typography color="text.secondary" variant="body2" sx={{ mt: 0.5 }}>
                    Highest raised campaign so far.
                  </Typography>

                  <Divider sx={{ my: 2 }} />

                  {campaignAnalytics?.topPerformingCampaign ? (
                    <Box>
                      <Typography fontWeight={900}>
                        {campaignAnalytics.topPerformingCampaign?.title ||
                          "Campaign"}
                      </Typography>

                      <Typography color="text.secondary" variant="body2" sx={{ mt: 0.5 }}>
                        {formatCurrency(
                          campaignAnalytics.topPerformingCampaign?.raisedAmount
                        )}{" "}
                        raised of{" "}
                        {formatCurrency(
                          campaignAnalytics.topPerformingCampaign?.goalAmount
                        )}
                      </Typography>

                      <LinearProgress
                        variant="determinate"
                        value={getProgress(campaignAnalytics.topPerformingCampaign)}
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

                      <Button
                        component={RouterLink}
                        to={`/campaigns/${campaignAnalytics.topPerformingCampaign?.id}`}
                        sx={{
                          mt: 1.5,
                          color: "#16a34a",
                          textTransform: "none",
                          fontWeight: 900,
                        }}
                      >
                        View Campaign
                      </Button>
                    </Box>
                  ) : (
                    <Typography color="text.secondary">
                      Create a campaign to see performance insights.
                    </Typography>
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
                  Recent Donations
                </Typography>

                <Typography color="text.secondary" variant="body2" sx={{ mt: 0.5 }}>
                  Latest donations received on your campaigns.
                </Typography>

                <Divider sx={{ my: 2 }} />

                {recentDonations.length === 0 && (
                  <EmptyState
                    title="No donations yet"
                    description="Donations will appear here once supporters contribute."
                  />
                )}

                {recentDonations.length > 0 && (
                  <Stack spacing={1.5}>
                    {recentDonations.map((donation) => (
                      <Stack
                        key={donation?.id}
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
                            <VolunteerActivismIcon />
                          </Avatar>

                          <Box>
                            <Typography fontWeight={900}>
                              {donation?.donor
                                ? `${donation.donor?.firstName || ""} ${
                                    donation.donor?.lastName || ""
                                  }`.trim()
                                : "Supporter"}
                            </Typography>

                            <Typography variant="body2" color="text.secondary">
                              {donation?.campaign?.title || "Campaign"} •{" "}
                              {formatDate(donation?.createdAt)}
                            </Typography>
                          </Box>
                        </Stack>

                        <Typography fontWeight={900}>
                          {formatCurrency(donation?.amount)}
                        </Typography>
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
                  Recent Payments
                </Typography>

                <Typography color="text.secondary" variant="body2" sx={{ mt: 0.5 }}>
                  Latest payment transactions for your campaigns.
                </Typography>

                <Divider sx={{ my: 2 }} />

                {recentPayments.length === 0 && (
                  <EmptyState
                    title="No payment records"
                    description="Payment transactions will appear here after donations."
                  />
                )}

                {recentPayments.length > 0 && (
                  <Stack spacing={1.5}>
                    {recentPayments.map((payment) => {
                      const statusMeta = getPaymentStatusMeta(payment?.status);

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
                                {formatDate(payment?.createdAt)}
                              </Typography>
                            </Box>
                          </Stack>

                          <Stack
                            direction="row"
                            spacing={1}
                            sx={{ alignItems: "center" }}
                          >
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

            {endingSoonCampaigns.length > 0 && (
              <Grid size={{ xs: 12 }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: { xs: 2.5, md: 3 },
                    borderRadius: 3,
                    border: "1px solid #fde68a",
                    bgcolor: "#fffbeb",
                  }}
                >
                  <Stack direction="row" spacing={1.2} sx={{ alignItems: "center" }}>
                    <WarningAmberIcon sx={{ color: "#b45309" }} />
                    <Typography variant="h5" fontWeight={900}>
                      Campaigns Ending Soon
                    </Typography>
                  </Stack>

                  <Grid container spacing={2} sx={{ mt: 1 }}>
                    {endingSoonCampaigns.map((campaign) => (
                      <Grid key={campaign?.id} size={{ xs: 12, md: 4 }}>
                        <Paper
                          elevation={0}
                          sx={{
                            p: 2,
                            borderRadius: 2,
                            bgcolor: "#ffffff",
                            border: "1px solid #fde68a",
                          }}
                        >
                          <Typography fontWeight={900}>
                            {campaign?.title || "Campaign"}
                          </Typography>

                          <Typography variant="body2" color="text.secondary">
                            Ends on {formatDate(campaign?.endDate)}
                          </Typography>

                          <Button
                            component={RouterLink}
                            to={`/campaigns/${campaign?.id}`}
                            sx={{
                              mt: 1,
                              color: "#16a34a",
                              textTransform: "none",
                              fontWeight: 900,
                            }}
                          >
                            View Campaign
                          </Button>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </Paper>
              </Grid>
            )}
          </Grid>
        </Container>
      )}
    </Box>
  );
};

export default CreatorDashboard;