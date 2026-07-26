const resetPasswordTemplate = (name, resetUrl) => {
  return `
    <h2>Password Reset Request</h2>

    <p>Hello ${name},</p>

    <p>We received a request to reset your password.</p>

    <a
      href="${resetUrl}"
      style="
        display:inline-block;
        padding:12px 20px;
        background:#2563eb;
        color:#fff;
        text-decoration:none;
        border-radius:5px;
      "
    >
      Reset Password
    </a>

    <p>This link will expire in <b>10 minutes</b>.</p>

    <p>If you did not request this request, ignore this email.</p>
  `;
};

export default resetPasswordTemplate;