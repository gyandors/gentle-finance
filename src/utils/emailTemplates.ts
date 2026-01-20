export const otpTemplate = (otp: string, name: string) => `
<!DOCTYPE html>
<html>
  <head>
    <style>
      .container {
        max-width: 700px;
        margin: 0 auto;
        padding: 20px;
        font-family: Arial, sans-serif;
      }

      .greet {
        font-size: 20px;
        font-weight: bold;
        margin: 0;
      }

      .header {
        background: #155dfc;
        color: white;
        padding: 20px;
        text-align: center;
        border-radius: 8px 8px 0 0;
      }

      .content {
        background: #ffffff;
        padding: 20px;
        border: 1px solid #e5e7eb;
        border-radius: 0 0 8px 8px;
      }

      .otp {
        font-size: 32px;
        font-weight: bold;
        text-align: center;
        color: #155dfc;
        letter-spacing: 4px;
        margin: 20px 0;
      }

      .note {
        margin: 0px;
        font-size: 16px;
      }

      .note + ul {
        margin: 10px 0;
        padding-left: 32px;
      }

      .footer {
        text-align: center;
        color: #6b7280;
        font-size: 12px;
        margin-top: 20px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Gentle Finance</h1>
      </div>
      <div class="content">
        <p class="greet">Hello ${name},</p>
        <p>Your OTP code for login is:</p>
        <div class="otp">${otp}</div>
        <h3 class="note">Please Note:</h3>
        <ul>
          <li>This code will expire in 5 minutes.</li>
          <li>Do not share this code with anyone.</li>
        </ul>
        <p>If you didn't request this code, please ignore this email.</p>
      </div>
      <div class="footer">
        <p>This is an automated email, please do not reply.</p>
      </div>
    </div>
  </body>
</html>
`;

export const welcomeTemplate = (name: string) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      font-family: Arial, sans-serif;
    }
    .header {
      background: #4F46E5;
      color: white;
      padding: 20px;
      text-align: center;
      border-radius: 8px 8px 0 0;
    }
    .content {
      background: #ffffff;
      padding: 20px;
      border: 1px solid #e5e7eb;
      border-radius: 0 0 8px 8px;
    }
    .button {
      background: #4F46E5;
      color: white;
      padding: 12px 24px;
      text-decoration: none;
      border-radius: 4px;
      display: inline-block;
      margin: 20px 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Welcome!</h1>
    </div>
    <div class="content">
      <h2>Hello ${name},</h2>
      <p>Thank you for registering with us.</p>
      <p>We're excited to have you on board!</p>
      <a href="${process.env.FRONTEND_URL}" class="button">Visit Website</a>
    </div>
  </div>
</body>
</html>
`;
