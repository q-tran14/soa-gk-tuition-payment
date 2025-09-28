const express = require("express");
const otpController = require("../services/otp");
const notificationController = require("../services/notification");
const customerService = require("../services/customer");
const studentService = require("../services/student");

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

// Student route
router.post("/students", studentService.Create);
router.get("/students/:code", studentService.GetByCode);
router.post("/students/lookup", studentService.Lookup);
router.get('/students/id/:id', studentService.GetById);
router.post('/students/lookup-by-id', studentService.LookupById);

module.exports = router;

// http://localhost:8000/api/students/