const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

// In-memory store for OTPCode: email -> { code, expires }
const otpCodes = new Map();

const otpController = {
  // Issue OTP
  GetOTP: asyncHandler(async (req, res) => {
    const { email } = req.body;

    // Check email is already exists
//     const client = await Client.findOne({ email });
//     console.log("Client is already is in backend", client);
//     if (!client) {
//       throw new Error("Account does not exist");
//     }

    // Generate 6-digit recovery code
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Store code with expiration (15 minutes)
    const expires = Date.now() + 5 * 60 * 1000;

    otpCodes.set(email, { code, expires });

//     // Send OTP to email  - > Call Notification Service
//     const mailOptions = {
//       from: process.env.SMTP_USER,
//       to: email,
//       subject: "MOG: Your Password Recovery Code",
//       text: `Your password recovery code for MOG game is: ${code}. It will expire in 15 minutes.`,
//     };

//     try {
//       await transporter.sendMail(mailOptions);
//       res.json({
//         message: "Recovery code sent to your email",
//       });
//     } catch (error) {
//       console.error("Error sending recovery email:", error);
//       res.status(500).json({ message: "Failed to send recovery code email." });
//     }
  }),

  // Verify OTP
  VerifyOTP: asyncHandler(async (req, res) => {
    const { email, code } = req.body;

    if (!email || !code) {
      res.status(400);
      throw new Error("Email and recovery code are required");
    }

    const record = otpCodes.get(email);
    if (!record) {
      res.status(400);
      throw new Error("No OTP found for this email");
    }

    if (record.expires < Date.now()) {
      otpCodes.delete(email);
      res.status(400);
      throw new Error("OTP has expired");
    }

    // const isMatch = await bcrypt.compare();

    if (record.code !== code) {
      res.status(400);
      throw new Error("Invalid OTP");
    }

    // If code is valid, delete it to prevent reuse
    otpCodes.delete(email);

    res.json({ message: "OTP verified" });
  }),
}