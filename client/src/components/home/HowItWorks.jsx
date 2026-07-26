import { Box, Container, Grid, Paper, Stack, Typography } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import ShareIcon from "@mui/icons-material/Share";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";


const steps = [
  {
    title: "Create Campaign",
    text: "Tell your story and set a transparent fundraising goal.",
    icon: AddCircleIcon,
  },
  {
    title: "Share Campaign",
    text: "Share your campaign with your network and supporters.",
    icon: ShareIcon,
  },
  {
    title: "Receive Donations",
    text: "Collect secure donations and track progress in real time.",
    icon: VolunteerActivismIcon,
  },
];

const HowItWorks = () => {
  return (
    <Container maxWidth="lg" sx={{ py: { xs: 6, md: 9 } }}>
      <Typography variant="h4" fontWeight={900} sx={{ textAlign: "center" }}>
        How It Works
      </Typography>
      <Typography
        color="text.secondary"
        sx={{ textAlign: "center", mt: 1, mb: 4 }}
      >
        Start raising funds in three simple steps.
      </Typography>
      <Grid container spacing={3}>
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <Grid size={{ xs: 12, md: 4 }} key={step.title}>
              <Paper
                elevation={0}
                sx={{
                  position: "relative",
                  height: "100%",
                  p: 3,
                  borderRadius: 3,
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Stack spacing={2}>
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: 2,
                      display: "grid",
                      placeItems: "center",
                      bgcolor: "#dcfce7",
                      color: "#16a34a",
                    }}
                  >
                    <Icon />
                  </Box>
                  <Typography variant="h6" fontWeight={900}>
                    {step.title}
                  </Typography>
                  <Typography color="text.secondary" lineHeight={1.7}>
                    {step.text}
                  </Typography>
                </Stack>
                {index < steps.length - 1 && (
                  <Typography
                    sx={{
                      display: { xs: "none", md: "block" },
                      position: "absolute",
                      right: -22,
                      top: "45%",
                      color: "#16a34a",
                      fontSize: 28,
                      fontWeight: 900,
                    }}
                  >
                    →
                  </Typography>
                )}
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
};

export default HowItWorks;
