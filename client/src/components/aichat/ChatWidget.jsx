import { useState } from "react";
import { Fab, Drawer, useMediaQuery } from "@mui/material";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import ChatWindow from "./ChatWindow";

const ChatWidget = () => {
  const [open, setOpen] = useState(false);

  const isMobile = useMediaQuery("(max-width:600px)");

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      {/* Floating AI Button */}
      <Fab
        color="primary"
        onClick={handleOpen}
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 1500,
          width: 64,
          height: 64,
          boxShadow: 6,
          "&:hover": {
            transform: "scale(1.08)",
          },
          transition: "all 0.3s ease",
        }}
      >
        <SmartToyIcon sx={{ fontSize: 32 }} />
      </Fab>

      {/* Chat Drawer */}
      <Drawer
        anchor="right"
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: isMobile ? "100%" : 420,
            height: "100%",
          },
        }}
      >
        <ChatWindow onClose={handleClose} />
      </Drawer>
    </>
  );
};

export default ChatWidget;