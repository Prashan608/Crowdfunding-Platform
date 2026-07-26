import { useEffect, useMemo } from "react";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Grid,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import RefreshIcon from "@mui/icons-material/Refresh";
import { Link as RouterLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import PublicNavbar from "../../components/common/PublicNavbar";
import CommonButton from "../../components/common/CommonButton";
import { fetchPaymentHistory } from "../../redux/paymentSlice";

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

const normalizePayments = (payments) => {
  if (Array.isArray(payments)) return payments;
  if (Array.isArray(payments?.payments)) return payments.payments;
  if (Array.isArray(payments?.data)) return payments.data;
  return [];
};

const getStatusColor = (status = "") => {
  const normalizedStatus = status.toLowerCase();

  if (normalizedStatus === "success" || normalizedStatus === "paid") {
    return {
      bgcolor: "#dcfce7",
      color: "#15803d",
      label: "Success",
    };
  }

  if (normalizedStatus === "pending") {
    return {
      bgcolor: "#fef3c7",
      color: "#b45309",
      label: "Pending",
    };
  }

  if (normalizedStatus === "failed") {
    return {
      bgcolor: "#fee2e2",
      color: "#dc2626",
      label: "Failed",
    };
  }

  return {
    bgcolor: "#e5e7eb",
    color: "#374151",
    label: status || "Unknown",
  };
};

const getCampaignTitle = (payment) => {
  return (
    payment?.campaign?.title ||
    payment?.Donation?.Campaign?.title ||
    payment?.donation?.campaign?.title ||
    payment?.campaignTitle ||
    "Campaign"
  );
};

const getPaymentAmount = (payment) => {
  return payment?.amount || payment?.donation?.amount || payment?.Donation?.amount || 0;
};

const getPaymentDate = (payment) => {
  return payment?.createdAt || payment?.updatedAt || payment?.paymentDate;
};

const getPaymentId = (payment) => {
  return payment?.id || payment?.paymentId || payment?.razorpayPaymentId;
};

const PaymentSkeleton = () => {
  return (
    <Stack spacing={2}>
      {[1, 2, 3].map((item) => (
        <Skeleton
          key={item}
          variant="rounded"
          height={132}
          sx={{ borderRadius: 3 }}
        />
      ))}
    </Stack>
  );
};

const EmptyPaymentState = () => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 3, md: 5 },
        borderRadius: 3,
        border: "1px solid #e5e7eb",
        textAlign: "center",
        bgcolor: "#ffffff",
      }}
    >
      <Avatar
        sx={{
          width: 70,
          height: 70,
          mx: "auto",
          bgcolor: "#dcfce7",
          color: "#16a34a",
        }}
      >
        <ReceiptLongIcon fontSize="large" />
      </Avatar>

      <Typography variant="h5" fontWeight={900} sx={{ mt: 2 }}>
        No payments yet
      </Typography>

      <Typography color="text.secondary" sx={{ mt: 1, maxWidth: 460, mx: "auto" }}>
        Your donation and payment records will appear here once you support a
        campaign.
      </Typography>

      <Button
        component={RouterLink}
        to="/campaigns"
        variant="contained"
        sx={{
          mt: 3,
          bgcolor: "#16a34a",
          textTransform: "none",
          borderRadius: 2,
          fontWeight: 900,
          px: 3,
          "&:hover": { bgcolor: "#15803d" },
        }}
      >
        Explore Campaigns
      </Button>
    </Paper>
  );
};

