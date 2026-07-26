import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Container,
  Grid,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

const campaigns = [
  {
    id: 1,
    title: "Help children access quality education",
    category: "Education",
    creator: "Aarav Foundation",
    image:
      "https://images.unsplash.com/photo-1497486751825-1233686d5d80?auto=format&fit=crop&w=900&q=80",
    raised: 840000,
    goal: 1200000,
    daysLeft: 18,
  },
  {
    id: 2,
    title: "Emergency medical support for families",
    category: "Medical",
    creator: "Care Circle",
    image:
      "https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=900&q=80",
    raised: 620000,
    goal: 900000,
    daysLeft: 9,
  },
  {
    id: 3,
    title: "Build clean water wells in rural areas",
    category: "Community",
    creator: "Hope Trust",
    image:
      "https://images.unsplash.com/photo-1541919329513-35f7af297129?auto=format&fit=crop&w=900&q=80",
    raised: 420000,
    goal: 700000,
    daysLeft: 24,
  },
];

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

const FeaturedCampaigns = () => {
  return (
    <Box sx={{ bgcolor: "#f8fafc", py: { xs: 6, md: 9 } }}>
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          spacing={2}
          sx={{ mb: 4 }}
        >
          <Box>
            <Typography variant="h4" fontWeight={900}>
              Featured Campaigns
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1 }}>
              Support trusted campaigns making real impact.
            </Typography>
          </Box>
          <Button
            component={RouterLink}
            to="/campaigns"
            sx={{ color: "#16a34a", textTransform: "none", fontWeight: 800 }}
          >
            View all campaigns
          </Button>
        </Stack>

        <Grid container spacing={3}>
          {campaigns.map((campaign) => {
            const progress = Math.min(
              (campaign.raised / campaign.goal) * 100,
              100,
            );

            return (
              <Grid size={{ xs: 12, md: 4 }} key={campaign.id}>
                <Card
                  elevation={0}
                  sx={{
                    height: "100%",
                    borderRadius: 3,
                    overflow: "hidden",
                    border: "1px solid",
                    borderColor: "divider",
                    transition: "0.25s ease",
                    "&:hover": {
                      transform: "translateY(-6px)",
                      boxShadow: "0 22px 55px rgba(15, 23, 42, 0.12)",
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    height="210"
                    image={campaign.image}
                  />
                  <CardContent sx={{ p: 2.5 }}>
                    <Chip
                      label={campaign.category}
                      size="small"
                      sx={{
                        bgcolor: "#dcfce7",
                        color: "#15803d",
                        fontWeight: 800,
                      }}
                    />
                    <Typography variant="h6" fontWeight={900} sx={{ mt: 1.5 }}>
                      {campaign.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 0.5 }}
                    >
                      by {campaign.creator}
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
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2" fontWeight={900}>
                        {formatCurrency(campaign.raised)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Goal {formatCurrency(campaign.goal)}
                      </Typography>
                    </Stack>
                    {/* <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      sx={{ mt: 2 }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        {campaign.daysLeft} days left
                      </Typography>
                      <Button
                        component={RouterLink}
                        to={`/campaigns`}
                        variant="contained"
                        size="small"
                        sx={{
                          bgcolor: "#16a34a",
                          textTransform: "none",
                          borderRadius: 2,
                          fontWeight: 800,
                          "&:hover": { bgcolor: "#15803d" },
                        }}
                      >
                        Donate
                      </Button>
                    </Stack> */}
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      flexWrap="wrap"
                      spacing={1}
                      sx={{ mt: 2 }}
                    >
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ whiteSpace: "nowrap" }}
                      >
                        {campaign.daysLeft} days left
                      </Typography>
                      <Button
                        component={RouterLink}
                        to={`/campaigns`}
                        variant="contained"
                        size="small"
                        sx={{
                          bgcolor: "#16a34a",
                          textTransform: "none",
                          borderRadius: 2,
                          fontWeight: 800,
                          flexShrink: 0,
                          mb:"4px",
                          "&:hover": { bgcolor: "#15803d" },
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
      </Container>
    </Box>
  );
};

export default FeaturedCampaigns;
