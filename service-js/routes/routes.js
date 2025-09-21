const express = require("express");
const otpController = require("../services/otp");
const notificationController = require("../services/notification");

const router = express.Router();

// Route here 
router.post("/send-otp", otpController.SendOTP);
router.post("/verify-otp", otpController.VerifyOTP);
router.post("/send-email", notificationController.SendEmail);

module.exports = router;