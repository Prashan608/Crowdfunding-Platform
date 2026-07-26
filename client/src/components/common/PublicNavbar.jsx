import { useState } from "react";
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
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import LogoutIcon from "@mui/icons-material/Logout";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/authSlice"; // apna sahi path check kar lein

const navLinks = [
  {
    label: "Home",
    path: "/",
  },
  {
    label: "Explore Campaigns",
    path: "/campaigns",
  },
  {
    label: "Start Campaign",
    path: "/campaigns/create",
  },
  {
    label: "About",
    path: "/about",
  },
  {
    label: "Contact",
    path: "/contact",
  },
];

const PublicNavbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const isMenuOpen = Boolean(anchorEl);

  const isActivePath = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }

    return location.pathname.startsWith(path);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
  };

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    closeDrawer();
    dispatch(logout());
    navigate("/login", { replace: true });
  };

  const renderNavLinks = (isMobile = false) =>
    navLinks.map((link) => {
      const isActive = isActivePath(link.path);

      if (isMobile) {
        return (
          <ListItemButton
            key={link.path}
            component={RouterLink}
            to={link.path}
            onClick={closeDrawer}
            sx={{
              borderRadius: 2,
              mb: 0.5,
              color: isActive ? "#16a34a" : "text.primary",
              backgroundColor: isActive
                ? "rgba(22, 163, 74, 0.08)"
                : "transparent",
            }}
          >
            <ListItemText
              primary={link.label}
              primaryTypographyProps={{
                fontWeight: isActive ? 800 : 600,
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
            position: "relative",
            px: 1.5,
            py: 1,
            color: isActive ? "#16a34a" : "#4b5563",
            textTransform: "none",
            fontWeight: isActive ? 800 : 700,
            fontSize: "0.96rem",
            borderRadius: 2,
            "&:hover": {
              color: "#16a34a",
              backgroundColor: "rgba(22, 163, 74, 0.08)",
            },
            "&::after": {
              content: '""',
              position: "absolute",
              left: "18%",
              right: "18%",
              bottom: 4,
              height: 3,
              borderRadius: 99,
              backgroundColor: isActive ? "#16a34a" : "transparent",
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
          width: "100%",
          backgroundColor: "rgba(255, 255, 255, 0.96)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid #e5e7eb",
          color: "text.primary",
          zIndex: 1200,
        }}
      >
        <Container maxWidth="xl">
          <Toolbar
            disableGutters
            sx={{
              minHeight: 76,
              px: { xs: 1, md: 2 },
              gap: 2,
            }}
          >
            <Typography
              component={RouterLink}
              to="/"
              variant="h5"
              sx={{
                color: "#16a34a",
                textDecoration: "none",
                fontWeight: 900,
                letterSpacing: "-0.4px",
                whiteSpace: "nowrap",
              }}
            >
              CrowdFund
            </Typography>

            <Stack
              direction="row"
              alignItems="center"
              spacing={0.5}
              sx={{
                display: { xs: "none", md: "flex" },
                flexGrow: 1,
                ml: 3,
              }}
            >
              {renderNavLinks()}
            </Stack>

            <Stack
              direction="row"
              alignItems="center"
              spacing={1.2}
              sx={{ display: { xs: "none", md: "flex" } }}
            >
              {isAuthenticated ? (
                <>
                  <IconButton
                    component={RouterLink}
                    to="/notifications"
                    sx={{
                      width: 42,
                      height: 42,
                      color: "#4b5563",
                      border: "1px solid #e5e7eb",
                      "&:hover": {
                        color: "#16a34a",
                        backgroundColor: "rgba(22, 163, 74, 0.08)",
                      },
                    }}
                  >
                    <Badge
                      color="success"
                      variant="dot"
                      overlap="circular"
                      anchorOrigin={{
                        vertical: "top",
                        horizontal: "right",
                      }}
                    >
                      <NotificationsNoneIcon />
                    </Badge>
                  </IconButton>

                  <Avatar
                    onClick={handleAvatarClick}
                    aria-controls={isMenuOpen ? "account-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={isMenuOpen ? "true" : undefined}
                    sx={{
                      width: 42,
                      height: 42,
                      bgcolor: "#16a34a",
                      color: "#ffffff",
                      fontWeight: 800,
                      cursor: "pointer",
                      boxShadow: "0 10px 24px rgba(22, 163, 74, 0.25)",
                    }}
                  >
                    {user?.firstName?.charAt(0)?.toUpperCase() || "U"}
                  </Avatar>

                  <Menu
                    id="account-menu"
                    anchorEl={anchorEl}
                    open={isMenuOpen}
                    onClose={handleMenuClose}
                    onClick={handleMenuClose}
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    transformOrigin={{ vertical: "top", horizontal: "right" }}
                    PaperProps={{
                      elevation: 3,
                      sx: {
                        mt: 1.5,
                        minWidth: 190,
                        borderRadius: 2,
                        border: "1px solid #e5e7eb",
                      },
                    }}
                  >
                    <MenuItem component={RouterLink} to="/profile">
                      Profile
                    </MenuItem>
                    <MenuItem component={RouterLink} to="/dashboard">
                      Dashboard
                    </MenuItem>
                    <MenuItem component={RouterLink} to="/notifications">
                      Notifications
                    </MenuItem>
                    <Divider />
                    <MenuItem
                      onClick={handleLogout}
                      sx={{ color: "#dc2626", fontWeight: 700 }}
                    >
                      <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
                      Logout
                    </MenuItem>
                  </Menu>

                  <Button
                    component={RouterLink}
                    to="/dashboard"
                    variant="contained"
                    sx={{
                      bgcolor: "#16a34a",
                      color: "#ffffff",
                      textTransform: "none",
                      borderRadius: 2,
                      px: 2.6,
                      py: 1.05,
                      fontWeight: 900,
                      boxShadow: "0 12px 28px rgba(22, 163, 74, 0.28)",
                      "&:hover": {
                        bgcolor: "#15803d",
                        boxShadow: "0 14px 32px rgba(22, 163, 74, 0.34)",
                      },
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
                    variant="text"
                    sx={{
                      color: "#16a34a",
                      textTransform: "none",
                      fontWeight: 900,
                      px: 2,
                      borderRadius: 2,
                      "&:hover": {
                        backgroundColor: "rgba(22, 163, 74, 0.08)",
                      },
                    }}
                  >
                    Sign In
                  </Button>

                  <Button
                    component={RouterLink}
                    to="/register"
                    variant="contained"
                    sx={{
                      bgcolor: "#16a34a",
                      color: "#ffffff",
                      textTransform: "none",
                      borderRadius: 2,
                      px: 2.7,
                      py: 1.05,
                      fontWeight: 900,
                      boxShadow: "0 12px 28px rgba(22, 163, 74, 0.28)",
                      "&:hover": {
                        bgcolor: "#15803d",
                        boxShadow: "0 14px 32px rgba(22, 163, 74, 0.34)",
                      },
                    }}
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </Stack>

            <Box sx={{ flexGrow: 1, display: { xs: "block", md: "none" } }} />

            <IconButton
              onClick={() => setDrawerOpen(true)}
              sx={{
                display: { xs: "inline-flex", md: "none" },
                border: "1px solid #e5e7eb",
                borderRadius: 2,
              }}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={closeDrawer}
        PaperProps={{
          sx: {
            width: 310,
            p: 2,
          },
        }}
      >
        <Stack spacing={2}>
          <Typography
            component={RouterLink}
            to="/"
            onClick={closeDrawer}
            variant="h5"
            sx={{
              color: "#16a34a",
              textDecoration: "none",
              fontWeight: 900,
            }}
          >
            CrowdFund
          </Typography>

          <Divider />

          <List disablePadding>{renderNavLinks(true)}</List>

          <Divider />

          {isAuthenticated ? (
            <Stack spacing={1.2}>
              <Button
                component={RouterLink}
                to="/dashboard"
                onClick={closeDrawer}
                variant="contained"
                fullWidth
                sx={{
                  bgcolor: "#16a34a",
                  textTransform: "none",
                  borderRadius: 2,
                  fontWeight: 900,
                  "&:hover": { bgcolor: "#15803d" },
                }}
              >
                Dashboard
              </Button>

              <Button
                component={RouterLink}
                to="/profile"
                onClick={closeDrawer}
                variant="outlined"
                fullWidth
                sx={{
                  borderColor: "#16a34a",
                  color: "#16a34a",
                  textTransform: "none",
                  borderRadius: 2,
                  fontWeight: 900,
                }}
              >
                Profile
              </Button>

              <Button
                component={RouterLink}
                to="/notifications"
                onClick={closeDrawer}
                variant="text"
                fullWidth
                sx={{
                  color: "#4b5563",
                  textTransform: "none",
                  borderRadius: 2,
                  fontWeight: 800,
                }}
              >
                Notifications
              </Button>

              <Divider />

              <Button
                onClick={handleLogout}
                variant="outlined"
                fullWidth
                startIcon={<LogoutIcon />}
                sx={{
                  borderColor: "#dc2626",
                  color: "#dc2626",
                  textTransform: "none",
                  borderRadius: 2,
                  fontWeight: 900,
                  "&:hover": {
                    borderColor: "#b91c1c",
                    backgroundColor: "rgba(220, 38, 38, 0.06)",
                  },
                }}
              >
                Logout
              </Button>
            </Stack>
          ) : (
            <Stack spacing={1.2}>
              <Button
                component={RouterLink}
                to="/login"
                onClick={closeDrawer}
                variant="outlined"
                fullWidth
                sx={{
                  borderColor: "#16a34a",
                  color: "#16a34a",
                  textTransform: "none",
                  borderRadius: 2,
                  fontWeight: 900,
                }}
              >
                Sign In
              </Button>

              <Button
                component={RouterLink}
                to="/register"
                onClick={closeDrawer}
                variant="contained"
                fullWidth
                sx={{
                  bgcolor: "#16a34a",
                  textTransform: "none",
                  borderRadius: 2,
                  fontWeight: 900,
                  "&:hover": { bgcolor: "#15803d" },
                }}
              >
                Sign Up
              </Button>
            </Stack>
          )}
        </Stack>
      </Drawer>
    </>
  );
};

export default PublicNavbar;






























// import { useState } from "react";
// import {
//   AppBar,
//   Avatar,
//   Badge,
//   Box,
//   Button,
//   Container,
//   Divider,
//   Drawer,
//   IconButton,
//   List,
//   ListItemButton,
//   ListItemText,
//   Stack,
//   Toolbar,
//   Typography,
// } from "@mui/material";
// import MenuIcon from "@mui/icons-material/Menu";
// import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
// import { Link as RouterLink, useLocation } from "react-router-dom";
// import { useSelector } from "react-redux";
// import { logout } from "../../redux/authSlice";

// const navLinks = [
//   {
//     label: "Home",
//     path: "/",
//   },
//   {
//     label: "Explore Campaigns",
//     path: "/campaigns",
//   },
//   {
//     label: "Start Campaign",
//     path: "/campaigns/create",
//   },
//   {
//     label: "About",
//     path: "/about",
//   },
//   {
//     label: "Contact",
//     path: "/contact",
//   },
// ];

// const PublicNavbar = () => {
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const location = useLocation();
//   const [anchorEl, setAnchorEl] = useState(null); // avatar menu ke liye

//   const { isAuthenticated, user } = useSelector((state) => state.auth);

//   const isActivePath = (path) => {
//     if (path === "/") {
//       return location.pathname === "/";
//     }

//     return location.pathname.startsWith(path);
//   };

//   const closeDrawer = () => {
//     setDrawerOpen(false);
//   };

//   const renderNavLinks = (isMobile = false) =>
//     navLinks.map((link) => {
//       const isActive = isActivePath(link.path);

//       if (isMobile) {
//         return (
//           <ListItemButton
//             key={link.path}
//             component={RouterLink}
//             to={link.path}
//             onClick={closeDrawer}
//             sx={{
//               borderRadius: 2,
//               mb: 0.5,
//               color: isActive ? "#16a34a" : "text.primary",
//               backgroundColor: isActive
//                 ? "rgba(22, 163, 74, 0.08)"
//                 : "transparent",
//             }}
//           >
//             <ListItemText
//               primary={link.label}
//               primaryTypographyProps={{
//                 fontWeight: isActive ? 800 : 600,
//               }}
//             />
//           </ListItemButton>
//         );
//       }

//       return (
//         <Button
//           key={link.path}
//           component={RouterLink}
//           to={link.path}
//           sx={{
//             position: "relative",
//             px: 1.5,
//             py: 1,
//             color: isActive ? "#16a34a" : "#4b5563",
//             textTransform: "none",
//             fontWeight: isActive ? 800 : 700,
//             fontSize: "0.96rem",
//             borderRadius: 2,
//             "&:hover": {
//               color: "#16a34a",
//               backgroundColor: "rgba(22, 163, 74, 0.08)",
//             },
//             "&::after": {
//               content: '""',
//               position: "absolute",
//               left: "18%",
//               right: "18%",
//               bottom: 4,
//               height: 3,
//               borderRadius: 99,
//               backgroundColor: isActive ? "#16a34a" : "transparent",
//             },
//           }}
//         >
//           {link.label}
//         </Button>
//       );
//     });

//   return (
//     <>
//       <AppBar
//         position="sticky"
//         elevation={0}
//         sx={{
//           width: "100%",
//           backgroundColor: "rgba(255, 255, 255, 0.96)",
//           backdropFilter: "blur(16px)",
//           borderBottom: "1px solid #e5e7eb",
//           color: "text.primary",
//           zIndex: 1200,
//         }}
//       >
//         <Container maxWidth="xl">
//           <Toolbar
//             disableGutters
//             sx={{
//               minHeight: 76,
//               px: { xs: 1, md: 2 },
//               gap: 2,
//             }}
//           >
//             <Typography
//               component={RouterLink}
//               to="/"
//               variant="h5"
//               sx={{
//                 color: "#16a34a",
//                 textDecoration: "none",
//                 fontWeight: 900,
//                 letterSpacing: "-0.4px",
//                 whiteSpace: "nowrap",
//               }}
//             >
//               CrowdFund
//             </Typography>

//             <Stack
//               direction="row"
//               alignItems="center"
//               spacing={0.5}
//               sx={{
//                 display: { xs: "none", md: "flex" },
//                 flexGrow: 1,
//                 ml: 3,
//               }}
//             >
//               {renderNavLinks()}
//             </Stack>

//             <Stack
//               direction="row"
//               alignItems="center"
//               spacing={1.2}
//               sx={{ display: { xs: "none", md: "flex" } }}
//             >
//               {isAuthenticated ? (
//                 <>
//                   <IconButton
//                     component={RouterLink}
//                     to="/notifications"
//                     sx={{
//                       width: 42,
//                       height: 42,
//                       color: "#4b5563",
//                       border: "1px solid #e5e7eb",
//                       "&:hover": {
//                         color: "#16a34a",
//                         backgroundColor: "rgba(22, 163, 74, 0.08)",
//                       },
//                     }}
//                   >
//                     <Badge
//                       color="success"
//                       variant="dot"
//                       overlap="circular"
//                       anchorOrigin={{
//                         vertical: "top",
//                         horizontal: "right",
//                       }}
//                     >
//                       <NotificationsNoneIcon />
//                     </Badge>
//                   </IconButton>

//                   <Avatar
//                     component={RouterLink}
//                     to="/profile"
//                     sx={{
//                       width: 42,
//                       height: 42,
//                       bgcolor: "#16a34a",
//                       color: "#ffffff",
//                       fontWeight: 800,
//                       textDecoration: "none",
//                       boxShadow: "0 10px 24px rgba(22, 163, 74, 0.25)",
//                     }}
//                   >
//                     {user?.firstName?.charAt(0)?.toUpperCase() || "U"}
//                   </Avatar>

//                   <Button
//                     component={RouterLink}
//                     to="/dashboard"
//                     variant="contained"
//                     sx={{
//                       bgcolor: "#16a34a",
//                       color: "#ffffff",
//                       textTransform: "none",
//                       borderRadius: 2,
//                       px: 2.6,
//                       py: 1.05,
//                       fontWeight: 900,
//                       boxShadow: "0 12px 28px rgba(22, 163, 74, 0.28)",
//                       "&:hover": {
//                         bgcolor: "#15803d",
//                         boxShadow: "0 14px 32px rgba(22, 163, 74, 0.34)",
//                       },
//                     }}
//                   >
//                     Dashboard
//                   </Button>
//                 </>
//               ) : (
//                 <>
//                   <Button
//                     component={RouterLink}
//                     to="/login"
//                     variant="text"
//                     sx={{
//                       color: "#16a34a",
//                       textTransform: "none",
//                       fontWeight: 900,
//                       px: 2,
//                       borderRadius: 2,
//                       "&:hover": {
//                         backgroundColor: "rgba(22, 163, 74, 0.08)",
//                       },
//                     }}
//                   >
//                     Sign In
//                   </Button>

//                   <Button
//                     component={RouterLink}
//                     to="/register"
//                     variant="contained"
//                     sx={{
//                       bgcolor: "#16a34a",
//                       color: "#ffffff",
//                       textTransform: "none",
//                       borderRadius: 2,
//                       px: 2.7,
//                       py: 1.05,
//                       fontWeight: 900,
//                       boxShadow: "0 12px 28px rgba(22, 163, 74, 0.28)",
//                       "&:hover": {
//                         bgcolor: "#15803d",
//                         boxShadow: "0 14px 32px rgba(22, 163, 74, 0.34)",
//                       },
//                     }}
//                   >
//                     Sign Up
//                   </Button>
//                 </>
//               )}
//             </Stack>

//             <Box sx={{ flexGrow: 1, display: { xs: "block", md: "none" } }} />

//             <IconButton
//               onClick={() => setDrawerOpen(true)}
//               sx={{
//                 display: { xs: "inline-flex", md: "none" },
//                 border: "1px solid #e5e7eb",
//                 borderRadius: 2,
//               }}
//             >
//               <MenuIcon />
//             </IconButton>
//           </Toolbar>
//         </Container>
//       </AppBar>

//       <Drawer
//         anchor="right"
//         open={drawerOpen}
//         onClose={closeDrawer}
//         PaperProps={{
//           sx: {
//             width: 310,
//             p: 2,
//           },
//         }}
//       >
//         <Stack spacing={2}>
//           <Typography
//             component={RouterLink}
//             to="/"
//             onClick={closeDrawer}
//             variant="h5"
//             sx={{
//               color: "#16a34a",
//               textDecoration: "none",
//               fontWeight: 900,
//             }}
//           >
//             CrowdFund
//           </Typography>

//           <Divider />

//           <List disablePadding>{renderNavLinks(true)}</List>

//           <Divider />

//           {isAuthenticated ? (
//             <Stack spacing={1.2}>
//               <Button
//                 component={RouterLink}
//                 to="/dashboard"
//                 onClick={closeDrawer}
//                 variant="contained"
//                 fullWidth
//                 sx={{
//                   bgcolor: "#16a34a",
//                   textTransform: "none",
//                   borderRadius: 2,
//                   fontWeight: 900,
//                   "&:hover": { bgcolor: "#15803d" },
//                 }}
//               >
//                 Dashboard
//               </Button>

//               <Button
//                 component={RouterLink}
//                 to="/profile"
//                 onClick={closeDrawer}
//                 variant="outlined"
//                 fullWidth
//                 sx={{
//                   borderColor: "#16a34a",
//                   color: "#16a34a",
//                   textTransform: "none",
//                   borderRadius: 2,
//                   fontWeight: 900,
//                 }}
//               >
//                 Profile
//               </Button>

//               <Button
//                 component={RouterLink}
//                 to="/notifications"
//                 onClick={closeDrawer}
//                 variant="text"
//                 fullWidth
//                 sx={{
//                   color: "#4b5563",
//                   textTransform: "none",
//                   borderRadius: 2,
//                   fontWeight: 800,
//                 }}
//               >
//                 Notifications
//               </Button>
//             </Stack>
//           ) : (
//             <Stack spacing={1.2}>
//               <Button
//                 component={RouterLink}
//                 to="/login"
//                 onClick={closeDrawer}
//                 variant="outlined"
//                 fullWidth
//                 sx={{
//                   borderColor: "#16a34a",
//                   color: "#16a34a",
//                   textTransform: "none",
//                   borderRadius: 2,
//                   fontWeight: 900,
//                 }}
//               >
//                 Sign In
//               </Button>

//               <Button
//                 component={RouterLink}
//                 to="/register"
//                 onClick={closeDrawer}
//                 variant="contained"
//                 fullWidth
//                 sx={{
//                   bgcolor: "#16a34a",
//                   textTransform: "none",
//                   borderRadius: 2,
//                   fontWeight: 900,
//                   "&:hover": { bgcolor: "#15803d" },
//                 }}
//               >
//                 Sign Up
//               </Button>
//             </Stack>
//           )}
//         </Stack>
//       </Drawer>
//     </>
//   );
// };

// export default PublicNavbar;
