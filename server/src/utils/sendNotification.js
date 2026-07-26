import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";
import sendEmail from "./sendEmail.js";

const sendNotification = async ({
  userId,
  title,
  message,
  type,
  referenceId = null,
}) => {
  try {
    // Save Notification
    const notification = await Notification.create({
      userId,
      title,
      message,
      type,
      referenceId,
    });

    // Get User Email
    const user = await User.findByPk(userId);

    if (user && user.email) {
      await sendEmail({
        email: user.email,
        subject: title,
        message,
      });
    }

    return notification;

  } catch (error) {
    console.error("Notification Error:", error.message);
  }
};

export default sendNotification;