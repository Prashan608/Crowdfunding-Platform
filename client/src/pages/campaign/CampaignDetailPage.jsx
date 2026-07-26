import { useEffect, useState } from "react";
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
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import IosShareIcon from "@mui/icons-material/IosShare";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import { Link as RouterLink, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import PublicNavbar from "../../components/common/PublicNavbar";
import DonationModal from "../../components/payment/DonationModal";
import {
  clearSelectedCampaign,
  fetchCampaignById,
} from "../../redux/campaignSlice";

const fallbackImage =
  "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1200&q=80";

const isValidUuid = (value) => {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    String(value)
  );
};

const formatCurrency = (amount = 0) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0);

const getCampaignImage = (campaign) => {
  return (
    campaign?.coverImage ||
    campaign?.image ||
    campaign?.thumbnail ||
    campaign?.campaignImage ||
    fallbackImage
  );
};

const getRaisedAmount = (campaign) => {
  return (
    campaign?.raisedAmount ||
    campaign?.raised ||
    campaign?.totalRaised ||
    0
  );
};

const getGoalAmount = (campaign) => {
  return campaign?.goalAmount || campaign?.goal || 0;
};

const getDaysLeft = (campaign) => {
  if (campaign?.daysLeft !== undefined) return campaign.daysLeft;

  const endDate =
    campaign?.endDate || campaign?.deadline || campaign?.expiryDate;

  if (!endDate) return 0;

  const diff = new Date(endDate).getTime() - Date.now();
  return Math.max(Math.ceil(diff / (1000 * 60 * 60 * 24)), 0);
};

const getCreatorName = (campaign) => {
  const firstName =
    campaign?.creator?.firstName ||
    campaign?.user?.firstName ||
    campaign?.creatorName;

  const lastName = campaign?.creator?.lastName || campaign?.user?.lastName;

  return [firstName, lastName].filter(Boolean).join(" ") || "Campaign Creator";
};

const getCampaignTitle = (campaign) => {
  return campaign?.title || campaign?.campaignTitle || "Untitled Campaign";
};

const getCampaignStory = (campaign) => {
  return (
    campaign?.description ||
    campaign?.story ||
    campaign?.campaignStory ||
    "No campaign story has been added yet."
  );
};

const CampaignDetailSkeleton = () => {
  return (
    <Container maxWidth="xl" sx={{ py: { xs: 3, md: 5 } }}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <Skeleton variant="rounded" height={520} sx={{ borderRadius: 3 }} />
          <Skeleton
            variant="rounded"
            height={240}
            sx={{ mt: 3, borderRadius: 3 }}
          />
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <Skeleton variant="rounded" height={420} sx={{ borderRadius: 3 }} />
        </Grid>
      </Grid>
    </Container>
  );
};

const InvalidCampaignState = () => {
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper
        elevation={0}
        sx={{
          p: 4,
          borderRadius: 3,
          textAlign: "center",
          border: "1px solid #fecaca",
          bgcolor: "#fef2f2",
        }}
      >
        <Typography variant="h5" fontWeight={900} color="error">
          Invalid campaign link
        </Typography>

        <Typography color="text.secondary" sx={{ mt: 1 }}>
          This campaign link is not valid. Please choose a campaign from the
          list.
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
            "&:hover": { bgcolor: "#15803d" },
          }}
        >
          Back to Campaigns
        </Button>
      </Paper>
    </Container>
  );
};

const CampaignErrorState = ({ error }) => {
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper
        elevation={0}
        sx={{
          p: 4,
          borderRadius: 3,
          textAlign: "center",
          border: "1px solid #fecaca",
          bgcolor: "#fef2f2",
        }}
      >
        <Typography variant="h5" fontWeight={900} color="error">
          Failed to load campaign
        </Typography>

        <Typography color="text.secondary" sx={{ mt: 1 }}>
          {error}
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
            "&:hover": { bgcolor: "#15803d" },
          }}
        >
          Back to Campaigns
        </Button>
      </Paper>
    </Container>
  );
};

const CampaignDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { selectedCampaign, loading, error } = useSelector(
    (state) => state.campaign
  );

  const [donationModalOpen, setDonationModalOpen] = useState(false);

  const hasValidCampaignId = isValidUuid(id);

  useEffect(() => {
    if (hasValidCampaignId) {
      dispatch(fetchCampaignById(id));
    }

    return () => {
      dispatch(clearSelectedCampaign());
    };
  }, [dispatch, id, hasValidCampaignId]);

  const campaign = selectedCampaign;

  const raisedAmount = getRaisedAmount(campaign);
  const goalAmount = getGoalAmount(campaign);
  const progress = goalAmount
    ? Math.min((raisedAmount / goalAmount) * 100, 100)
    : 0;

  const handleDonateClick = () => {
    if (!hasValidCampaignId || !campaign) {
      toast.error("Campaign is not available.");
      return;
    }

    setDonationModalOpen(true);
  };

  const handleDonationSuccess = () => {
    dispatch(fetchCampaignById(id));
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

      {!hasValidCampaignId && <InvalidCampaignState />}

      {hasValidCampaignId && loading && <CampaignDetailSkeleton />}

      {hasValidCampaignId && !loading && error && (
        <CampaignErrorState error={error} />
      )}

      {hasValidCampaignId && !loading && !error && campaign && (
        <>
          <Box
            component="section"
            sx={{
              width: "100%",
              bgcolor: "#ffffff",
              borderBottom: "1px solid #e5e7eb",
              py: { xs: 4, md: 5 },
            }}
          >
            <Container maxWidth="xl">
              <Stack spacing={1.5}>
                <Chip
                  label={campaign?.category || "General"}
                  sx={{
                    width: "fit-content",
                    bgcolor: "#dcfce7",
                    color: "#15803d",
                    fontWeight: 900,
                  }}
                />

                <Typography
                  variant="h2"
                  sx={{
                    maxWidth: 920,
                    fontSize: { xs: "2rem", md: "3.2rem" },
                    fontWeight: 900,
                    letterSpacing: "-1px",
                    lineHeight: 1.15,
                  }}
                >
                  {getCampaignTitle(campaign)}
                </Typography>

                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={1.5}
                  sx={{ alignItems: { xs: "flex-start", sm: "center" } }}
                >
                  <Stack
                    direction="row"
                    spacing={1.2}
                    sx={{ alignItems: "center" }}
                  >
                    <Avatar sx={{ bgcolor: "#16a34a" }}>
                      {getCreatorName(campaign).charAt(0)}
                    </Avatar>

                    <Box>
                      <Typography fontWeight={900}>
                        {getCreatorName(campaign)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Verified Creator
                      </Typography>
                    </Box>
                  </Stack>

                  <Chip
                    icon={<VerifiedUserIcon />}
                    label={campaign?.status || "Active"}
                    sx={{
                      bgcolor: "#ecfdf5",
                      color: "#15803d",
                      fontWeight: 800,
                    }}
                  />

                  <Typography variant="body2" color="text.secondary">
                    Campaign ID: {campaign?.id || id}
                  </Typography>
                </Stack>
              </Stack>
            </Container>
          </Box>

          <Container maxWidth="xl" sx={{ py: { xs: 3, md: 5 } }}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, lg: 8 }}>
                <Paper
                  elevation={0}
                  sx={{
                    overflow: "hidden",
                    borderRadius: 3,
                    border: "1px solid #e5e7eb",
                    bgcolor: "#ffffff",
                  }}
                >
                  <Box
                    component="img"
                    src={getCampaignImage(campaign)}
                    alt={getCampaignTitle(campaign)}
                    sx={{
                      width: "100%",
                      height: { xs: 280, md: 520 },
                      objectFit: "cover",
                    }}
                  />
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
                  <Typography variant="h5" fontWeight={900}>
                    Campaign Story
                  </Typography>

                  <Typography
                    color="text.secondary"
                    sx={{ mt: 1.5, lineHeight: 1.9, fontSize: "1rem" }}
                  >
                    {getCampaignStory(campaign)}
                  </Typography>
                </Paper>
              </Grid>

              <Grid size={{ xs: 12, lg: 4 }}>
                <Paper
                  elevation={0}
                  sx={{
                    position: { lg: "sticky" },
                    top: { lg: 96 },
                    p: { xs: 2.5, md: 3 },
                    borderRadius: 3,
                    border: "1px solid #e5e7eb",
                    bgcolor: "#ffffff",
                    boxShadow: "0 24px 60px rgba(15, 23, 42, 0.08)",
                  }}
                >
                  <Typography variant="h4" fontWeight={900}>
                    {formatCurrency(raisedAmount)}
                  </Typography>

                  <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                    raised of {formatCurrency(goalAmount)} goal
                  </Typography>

                  <LinearProgress
                    variant="determinate"
                    value={progress}
                    sx={{
                      my: 2.5,
                      height: 10,
                      borderRadius: 99,
                      bgcolor: "#e5e7eb",
                      "& .MuiLinearProgress-bar": {
                        bgcolor: "#16a34a",
                        borderRadius: 99,
                      },
                    }}
                  />

                  <Grid container spacing={2}>
                    <Grid size={{ xs: 4 }}>
                      <Typography fontWeight={900}>
                        {(
                          campaign?.donors ||
                          campaign?.donorCount ||
                          0
                        ).toLocaleString("en-IN")}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Donors
                      </Typography>
                    </Grid>

                    <Grid size={{ xs: 4 }}>
                      <Typography fontWeight={900}>
                        {getDaysLeft(campaign)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Days Left
                      </Typography>
                    </Grid>

                    <Grid size={{ xs: 4 }}>
                      <Typography fontWeight={900}>
                        {Math.round(progress)}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Funded
                      </Typography>
                    </Grid>
                  </Grid>

                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    onClick={handleDonateClick}
                    sx={{
                      mt: 3,
                      bgcolor: "#16a34a",
                      textTransform: "none",
                      borderRadius: 2,
                      py: 1.25,
                      fontWeight: 900,
                      boxShadow: "0 14px 32px rgba(22, 163, 74, 0.28)",
                      "&:hover": {
                        bgcolor: "#15803d",
                      },
                    }}
                  >
                    Donate Now
                  </Button>

                  <Stack direction="row" spacing={1.2} sx={{ mt: 1.5 }}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<FavoriteBorderIcon />}
                      sx={{
                        borderColor: "#e5e7eb",
                        color: "#111827",
                        textTransform: "none",
                        borderRadius: 2,
                        fontWeight: 800,
                      }}
                    >
                      Save
                    </Button>

                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<IosShareIcon />}
                      sx={{
                        borderColor: "#e5e7eb",
                        color: "#111827",
                        textTransform: "none",
                        borderRadius: 2,
                        fontWeight: 800,
                      }}
                    >
                      Share
                    </Button>
                  </Stack>

                  <Divider sx={{ my: 3 }} />

                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      border: "1px solid #bbf7d0",
                      bgcolor: "#f0fdf4",
                    }}
                  >
                    <Stack
                      direction="row"
                      spacing={1.5}
                      sx={{ alignItems: "flex-start" }}
                    >
                      <VerifiedUserIcon sx={{ color: "#16a34a" }} />

                      <Box>
                        <Typography fontWeight={900}>
                          Verified Campaign
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mt: 0.5 }}
                        >
                          This campaign has been reviewed for trust and
                          transparency.
                        </Typography>
                      </Box>
                    </Stack>
                  </Paper>
                </Paper>
              </Grid>
            </Grid>
          </Container>
        </>
      )}

      <DonationModal
        open={donationModalOpen}
        onClose={() => setDonationModalOpen(false)}
        campaign={campaign}
        onSuccess={handleDonationSuccess}
      />
    </Box>
  );
};

export default CampaignDetailPage;