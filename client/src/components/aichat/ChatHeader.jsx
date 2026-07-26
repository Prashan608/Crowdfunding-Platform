import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Avatar,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SmartToyIcon from "@mui/icons-material/SmartToy";

const ChatHeader = ({ onClose }) => {
  return (
    <AppBar
      position="static"
      elevation={1}
      sx={{
        bgcolor: "primary.main",
      }}
    >
      <Toolbar>
        <Avatar
          sx={{
            bgcolor: "white",
            color: "primary.main",
            width: 42,
            height: 42,
            mr: 2,
          }}
        >
          <SmartToyIcon />
        </Avatar>

        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h6" fontWeight={600}>
            Crowdfund AI
          </Typography>

          <Typography
            variant="caption"
            sx={{
              opacity: 0.9,
            }}
          >
            Online • Ready to help
          </Typography>
        </Box>

        <IconButton color="inherit" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default ChatHeader;