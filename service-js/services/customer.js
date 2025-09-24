const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const Customer = require("../models/Customer");

const customerController = {
  
    Register: asyncHandler(async (req, res) => {
        const { fullName, phone, email, password } = req.body;

        if (!fullName || !phone || !email || !password) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await Customer.create({ fullName, phone, email, password: hashedPassword });

        res.json({ message: "Register success!" });
    }),

    
    Login: asyncHandler(async (req, res) => {
        const { email, password } = req.body;
        const customer = await Customer.findByEmail(email);
        if (!customer) return res.status(404).json({ message: "Email not exist" });

        const isMatch = await bcrypt.compare(password, customer.password);
        if (!isMatch) return res.status(401).json({ message: "Invalid email or password" });

        const token = jwt.sign(
            { id: customer.id, email: customer.email },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({ message: "Login success", token, customer });
    }),

    
    Withdraw: asyncHandler(async (req, res) => {
        const { customerId, amount } = req.body;
        const customer = await Customer.findById(customerId);
        if (!customer) return res.status(404).json({ message: "Customer not found" });

        if (customer.balance < amount) {
        return res.status(400).json({ message: "Insufficient balance" });
        }

        await Customer.withdraw(customerId, amount);
        res.json({ message: "Withdraw success" });
    }),

    Deposit: asyncHandler(async (req, res) => {
        const { customerId, amount } = req.body;
        const customer = await Customer.findById(customerId);

        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        if (amount <= 0) {
            return res.status(400).json({ message: "Amount must be greater than 0" });
        }

        await Customer.deposit(customerId, amount);
        res.json({ message: "Deposit success" });   
    }),

  
    ResetPassword: asyncHandler(async (req, res) => {
        const { email, newPassword } = req.body;
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await Customer.updatePassword(email, hashedPassword);
        res.json({ message: "Password updated" });
    }),
};

module.exports = customerController;
