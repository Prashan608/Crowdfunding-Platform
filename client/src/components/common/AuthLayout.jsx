import { Box, Container, Paper, Typography } from "@mui/material";

const AuthLayout = ({ title, subtitle, children }) => {
  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          minHeight: "100dvh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          py: 4,
        }}
      >
        <Paper
          elevation={4}
          sx={{
            width: "100%",
            p: { xs: 2.5, sm: 3 },
            borderRadius: 2.5,
          }}
        >
          <Typography variant="h5" fontWeight={700} sx={{ textAlign: "center" }}>
            {title}
          </Typography>

          {subtitle && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ textAlign: "center", mt: 0.5, mb: 2.5 }}
            >
              {subtitle}
            </Typography>
          )}

          {children}
        </Paper>
      </Box>
    </Container>
  );
};

export default AuthLayout;