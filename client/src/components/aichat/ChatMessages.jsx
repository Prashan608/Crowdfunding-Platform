import { Box, Typography } from "@mui/material";
import Message from "./Message";

const ChatMessages = ({ messages }) => {
  return (
    <Box
      sx={{
        flex: 1,
        overflowY: "auto",
        p: 2,
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      {messages.length === 0 ? (
        <Typography
          align="center"
          color="text.secondary"
          sx={{ mt: 4 }}
        >
          👋 Welcome to Crowdfund AI
          <br />
          Ask me anything about campaigns, donations, or fundraising.
        </Typography>
      ) : (
        messages.map((message) => (
          <Message key={message.id} message={message} />
        ))
      )}
    </Box>
  );
};

export default ChatMessages;