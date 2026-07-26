import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Button,
  Container,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { useState } from "react";
import { useSelector } from "react-redux";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Explore Campaigns", path: "/campaigns" },
  { label: "Start Campaign", path: "/campaigns/create" },
  { label: "About", path: "/about" },
  { label: "Contact", path: "/contact" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const renderNavLinks = (isMobile = false) =>
    navLinks.map((link) => {
      const isActive = location.pathname === link.path;

      if (isMobile) {
        return (
          <ListItemButton
            key={link.path}
            component={RouterLink}
            to={link.path}
            onClick={() => setOpen(false)}
          >
            <ListItemText
              primary={link.label}
              primaryTypographyProps={{
                fontWeight: isActive ? 800 : 600,
                color: isActive ? "#16a34a" : "text.primary",
              }}
            />
          </ListItemButton>
        );
      }

      return (
        <Button
          key={link.path}
          component={RouterLink}
          to={link.path}
          sx={{
            color: isActive ? "#16a34a" : "text.secondary",
            fontWeight: isActive ? 800 : 600,
            textTransform: "none",
            "&:hover": {
              color: "#16a34a",
              backgroundColor: "rgba(22, 163, 74, 0.08)",
            },
          }}
        >
          {link.label}
        </Button>
      );
    });

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          backgroundColor: "rgba(255, 255, 255, 0.92)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ minHeight: 76 }}>
            <Typography
              component={RouterLink}
              to="/"
              variant="h5"
              fontWeight={900}
              sx={{
                color: "#16a34a",
                textDecoration: "none",
                mr: 4,
                letterSpacing: -0.2,
              }}
            >
              CrowdFund
            </Typography>

            <Stack
              direction="row"
              spacing={0.5}
              sx={{ display: { xs: "none", md: "flex" }, flexGrow: 1 }}
            >
              {renderNavLinks()}
            </Stack>

            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{ display: { xs: "none", md: "flex" } }}
            >
              {isAuthenticated ? (
                <>
                  <IconButton component={RouterLink} to="/notifications">
                    <Badge color="success" variant="dot">
                      <NotificationsNoneIcon />
                    </Badge>
                  </IconButton>
                  <Avatar
                    component={RouterLink}
                    to="/profile"
                    sx={{
                      width: 38,
                      height: 38,
                      bgcolor: "#16a34a",
                      textDecoration: "none",
                    }}
                  >
                    {user?.firstName?.[0] || "U"}
                  </Avatar>
                  <Button
                    component={RouterLink}
                    to="/dashboard"
                    variant="contained"
                    sx={{
                      bgcolor: "#16a34a",
                      textTransform: "none",
                      borderRadius: 2,
                      fontWeight: 800,
                      px: 2.5,
                      "&:hover": { bgcolor: "#15803d" },
                    }}
                  >
                    Dashboard
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    component={RouterLink}
                    to="/login"
                    sx={{
                      color: "#16a34a",
                      textTransform: "none",
                      fontWeight: 800,
                    }}
                  >
                    Login
                  </Button>
                  <Button
                    component={RouterLink}
                    to="/register"
                    variant="contained"
                    sx={{
                      bgcolor: "#16a34a",
                      textTransform: "none",
                      borderRadius: 2,
                      fontWeight: 800,
                      px: 2.5,
                      "&:hover": { bgcolor: "#15803d" },
                    }}
                  >
                    Register
                  </Button>
                </>
              )}
            </Stack>

            <Box sx={{ flexGrow: 1, display: { xs: "block", md: "none" } }} />
            <IconButton
              onClick={() => setOpen(true)}
              sx={{ display: { xs: "inline-flex", md: "none" } }}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
        <Box sx={{ width: 290, p: 2 }}>
          <Typography variant="h6" fontWeight={900} sx={{ color: "#16a34a" }}>
            CrowdFund
          </Typography>
          <Divider sx={{ my: 2 }} />
          <List>{renderNavLinks(true)}</List>
          <Divider sx={{ my: 2 }} />
          <Stack spacing={1}>
            {isAuthenticated ? (
              <>
                <Button component={RouterLink} to="/dashboard" variant="contained">
                  Dashboard
                </Button>
                <Button component={RouterLink} to="/profile" variant="outlined">
                  Profile
                </Button>
              </>
            ) : (
              <>
                <Button component={RouterLink} to="/login" variant="outlined">
                  Login
                </Button>
                <Button component={RouterLink} to="/register" variant="contained">
                  Register
                </Button>
              </>
            )}
          </Stack>
        </Box>
      </Drawer>
    </>
  );
};

export default Navbar;
