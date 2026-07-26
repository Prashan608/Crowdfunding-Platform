import { Box, Container, Grid, IconButton, Link, Stack, Typography } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import { Link as RouterLink } from "react-router-dom";

const Footer = () => {
  return (
    <Box sx={{ bgcolor: "#0f172a", color: "#ffffff", py: 5 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="h5" fontWeight={900} sx={{ color: "#22c55e" }}>
              CrowdFund
            </Typography>
            <Typography sx={{ mt: 1.5, color: "rgba(255,255,255,0.72)", maxWidth: 360 }}>
              A transparent crowdfunding platform for meaningful campaigns and secure donations.
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Typography fontWeight={900} sx={{ mb: 1.5 }}>
              Quick Links
            </Typography>
            <Stack spacing={1}>
              {["Home", "Explore Campaigns", "Start Campaign", "About", "Contact"].map((item) => (
                <Link
                  key={item}
                  component={RouterLink}
                  to={item === "Home" ? "/" : "#"}
                  underline="none"
                  sx={{ color: "rgba(255,255,255,0.72)" }}
                >
                  {item}
                </Link>
              ))}
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Typography fontWeight={900} sx={{ mb: 1.5 }}>
              Contact
            </Typography>
            <Typography sx={{ color: "rgba(255,255,255,0.72)" }}>
              support@crowdfund.com
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
              {[FacebookIcon, TwitterIcon, InstagramIcon, LinkedInIcon].map((Icon, index) => (
                <IconButton key={index} sx={{ color: "#ffffff", bgcolor: "rgba(255,255,255,0.08)" }}>
                  <Icon />
                </IconButton>
              ))}
            </Stack>
          </Grid>
        </Grid>
        <Box
          sx={{
            mt: 4,
            pt: 3,
            borderTop: "1px solid rgba(255,255,255,0.12)",
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            gap: 1.5,
          }}
        >
          <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.65)" }}>
            © 2026 CrowdFund. All rights reserved.
          </Typography>
          <Stack direction="row" spacing={2}>
            <Link href="#" underline="none" sx={{ color: "rgba(255,255,255,0.65)" }}>
              Privacy Policy
            </Link>
            <Link href="#" underline="none" sx={{ color: "rgba(255,255,255,0.65)" }}>
              Terms
            </Link>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
