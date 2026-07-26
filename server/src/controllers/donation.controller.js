export const createDonation = async (req, res) => {
  // Start Transaction
  const transaction = await sequelize.transaction();

  try {
    const { campaignId } = req.params;
    const { amount, message } = req.body;

    const donorId = req.user.id;

    // Check Campaign Exists
    const campaign = await Campaign.findByPk(campaignId);

    if (!campaign) {
      await transaction.rollback();

      return res.status(404).json({
        success: false,
        message: "Campaign not found.",
      });
    }

    // Create Donation
    const donation = await Donation.create(
      {
        amount,
        message,
        donorId,
        campaignId,
        paymentStatus: "success",
      },
      {
        transaction,
      }
    );

    // Update Campaign Raised Amount
    await campaign.update(
      {
        raisedAmount:
          Number(campaign.raisedAmount) + Number(amount),
      },
      {
        transaction,
      }
    );

    // Commit Transaction
    await transaction.commit();

    return res.status(201).json({
      success: true,
      message: "Donation Successful",
      data: donation,
    });

  } catch (error) {

    // Rollback Transaction
    await transaction.rollback();

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};