import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import authRoutes from "./src/routes/auth.routes.js";
import campaignRoutes from "./src/routes/campaign.routes.js";
import donationRoutes from "./src/routes/donation.routes.js";
import dashboardRoutes from "./src/routes/dashbord.routes.js";
import paymentRoutes from "./src/routes/payment.routes.js";
import notificationRoutes from "./src/routes/notification.routes.js";
import helmet from "helmet";
import rateLimiter from "./src/middlewares/rateLimiter.middleware.js";
import compression from "compression";
import profileRoutes from "./src/routes/profile.routes.js";
import aiRoutes from "./src/routes/ai.routes.js"

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(morgan("dev"));

app.use(helmet());

app.use(rateLimiter);

app.use(compression());

app.use("/api/auth", authRoutes);
app.use("/api/campaigns", campaignRoutes);
app.use("/api/donation", donationRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/ai", aiRoutes);



app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Crowdfunding Backend Running 🚀",
  });
});

export default app;