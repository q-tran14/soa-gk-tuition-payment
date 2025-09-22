const express = require("express");
const otpController = require("../services/otp");
const notificationController = require("../services/notification");
const customerService = require("../services/customer");

const router = express.Router();

// Route here 
router.post("/send-otp", otpController.SendOTP);
router.post("/verify-otp", otpController.VerifyOTP);
router.post("/send-email", notificationController.SendEmail);

// Customer route
router.post("/customers/register", customerService.Register);
router.post("/customers/login", customerService.Login);
router.post("/customers/withdraw", customerService.Withdraw);
router.post("/customers/deposit", customerService.Deposit);
router.post("/customers/reset-password", customerService.ResetPassword);

module.exports = router;