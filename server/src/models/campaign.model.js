import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Campaign = sequelize.define(
  "Campaign",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    goalAmount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },

    raisedAmount: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0,
    },

    category: {
      type: DataTypes.ENUM(
        "Education",
        "Medical",
        "Startup",
        "Charity",
        "Animal",
        "Environment",
        "Emergency",
        "Other"
      ),
      allowNull: false,
    },

    coverImage: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM(
        "active",
        "completed",
        "cancelled"
      ),
      defaultValue: "active",
    },

    creatorId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    tableName: "campaigns",
    timestamps: true,
  }
);

export default Campaign;