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
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CategoryIcon from "@mui/icons-material/Category";
import FavoriteIcon from "@mui/icons-material/Favorite";
import PaymentsIcon from "@mui/icons-material/Payments";
import RefreshIcon from "@mui/icons-material/Refresh";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import { Link as RouterLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import PublicNavbar from "../../components/common/PublicNavbar";
import CommonButton from "../../components/common/CommonButton";
import { fetchSupporterDashboard } from "../../redux/dashboardSlice";

const fallbackImage =
  "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=900&q=80";

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

const getCampaignTitle = (item) => {
  return item?.campaign?.title || item?.donation?.campaign?.title || "Campaign";
};

const getCampaignImage = (item) => {
  return item?.campaign?.coverImage || fallbackImage;
};

const getProgress = (campaign) => {
  const raisedAmount = Number(campaign?.raisedAmount) || 0;
  const goalAmount = Number(campaign?.goalAmount) || 0;

  if (!goalAmount) return 0;

  return Math.min((raisedAmount / goalAmount) * 100, 100);
};

const getStatusColor = (status = "") => {
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
          <Skeleton variant="rounded" height={430} sx={{ borderRadius: 3 }} />
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <Skeleton variant="rounded" height={430} sx={{ borderRadius: 3 }} />
        </Grid>
      </Grid>
    </Container>
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
        <VolunteerActivismIcon />
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

const SupporterDashboard = () => {
  const dispatch = useDispatch();

  const { supporterDashboard, loading, error } = useSelector(
    (state) => state.dashboard,
  );

  const { user } = useSelector((state) => state.auth);

  const statistics = supporterDashboard?.statistics || {};
  const analytics = supporterDashboard?.analytics || {};
  const recentData = supporterDashboard?.recentData || {};

  const recentDonations = recentData?.recentDonations || [];
  const recentPayments = recentData?.recentPayments || [];

  const paymentStats = statistics?.paymentStats || {};

  const supporterName = useMemo(() => {
    const fullName = [user?.firstName, user?.lastName]
      .filter(Boolean)
      .join(" ");
    return fullName || user?.name || "Supporter";
  }, [user]);

  useEffect(() => {
    dispatch(fetchSupporterDashboard());
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(fetchSupporterDashboard());
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
                label="Supporter Dashboard"
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
                Welcome back, {supporterName}
              </Typography>

              <Typography color="text.secondary" sx={{ mt: 1, maxWidth: 680 }}>
                Track your donations, supported campaigns and payment activity
                from one clean dashboard.
              </Typography>
            </Box>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1.2}
              sx={{ width: { xs: "100%", md: "auto" } }}
            >
              <Button
                component={RouterLink}
                to="/campaigns"
                variant="outlined"
                sx={{
                  borderColor: "#16a34a",
                  color: "#16a34a",
                  textTransform: "none",
                  borderRadius: 2,
                  fontWeight: 900,
                }}
              >
                Explore Campaigns
              </Button>

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

      {!loading && !error && supporterDashboard && (
        <Container maxWidth="xl" sx={{ py: { xs: 3, md: 5 } }}>
          <Grid container spacing={2.5}>
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <StatCard
                title="Total Donated"
                value={formatCurrency(statistics?.totalAmountDonated)}
                subtitle="Across successful donations"
                icon={<AccountBalanceWalletIcon />}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <StatCard
                title="Total Donations"
                value={statistics?.totalDonations || 0}
                subtitle="Campaigns you supported"
                icon={<VolunteerActivismIcon />}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <StatCard
                title="Average Donation"
                value={formatCurrency(analytics?.averageDonationAmount)}
                subtitle="Your giving average"
                icon={<TrendingUpIcon />}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <StatCard
                title="Favorite Category"
                value={analytics?.favoriteCategory || "N/A"}
                subtitle="Most supported category"
                icon={<CategoryIcon />}
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
                      Recent Donations
                    </Typography>
                    <Typography color="text.secondary" variant="body2">
                      Your latest supported campaigns.
                    </Typography>
                  </Box>

                  <Button
                    component={RouterLink}
                    to="/payment"
                    endIcon={<ArrowForwardIcon />}
                    sx={{
                      color: "#16a34a",
                      textTransform: "none",
                      fontWeight: 900,
                    }}
                  >
                    View Payments
                  </Button>
                </Stack>

                {recentDonations.length === 0 && (
                  <EmptyState
                    title="No donations yet"
                    description="Start supporting campaigns and your donations will show here."
                    buttonText="Explore Campaigns"
                    to="/campaigns"
                  />
                )}

                {recentDonations.length > 0 && (
                  <Stack spacing={2}>
                    {recentDonations.map((donation) => {
                      const campaign = donation?.campaign;
                      const progress = getProgress(campaign);

                      return (
                        <Paper
                          key={donation?.id}
                          elevation={0}
                          sx={{
                            p: 2,
                            borderRadius: 2.5,
                            border: "1px solid #e5e7eb",
                            bgcolor: "#ffffff",
                          }}
                        >
                          <Stack
                            direction={{ xs: "column", sm: "row" }}
                            spacing={2}
                            sx={{ alignItems: { xs: "stretch", sm: "center" } }}
                          >
                            <Box
                              component="img"
                              src={getCampaignImage(donation)}
                              alt={getCampaignTitle(donation)}
                              sx={{
                                width: { xs: "100%", sm: 96 },
                                height: 82,
                                objectFit: "cover",
                                borderRadius: 2,
                              }}
                            />

                            <Box sx={{ flex: 1, minWidth: 0 }}>
                              <Stack
                                direction={{ xs: "column", md: "row" }}
                                spacing={1}
                                sx={{
                                  justifyContent: "space-between",
                                  alignItems: {
                                    xs: "flex-start",
                                    md: "center",
                                  },
                                }}
                              >
                                <Box>
                                  <Typography fontWeight={900}>
                                    {getCampaignTitle(donation)}
                                  </Typography>

                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    Donated {formatCurrency(donation?.amount)}{" "}
                                    on {formatDate(donation?.createdAt)}
                                  </Typography>
                                </Box>

                                <Chip
                                  label={campaign?.category || "General"}
                                  sx={{
                                    bgcolor: "#dcfce7",
                                    color: "#15803d",
                                    fontWeight: 800,
                                  }}
                                />
                              </Stack>

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
                                {Math.round(progress)}% funded
                              </Typography>
                            </Box>
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

                  <Typography
                    color="text.secondary"
                    variant="body2"
                    sx={{ mt: 0.5 }}
                  >
                    Quick status breakdown.
                  </Typography>

                  <Stack spacing={1.5} sx={{ mt: 2 }}>
                    {[
                      {
                        label: "Successful",
                        value: paymentStats?.successfulPayments || 0,
                        color: "#16a34a",
                        bgcolor: "#dcfce7",
                      },
                      {
                        label: "Pending",
                        value: paymentStats?.pendingPayments || 0,
                        color: "#b45309",
                        bgcolor: "#fef3c7",
                      },
                      {
                        label: "Failed",
                        value: paymentStats?.failedPayments || 0,
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
                        <Stack
                          direction="row"
                          spacing={1}
                          sx={{ alignItems: "center" }}
                        >
                          <Avatar
                            sx={{
                              width: 34,
                              height: 34,
                              bgcolor: item.bgcolor,
                              color: item.color,
                            }}
                          >
                            <PaymentsIcon fontSize="small" />
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
                    Open Payment History
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
                  <Stack
                    direction="row"
                    spacing={1.2}
                    sx={{ alignItems: "center" }}
                  >
                    <Avatar sx={{ bgcolor: "#dcfce7", color: "#16a34a" }}>
                      <FavoriteIcon />
                    </Avatar>

                    <Box>
                      <Typography variant="h6" fontWeight={900}>
                        Most Donated Campaign
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Your top supported cause.
                      </Typography>
                    </Box>
                  </Stack>

                  <Divider sx={{ my: 2 }} />

                  {analytics?.mostDonatedCampaign ? (
                    <Box>
                      <Typography fontWeight={900}>
                        {analytics?.mostDonatedCampaign?.["campaign.title"] ||
                          analytics?.mostDonatedCampaign?.campaign?.title ||
                          "Campaign"}
                      </Typography>

                      <Typography
                        color="text.secondary"
                        variant="body2"
                        sx={{ mt: 0.5 }}
                      >
                        Total donated:{" "}
                        {formatCurrency(
                          analytics?.mostDonatedCampaign?.totalAmount,
                        )}
                      </Typography>

                      <Typography color="text.secondary" variant="body2">
                        Donations:{" "}
                        {analytics?.mostDonatedCampaign?.donationCount || 0}
                      </Typography>

                      {analytics?.mostDonatedCampaign?.campaignId && (
                        <Button
                          component={RouterLink}
                          to={`/campaigns/${analytics.mostDonatedCampaign.campaignId}`}
                          sx={{
                            mt: 1.5,
                            color: "#16a34a",
                            textTransform: "none",
                            fontWeight: 900,
                          }}
                        >
                          View Campaign
                        </Button>
                      )}
                    </Box>
                  ) : (
                    <Typography color="text.secondary">
                      Support a campaign to build your giving profile.
                    </Typography>
                  )}
                </Paper>
              </Stack>
            </Grid>

            <Grid size={{ xs: 12 }}>
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
                  Recent Payments
                </Typography>

                <Typography
                  color="text.secondary"
                  variant="body2"
                  sx={{ mt: 0.5 }}
                >
                  Latest payment transactions from your account.
                </Typography>

                <Divider sx={{ my: 2 }} />

                {recentPayments.length === 0 && (
                  <EmptyState
                    title="No payment records"
                    description="Your completed and pending payment transactions will appear here."
                  />
                )}

                {recentPayments.length > 0 && (
                  <Stack spacing={1.5}>
                    {recentPayments.map((payment) => {
                      const statusMeta = getStatusColor(payment?.status);

                      return (
                        <Stack
                          key={payment?.id}
                          direction={{ xs: "column", md: "row" }}
                          spacing={1.5}
                          sx={{
                            justifyContent: "space-between",
                            alignItems: { xs: "flex-start", md: "center" },
                            p: 2,
                            borderRadius: 2,
                            bgcolor: "#f8fafc",
                            border: "1px solid #e5e7eb",
                          }}
                        >
                          <Box>
                            <Typography fontWeight={900}>
                              {payment?.donation?.campaign?.title || "Campaign"}
                            </Typography>

                            <Typography variant="body2" color="text.secondary">
                              {formatDate(payment?.createdAt)}
                            </Typography>
                          </Box>

                          <Stack
                            direction={{ xs: "column", sm: "row" }}
                            spacing={1.2}
                            sx={{
                              alignItems: { xs: "flex-start", sm: "center" },
                            }}
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

                            <Button
                              component={RouterLink}
                              to={`/payment/${payment?.id}`}
                              disabled={!payment?.id}
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

export default SupporterDashboard;
