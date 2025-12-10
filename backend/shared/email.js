// backend/shared/email.js
const nodemailer = require("nodemailer");
const { google } = require("googleapis");

const OAuth2 = google.auth.OAuth2;

// Create OAuth client
const oauth2Client = new OAuth2(
  process.env.GMAIL_CLIENT_ID,
  process.env.GMAIL_CLIENT_SECRET,
  "https://developers.google.com/oauthplayground" // redirect URI
);

// Attach refresh token
oauth2Client.setCredentials({
  refresh_token: process.env.GMAIL_REFRESH_TOKEN,
});

/**
 * Send OTP email using Gmail API (OAuth2)
 * @param {{ to: string, otp: string }} param0
 */
async function sendOTPEmail({ to, otp }) {
  try {
    // Get fresh access token
    const accessToken = await oauth2Client.getAccessToken();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.GMAIL_USER,
        clientId: process.env.GMAIL_CLIENT_ID,
        clientSecret: process.env.GMAIL_CLIENT_SECRET,
        refreshToken: process.env.GMAIL_REFRESH_TOKEN,
        accessToken: accessToken?.token ?? accessToken,
      },
    });

    const mailOptions = {
      from: `Travel Explorer <${process.env.GMAIL_USER}>`,
      to,
      subject: "Your Travel Explorer OTP",
      text: `Your OTP for Travel Explorer is: ${otp}. It expires in 5 minutes.`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("OTP email sent:", info.messageId);
    return info;
  } catch (err) {
    console.error("Error sending OTP email:", err);
    throw err; // let the caller (login route) handle it
  }
}

module.exports = { sendOTPEmail };

