import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined"
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import RefreshIcon from "@mui/icons-material/Refresh";
import {
  Box,
  Stack,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Badge,
  Chip,
  Alert,
  Button,
  Divider,
  Tooltip,
  AppBar,
  Toolbar,
  Skeleton,
  Paper,
} from "@mui/material";
import {
  Notifications as NotificationsIcon,
  NotificationsNoneOutlined as NotificationsNoneIcon,
  Done as DoneIcon,
  DoneAll as DoneAllIcon,
  Circle as CircleIcon,
} from "@mui/icons-material";

/**
 * NotificationPage
 * ------------------
 * Backend:
 *  - GET    /api/notifications        -> { success, total, data: [...] }
 *  - PATCH  /api/notifications/:id/read
 *  - PATCH  /api/notifications/read-all
 *  - DELETE /api/notifications/:id
 *  - Auth: JWT Bearer token (stored in localStorage under "token"), NOT cookies.
 *  - Notification fields use `isRead`.
 *  - Socket: client must emit "join" with userId after connecting.
 *
 * Props:
 *  - apiBaseUrl  : REST API base url (default: "/api/notifications")
 *  - socketUrl   : Socket server url, e.g. "http://localhost:5000"
 *  - userId      : logged-in user id (used for socket "join" room)
 *  - loginPath   : route to redirect to when auth fails (default: "/login")
 */
const NEW_NOTIFICATION_EVENT = "newNotification"; // TODO: confirm exact event name from backend

