import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { Link as RouterLink } from "react-router-dom";

const HeroSection = () => {
  return (
    <Box sx={{ bgcolor: "#ffffff", py: { xs: 7, md: 10 } }}>
      <Container maxWidth="lg">
        <Grid container spacing={6} alignItems="center">
          <Grid size={{ xs: 12, md: 6 }}>
            <Stack spacing={3}>
              <Typography
                variant="overline"
                sx={{ color: "#16a34a", fontWeight: 900, letterSpacing: 1 }}
              >
                Trusted Crowdfunding Platform
              </Typography>
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: "2.6rem", md: "4.5rem" },
                  lineHeight: 1.05,
                  fontWeight: 900,
                  letterSpacing: -1,
                }}
              >
                Fund Dreams. Change Lives.
              </Typography>
              <Typography
                variant="h6"
                color="text.secondary"
                sx={{ maxWidth: 560, lineHeight: 1.7, fontWeight: 400 }}
              >
                Help people achieve their dreams by supporting meaningful
                campaigns around the world.
              </Typography>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <Button
                  component={RouterLink}
                  to="/campaigns"
                  variant="contained"
                  size="large"
                  sx={{
                    bgcolor: "#16a34a",
                    borderRadius: 2,
                    py: 1.3,
                    px: 3,
                    textTransform: "none",
                    fontWeight: 800,
                    "&:hover": { bgcolor: "#15803d" },
                  }}
                >
                  Explore Campaigns
                </Button>
                <Button
                  component={RouterLink}
                  to="/campaigns/create"
                  variant="outlined"
                  size="large"
                  sx={{
                    borderColor: "#16a34a",
                    color: "#16a34a",
                    borderRadius: 2,
                    py: 1.3,
                    px: 3,
                    textTransform: "none",
                    fontWeight: 800,
                    "&:hover": {
                      borderColor: "#15803d",
                      bgcolor: "rgba(22, 163, 74, 0.08)",
                    },
                  }}
                >
                  Start Fundraising
                </Button>
              </Stack>
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Paper
              elevation={0}
              sx={{
                position: "relative",
                overflow: "hidden",
                minHeight: { xs: 360, md: 460 },
                borderRadius: 5,
                p: 4,
                border: "1px solid",
                borderColor: "divider",
                bgcolor: "#f0fdf4",
              }}
            >
              <Box
                component="img"
                alt="Crowdfunding illustration"
                src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1000&q=80"
                sx={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(180deg, rgba(0,0,0,0.05), rgba(0,0,0,0.55))",
                }}
              />
              <Paper
                elevation={0}
                sx={{
                  position: "absolute",
                  left: 24,
                  right: 24,
                  bottom: 24,
                  p: 2.5,
                  borderRadius: 3,
                  bgcolor: "rgba(255,255,255,0.94)",
                }}
              >
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box
                    sx={{
                      width: 52,
                      height: 52,
                      borderRadius: 2,
                      bgcolor: "#dcfce7",
                      display: "grid",
                      placeItems: "center",
                      color: "#16a34a",
                    }}
                  >
                    <VolunteerActivismIcon />
                  </Box>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography fontWeight={900}>₹8,40,000 raised</Typography>
                    <Typography variant="body2" color="text.secondary">
                      70% funded by 1,240 supporters
                    </Typography>
                  </Box>
                  <TrendingUpIcon sx={{ color: "#16a34a" }} />
                </Stack>
              </Paper>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default HeroSection;
