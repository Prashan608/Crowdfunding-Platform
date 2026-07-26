import { useState } from "react";
import {
  Box,
  TextField,
  IconButton,
  InputAdornment,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

const ChatInput = ({ onSend, loading = false }) => {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    const text = message.trim();

    if (!text || loading) return;

    onSend(text);
    setMessage("");
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <Box
      sx={{
        p: 2,
        bgcolor: "#fff",
        borderTop: "1px solid #e0e0e0",
      }}
    >
      <TextField
        fullWidth
        multiline
        maxRows={4}
        placeholder="Ask me anything about crowdfunding..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={loading}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                color="primary"
                onClick={handleSend}
                disabled={!message.trim() || loading}
              >
                <SendIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
};

export default ChatInput;