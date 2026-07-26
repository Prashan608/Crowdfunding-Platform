const donationReceivedTemplate = ({
  creatorName,
  donorName,
  campaignTitle,
  amount,
}) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto; padding:20px; border:1px solid #ddd; border-radius:10px;">

      <h2 style="color:#2563eb;">
        🎉 You Received a New Donation
      </h2>

      <p>Hi <b>${creatorName}</b>,</p>

      <p>
        Great news! Someone has contributed to your campaign.
      </p>

      <hr/>

      <h3>Donation Details</h3>

      <p><b>Donor:</b> ${donorName}</p>

      <p><b>Campaign:</b> ${campaignTitle}</p>

      <p><b>Amount:</b> ₹${amount}</p>

      <hr/>

      <p>
        Keep sharing your campaign and inspiring people.
      </p>

      <p>
        Regards,<br/>
        <b>Crowdfunding Team ❤️</b>
      </p>

    </div>
  `;
};

export default donationReceivedTemplate;