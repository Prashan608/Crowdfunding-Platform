import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { addSocketNotification } from "../redux/notificationSlice";
import { connectSocket, disconnectSocket } from "../services/socket.service";

const useSocketNotifications = () => {
  const dispatch = useDispatch();

  const { user, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated || !user?.id) {
      disconnectSocket();
      return;
    }

    const socket = connectSocket();

    const handleConnect = () => {
      socket.emit("join", user.id);
      console.log("Socket connected:", socket.id);
    };

    const handleNotification = (notification) => {
      dispatch(addSocketNotification(notification));
      toast.success(notification?.message || "New notification received.");
    };

    const handleDisconnect = () => {
      console.log("Socket disconnected");
    };

    socket.on("connect", handleConnect);
    socket.on("notification", handleNotification);
    socket.on("newNotification", handleNotification);
    socket.on("disconnect", handleDisconnect);

    if (socket.connected) {
      socket.emit("join", user.id);
    }

    return () => {
      socket.off("connect", handleConnect);
      socket.off("notification", handleNotification);
      socket.off("newNotification", handleNotification);
      socket.off("disconnect", handleDisconnect);
    };
  }, [dispatch, isAuthenticated, user?.id]);
};

export default useSocketNotifications;