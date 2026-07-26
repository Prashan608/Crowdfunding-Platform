import { Box, Container, Grid, Paper, Stack, Typography } from "@mui/material";
import PaymentsIcon from "@mui/icons-material/Payments";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import BoltIcon from "@mui/icons-material/Bolt";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import VisibilityIcon from "@mui/icons-material/Visibility";

const items = [
  { title: "Secure Payments", icon: PaymentsIcon },
  { title: "Verified Campaigns", icon: VerifiedUserIcon },
  { title: "Real Time Updates", icon: BoltIcon },
  { title: "Fast Support", icon: SupportAgentIcon },
  { title: "Transparent Donations", icon: VisibilityIcon },
];

const WhyChooseUs = () => {
  return (
    <Box sx={{ bgcolor: "#f8fafc", py: { xs: 6, md: 9 } }}>
      <Container maxWidth="lg">
        <Typography variant="h4" fontWeight={900} sx={{ textAlign: "center" }}>
          Why Choose Us
        </Typography>
        <Grid container spacing={2.5} sx={{ mt: 4 }}>
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <Grid size={{ xs: 12, sm: 6, md: 2.4 }} key={item.title}>
                <Paper
                  elevation={0}
                  sx={{
                    height: "100%",
                    p: 2.5,
                    borderRadius: 3,
                    border: "1px solid",
                    borderColor: "divider",
                    textAlign: "center",
                  }}
                >
                  <Stack spacing={1.5} alignItems="center">
                    <Icon sx={{ color: "#16a34a", fontSize: 34 }} />
                    <Typography fontWeight={900}>{item.title}</Typography>
                  </Stack>
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </Box>
  );
};

export default WhyChooseUs;
