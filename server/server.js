import dotenv from "dotenv";
dotenv.config();
import http from "http";
import app from "./app.js";
import sequelize from "./src/config/db.js";
import "./src/models/index.js";
import { initializeSocket } from "./src/socket/index.js";

const PORT = process.env.PORT || 5000;

// Create HTTP Server
const server = http.createServer(app);

// Initialize Socket.IO
initializeSocket(server);

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database Connected Successfully");

    await sequelize.sync({ alter: true });
    console.log("✅ Database Synced Successfully");

    server.listen(PORT, () => {
      console.log(`🚀 Server Running On Port ${PORT}`);
      console.log("✅ Socket.IO Initialized");
    });

  } catch (error) {
    console.log("❌ Database Connection Failed");
    console.log(error.message);
  }
};

startServer();