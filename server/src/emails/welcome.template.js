const welcomeTemplate = (name) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto; padding:20px; border:1px solid #ddd; border-radius:10px;">

      <h2 style="color:#2563eb;">
        🎉 Welcome to Crowdfunding Platform
      </h2>

      <p>Hi <b>${name}</b>,</p>

      <p>
        Welcome to our Crowdfunding Platform!
      </p>

      <p>
        We're excited to have you join our community.
      </p>

      <p>
        You can now:
      </p>

      <ul>
        <li>🚀 Create fundraising campaigns</li>
        <li>❤️ Support campaigns through donations</li>
        <li>📢 Share campaigns with friends and family</li>
        <li>🔔 Receive real-time notifications</li>
      </ul>

      <p>
        Thank you for choosing us.
      </p>

      <p>
        Regards,<br/>
        <b>Crowdfunding Team ❤️</b>
      </p>

    </div>
  `;
};

export default welcomeTemplate;