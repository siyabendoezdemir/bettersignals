require("dotenv").config();

const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const path = require("path");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const db = require("./database/db");

const passport = require("passport");
const passportConfig = require("./configs/passport-config");
const flash = require("express-flash");
const session = require("express-session");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo")(session);

const userRoutes = require("./routes/userRoutes");
const traderRoutes = require("./routes/traderRoutes");
const authRoutes = require("./routes/authRoutes");
const bodyParser = require("body-parser");

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

app.get("/ping", (req, res) => {
  res.send("Pong!");
});

// Enable JSON request body parsing
app.use(express.json());

app.use(flash());

// Initialize Routes
app.use("/user", userRoutes);
app.use("/traders", traderRoutes);
app.use("/auth", authRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
