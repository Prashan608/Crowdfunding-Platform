import razorpay from "../config/razorpay.js";
import crypto from "crypto";
import sequelize from "../config/db.js";
import Campaign from "../models/campaign.model.js";
import Donation from "../models/donation.models.js";
import Payment from "../models/payment.model.js";
import donationReceiptTemplate from "../emails/donationReceipt.template.js";
import donationReceivedTemplate from "../emails/donationReceived.template.js";
import sendEmail from "../utils/sendEmail.js";
import sendNotification from "../utils/sendNotification.js";
import User from "../models/user.model.js";
import { getIO } from "../socket/index.js";


export const createOrder = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { campaignId, amount, message } = req.body;

    // Validation
    if (!campaignId) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: "Campaign ID is required.",
      });
    }

    if (!amount || Number(amount) <= 0) {
      await transaction.rollback();

      return res.status(400).json({
        success: false,
        message: "Please provide a valid amount.",
      });
    }

    // Check Campaign
    const campaign = await Campaign.findByPk(campaignId, {
      transaction,
    });

    if (!campaign) {
      await transaction.rollback();

      return res.status(404).json({
        success: false,
        message: "Campaign not found.",
      });
    }

    // Fetch Users
    const donor = await User.findByPk(req.user.id);
    const creator = await User.findByPk(campaign.creatorId);

    // Create Pending Donation
    const donation = await Donation.create(
      {
        donorId: req.user.id,
        campaignId,
        amount,
        message,
        paymentStatus: "pending",
      },
      { transaction }
    );

    // Razorpay Order
    const options = {
      amount: Number(amount) * 100,
      currency: "INR",
      receipt: `DONATION_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    // Create Pending Payment
    await Payment.create(
      {
        donationId: donation.id,
        orderId: order.id,
        amount,
        currency: order.currency,
        status: "created",
      },
      { transaction }
    );

    await transaction.commit();

    return res.status(201).json({
      success: true,
      message: "Order created successfully.",
      data: {
        orderId: order.id,
        donationId: donation.id,
        campaignId,
        amount: Number(amount),
        currency: order.currency,
        receipt: order.receipt,
        status: order.status,
      },
    });

  } catch (error) {
    await transaction.rollback();

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const verifyPayment = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    // Validation
    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      await transaction.rollback();

      return res.status(400).json({
        success: false,
        message: "All payment details are required.",
      });
    }

    // Verify Signature
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      await transaction.rollback();

      return res.status(400).json({
        success: false,
        message: "Payment verification failed.",
      });
    }

    // Find Payment
    const payment = await Payment.findOne({
      where: {
        orderId: razorpay_order_id,
      },
      transaction,
    });

    if (!payment) {
      await transaction.rollback();

      return res.status(404).json({
        success: false,
        message: "Payment record not found.",
      });
    }

    // Prevent Duplicate Verification
    if (payment.status === "captured") {
      await transaction.rollback();

      return res.status(400).json({
        success: false,
        message: "Payment already verified.",
      });
    }

    // Update Payment
    await payment.update(
      {
        paymentId: razorpay_payment_id,
        signature: razorpay_signature,
        status: "captured",
      },
      {
        transaction,
      }
    );

    // Find Donation
    const donation = await Donation.findByPk(payment.donationId, {
      transaction,
    });

    if (!donation) {
      await transaction.rollback();

      return res.status(404).json({
        success: false,
        message: "Donation not found.",
      });
    }

    // Update Donation
    await donation.update(
      {
        paymentStatus: "success",
        transactionId: razorpay_payment_id,
      },
      {
        transaction,
      }
    );

    // Find Campaign
    const campaign = await Campaign.findByPk(donation.campaignId, {
      transaction,
    });

    if (!campaign) {
      await transaction.rollback();

      return res.status(404).json({
        success: false,
        message: "Campaign not found.",
      });
    }

    const donor = await User.findByPk(req.user.id);
    const creator = await User.findByPk(campaign.creatorId);

    if (!donor || !creator) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Update Raised Amount
    await campaign.update(
      {
        raisedAmount:
          Number(campaign.raisedAmount) + Number(donation.amount),
      },
      {
        transaction,
      }
    );

    // Commit Transaction
    await transaction.commit();

    // Notify Campaign Owner
    await sendNotification({
      userId: campaign.creatorId,
      title: "New Donation Received",
      message: `${req.user.firstName} donated ₹${donation.amount} to your campaign.`,
      type: "donation",
      referenceId: donation.id,
    });

    const io = getIO();

    io.to(campaign.creatorId).emit("new-notification", {
      title: "New Donation Received",
      message: `${req.user.firstName} donated ₹${donation.amount} to your campaign.`,
      donationId: donation.id,
      campaignId: campaign.id,
      amount: donation.amount,
      createdAt: new Date(),
    });

    // Donor Email
    const donorMessage = donationReceiptTemplate({
      donorName: donor.firstName,
      campaignTitle: campaign.title,
      amount: donation.amount,
      transactionId: razorpay_payment_id,
    });

    await sendEmail({
      email: donor.email,
      subject: "Thank You for Your Donation ❤️",
      message: donorMessage,
    });

    // creator email
    const creatorMessage = donationReceivedTemplate({
      creatorName: creator.firstName,
      donorName: donor.firstName,
      campaignTitle: campaign.title,
      amount: donation.amount,
    });

    await sendEmail({
      email: creator.email,
      subject: "You Received a New Donation 🎉",
      message: creatorMessage,
    });
    return res.status(200).json({
      success: true,
      message: "Payment verified successfully.",
      data: {
        paymentId: payment.paymentId,
        donationId: donation.id,
        campaignId: campaign.id,
        amount: donation.amount,
      },
    });

  } catch (error) {
    await transaction.rollback();

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getPaymentHistory = async (req, res) => {
  try {
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await Payment.findAndCountAll({
      include: [
        {
          model: Donation,
          as: "donation",
          where: {
            donorId: req.user.id,
          },
          required: true,

          attributes: [
            "id",
            "amount",
            "message",
            "paymentStatus",
            "transactionId",
            "createdAt",
          ],

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
              ],
            },
          ],
        },
      ],

      order: [["createdAt", "DESC"]],

      limit,
      offset,
    });

    return res.status(200).json({
      success: true,
      message: "Payment history fetched successfully.",
      totalPayments: count,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
      data: rows,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getPaymentById = async (req, res) => {
  try {
    const { id } = req.params;

    const payment = await Payment.findByPk(id, {
      include: [
        {
          model: Donation,
          as: "donation",
          attributes: [
            "id",
            "amount",
            "message",
            "paymentStatus",
            "transactionId",
            "createdAt",
          ],
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
              ],
            },
          ],
        },
      ],
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Payment fetched successfully.",
      data: payment,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getCampaignDonations = async (req, res) => {
  try {
    const { campaignId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const campaign = await Campaign.findByPk(campaignId);

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: "Campaign not found.",
      });
    }

    const { count, rows } = await Donation.findAndCountAll({
      where: {
        campaignId,
        paymentStatus: "success",
      },
      include: [
        {
          model: User,
          as: "donor",
          attributes: ["id", "firstName", "lastName", "email", "profileImage"],
        },
      ],
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });

    return res.status(200).json({
      success: true,
      message: "Campaign donations fetched successfully.",
      totalDonations: count,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
      data: rows,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const handleFailedPayment = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      error,
    } = req.body;

    // Validation
    if (!razorpay_order_id) {
      await transaction.rollback();

      return res.status(400).json({
        success: false,
        message: "Order ID is required.",
      });
    }

    // Find Payment
    const payment = await Payment.findOne({
      where: {
        orderId: razorpay_order_id,
      },
      transaction,
    });

    if (!payment) {
      await transaction.rollback();

      return res.status(404).json({
        success: false,
        message: "Payment not found.",
      });
    }

    // Update Payment
    await payment.update(
      {
        paymentId: razorpay_payment_id || null,
        status: "failed",
      },
      { transaction }
    );

    // Find Donation
    const donation = await Donation.findByPk(
      payment.donationId,
      { transaction }
    );

    if (donation) {
      await donation.update(
        {
          paymentStatus: "failed",
        },
        { transaction }
      );
    }

    await transaction.commit();

    return res.status(200).json({
      success: true,
      message: "Payment marked as failed.",
      data: {
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        reason: error || "Payment failed",
      },
    });

  } catch (error) {
    if (!transaction.finished) {
      await transaction.rollback();
    }

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const razorpayWebhook = async (req, res) => {
  try {
    // Razorpay Signature
    const signature = req.headers["x-razorpay-signature"];

    // Generate Signature
    const expectedSignature = crypto
      .createHmac(
        "sha256",
        process.env.RAZORPAY_WEBHOOK_SECRET
      )
      .update(req.body)
      .digest("hex");

    // Verify Signature
    if (signature !== expectedSignature) {
      return res.status(400).json({
        success: false,
        message: "Invalid webhook signature.",
      });
    }

    // Parse Event
    const event = JSON.parse(req.body.toString());

    console.log("Webhook Event:", event.event);

    return res.status(200).json({
      success: true,
      message: "Webhook received successfully.",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getPaymentStats = async (req, res) => {
  try {
    // Total Payments
    const totalPayments = await Payment.count();

    // Successful Payments
    const successfulPayments = await Payment.count({
      where: {
        status: "captured",
      },
    });

    // Failed Payments
    const failedPayments = await Payment.count({
      where: {
        status: "failed",
      },
    });

    // Pending Payments
    const pendingPayments = await Payment.count({
      where: {
        status: {
          [Op.in]: ["pending", "created", "authorized"],
        },
      },
    });

    // Refunded Payments
    const refundedPayments = await Payment.count({
      where: {
        status: "refunded",
      },
    });

    // Total Revenue
    const totalRevenue = await Payment.sum("amount", {
      where: {
        status: "captured",
      },
    });

    // Average Donation
    const averageDonation = await Payment.avg("amount", {
      where: {
        status: "captured",
      },
    });

    return res.status(200).json({
      success: true,
      message: "Payment statistics fetched successfully.",
      data: {
        totalPayments,
        successfulPayments,
        failedPayments,
        pendingPayments,
        refundedPayments,
        totalRevenue: Number(totalRevenue || 0),
        averageDonation: Number(averageDonation || 0),
      },
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};