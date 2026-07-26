import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Container,
  Grid,
  InputAdornment,
  LinearProgress,
  MenuItem,
  Paper,
  Select,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { Link as RouterLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import PublicNavbar from "../../components/common/PublicNavbar";
import { fetchCampaigns } from "../../redux/campaignSlice";

const categories = [
  "All",
  "Education",
  "Medical",
  "Community",
  "Environment",
  "Startup",
  "Emergency",
];

const fallbackImage =
  "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=900&q=80";

const isValidUuid = (value) => {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    String(value),
  );
};

const formatCurrency = (amount = 0) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0);

const isValidImageUrl = (value) => {
  return typeof value === "string" && /^https?:\/\//i.test(value.trim());
};

const getCampaignImage = (campaign) => {
  const candidates = [
    campaign?.image,
    campaign?.coverImage,
    campaign?.thumbnail,
    campaign?.campaignImage,
  ];

  const validImage = candidates.find((url) => isValidImageUrl(url));

  return validImage || fallbackImage;
};

// const getCampaignImage = (campaign) => {
//   return (
//     campaign?.image ||
//     campaign?.coverImage ||
//     campaign?.thumbnail ||
//     campaign?.campaignImage ||
//     fallbackImage
//   );
// };

const getRaisedAmount = (campaign) => {
  return (
    campaign?.raisedAmount || campaign?.raised || campaign?.totalRaised || 0
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

const getCampaignCategory = (campaign) => {
  return campaign?.category || "General";
};

const getCreatorName = (campaign) => {
  return (
    campaign?.creator?.firstName ||
    campaign?.creator?.name ||
    campaign?.user?.firstName ||
    campaign?.creatorName ||
    "Campaign Creator"
  );
};

const CampaignCardSkeleton = () => {
  return (
    <Card
      elevation={0}
      sx={{
        height: "100%",
        borderRadius: 3,
        overflow: "hidden",
        border: "1px solid #e5e7eb",
      }}
    >
      <Skeleton variant="rectangular" height={220} />
      <CardContent sx={{ p: 2.5 }}>
        <Skeleton width={90} height={28} />
        <Skeleton width="90%" height={32} sx={{ mt: 1 }} />
        <Skeleton width="50%" height={22} />
        <Skeleton height={18} sx={{ my: 2 }} />
        <Skeleton width="80%" height={24} />
        <Skeleton width="40%" height={38} sx={{ mt: 2, ml: "auto" }} />
      </CardContent>
    </Card>
  );
};

const CampaignListPage = () => {
  const dispatch = useDispatch();

  const { campaigns, loading, error } = useSelector((state) => state.campaign);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    dispatch(fetchCampaigns());
  }, [dispatch]);

  const filteredCampaigns = useMemo(() => {
    return campaigns.filter((campaign) => {
      const title = campaign?.title || campaign?.campaignTitle || "";
      const creatorName = getCreatorName(campaign);
      const campaignCategory = getCampaignCategory(campaign);

      const matchesSearch =
        title.toLowerCase().includes(search.toLowerCase()) ||
        creatorName.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        category === "All" || campaignCategory === category;

      return matchesSearch && matchesCategory;
    });
  }, [campaigns, search, category]);

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
          width: "100%",
          py: { xs: 5, md: 7 },
          bgcolor: "#ffffff",
          borderBottom: "1px solid #e5e7eb",
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={2} sx={{ maxWidth: 760 }}>
            <Chip
              label="Explore Campaigns"
              sx={{
                width: "fit-content",
                bgcolor: "#dcfce7",
                color: "#15803d",
                fontWeight: 800,
              }}
            />

            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: "2.2rem", md: "3.4rem" },
                fontWeight: 900,
                letterSpacing: "-1px",
              }}
            >
              Discover causes that need your support.
            </Typography>

            <Typography
              color="text.secondary"
              sx={{
                fontSize: { xs: "1rem", md: "1.12rem" },
                lineHeight: 1.8,
              }}
            >
              Browse verified campaigns, track progress, and support meaningful
              causes with secure donations.
            </Typography>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: { xs: 4, md: 5 } }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, md: 2.5 },
            mb: 4,
            borderRadius: 3,
            border: "1px solid #e5e7eb",
            bgcolor: "#ffffff",
          }}
        >
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 8 }}>
              <TextField
                fullWidth
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search campaigns or creators..."
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: "#64748b" }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Select
                fullWidth
                value={category}
                onChange={(event) => setCategory(event.target.value)}
              >
                {categories.map((item) => (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
          </Grid>
        </Paper>

        {error && (
          <Paper
            elevation={0}
            sx={{
              mb: 4,
              p: 3,
              borderRadius: 3,
              border: "1px solid #fecaca",
              bgcolor: "#fef2f2",
            }}
          >
            <Typography fontWeight={900} color="error">
              Failed to load campaigns
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 0.5 }}>
              {error}
            </Typography>
          </Paper>
        )}

        <Grid container spacing={3}>
          {loading
            ? Array.from({ length: 6 }).map((_, index) => (
                <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={index}>
                  <CampaignCardSkeleton />
                </Grid>
              ))
            : filteredCampaigns.map((campaign) => {
                const id = campaign?.id || campaign?._id;
                const hasValidId = isValidUuid(id);

                const title =
                  campaign?.title ||
                  campaign?.campaignTitle ||
                  "Untitled Campaign";

                const raisedAmount = getRaisedAmount(campaign);
                const goalAmount = getGoalAmount(campaign);
                const progress = goalAmount
                  ? Math.min((raisedAmount / goalAmount) * 100, 100)
                  : 0;

                return (
                  <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={id || title}>
                    <Card
                      elevation={0}
                      sx={{
                        height: "100%",
                        borderRadius: 3,
                        overflow: "hidden",
                        border: "1px solid #e5e7eb",
                        bgcolor: "#ffffff",
                        transition: "0.25s ease",
                        "&:hover": {
                          transform: "translateY(-6px)",
                          boxShadow: "0 24px 60px rgba(15, 23, 42, 0.12)",
                        },
                      }}
                    >
                      <Box sx={{ position: "relative" }}>
                        {/* <CardMedia
                          component="img"
                          height="220"
                          image={getCampaignImage(campaign)}
                          alt={title}
                          sx={{ objectFit: "cover" }}
                        /> */}

                        <CardMedia
                          component="img"
                          height="220"
                          image={getCampaignImage(campaign)}
                          alt={title}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = fallbackImage;
                          }}
                          sx={{ objectFit: "cover" }}
                        />

                        <Chip
                          label={campaign?.status || "Active"}
                          size="small"
                          sx={{
                            position: "absolute",
                            top: 14,
                            left: 14,
                            fontWeight: 900,
                            bgcolor: "#dcfce7",
                            color: "#15803d",
                          }}
                        />
                      </Box>

                      <CardContent sx={{ p: 2.5 }}>
                        <Chip
                          label={getCampaignCategory(campaign)}
                          size="small"
                          sx={{
                            bgcolor: "#f0fdf4",
                            color: "#16a34a",
                            fontWeight: 800,
                          }}
                        />

                        <Typography
                          variant="h6"
                          sx={{
                            mt: 1.5,
                            fontWeight: 900,
                            lineHeight: 1.35,
                          }}
                        >
                          {title}
                        </Typography>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mt: 0.7 }}
                        >
                          by {getCreatorName(campaign)}
                        </Typography>

                        <LinearProgress
                          variant="determinate"
                          value={progress}
                          sx={{
                            my: 2,
                            height: 9,
                            borderRadius: 99,
                            bgcolor: "#e5e7eb",
                            "& .MuiLinearProgress-bar": {
                              bgcolor: "#16a34a",
                              borderRadius: 99,
                            },
                          }}
                        />

                        <Stack
                          direction="row"
                          sx={{
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Box>
                            <Typography fontWeight={900}>
                              {formatCurrency(raisedAmount)}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              raised of {formatCurrency(goalAmount)}
                            </Typography>
                          </Box>

                          <Box sx={{ textAlign: "right" }}>
                            <Typography fontWeight={900}>
                              {getDaysLeft(campaign)}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              days left
                            </Typography>
                          </Box>
                        </Stack>

                        <Stack
                          direction="row"
                          sx={{
                            justifyContent: "space-between",
                            alignItems: "center",
                            mt: 2.5,
                          }}
                        >
                          <Typography variant="body2" color="text.secondary">
                            {(
                              campaign?.donors ||
                              campaign?.donorCount ||
                              0
                            ).toLocaleString("en-IN")}{" "}
                            donors
                          </Typography>

                          <Button
                            component={RouterLink}
                            to={hasValidId ? `/campaigns/${id}` : "/campaigns"}
                            disabled={!hasValidId}
                            variant="contained"
                            sx={{
                              bgcolor: "#16a34a",
                              textTransform: "none",
                              borderRadius: 2,
                              fontWeight: 900,
                              px: 2.2,
                              "&:hover": {
                                bgcolor: "#15803d",
                              },
                              "&.Mui-disabled": {
                                bgcolor: "#bbf7d0",
                                color: "#15803d",
                              },
                            }}
                          >
                            Donate
                          </Button>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
        </Grid>

        {!loading && filteredCampaigns.length === 0 && (
          <Paper
            elevation={0}
            sx={{
              mt: 4,
              p: 5,
              textAlign: "center",
              borderRadius: 3,
              border: "1px solid #e5e7eb",
            }}
          >
            <Typography variant="h6" fontWeight={900}>
              No campaigns found
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1 }}>
              Try changing your search or selected category.
            </Typography>
          </Paper>
        )}
      </Container>
    </Box>
  );
};

export default CampaignListPage;
