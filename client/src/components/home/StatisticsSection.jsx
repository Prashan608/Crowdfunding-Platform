import { Container, Grid, Paper, Stack, Typography } from "@mui/material";
import CampaignIcon from "@mui/icons-material/Campaign";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import GroupsIcon from "@mui/icons-material/Groups";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

const stats = [
  { label: "Total Campaigns", value: "1,250+", icon: CampaignIcon },
  { label: "Total Raised", value: "₹12Cr+", icon: CurrencyRupeeIcon },
  { label: "Total Donors", value: "48K+", icon: GroupsIcon },
  { label: "Success Stories", value: "860+", icon: EmojiEventsIcon },
];

const StatisticsSection = () => {
  return (
    <Container maxWidth="lg" sx={{ py: { xs: 5, md: 7 } }}>
      <Grid container spacing={2.5}>
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={item.label}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  border: "1px solid",
                  borderColor: "divider",
                  transition: "0.25s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 18px 45px rgba(15, 23, 42, 0.1)",
                  },
                }}
              >
                <Stack spacing={1.5}>
                  <Icon sx={{ color: "#16a34a", fontSize: 34 }} />
                  <Typography variant="h4" fontWeight={900}>
                    {item.value}
                  </Typography>
                  <Typography color="text.secondary">{item.label}</Typography>
                </Stack>
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
};

export default StatisticsSection;
