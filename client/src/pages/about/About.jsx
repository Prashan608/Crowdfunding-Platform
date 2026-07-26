import React from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Stack,
  Paper,
  Avatar,
  Divider,
  Button,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import RocketLaunchOutlinedIcon from "@mui/icons-material/RocketLaunchOutlined";
import { useNavigate } from "react-router-dom";
import PublicNavbar from "../../components/common/PublicNavbar";

const BRAND_GREEN = "#16a34a";

const stats = [
  { label: "Campaigns funded", value: "12,400+" },
  { label: "Total raised", value: "₹8.6 Cr+" },
  { label: "Active supporters", value: "45,000+" },
  { label: "Countries reached", value: "18" },
];

const values = [
  {
    icon: <VerifiedUserOutlinedIcon sx={{ fontSize: 32 }} />,
    title: "Transparency first",
    description:
      "Every campaign is verified and every rupee raised is tracked, so supporters always know where their money goes.",
  },
  {
    icon: <GroupsOutlinedIcon sx={{ fontSize: 32 }} />,
    title: "Community powered",
    description:
      "We believe the best ideas get funded when real people, not gatekeepers, decide what matters.",
  },
  {
    icon: <FavoriteBorderIcon sx={{ fontSize: 32 }} />,
    title: "Built on trust",
    description:
      "From identity checks to secure payments, we design every step to protect creators and supporters alike.",
  },
  {
    icon: <RocketLaunchOutlinedIcon sx={{ fontSize: 32 }} />,
    title: "Made for momentum",
    description:
      "Simple tools for creators to launch fast, and simple ways for supporters to back what they believe in.",
  },
];

const team = [
  { name: "Aditi Sharma", role: "Co-founder & CEO", initials: "AS" },
  { name: "Rohan Mehta", role: "Co-founder & CTO", initials: "RM" },
  { name: "Priya Nair", role: "Head of Trust & Safety", initials: "PN" },
  { name: "Karan Verma", role: "Head of Product", initials: "KV" },
];

function AboutPage() {
  const navigate = useNavigate();

  return (
    <Box sx={{ bgcolor: "background.default" }}>
      <PublicNavbar />
      {/* Hero */}
      <Box
        sx={{
          bgcolor: "#0f172a",
          color: "#fff",
          py: { xs: 8, md: 12 },
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="overline"
            sx={{ color: BRAND_GREEN, fontWeight: 700, letterSpacing: 1.5 }}
          >
            About CrowdFund
          </Typography>
          <Typography
            variant="h3"
            fontWeight={700}
            sx={{ mt: 1, mb: 2, fontSize: { xs: "2rem", md: "2.75rem" } }}
          >
            Helping good ideas find the people who believe in them
          </Typography>
          <Typography variant="body1" sx={{ color: "grey.400", maxWidth: 640 }}>
            CrowdFund connects creators with a community of supporters who want
            to see meaningful projects come to life — from first-time founders
            to grassroots causes.
          </Typography>
        </Container>
      </Box>

      {/* Stats */}
      <Container maxWidth="md" sx={{ mt: { xs: -4, md: -6 } }}>
        <Paper
          elevation={3}
          sx={{
            borderRadius: 3,
            px: { xs: 2, md: 4 },
            py: { xs: 3, md: 4 },
          }}
        >
          <Grid container spacing={3}>
            {stats.map((s) => (
              <Grid item xs={6} md={3} key={s.label}>
                <Typography
                  variant="h5"
                  fontWeight={700}
                  color={BRAND_GREEN}
                  textAlign="center"
                >
                  {s.value}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  textAlign="center"
                >
                  {s.label}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Container>

      {/* Story */}
      <Container maxWidth="md" sx={{ py: { xs: 6, md: 10 } }}>
        <Grid container spacing={5} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h5" fontWeight={700} gutterBottom>
              Our story
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              CrowdFund started with a simple frustration: too many great ideas
              never got a fair shot at funding, while the process of raising
              money felt slow, opaque, and stacked against first-time creators.
            </Typography>
            <Typography variant="body1" color="text.secondary">
              So we built a platform where anyone can launch a campaign in
              minutes, where every project is reviewed for legitimacy, and where
              supporters can track exactly how their contributions are used —
              all the way from the first rupee to the finished project.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h5" fontWeight={700} gutterBottom>
              Our mission
            </Typography>
            <Typography variant="body1" color="text.secondary">
              To make funding accessible, transparent, and fast — so that the
              only thing standing between an idea and its supporters is a good
              story, not red tape.
            </Typography>
          </Grid>
        </Grid>
      </Container>

      <Divider />

      {/* Values */}
      <Container maxWidth="md" sx={{ py: { xs: 6, md: 10 } }}>
        <Typography
          variant="h5"
          fontWeight={700}
          textAlign="center"
          gutterBottom
        >
          What we stand for
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          textAlign="center"
          sx={{ maxWidth: 520, mx: "auto", mb: 5 }}
        >
          These principles guide every feature we build and every campaign we
          approve.
        </Typography>
        <Grid container spacing={3}>
          {values.map((v) => (
            <Grid item xs={12} sm={6} key={v.title}>
              <Paper
                variant="outlined"
                sx={{
                  p: 3,
                  height: "100%",
                  borderRadius: 3,
                  transition: "box-shadow 0.2s ease",
                  "&:hover": { boxShadow: 3 },
                }}
              >
                <Box sx={{ color: BRAND_GREEN, mb: 1.5 }}>{v.icon}</Box>
                <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                  {v.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {v.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Divider />

      {/* Team */}
      <Container maxWidth="md" sx={{ py: { xs: 6, md: 10 } }}>
        <Typography
          variant="h5"
          fontWeight={700}
          textAlign="center"
          gutterBottom
        >
          Meet the team
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          textAlign="center"
          sx={{ maxWidth: 480, mx: "auto", mb: 5 }}
        >
          A small team obsessed with making crowdfunding simple, safe, and fair.
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {team.map((member) => (
            <Grid item xs={6} sm={3} key={member.name} textAlign="center">
              <Avatar
                sx={{
                  width: 72,
                  height: 72,
                  mx: "auto",
                  mb: 1.5,
                  bgcolor: BRAND_GREEN,
                  fontWeight: 700,
                  fontSize: "1.1rem",
                }}
              >
                {member.initials}
              </Avatar>
              <Typography variant="subtitle2" fontWeight={700}>
                {member.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {member.role}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA */}
      <Box sx={{ bgcolor: "#f0fdf4", py: { xs: 6, md: 8 } }}>
        <Container maxWidth="sm" sx={{ textAlign: "center" }}>
          <Typography variant="h5" fontWeight={700} gutterBottom>
            Ready to bring your idea to life?
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Launch a campaign in minutes, or explore projects worth supporting
            today.
          </Typography>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            justifyContent="center"
          >
            <Button
              variant="contained"
              size="large"
              sx={{ bgcolor: BRAND_GREEN, "&:hover": { bgcolor: "#15803d" } }}
              onClick={() => navigate("/campaigns/create")}
            >
              Start a campaign
            </Button>
            <Button
              variant="outlined"
              size="large"
              sx={{ borderColor: BRAND_GREEN, color: BRAND_GREEN }}
              onClick={() => navigate("/campaigns")}
            >
              Explore campaigns
            </Button>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}

export default AboutPage;
