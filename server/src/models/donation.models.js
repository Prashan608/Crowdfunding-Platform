import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Donation = sequelize.define(
  "Donation",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },

    message: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    paymentStatus: {
      type: DataTypes.ENUM(
        "pending",
        "success",
        "failed"
      ),
      defaultValue: "pending",
    },

    transactionId: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    donorId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    campaignId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    tableName: "donations",
    timestamps: true,
  }
);

export default Donation;