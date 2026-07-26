import User from "./user.model.js";
import Campaign from "./campaign.model.js";
import Donation from "./donation.models.js";
import Payment from "./payment.model.js";
import Notification from "./notification.model.js";



User.hasMany(Campaign, {
  foreignKey: "creatorId",
  as: "campaigns",
});

Campaign.belongsTo(User, {
  foreignKey: "creatorId",
  as: "creator",
});

// User ↔ Donation
User.hasMany(Donation, {
  foreignKey: "donorId",
  as: "donations",
});

Donation.belongsTo(User, {
  foreignKey: "donorId",
  as: "donor",
});

// Campaign ↔ Donation
Campaign.hasMany(Donation, {
  foreignKey: "campaignId",
  as: "donations",
});

Donation.belongsTo(Campaign, {
  foreignKey: "campaignId",
  as: "campaign",
});


Donation.hasOne(Payment, {
  foreignKey: "donationId",
  as: "payment",
});

Payment.belongsTo(Donation, {
  foreignKey: "donationId",
  as: "donation",
});

// User ↔ Notification

User.hasMany(Notification, {
  foreignKey: "userId",
  as: "notifications",
});

Notification.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

export { User, Campaign,Donation,Payment };