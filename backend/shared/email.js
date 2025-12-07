
const nodemailer = require("nodemailer");

// Create transporter using Gmail
const transporter = nodemailer.createTransport({
  service: "gmail", 
  auth: {
    user: process.env.GMAIL_USER,          
    pass: process.env.GMAIL_APP_PASSWORD, 
  },
});

// Verify transporter connection 
transporter.verify((err, success) => {
  if (err) {
    console.error("Email transporter connection error:", err);
  } else {
    console.log("Email transporter ready");
  }
});

// Function to send OTP email
async function sendOTPEmail({ to, otp }) {
  const mailOptions = {
    from: process.env.GMAIL_USER, // sender
    to,                          // recipient
    subject: "Your TravelExplorer OTP",
    text: `Your OTP for TravelExplorer is: ${otp}. It expires in 5 minutes.`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`OTP email sent to ${to}: ${info.response}`);
    return info;
  } catch (err) {
    console.error("Error sending OTP email:", err);
    throw new Error("Failed to send OTP email");
  }
}

module.exports = { sendOTPEmail };
