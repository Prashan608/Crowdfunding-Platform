import { Box, Divider } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";

import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";

import { sendMessage } from "../../redux/aiSlice";

const ChatWindow = ({ onClose }) => {
  const dispatch = useDispatch();

  const { messages, loading } = useSelector((state) => state.ai);

  const handleSend = (message) => {
    dispatch(sendMessage(message));
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        bgcolor: "#f8fafc",
      }}
    >
      {/* Header */}
      <ChatHeader onClose={onClose} />

      <Divider />

      {/* Messages */}
      <ChatMessages messages={messages} />

      <Divider />

      {/* Input */}
      <ChatInput
        onSend={handleSend}
        loading={loading}
      />
    </Box>
  );
};

export default ChatWindow;