function NotificationPage({
  apiBaseUrl = "/api/notifications",
  socketUrl,
  userId,
  loginPath = "/login",
}) {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [connected, setConnected] = useState(false);
  const [authError, setAuthError] = useState(false);

  const socketRef = useRef(null);

  // ---------- Auth helpers ----------
  const getToken = () => localStorage.getItem("token");

  const authHeaders = () => {
    const token = getToken();
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  const goToLogin = useCallback(() => {
    localStorage.removeItem("token");
    navigate(loginPath, { replace: true });
  }, [navigate, loginPath]);

  // Central response handler: catches invalid/missing token (401) globally
  const handleUnauthorized = useCallback(
    (res) => {
      if (res && res.status === 401) {
        setAuthError(true);
        localStorage.removeItem("token");
        // give the user a beat to see the message before redirecting
        setTimeout(() => navigate(loginPath, { replace: true }), 1200);
        return true;
      }
      return false;
    },
    [navigate, loginPath],
  );

  // ---------- REST: fetch notification list ----------
  const fetchNotifications = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setAuthError(true);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await fetch(apiBaseUrl, {
        headers: authHeaders(),
      });

      if (handleUnauthorized(res)) return;

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || `Request failed (${res.status})`);
      }

      setNotifications(json.data || []);
    } catch (err) {
      setError(err.message || "Could not load notifications.");
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiBaseUrl]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // ---------- SOCKET: connect, join personal room, listen for new notifications ----------
  useEffect(() => {
    if (!socketUrl || authError) return;

    const token = getToken();
    const socket = io(socketUrl, {
      auth: { token: token ? `Bearer ${token}` : undefined },
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      setConnected(true);
      if (userId) socket.emit("join", userId);
    });

    socket.on("disconnect", () => setConnected(false));

    socket.on(NEW_NOTIFICATION_EVENT, (payload) => {
      setNotifications((prev) => {
        if (prev.some((n) => n.id === payload.id)) return prev;
        return [payload, ...prev];
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [socketUrl, userId, authError]);

  // ---------- Actions ----------
  const markAsRead = async (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    );
    try {
      const res = await fetch(`${apiBaseUrl}/${id}/read`, {
        method: "PATCH",
        headers: authHeaders(),
      });
      if (handleUnauthorized(res)) return;
    } catch {
      // silent fail; UI already updated optimistically
    }
  };

  const markAllAsRead = async () => {
    const hasUnread = notifications.some((n) => !n.isRead);
    if (!hasUnread) return;

    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    try {
      const res = await fetch(`${apiBaseUrl}/read-all`, {
        method: "PATCH",
        headers: authHeaders(),
      });
      if (handleUnauthorized(res)) return;
    } catch {
      // silent fail
    }
  };

  const deleteOne = async (id) => {
    const prevList = notifications;
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    try {
      const res = await fetch(`${apiBaseUrl}/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      if (handleUnauthorized(res)) return;
      if (!res.ok) throw new Error();
    } catch {
      setNotifications(prevList); // rollback on failure
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // ---------- Auth error state (missing/expired token) ----------
  if (authError) {
    return (
      <Box
        sx={{
          maxWidth: 520,
          mx: "auto",
          px: 2,
          py: 8,
          textAlign: "center",
        }}
      >
        <Alert severity="warning" sx={{ mb: 2 }}>
          Your session has expired. Please log in again.
        </Alert>
        <Button variant="contained" onClick={goToLogin}>
          Go to Login
        </Button>
      </Box>
    );
  }

  // ---------- Render ----------
  return (
    <Box sx={{ maxWidth: 640, mx: "auto", bgcolor: "background.default", minHeight: "100vh" }}>
      {/* Top AppBar */}
      <AppBar
        position="sticky"
        color="inherit"
        elevation={0}
        sx={{
          borderBottom: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
        }}
      >
        <Toolbar sx={{ gap: 1, px: { xs: 1.5, sm: 2 } }}>
          <Tooltip title="Back">
            <IconButton
              edge="start"
              onClick={() => navigate(-1)}
              aria-label="go back"
            >
              <ArrowBackIcon />
            </IconButton>
          </Tooltip>

          <Badge badgeContent={unreadCount} color="error" max={99}>
            <NotificationsIcon color="action" />
          </Badge>

          <Typography variant="h6" fontWeight={600} sx={{ flexGrow: 1 }}>
            Notifications
          </Typography>

          <Tooltip title={connected ? "Live" : "Connecting..."}>
            <CircleIcon
              sx={{ fontSize: 10 }}
              color={connected ? "success" : "disabled"}
            />
          </Tooltip>

          {unreadCount > 0 && (
            <Chip
              icon={<DoneAllIcon />}
              label="Mark all read"
              size="small"
              onClick={markAllAsRead}
              color="primary"
              variant="outlined"
              sx={{ display: { xs: "none", sm: "inline-flex" }, ml: 1 }}
            />
          )}
        </Toolbar>

        {/* Mark all read - mobile row */}
        {unreadCount > 0 && (
          <Box sx={{ display: { xs: "flex", sm: "none" }, justifyContent: "flex-end", px: 1.5, pb: 1 }}>
            <Chip
              icon={<DoneAllIcon />}
              label="Mark all read"
              size="small"
              onClick={markAllAsRead}
              color="primary"
              variant="outlined"
            />
          </Box>
        )}
      </AppBar>

      {/* Error */}
      {error && (
        <Alert
          severity="error"
          sx={{ m: 2 }}
          action={
            <Button
              color="inherit"
              size="small"
              startIcon={<RefreshIcon />}
              onClick={fetchNotifications}
            >
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      {/* Loading - skeletons */}
      {loading && !error && (
        <Stack divider={<Divider />} sx={{ px: 2, py: 1 }}>
          {[...Array(5)].map((_, i) => (
            <Stack
              key={i}
              direction="row"
              spacing={1.5}
              alignItems="flex-start"
              sx={{ py: 1.5 }}
            >
              <Skeleton variant="circular" width={8} height={8} sx={{ mt: 1 }} />
              <Box sx={{ flexGrow: 1 }}>
                <Skeleton variant="text" width="55%" height={22} />
                <Skeleton variant="text" width="90%" />
                <Skeleton variant="text" width="30%" />
              </Box>
            </Stack>
          ))}
        </Stack>
      )}

      {/* Empty state */}
      {!loading && !error && notifications.length === 0 && (
        <Stack
          alignItems="center"
          justifyContent="center"
          sx={{ py: { xs: 8, sm: 12 }, px: 3, color: "text.secondary" }}
        >
          <Paper
            elevation={0}
            sx={{
              width: 88,
              height: 88,
              borderRadius: "50%",
              bgcolor: "action.hover",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 2,
            }}
          >
            <NotificationsNoneIcon sx={{ fontSize: 44, color: "text.disabled" }} />
          </Paper>
          <Typography variant="subtitle1" fontWeight={600} color="text.primary">
            No notifications yet
          </Typography>
          <Typography variant="body2" sx={{ mt: 0.5, textAlign: "center", maxWidth: 320 }}>
            When something needs your attention, it'll show up here.
          </Typography>
        </Stack>
      )}

      {/* List */}
      {!loading && !error && notifications.length > 0 && (
        <List disablePadding>
          {notifications.map((n, idx) => (
            <React.Fragment key={n.id}>
              <ListItem
                sx={{
                  alignItems: "flex-start",
                  bgcolor: n.isRead ? "background.paper" : "action.hover",
                  py: 1.25,
                  px: { xs: 1.5, sm: 2 },
                  transition: "background-color 0.15s ease",
                }}
                secondaryAction={
                  <Stack direction="row" spacing={0.5}>
                    {!n.isRead && (
                      <Tooltip title="Mark as read">
                        <IconButton
                          size="small"
                          onClick={() => markAsRead(n.id)}
                        >
                          <DoneIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                    <Tooltip title="Delete">
                      <IconButton size="small" onClick={() => deleteOne(n.id)}>
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                }
              >
                {!n.isRead && (
                  <CircleIcon
                    sx={{ fontSize: 8, color: "primary.main", mt: 1, mr: 1.5, flexShrink: 0 }}
                  />
                )}
                <ListItemText
                  primary={
                    <Typography variant="body2" fontWeight={600}>
                      {n.title}
                    </Typography>
                  }
                  secondary={
                    <>
                      {n.message && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          component="span"
                          sx={{
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {n.message}
                        </Typography>
                      )}
                      <Typography
                        variant="caption"
                        color="text.disabled"
                        component="span"
                        sx={{ display: "block", mt: 0.25 }}
                      >
                        {formatTime(n.createdAt)}
                      </Typography>
                    </>
                  }
                  sx={{ pr: { xs: 7, sm: 8 } }}
                />
              </ListItem>
              {idx < notifications.length - 1 && <Divider component="li" />}
            </React.Fragment>
          ))}
        </List>
      )}
    </Box>
  );
}

function formatTime(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const diffMs = Date.now() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 7) return `${diffDay}d ago`;
  return date.toLocaleDateString();
}

export default NotificationPage;



















































// import React, { useState, useEffect, useRef } from "react";
// import { io } from "socket.io-client";
// import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
// import {
//   Box,
//   Stack,
//   Typography,
//   List,
//   ListItem,
//   ListItemText,
//   IconButton,
//   Badge,
//   Chip,
//   CircularProgress,
//   Alert,
//   Divider,
//   Tooltip,
// } from "@mui/material";
// import {
//   Notifications as NotificationsIcon,
//   NotificationsNone as NotificationsNoneIcon,
//   Done as DoneIcon,
//   DoneAll as DoneAllIcon,
//   Circle as CircleIcon,
// } from "@mui/icons-material";

// /**
//  * NotificationPage
//  * ------------------
//  * Backend (as confirmed):
//  *  - GET    /api/notifications        -> { success, total, data: [...] }  (no pagination, findAll)
//  *  - PATCH  /api/notifications/:id/read
//  *  - PATCH  /api/notifications/read-all
//  *  - DELETE /api/notifications/:id
//  *  - Notification fields use `isRead` (not `read`)
//  *  - Socket: client must emit "join" with userId after connecting
//  *    (server: socket.on("join", (userId) => socket.join(userId)))
//  *  - Socket event name for a NEW notification is NOT yet confirmed in backend code —
//  *    using "newNotification" as placeholder. Update NEW_NOTIFICATION_EVENT below
//  *    once you find where getIO().to(userId).emit(...) is actually called.
//  *
//  * Props:
//  *  - apiBaseUrl        : REST API base url (default: "/api/notifications")
//  *  - socketUrl         : Socket server url, e.g. "http://localhost:5000"
//  *  - userId            : logged-in user id (used for socket "join" room)
//  *  - withCredentials   : true if backend auth uses cookies (isAuthenticated middleware) - default true
//  */
// const NEW_NOTIFICATION_EVENT = "newNotification"; // TODO: confirm exact event name from backend

// function NotificationPage({
//   apiBaseUrl = "/api/notifications",
//   socketUrl,
//   userId,
//   withCredentials = true,
// }) {
//   const [notifications, setNotifications] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [connected, setConnected] = useState(false);

//   const socketRef = useRef(null);

//   // ---------- REST: fetch notification list ----------
//   const fetchNotifications = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       const res = await fetch(apiBaseUrl, {
//         credentials: withCredentials ? "include" : "same-origin",
//         headers: { "Content-Type": "application/json" },
//       });

//       const json = await res.json();
//       if (!res.ok || !json.success) {
//         throw new Error(json.message || `Request failed (${res.status})`);
//       }

//       setNotifications(json.data || []);
//     } catch (err) {
//       setError(err.message || "Notifications load nahi ho paayi.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchNotifications();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [apiBaseUrl]);

//   // ---------- SOCKET: connect, join personal room, listen for new notifications ----------
//   useEffect(() => {
//     if (!socketUrl) return;

//     const socket = io(socketUrl, { withCredentials });
//     socketRef.current = socket;

//     socket.on("connect", () => {
//       setConnected(true);
//       if (userId) socket.emit("join", userId); // matches server join handler
//     });

//     socket.on("disconnect", () => setConnected(false));

//     // Naya notification aane par list ke top pe prepend karo
//     socket.on(NEW_NOTIFICATION_EVENT, (payload) => {
//       setNotifications((prev) => {
//         if (prev.some((n) => n.id === payload.id)) return prev; // duplicate guard
//         return [payload, ...prev];
//       });
//     });

//     return () => {
//       socket.disconnect();
//     };
//   }, [socketUrl, userId, withCredentials]);

//   // ---------- Actions ----------
//   const markAsRead = async (id) => {
//     setNotifications((prev) =>
//       prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
//     );
//     try {
//       await fetch(`${apiBaseUrl}/${id}/read`, {
//         method: "PATCH",
//         credentials: withCredentials ? "include" : "same-origin",
//       });
//     } catch {
//       // silent fail; UI already updated optimistically
//     }
//   };

//   const markAllAsRead = async () => {
//     const hasUnread = notifications.some((n) => !n.isRead);
//     if (!hasUnread) return;

//     setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
//     try {
//       await fetch(`${apiBaseUrl}/read-all`, {
//         method: "PATCH",
//         credentials: withCredentials ? "include" : "same-origin",
//       });
//     } catch {
//       // silent fail
//     }
//   };

//   const deleteOne = async (id) => {
//     const prevList = notifications;
//     setNotifications((prev) => prev.filter((n) => n.id !== id));
//     try {
//       const res = await fetch(`${apiBaseUrl}/${id}`, {
//         method: "DELETE",
//         credentials: withCredentials ? "include" : "same-origin",
//       });
//       if (!res.ok) throw new Error();
//     } catch {
//       setNotifications(prevList); // rollback on failure
//     }
//   };

//   const unreadCount = notifications.filter((n) => !n.isRead).length;

//   // ---------- Render ----------
//   return (
//     <Box sx={{ maxWidth: 520, mx: "auto", bgcolor: "background.paper" }}>
//       {/* Header */}
//       <Stack
//         direction="row"
//         alignItems="center"
//         justifyContent="space-between"
//         sx={{
//           position: "sticky",
//           top: 0,
//           zIndex: 1,
//           px: 2,
//           py: 1.5,
//           borderBottom: "1px solid",
//           borderColor: "divider",
//           bgcolor: "background.paper",
//         }}
//       >
//         <Stack direction="row" alignItems="center" spacing={1}>
//           <Badge badgeContent={unreadCount} color="error">
//             <NotificationsIcon color="action" />
//           </Badge>
//           <Typography variant="h6" fontWeight={600}>
//             Notifications
//           </Typography>
//           <Tooltip title={connected ? "Live" : "Connecting..."}>
//             <CircleIcon
//               sx={{ fontSize: 10 }}
//               color={connected ? "success" : "disabled"}
//             />
//           </Tooltip>
//         </Stack>

//         {unreadCount > 0 && (
//           <Chip
//             icon={<DoneAllIcon />}
//             label="Mark all read"
//             size="small"
//             onClick={markAllAsRead}
//             color="primary"
//             variant="outlined"
//           />
//         )}
//       </Stack>

//       {/* Error */}
//       {error && (
//         <Alert severity="error" sx={{ m: 2 }}>
//           {error}
//         </Alert>
//       )}

//       {/* Loading */}
//       {loading && (
//         <Stack alignItems="center" justifyContent="center" sx={{ py: 8 }}>
//           <CircularProgress size={28} />
//         </Stack>
//       )}

//       {/* Empty state */}
//       {!loading && notifications.length === 0 && !error && (
//         <Stack
//           alignItems="center"
//           justifyContent="center"
//           sx={{ py: 10, color: "text.disabled" }}
//         >
//           <NotificationsNoneIcon sx={{ fontSize: 40, mb: 1, opacity: 0.5 }} />
//           <Typography variant="body2">
//             Koi notification nahi hai abhi.
//           </Typography>
//         </Stack>
//       )}

//       {/* List */}
//       {!loading && notifications.length > 0 && (
//         <List disablePadding>
//           {notifications.map((n, idx) => (
//             <React.Fragment key={n.id}>
//               <ListItem
//                 sx={{
//                   alignItems: "flex-start",
//                   bgcolor: n.isRead ? "background.paper" : "action.hover",
//                   py: 1.25,
//                 }}
//                 secondaryAction={
//                   <Stack direction="row" spacing={0.5}>
//                     {!n.isRead && (
//                       <Tooltip title="Mark as read">
//                         <IconButton
//                           size="small"
//                           onClick={() => markAsRead(n.id)}
//                         >
//                           <DoneIcon fontSize="small" />
//                         </IconButton>
//                       </Tooltip>
//                     )}
//                     <Tooltip title="Delete">
//                       <IconButton size="small" onClick={() => deleteOne(n.id)}>
//                         <DeleteOutlineIcon fontSize="small" />
//                       </IconButton>
//                     </Tooltip>
//                   </Stack>
//                 }
//               >
//                 {!n.isRead && (
//                   <CircleIcon
//                     sx={{ fontSize: 8, color: "primary.main", mt: 1, mr: 1.5 }}
//                   />
//                 )}
//                 <ListItemText
//                   primary={
//                     <Typography variant="body2" fontWeight={600}>
//                       {n.title}
//                     </Typography>
//                   }
//                   secondary={
//                     <>
//                       {n.message && (
//                         <Typography
//                           variant="body2"
//                           color="text.secondary"
//                           sx={{
//                             display: "-webkit-box",
//                             WebkitLineClamp: 2,
//                             WebkitBoxOrient: "vertical",
//                             overflow: "hidden",
//                           }}
//                         >
//                           {n.message}
//                         </Typography>
//                       )}
//                       <Typography variant="caption" color="text.disabled">
//                         {formatTime(n.createdAt)}
//                       </Typography>
//                     </>
//                   }
//                   sx={{ pr: 8 }}
//                 />
//               </ListItem>
//               {idx < notifications.length - 1 && <Divider component="li" />}
//             </React.Fragment>
//           ))}
//         </List>
//       )}
//     </Box>
//   );
// }

// function formatTime(dateStr) {
//   if (!dateStr) return "";
//   const date = new Date(dateStr);
//   const diffMs = Date.now() - date.getTime();
//   const diffMin = Math.floor(diffMs / 60000);

//   if (diffMin < 1) return "abhi";
//   if (diffMin < 60) return `${diffMin}m pehle`;
//   const diffHr = Math.floor(diffMin / 60);
//   if (diffHr < 24) return `${diffHr}h pehle`;
//   const diffDay = Math.floor(diffHr / 24);
//   if (diffDay < 7) return `${diffDay}d pehle`;
//   return date.toLocaleDateString();
// }

// export default NotificationPage;
