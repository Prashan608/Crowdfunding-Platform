const donationReceiptTemplate = ({
  donorName,
  campaignTitle,
  amount,
  transactionId,
}) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto; padding:20px; border:1px solid #ddd; border-radius:10px;">

      <h2 style="color:#16a34a;">
        🎉 Thank You for Your Donation!
      </h2>

      <p>Hi <b>${donorName}</b>,</p>

      <p>
        Thank you for supporting our crowdfunding platform.
        Your generosity will make a real difference.
      </p>

      <hr/>

      <h3>Donation Details</h3>

      <p><b>Campaign:</b> ${campaignTitle}</p>

      <p><b>Donation Amount:</b> ₹${amount}</p>

      <p><b>Transaction ID:</b> ${transactionId}</p>

      <hr/>

      <p>
        We truly appreciate your support.
      </p>

      <p>
        Regards,<br/>
        <b>Crowdfunding Team ❤️</b>
      </p>

    </div>
  `;
};

export default donationReceiptTemplate;