const nodemailer = require("nodemailer");

const sendEmail = async (email, otp, username) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "Your OTP Code",
    html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP for CourseXone</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            background-color: #ffffff;
            width: 100%;
            max-width: 600px;
            margin: 20px auto;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            color: #4CAF50;
        }
        .otp {
            font-size: 28px;
            font-weight: bold;
            color: #333;
            text-align: center;
            background-color: #f2f2f2;
            padding: 15px;
            border-radius: 4px;
            margin: 20px 0;
        }
        .message {
            font-size: 16px;
            color: #333;
            line-height: 1.6;
        }
        .footer {
            text-align: center;
            font-size: 14px;
            color: #999;
            margin-top: 20px;
        }
        .footer a {
            color: #4CAF50;
            text-decoration: none;
        }
        .footer p {
            margin: 5px 0;
        }
        .contact {
            font-weight: bold;
        }
    </style>
</head>
<body>

    <div class="container">
        <h2 class="header">CourseZone - One-Time Password (OTP)</h2>
        
        <p class="message">Dear ${username},</p>
        
        <p class="message">We received a request to verify your identity on CourseZone. To complete the process, please use the following one-time password (OTP):</p>
        
        <div class="otp">
            ${otp}
        </div>
        
        <p class="message">This OTP is valid for the next 10 minutes. If you did not request this, please disregard this email or contact our support team immediately.</p>
        
        <p class="message">Best regards,</p>
        <p class="message">The CourseZone Team</p>
        
        <div class="footer">
            <p>CourseZone | Your Learning Partner</p>
            <p class="contact">Need help? Reach out to us at <a href="mailto:coursezonebusiness@gmail.com">coursezonebusiness@gmail.com</a></p>
        </div>
    </div>

</body>
</html>
`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("OTP sent to email:", email);
  } catch (error) {
    console.error("Error sending OTP:", error);
  }
};

module.exports = sendEmail;