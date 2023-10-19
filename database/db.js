const mongoose = require("mongoose");

//  MongoDB connection string
const mongoURI = "mongodb://localhost:27017/BetterSignals";

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.once("open", () => {
  console.log("MongoDB connected successfully");
});

// Handle database connection errors
db.on("error", console.error.bind(console, "MongoDB connection error:"));
