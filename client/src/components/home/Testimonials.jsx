import { Avatar, Container, Grid, Paper, Stack, Typography } from "@mui/material";

const testimonials = [
  {
    name: "Priya Sharma",
    review: "CrowdFund helped us raise money quickly for our school project. The process felt simple and trustworthy.",
  },
  {
    name: "Rahul Mehta",
    review: "The campaign pages look professional and donation tracking is very clear. It helped our supporters stay confident.",
  },
  {
    name: "Ananya Rao",
    review: "I discovered meaningful campaigns and donated in minutes. The platform feels clean, fast and transparent.",
  },
];

const Testimonials = () => {
  return (
    <Container maxWidth="lg" sx={{ py: { xs: 6, md: 9 } }}>
      <Typography variant="h4" fontWeight={900} sx={{ textAlign: "center" }}>
        Loved by creators and supporters
      </Typography>
      <Grid container spacing={3} sx={{ mt: 4 }}>
        {testimonials.map((item) => (
          <Grid size={{ xs: 12, md: 4 }} key={item.name}>
            <Paper
              elevation={0}
              sx={{
                height: "100%",
                p: 3,
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Stack spacing={2}>
                <Avatar sx={{ bgcolor: "#16a34a" }}>{item.name[0]}</Avatar>
                <Typography color="text.secondary" lineHeight={1.8}>
                  “{item.review}”
                </Typography>
                <Typography fontWeight={900}>{item.name}</Typography>
              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Testimonials;
