require("dotenv").config();

// Basic App imports
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const path = require("path");

// View Engine imports
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/public/views"));
app.use(express.static("public"));

// Authentication imports
const passport = require("passport");
const passportConfig = require("./configs/passport-config");
const flash = require("express-flash");
const session = require("express-session");

// Database imports
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo")(session);
const db = require("./database/db");

// Routing imports
const cors = require('cors');
const userRoutes = require("./routes/userRoutes");
const traderRoutes = require("./routes/traderRoutes");
const authRoutes = require("./routes/authRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

// Payment imports
const stripe = require('stripe')(process.env.STRIPE_SECRET);

// Misc
const bodyParser = require("body-parser");
app.use(cors({ origin: 'http://127.0.0.1:3000' }));
app.use(bodyParser.urlencoded({ extended: true }));

// Initialize Passport
app.use(
  session({
    secret: process.env.PASSPORT_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Ping endpoint to see if server is reachable
app.get("/ping", (req, res) => {
  res.send("Pong!");
});

// Enable JSON request body parsing & flash
app.use(express.json());
app.use(flash());

// Initialize Routes
app.use("/user", userRoutes);
app.use("/traders", traderRoutes);
app.use("/auth", authRoutes);
app.use("/payment", paymentRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
