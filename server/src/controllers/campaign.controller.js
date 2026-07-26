import Campaign from "../models/campaign.model.js";
import User from "../models/user.model.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";

export const createCampaign = async (req, res) => {
  try {
    const {
      title,
      description,
      goalAmount,
      category,
      coverImage,
      startDate,
      endDate,
    } = req.body;

    // Logged-in User ID
    const creatorId = req.user.id;

    let imageUrl = null;

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      imageUrl = result.secure_url;
    }

    // Create Campaign
    const campaign = await Campaign.create({
      title,
      description,
      goalAmount,
      category,
      coverImage: imageUrl,
      startDate,
      endDate,
      creatorId,
    });

    return res.status(201).json({
      success: true,
      message: "Campaign created successfully.",
      data: campaign,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const getAllCampaigns = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const offset = (page - 1) * limit;

    const search = req.query.search || "";
    const category = req.query.category || "";
    const status = req.query.status || "";
    const sort = req.query.sort || "latest";

    const where = {};

    if (search) {
      where[Op.or] = [
        {
          title: {
            [Op.iLike]: `%${search}%`,
          },
        },
        {
          description: {
            [Op.iLike]: `%${search}%`,
          },
        },
      ];
    }

    if (category) {
      where.category = category;
    }

    if (status) {
      where.status = status;
    }

    let order = [["createdAt", "DESC"]];

    switch (sort) {
      case "latest":
        order = [["createdAt", "DESC"]];
        break;

      case "oldest":
        order = [["createdAt", "ASC"]];
        break;

      case "goalAsc":
        order = [["goalAmount", "ASC"]];
        break;

      case "goalDesc":
        order = [["goalAmount", "DESC"]];
        break;

      case "raisedAsc":
        order = [["raisedAmount", "ASC"]];
        break;

      case "raisedDesc":
        order = [["raisedAmount", "DESC"]];
        break;

      default:
        order = [["createdAt", "DESC"]];
    }

    const { count, rows } = await Campaign.findAndCountAll({
      where,
      limit,
      offset,
      include: [
        {
          model: User,
          as: "creator",
          attributes: ["id", "firstName", "lastName", "email"],
        },
      ],
      order,
    });

    const totalPages = Math.ceil(count / limit);

    return res.status(200).json({
      success: true,
      currentPage: page,
      pageSize: limit,
      totalCampaigns: count,
      totalPages,
      data: rows,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getCampaignById = async (req, res) => {
  try {
    const { id } = req.params;

    const campaign = await Campaign.findByPk(id, {
      include: [
        {
          model: User,
          as: "creator",
          attributes: ["id", "firstName", "lastName", "email", "profileImage"],
        },
      ],
    });

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: "Campaign not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: campaign,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateCampaign = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      description,
      goalAmount,
      category,
      coverImage,
      startDate,
      endDate,
      status,
    } = req.body;

    // Find Campaign
    const campaign = await Campaign.findByPk(id);

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: "Campaign not found.",
      });
    }

    // Authorization Check
    if (campaign.creatorId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this campaign.",
      });
    }

    // Update Campaign
    await campaign.update({
      title,
      description,
      goalAmount,
      category,
      coverImage,
      startDate,
      endDate,
      status,
    });

    return res.status(200).json({
      success: true,
      message: "Campaign updated successfully.",
      data: campaign,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteCampaign = async (req, res) => {
  try {
    const { id } = req.params;

    // Find Campaign
    const campaign = await Campaign.findByPk(id);

    // Campaign Not Found
    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: "Campaign not found.",
      });
    }

    // Authorization Check
    if (campaign.creatorId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this campaign.",
      });
    }

    // Delete Campaign
    await campaign.destroy();

    return res.status(200).json({
      success: true,
      message: "Campaign deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
