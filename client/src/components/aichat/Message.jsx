import { Box, Paper, Typography } from "@mui/material";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import PersonIcon from "@mui/icons-material/Person";
import ReactMarkdown from "react-markdown";

const Message = ({ message }) => {
  const isAI = message.sender === "ai";

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: isAI ? "flex-start" : "flex-end",
      }}
    >
      <Paper
        elevation={2}
        sx={{
          p: 2,
          maxWidth: "80%",
          borderRadius: 3,
          bgcolor: isAI ? "#ffffff" : "primary.main",
          color: isAI ? "text.primary" : "#fff",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 1,
            gap: 1,
          }}
        >
          {isAI ? (
            <SmartToyIcon fontSize="small" />
          ) : (
            <PersonIcon fontSize="small" />
          )}

          <Typography variant="subtitle2" fontWeight={600}>
            {isAI ? "Crowdfund AI" : "You"}
          </Typography>
        </Box>

        {isAI ? (
          <ReactMarkdown>{message.text}</ReactMarkdown>
        ) : (
          <Typography>{message.text}</Typography>
        )}
      </Paper>
    </Box>
  );
};

export default Message;