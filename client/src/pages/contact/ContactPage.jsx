import React, { useState } from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  TextField,
  Button,
  Paper,
  Stack,
  Alert,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import PublicNavbar from "../../components/common/PublicNavbar";
const BRAND_GREEN = "#16a34a";

const subjectOptions = [
  { value: "general", label: "General inquiry" },
  { value: "campaign", label: "Campaign support" },
  { value: "payment", label: "Payment / refund issue" },
  { value: "report", label: "Report a campaign" },
  { value: "partnership", label: "Partnership" },
];

const contactDetails = [
  {
    icon: <EmailOutlinedIcon sx={{ fontSize: 26 }} />,
    label: "Email us",
    value: "support@crowdfund.com",
  },
  {
    icon: <PhoneOutlinedIcon sx={{ fontSize: 26 }} />,
    label: "Call us",
    value: "+91 98765 43210",
  },
  {
    icon: <LocationOnOutlinedIcon sx={{ fontSize: 26 }} />,
    label: "Visit us",
    value: "4th Floor, Cyber Hub, Gurugram, Haryana, India",
  },
  {
    icon: <AccessTimeOutlinedIcon sx={{ fontSize: 26 }} />,
    label: "Support hours",
    value: "Mon – Sat, 9:00 AM – 7:00 PM IST",
  },
];

const initialForm = {
  name: "",
  email: "",
  subject: "general",
  message: "",
};

function ContactPage({ apiBaseUrl = "/api/contact" }) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState(null); // "success" | "error" | null

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = "Please enter your name.";
    if (!form.email.trim()) {
      next.email = "Please enter your email.";
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      next.email = "Please enter a valid email address.";
    }
    if (!form.message.trim()) next.message = "Please enter a message.";
    else if (form.message.trim().length < 10)
      next.message = "Message should be at least 10 characters.";

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);

    if (!validate()) return;

    try {
      setSubmitting(true);
      const res = await fetch(apiBaseUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok || json.success === false) {
        throw new Error(json.message || "Something went wrong.");
      }

      setStatus("success");
      setForm(initialForm);
    } catch (err) {
      setStatus("error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
      
      <PublicNavbar />
      {/* Header */}
      <Box sx={{ bgcolor: "#0f172a", color: "#fff", py: { xs: 6, md: 8 } }}>
        <Container maxWidth="md">
          <Typography
            variant="overline"
            sx={{ color: BRAND_GREEN, fontWeight: 700, letterSpacing: 1.5 }}
          >
            Contact us
          </Typography>
          <Typography
            variant="h4"
            fontWeight={700}
            sx={{ mt: 1, mb: 1, fontSize: { xs: "1.75rem", md: "2.25rem" } }}
          >
            We'd love to hear from you
          </Typography>
          <Typography variant="body1" sx={{ color: "grey.400", maxWidth: 560 }}>
            Questions about a campaign, a payment, or just want to say hi?
            Send us a message and our team will get back within 24 hours.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="md" sx={{ py: { xs: 5, md: 8 } }}>
        <Grid container spacing={4}>
          {/* Contact details */}
          <Grid item xs={12} md={5}>
            <Stack spacing={3}>
              {contactDetails.map((c) => (
                <Stack direction="row" spacing={2} key={c.label} alignItems="flex-start">
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      bgcolor: "#f0fdf4",
                      color: BRAND_GREEN,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {c.icon}
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" fontWeight={700}>
                      {c.label}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {c.value}
                    </Typography>
                  </Box>
                </Stack>
              ))}
            </Stack>
          </Grid>

          {/* Form */}
          <Grid item xs={12} md={7}>
            <Paper
              variant="outlined"
              sx={{ p: { xs: 2.5, md: 4 }, borderRadius: 3 }}
            >
              {status === "success" && (
                <Alert severity="success" sx={{ mb: 3 }}>
                  Thanks for reaching out — we've received your message and
                  will reply soon.
                </Alert>
              )}
              {status === "error" && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  We couldn't send your message right now. Please try again in
                  a moment.
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit} noValidate>
                <Grid container spacing={2.5}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Your name"
                      fullWidth
                      value={form.name}
                      onChange={handleChange("name")}
                      error={Boolean(errors.name)}
                      helperText={errors.name}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Email address"
                      type="email"
                      fullWidth
                      value={form.email}
                      onChange={handleChange("email")}
                      error={Boolean(errors.email)}
                      helperText={errors.email}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      select
                      label="Subject"
                      fullWidth
                      value={form.subject}
                      onChange={handleChange("subject")}
                    >
                      {subjectOptions.map((opt) => (
                        <MenuItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Message"
                      fullWidth
                      multiline
                      minRows={5}
                      value={form.message}
                      onChange={handleChange("message")}
                      error={Boolean(errors.message)}
                      helperText={errors.message}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      disabled={submitting}
                      sx={{
                        bgcolor: BRAND_GREEN,
                        "&:hover": { bgcolor: "#15803d" },
                        minWidth: 160,
                      }}
                    >
                      {submitting ? (
                        <CircularProgress size={22} sx={{ color: "#fff" }} />
                      ) : (
                        "Send message"
                      )}
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default ContactPage;