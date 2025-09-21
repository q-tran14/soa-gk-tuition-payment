require('dotenv').config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const router = require("./routes/routes");

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "../frontend")));

// Routes
app.use("/api", router);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}/login.html`);
});