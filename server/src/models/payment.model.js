import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Payment = sequelize.define(
  "Payment",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    donationId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    gateway: {
      type: DataTypes.ENUM("razorpay", "stripe", "paypal"),
      defaultValue: "razorpay",
    },

    provider: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    orderId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    paymentId: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },

    signature: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },

    currency: {
      type: DataTypes.STRING,
      defaultValue: "INR",
    },

    paymentMethod: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    status: {
      type: DataTypes.ENUM(
        "pending",
        "created",
        "authorized",
        "captured",
        "failed",
        "refunded"
      ),
      defaultValue: "pending",
    },
  },
  {
    tableName: "payments",
    timestamps: true,
  }
);

export default Payment;