const PaymentPage = () => {
  const dispatch = useDispatch();

  const { payments, loading, error } = useSelector((state) => state.payment);

  const paymentList = useMemo(() => normalizePayments(payments), [payments]);

  const summary = useMemo(() => {
    const successfulPayments = paymentList.filter((payment) => {
      const status = String(payment?.status || "").toLowerCase();
      return status === "success" || status === "paid";
    });

    const totalDonated = successfulPayments.reduce(
      (total, payment) => total + Number(getPaymentAmount(payment) || 0),
      0
    );

    return {
      totalPayments: paymentList.length,
      successfulPayments: successfulPayments.length,
      totalDonated,
    };
  }, [paymentList]);

  useEffect(() => {
    dispatch(fetchPaymentHistory());
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(fetchPaymentHistory());
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
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 900,
                  fontSize: { xs: "2rem", md: "3rem" },
                  letterSpacing: "-0.5px",
                }}
              >
                Payment History
              </Typography>

              <Typography color="text.secondary" sx={{ mt: 1, maxWidth: 650 }}>
                Track every donation you have made and review your payment
                status in one place.
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

      <Container maxWidth="xl" sx={{ py: { xs: 3, md: 5 } }}>
        <Grid container spacing={2.5} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: 3,
                border: "1px solid #e5e7eb",
                bgcolor: "#ffffff",
              }}
            >
              <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                <Avatar sx={{ bgcolor: "#dcfce7", color: "#16a34a" }}>
                  <CurrencyRupeeIcon />
                </Avatar>

                <Box>
                  <Typography color="text.secondary" variant="body2">
                    Total Donated
                  </Typography>
                  <Typography variant="h5" fontWeight={900}>
                    {formatCurrency(summary.totalDonated)}
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: 3,
                border: "1px solid #e5e7eb",
                bgcolor: "#ffffff",
              }}
            >
              <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                <Avatar sx={{ bgcolor: "#dcfce7", color: "#16a34a" }}>
                  <VolunteerActivismIcon />
                </Avatar>

                <Box>
                  <Typography color="text.secondary" variant="body2">
                    Successful Donations
                  </Typography>
                  <Typography variant="h5" fontWeight={900}>
                    {summary.successfulPayments}
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: 3,
                border: "1px solid #e5e7eb",
                bgcolor: "#ffffff",
              }}
            >
              <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                <Avatar sx={{ bgcolor: "#dcfce7", color: "#16a34a" }}>
                  <ReceiptLongIcon />
                </Avatar>

                <Box>
                  <Typography color="text.secondary" variant="body2">
                    Total Payments
                  </Typography>
                  <Typography variant="h5" fontWeight={900}>
                    {summary.totalPayments}
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Grid>
        </Grid>

        {loading && <PaymentSkeleton />}

        {!loading && error && (
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              border: "1px solid #fecaca",
              bgcolor: "#fef2f2",
            }}
          >
            <Typography fontWeight={900} color="error">
              Failed to load payments
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 0.5 }}>
              {error}
            </Typography>
          </Paper>
        )}

        {!loading && !error && paymentList.length === 0 && <EmptyPaymentState />}

        {!loading && !error && paymentList.length > 0 && (
          <Stack spacing={2}>
            {paymentList.map((payment) => {
              const statusStyle = getStatusColor(payment?.status);
              const paymentId = getPaymentId(payment);

              return (
                <Paper
                  key={paymentId}
                  elevation={0}
                  sx={{
                    p: { xs: 2, md: 2.5 },
                    borderRadius: 3,
                    border: "1px solid #e5e7eb",
                    bgcolor: "#ffffff",
                    transition: "0.2s ease",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: "0 18px 45px rgba(15, 23, 42, 0.08)",
                    },
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
                    <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                      <Avatar sx={{ bgcolor: "#dcfce7", color: "#16a34a" }}>
                        <ReceiptLongIcon />
                      </Avatar>

                      <Box>
                        <Typography fontWeight={900}>
                          {getCampaignTitle(payment)}
                        </Typography>

                        <Typography variant="body2" color="text.secondary">
                          Paid on {formatDate(getPaymentDate(payment))}
                        </Typography>
                      </Box>
                    </Stack>

                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      spacing={1.5}
                      sx={{
                        width: { xs: "100%", md: "auto" },
                        alignItems: { xs: "stretch", sm: "center" },
                      }}
                    >
                      <Box sx={{ textAlign: { xs: "left", sm: "right" } }}>
                        <Typography variant="h6" fontWeight={900}>
                          {formatCurrency(getPaymentAmount(payment))}
                        </Typography>

                        <Typography variant="caption" color="text.secondary">
                          {payment?.razorpayPaymentId ||
                            payment?.paymentId ||
                            "Payment ID pending"}
                        </Typography>
                      </Box>

                      <Chip
                        label={statusStyle.label}
                        sx={{
                          bgcolor: statusStyle.bgcolor,
                          color: statusStyle.color,
                          fontWeight: 900,
                          width: "fit-content",
                        }}
                      />

                      <Button
                        component={RouterLink}
                        to={`/payment/${paymentId}`}
                        endIcon={<ArrowForwardIcon />}
                        disabled={!paymentId}
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

                  {(payment?.message || payment?.donation?.message) && (
                    <>
                      <Divider sx={{ my: 2 }} />

                      <Typography color="text.secondary">
                        {payment?.message || payment?.donation?.message}
                      </Typography>
                    </>
                  )}
                </Paper>
              );
            })}
          </Stack>
        )}
      </Container>
    </Box>
  );
};

export default PaymentPage;