import { useEffect } from "react";
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
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import ErrorIcon from "@mui/icons-material/Error";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import { Link as RouterLink, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import PublicNavbar from "../../components/common/PublicNavbar";
import { clearPaymentState, fetchPaymentById } from "../../redux/paymentSlice";

const formatCurrency = (amount = 0) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0);

const formatDateTime = (date) => {
  if (!date) return "N/A";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
};

const getPayloadPayment = (payment) => {
  return payment?.payment || payment?.data || payment;
};

const getPaymentAmount = (payment) => {
  return payment?.amount || payment?.donation?.amount || payment?.Donation?.amount || 0;
};

const getCampaignTitle = (payment) => {
  return (
    payment?.campaign?.title ||
    payment?.Campaign?.title ||
    payment?.donation?.campaign?.title ||
    payment?.Donation?.Campaign?.title ||
    payment?.campaignTitle ||
    "Campaign"
  );
};

const getCampaignId = (payment) => {
  return (
    payment?.campaignId ||
    payment?.Campaign?.id ||
    payment?.campaign?.id ||
    payment?.donation?.campaignId ||
    payment?.Donation?.campaignId
  );
};

const getDonorName = (payment) => {
  const donor =
    payment?.user ||
    payment?.User ||
    payment?.donor ||
    payment?.Donation?.User ||
    payment?.donation?.user;

  const fullName = [donor?.firstName, donor?.lastName].filter(Boolean).join(" ");

  return fullName || donor?.name || "Supporter";
};

const getDonationMessage = (payment) => {
  return (
    payment?.message ||
    payment?.donation?.message ||
    payment?.Donation?.message ||
    "No message added with this donation."
  );
};

const getStatusMeta = (status = "") => {
  const normalizedStatus = status.toLowerCase();

  if (normalizedStatus === "success" || normalizedStatus === "paid") {
    return {
      label: "Success",
      icon: <CheckCircleIcon />,
      bgcolor: "#dcfce7",
      color: "#15803d",
      borderColor: "#bbf7d0",
    };
  }

  if (normalizedStatus === "pending") {
    return {
      label: "Pending",
      icon: <HourglassTopIcon />,
      bgcolor: "#fef3c7",
      color: "#b45309",
      borderColor: "#fde68a",
    };
  }

  if (normalizedStatus === "failed") {
    return {
      label: "Failed",
      icon: <ErrorIcon />,
      bgcolor: "#fee2e2",
      color: "#dc2626",
      borderColor: "#fecaca",
    };
  }

  return {
    label: status || "Unknown",
    icon: <ReceiptLongIcon />,
    bgcolor: "#f3f4f6",
    color: "#374151",
    borderColor: "#e5e7eb",
  };
};

const DetailRow = ({ label, value }) => {
  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={1}
      sx={{
        justifyContent: "space-between",
        py: 1.5,
        borderBottom: "1px solid #f1f5f9",
      }}
    >
      <Typography color="text.secondary">{label}</Typography>
      <Typography fontWeight={800} sx={{ wordBreak: "break-word" }}>
        {value || "N/A"}
      </Typography>
    </Stack>
  );
};

const PaymentDetailSkeleton = () => {
  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Skeleton variant="rounded" height={420} sx={{ borderRadius: 3 }} />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Skeleton variant="rounded" height={260} sx={{ borderRadius: 3 }} />
        </Grid>
      </Grid>
    </Container>
  );
};

const PaymentDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { payment, loading, error } = useSelector((state) => state.payment);

  const paymentDetails = getPayloadPayment(payment);
  const statusMeta = getStatusMeta(paymentDetails?.status);

  useEffect(() => {
    if (id) {
      dispatch(fetchPaymentById(id));
    }

    return () => {
      dispatch(clearPaymentState());
    };
  }, [dispatch, id]);

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
          py: { xs: 4, md: 5 },
        }}
      >
        <Container maxWidth="lg">
          <Button
            component={RouterLink}
            to="/payment"
            startIcon={<ArrowBackIcon />}
            sx={{
              color: "#16a34a",
              textTransform: "none",
              fontWeight: 900,
              mb: 2,
            }}
          >
            Back to Payment History
          </Button>

          <Typography
            variant="h3"
            sx={{
              fontWeight: 900,
              fontSize: { xs: "2rem", md: "2.8rem" },
              letterSpacing: "-0.5px",
            }}
          >
            Payment Details
          </Typography>

          <Typography color="text.secondary" sx={{ mt: 1 }}>
            Review donation amount, campaign details and Razorpay transaction
            information.
          </Typography>
        </Container>
      </Box>

      {loading && <PaymentDetailSkeleton />}

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
              Failed to load payment
            </Typography>

            <Typography color="text.secondary" sx={{ mt: 1 }}>
              {error}
            </Typography>

            <Button
              component={RouterLink}
              to="/payment"
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
              Back to Payment History
            </Button>
          </Paper>
        </Container>
      )}

      {!loading && !error && paymentDetails && (
        <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
          <Grid container spacing={3}>
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
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                  sx={{
                    justifyContent: "space-between",
                    alignItems: { xs: "flex-start", sm: "center" },
                    mb: 2,
                  }}
                >
                  <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                    <Avatar sx={{ bgcolor: "#dcfce7", color: "#16a34a" }}>
                      <ReceiptLongIcon />
                    </Avatar>

                    <Box>
                      <Typography variant="h5" fontWeight={900}>
                        Transaction Receipt
                      </Typography>
                      <Typography color="text.secondary">
                        Payment ID: {paymentDetails?.id || id}
                      </Typography>
                    </Box>
                  </Stack>

                  <Chip
                    icon={statusMeta.icon}
                    label={statusMeta.label}
                    sx={{
                      bgcolor: statusMeta.bgcolor,
                      color: statusMeta.color,
                      border: `1px solid ${statusMeta.borderColor}`,
                      fontWeight: 900,
                    }}
                  />
                </Stack>

                <Divider sx={{ my: 2 }} />

                <DetailRow
                  label="Campaign"
                  value={getCampaignTitle(paymentDetails)}
                />

                <DetailRow
                  label="Amount"
                  value={formatCurrency(getPaymentAmount(paymentDetails))}
                />

                <DetailRow
                  label="Payment Status"
                  value={statusMeta.label}
                />

                <DetailRow
                  label="Razorpay Order ID"
                  value={paymentDetails?.orderId || paymentDetails?.razorpayOrderId}
                />

                <DetailRow
                  label="Razorpay Payment ID"
                  value={
                    paymentDetails?.razorpayPaymentId ||
                    paymentDetails?.paymentId
                  }
                />

                <DetailRow
                  label="Donation ID"
                  value={paymentDetails?.donationId || paymentDetails?.Donation?.id}
                />

                <DetailRow
                  label="Paid At"
                  value={formatDateTime(paymentDetails?.createdAt)}
                />

                <Box sx={{ mt: 3 }}>
                  <Typography fontWeight={900}>Donation Message</Typography>

                  <Paper
                    elevation={0}
                    sx={{
                      mt: 1,
                      p: 2,
                      borderRadius: 2,
                      bgcolor: "#f8fafc",
                      border: "1px solid #e5e7eb",
                    }}
                  >
                    <Typography color="text.secondary">
                      {getDonationMessage(paymentDetails)}
                    </Typography>
                  </Paper>
                </Box>
              </Paper>
            </Grid>

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
                <Avatar
                  sx={{
                    width: 64,
                    height: 64,
                    bgcolor: "#dcfce7",
                    color: "#16a34a",
                  }}
                >
                  <VolunteerActivismIcon fontSize="large" />
                </Avatar>

                <Typography variant="h5" fontWeight={900} sx={{ mt: 2 }}>
                  {formatCurrency(getPaymentAmount(paymentDetails))}
                </Typography>

                <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                  donated by {getDonorName(paymentDetails)}
                </Typography>

                <Divider sx={{ my: 2.5 }} />

                <Stack spacing={1.5}>
                  {getCampaignId(paymentDetails) && (
                    <Button
                      component={RouterLink}
                      to={`/campaigns/${getCampaignId(paymentDetails)}`}
                      variant="contained"
                      fullWidth
                      sx={{
                        bgcolor: "#16a34a",
                        textTransform: "none",
                        borderRadius: 2,
                        fontWeight: 900,
                        "&:hover": { bgcolor: "#15803d" },
                      }}
                    >
                      View Campaign
                    </Button>
                  )}

                  <Button
                    component={RouterLink}
                    to="/campaigns"
                    variant="outlined"
                    fullWidth
                    sx={{
                      borderColor: "#16a34a",
                      color: "#16a34a",
                      textTransform: "none",
                      borderRadius: 2,
                      fontWeight: 900,
                    }}
                  >
                    Support More Campaigns
                  </Button>
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      )}
    </Box>
  );
};

export default PaymentDetailPage;