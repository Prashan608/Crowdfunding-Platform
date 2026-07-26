import User from "../models/user.model.js";
import Campaign from "../models/campaign.model.js";
import Donation from "../models/donation.models.js";
import Payment from "../models/payment.model.js";
import { Op, fn, col, literal } from "sequelize";
import sequelize from "../config/db.js";

// Helper function to get last 12 months date range
const getLast12Months = () => {
  const months = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    months.push(new Date(d.getFullYear(), d.getMonth(), 1));
  }
  return months;
};

// ========================
// ADMIN DASHBOARD V2
// ========================
export const getAdminDashboard = async (req, res) => {
  try {
    // Statistics Queries
    const [
      totalUsers,
      totalCreators,
      totalSupporters,
      totalCampaigns,
      activeCampaigns,
      completedCampaigns,
      cancelledCampaigns,
      totalDonations,
      totalRevenue,
      successfulPayments,
      failedPayments,
      pendingPayments,
    ] = await Promise.all([
      User.count(),
      User.count({ where: { role: "creator" } }),
      User.count({ where: { role: "supporter" } }),
      Campaign.count(),
      Campaign.count({ where: { status: "active" } }),
      Campaign.count({ where: { status: "completed" } }),
      Campaign.count({ where: { status: "cancelled" } }),
      Donation.count({ where: { paymentStatus: "success" } }),
      Donation.sum("amount", { where: { paymentStatus: "success" } }),
      Payment.count({ where: { status: "captured" } }),
      Payment.count({ where: { status: "failed" } }),
      Payment.count({ where: { status: "pending" } }),
    ]);

    // Analytics Queries - Monthly Data (Last 12 Months)
    const last12Months = getLast12Months();

    const [
      monthlyUserRegistrations,
      monthlyDonations,
      monthlyRevenue,
      categoryWiseCampaigns,
      topCampaignsByRaised,
      topDonors,
      recentUsers,
      recentCampaigns,
      recentDonations,
      recentPayments,
    ] = await Promise.all([
      // Monthly User Registrations
      User.findAll({
        attributes: [
          [fn("DATE_TRUNC", literal("'month'"), col("createdAt")), "month"],
          [fn("COUNT", col("id")), "count"],
        ],
        where: {
          createdAt: {
            [Op.gte]: new Date(new Date().getFullYear() - 1, new Date().getMonth(), 1),
          },
        },
        group: [fn("DATE_TRUNC", literal("'month'"), col("createdAt"))],
        order: [[fn("DATE_TRUNC", literal("'month'"), col("createdAt")), "ASC"]],
        subQuery: false,
        raw: true,
      }),

      // Monthly Donations Count
      Donation.findAll({
        attributes: [
          [fn("DATE_TRUNC", literal("'month'"), col("createdAt")), "month"],
          [fn("COUNT", col("id")), "count"],
        ],
        where: {
          paymentStatus: "success",
          createdAt: {
            [Op.gte]: new Date(new Date().getFullYear() - 1, new Date().getMonth(), 1),
          },
        },
        group: [fn("DATE_TRUNC", literal("'month'"), col("createdAt"))],
        order: [[fn("DATE_TRUNC", literal("'month'"), col("createdAt")), "ASC"]],
        subQuery: false,
        raw: true,
      }),

      // Monthly Revenue
      Donation.findAll({
        attributes: [
          [fn("DATE_TRUNC", literal("'month'"), col("createdAt")), "month"],
          [fn("SUM", col("amount")), "revenue"],
        ],
        where: {
          paymentStatus: "success",
          createdAt: {
            [Op.gte]: new Date(new Date().getFullYear() - 1, new Date().getMonth(), 1),
          },
        },
        group: [fn("DATE_TRUNC", literal("'month'"), col("createdAt"))],
        order: [[fn("DATE_TRUNC", literal("'month'"), col("createdAt")), "ASC"]],
        subQuery: false,
        raw: true,
      }),

      // Category Wise Campaign Count
      Campaign.findAll({
        attributes: [
          "category",
          [fn("COUNT", col("id")), "count"],
        ],
        group: ["category"],
        order: [[fn("COUNT", col("id")), "DESC"]],
        subQuery: false,
        raw: true,
      }),

      // Top 5 Campaigns by Raised Amount
      Campaign.findAll({
        attributes: [
          "id",
          "title",
          "category",
          "goalAmount",
          "raisedAmount",
          "status",
        ],
        include: [
          {
            model: User,
            as: "creator",
            attributes: ["id", "firstName", "lastName"],
          },
        ],
        order: [["raisedAmount", "DESC"]],
        limit: 5,
      }),

      // Top 5 Donors
      User.findAll({
        attributes: [
          "id",
          "firstName",
          "lastName",
          "email",
          [fn("COUNT", col("donations.id")), "donationCount"],
          [fn("SUM", col("donations.amount")), "totalDonated"],
        ],
        include: [
          {
            model: Donation,
            as: "donations",
            attributes: [],
            where: { paymentStatus: "success" },
            required: false,
          },
        ],
        group: ["User.id"],
        subQuery: false,
        order: [[literal("totalDonated"), "DESC"]],
        limit: 5,
        raw: true,
      }),

      // Recent Users
      User.findAll({
        attributes: ["id", "firstName", "lastName", "email", "role", "createdAt"],
        order: [["createdAt", "DESC"]],
        limit: 5,
      }),

      // Recent Campaigns
      Campaign.findAll({
        attributes: [
          "id",
          "title",
          "category",
          "goalAmount",
          "raisedAmount",
          "status",
          "createdAt",
        ],
        include: [
          {
            model: User,
            as: "creator",
            attributes: ["id", "firstName", "lastName"],
          },
        ],
        order: [["createdAt", "DESC"]],
        limit: 5,
      }),

      // Recent Donations
      Donation.findAll({
        attributes: ["id", "amount", "paymentStatus", "createdAt"],
        include: [
          {
            model: User,
            as: "donor",
            attributes: ["id", "firstName", "lastName"],
          },
          {
            model: Campaign,
            as: "campaign",
            attributes: ["id", "title"],
          },
        ],
        order: [["createdAt", "DESC"]],
        limit: 5,
      }),

      // Recent Payments
      Payment.findAll({
        attributes: ["id", "amount", "status", "createdAt"],
        include: [
          {
            model: Donation,
            as: "donation",
            attributes: ["id", "amount"],
            include: [
              {
                model: User,
                as: "donor",
                attributes: ["id", "firstName", "lastName"],
              },
              {
                model: Campaign,
                as: "campaign",
                attributes: ["id", "title"],
              },
            ],
          },
        ],
        order: [["createdAt", "DESC"]],
        limit: 5,
      }),
    ]);

    return res.status(200).json({
      success: true,
      message: "Admin dashboard v2 fetched successfully.",
      data: {
        statistics: {
          totalUsers,
          totalCreators,
          totalSupporters,
          totalCampaigns,
          activeCampaigns,
          completedCampaigns,
          cancelledCampaigns,
          totalDonations,
          totalRevenue: Number(totalRevenue) || 0,
          paymentStats: {
            successfulPayments,
            failedPayments,
            pendingPayments,
          },
        },
        analytics: {
          monthlyUserRegistrations,
          monthlyDonations,
          monthlyRevenue,
          categoryWiseCampaigns,
          topCampaignsByRaised,
          topDonors,
        },
        recentData: {
          recentUsers,
          recentCampaigns,
          recentDonations,
          recentPayments,
        },
      },
    });
  } catch (error) {
    console.error("Admin Dashboard Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ========================
// CREATOR DASHBOARD V2
// ========================
export const getCreatorDashboard = async (req, res) => {
  try {
    const creatorId = req.user.id;

    // Get creator's campaigns
    const campaigns = await Campaign.findAll({
      where: { creatorId },
      attributes: [
        "id",
        "title",
        "category",
        "goalAmount",
        "raisedAmount",
        "status",
        "startDate",
        "endDate",
        "createdAt",
      ],
    });

    const campaignIds = campaigns.map((c) => c.id);

    // Statistics Queries
    const [
      totalCampaigns,
      activeCampaigns,
      completedCampaigns,
      cancelledCampaigns,
      totalRaised,
      totalDonations,
      totalDonors,
      successfulPayments,
      failedPayments,
      pendingPayments,
    ] = await Promise.all([
      Campaign.count({ where: { creatorId } }),
      Campaign.count({ where: { creatorId, status: "active" } }),
      Campaign.count({ where: { creatorId, status: "completed" } }),
      Campaign.count({ where: { creatorId, status: "cancelled" } }),
      Donation.sum("amount", {
        where: {
          campaignId: campaignIds,
          paymentStatus: "success",
        },
      }),
      Donation.count({
        where: {
          campaignId: campaignIds,
          paymentStatus: "success",
        },
      }),
      Donation.count({
        where: {
          campaignId: campaignIds,
          paymentStatus: "success",
        },
        distinct: true,
        col: "donorId",
      }),
      Payment.count({
        where: { status: "captured" },
        include: [
          {
            model: Donation,
            as: "donation",
            where: { campaignId: campaignIds },
            required: true,
          },
        ],
      }),
      Payment.count({
        where: { status: "failed" },
        include: [
          {
            model: Donation,
            as: "donation",
            where: { campaignId: campaignIds },
            required: true,
          },
        ],
      }),
      Payment.count({
        where: { status: "pending" },
        include: [
          {
            model: Donation,
            as: "donation",
            where: { campaignId: campaignIds },
            required: true,
          },
        ],
      }),
    ]);

    // Campaign Analytics
    let topPerformingCampaign = null;
    let lowestPerformingCampaign = null;
    let campaignEndingSoon = null;
    let goalCompletionPercentage = 0;

    if (campaigns.length > 0) {
      // Goal Completion Percentage (for all campaigns)
      const totalGoal = campaigns.reduce(
        (sum, c) => sum + Number(c.goalAmount),
        0
      );
      const totalRaisedAmount = campaigns.reduce(
        (sum, c) => sum + Number(c.raisedAmount),
        0
      );
      goalCompletionPercentage =
        totalGoal > 0 ? ((totalRaisedAmount / totalGoal) * 100).toFixed(2) : 0;

      // Top Performing Campaign (highest raised)
      topPerformingCampaign = campaigns.reduce((prev, current) =>
        Number(prev.raisedAmount) > Number(current.raisedAmount) ? prev : current
      );

      // Lowest Performing Campaign (lowest raised)
      lowestPerformingCampaign = campaigns.reduce((prev, current) =>
        Number(prev.raisedAmount) < Number(current.raisedAmount) ? prev : current
      );

      // Campaign Ending Soon (active campaigns ending within 30 days)
      const today = new Date();
      const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
      campaignEndingSoon = campaigns.filter(
        (c) => c.status === "active" && c.endDate <= thirtyDaysFromNow
      );
    }

    // More Analytics Queries - Monthly Data
    const [
      monthlyRevenue,
      monthlyDonations,
      campaignWiseRevenue,
      campaignWiseDonationCount,
      recentCampaigns,
      recentDonations,
      recentPayments,
    ] = await Promise.all([
      // Monthly Revenue (Last 12 Months)
      Donation.findAll({
        attributes: [
          [fn("DATE_TRUNC", literal("'month'"), col("createdAt")), "month"],
          [fn("SUM", col("amount")), "revenue"],
        ],
        where: {
          campaignId: campaignIds,
          paymentStatus: "success",
          createdAt: {
            [Op.gte]: new Date(new Date().getFullYear() - 1, new Date().getMonth(), 1),
          },
        },
        group: [fn("DATE_TRUNC", literal("'month'"), col("createdAt"))],
        order: [[fn("DATE_TRUNC", literal("'month'"), col("createdAt")), "ASC"]],
        subQuery: false,
        raw: true,
      }),

      // Monthly Donations Count
      Donation.findAll({
        attributes: [
          [fn("DATE_TRUNC", literal("'month'"), col("createdAt")), "month"],
          [fn("COUNT", col("id")), "count"],
        ],
        where: {
          campaignId: campaignIds,
          paymentStatus: "success",
          createdAt: {
            [Op.gte]: new Date(new Date().getFullYear() - 1, new Date().getMonth(), 1),
          },
        },
        group: [fn("DATE_TRUNC", literal("'month'"), col("createdAt"))],
        order: [[fn("DATE_TRUNC", literal("'month'"), col("createdAt")), "ASC"]],
        subQuery: false,
        raw: true,
      }),

      // Campaign Wise Revenue
      Donation.findAll({
        attributes: [
          "campaignId",
          [fn("SUM", col("amount")), "totalRevenue"],
          [fn("COUNT", col("id")), "donationCount"],
        ],
        where: {
          campaignId: campaignIds,
          paymentStatus: "success",
        },
        include: [
          {
            model: Campaign,
            as: "campaign",
            attributes: ["id", "title"],
          },
        ],
        group: ["campaignId", "campaign.id"],
        order: [[literal("totalRevenue"), "DESC"]],
        subQuery: false,
        raw: true,
      }),

      // Campaign Wise Donation Count
      Donation.findAll({
        attributes: [
          "campaignId",
          [fn("COUNT", col("id")), "donationCount"],
        ],
        where: {
          campaignId: campaignIds,
          paymentStatus: "success",
        },
        include: [
          {
            model: Campaign,
            as: "campaign",
            attributes: ["id", "title"],
          },
        ],
        group: ["campaignId", "campaign.id"],
        order: [[literal("donationCount"), "DESC"]],
        subQuery: false,
        raw: true,
      }),

      // Recent Campaigns
      Campaign.findAll({
        where: { creatorId },
        attributes: [
          "id",
          "title",
          "category",
          "goalAmount",
          "raisedAmount",
          "status",
          "endDate",
          "createdAt",
        ],
        order: [["createdAt", "DESC"]],
        limit: 5,
      }),

      // Recent Donations
      Donation.findAll({
        where: {
          campaignId: campaignIds,
          paymentStatus: "success",
        },
        attributes: ["id", "amount", "message", "createdAt"],
        include: [
          {
            model: User,
            as: "donor",
            attributes: ["id", "firstName", "lastName", "email"],
          },
          {
            model: Campaign,
            as: "campaign",
            attributes: ["id", "title"],
          },
        ],
        order: [["createdAt", "DESC"]],
        limit: 5,
      }),

      // Recent Payments
      Payment.findAll({
        attributes: ["id", "amount", "status", "createdAt"],
        include: [
          {
            model: Donation,
            as: "donation",
            where: { campaignId: campaignIds },
            attributes: ["id", "amount"],
            include: [
              {
                model: Campaign,
                as: "campaign",
                attributes: ["id", "title"],
              },
            ],
          },
        ],
        order: [["createdAt", "DESC"]],
        limit: 5,
      }),
    ]);

    return res.status(200).json({
      success: true,
      message: "Creator dashboard v2 fetched successfully.",
      data: {
        statistics: {
          totalCampaigns,
          activeCampaigns,
          completedCampaigns,
          cancelledCampaigns,
          totalRaised: Number(totalRaised) || 0,
          totalDonations,
          totalDonors,
          paymentStats: {
            successfulPayments,
            failedPayments,
            pendingPayments,
          },
        },
        analytics: {
          campaignAnalytics: {
            goalCompletionPercentage: Number(goalCompletionPercentage),
            topPerformingCampaign,
            lowestPerformingCampaign,
            campaignEndingSoon,
          },
          monthlyRevenue,
          monthlyDonations,
          campaignWiseRevenue,
          campaignWiseDonationCount,
        },
        recentData: {
          recentCampaigns,
          recentDonations,
          recentPayments,
        },
      },
    });
  } catch (error) {
    console.error("Creator Dashboard Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ========================
// SUPPORTER DASHBOARD V2
// ========================
 
export const getSupporterDashboard = async (req, res) => {
  try {
    const supporterId = req.user.id;

    const successfulDonationsWhere = {
      donorId: supporterId,
      paymentStatus: "success",
    };

    const [
      totalDonations,
      totalAmountDonated,
      successfulPayments,
      failedPayments,
      pendingPayments,
      monthlyDonationHistory,
      favoriteCategoryData,
      mostDonatedCampaign,
      averageDonationAmount,
      recentDonations,
      recentPayments,
    ] = await Promise.all([
      Donation.count({
        where: successfulDonationsWhere,
      }),

      Donation.sum("amount", {
        where: successfulDonationsWhere,
      }),

      Payment.count({
        where: {
          status: "captured",
        },
        include: [
          {
            model: Donation,
            as: "donation",
            where: {
              donorId: supporterId,
            },
            required: true,
            attributes: [],
          },
        ],
      }),

      Payment.count({
        where: {
          status: "failed",
        },
        include: [
          {
            model: Donation,
            as: "donation",
            where: {
              donorId: supporterId,
            },
            required: true,
            attributes: [],
          },
        ],
      }),

      Payment.count({
        where: {
          status: "pending",
        },
        include: [
          {
            model: Donation,
            as: "donation",
            where: {
              donorId: supporterId,
            },
            required: true,
            attributes: [],
          },
        ],
      }),

      Donation.findAll({
        attributes: [
          [
            fn("DATE_TRUNC", literal("'month'"), col("Donation.createdAt")),
            "month",
          ],
          [fn("COUNT", col("Donation.id")), "count"],
          [fn("SUM", col("Donation.amount")), "totalAmount"],
        ],
        where: {
          ...successfulDonationsWhere,
          createdAt: {
            [Op.gte]: new Date(
              new Date().getFullYear() - 1,
              new Date().getMonth(),
              1
            ),
          },
        },
        group: [
          fn("DATE_TRUNC", literal("'month'"), col("Donation.createdAt")),
        ],
        order: [
          [
            fn("DATE_TRUNC", literal("'month'"), col("Donation.createdAt")),
            "ASC",
          ],
        ],
        raw: true,
      }),

      Donation.findAll({
        attributes: [[fn("COUNT", col("Donation.id")), "count"]],
        include: [
          {
            model: Campaign,
            as: "campaign",
            attributes: ["category"],
            required: true,
          },
        ],
        where: successfulDonationsWhere,
        group: ["campaign.category"],
        order: [[fn("COUNT", col("Donation.id")), "DESC"]],
        limit: 1,
        raw: true,
      }),

      Donation.findAll({
        attributes: [
          "campaignId",
          [fn("COUNT", col("Donation.id")), "donationCount"],
          [fn("SUM", col("Donation.amount")), "totalAmount"],
        ],
        where: successfulDonationsWhere,
        include: [
          {
            model: Campaign,
            as: "campaign",
            attributes: ["id", "title", "category"],
            required: true,
          },
        ],
        group: ["Donation.campaignId", "campaign.id"],
        order: [[fn("SUM", col("Donation.amount")), "DESC"]],
        limit: 1,
        raw: true,
      }),

      Donation.findOne({
        attributes: [[fn("AVG", col("Donation.amount")), "averageAmount"]],
        where: successfulDonationsWhere,
        raw: true,
      }),

      Donation.findAll({
        where: successfulDonationsWhere,
        attributes: ["id", "amount", "message", "createdAt"],
        include: [
          {
            model: Campaign,
            as: "campaign",
            attributes: [
              "id",
              "title",
              "category",
              "coverImage",
              "goalAmount",
              "raisedAmount",
            ],
          },
        ],
        order: [["createdAt", "DESC"]],
        limit: 5,
      }),

      Payment.findAll({
        attributes: ["id", "amount", "status", "createdAt"],
        include: [
          {
            model: Donation,
            as: "donation",
            where: {
              donorId: supporterId,
            },
            required: true,
            attributes: ["id", "amount"],
            include: [
              {
                model: Campaign,
                as: "campaign",
                attributes: ["id", "title"],
              },
            ],
          },
        ],
        order: [["createdAt", "DESC"]],
        limit: 5,
      }),
    ]);

    return res.status(200).json({
      success: true,
      message: "Supporter dashboard v2 fetched successfully.",
      data: {
        statistics: {
          totalDonations,
          totalAmountDonated: Number(totalAmountDonated) || 0,
          paymentStats: {
            successfulPayments,
            failedPayments,
            pendingPayments,
          },
        },
        analytics: {
          monthlyDonationHistory,
          favoriteCategory:
            favoriteCategoryData[0]?.["campaign.category"] || "N/A",
          mostDonatedCampaign: mostDonatedCampaign[0] || null,
          averageDonationAmount:
            Number(averageDonationAmount?.averageAmount) || 0,
        },
        recentData: {
          recentDonations,
          recentPayments,
        },
      },
    });
  } catch (error) {
    console.error("Supporter Dashboard Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// export const getAdminDashboard = async (req, res) => 
//   try {
//     const [
//       totalUsers,
//       totalCampaigns,
//       activeCampaigns,
//       completedCampaigns,
//       cancelledCampaigns,
//       totalDonations,
//       totalAmountRaised,
//     ] = await Promise.all([
//       User.count(),

//       Campaign.count(),

//       Campaign.count({
//         where: {
//           status: "active",
//         },
//       }),

//       Campaign.count({
//         where: {
//           status: "completed",
//         },
//       }),

//       Campaign.count({
//         where: {
//           status: "cancelled",
//         },
//       }),

//       Donation.count(),

//       Donation.sum("amount"),
//     ]);

//     return res.status(200).json({
//       success: true,
//       data: {
//         totalUsers,
//         totalCampaigns,
//         activeCampaigns,
//         completedCampaigns,
//         cancelledCampaigns,
//         totalDonations,
//         totalAmountRaised: Number(totalAmountRaised) || 0,
//       },
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };