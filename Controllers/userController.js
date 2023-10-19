const User = require("../models/user");
const Trader = require("../models/trader");

exports.getUsers = (req, res) => {
  User.find({})
    .then(function (users) {
      res.json(users);
    })
    .catch(function (err) {
      console.error(err);
      return res
        .status(500)
        .json({ error: "An error occurred while fetching users." });
    });
};

exports.addUser = (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password)
    return res.send("Not all the data was provided.");

  // Create a new user
  const newUser = new User({
    username: username,
    email: email,
    password: password,
    // Add other user-related data
  });

  newUser
    .save()
    .then(function (user) {
      console.log(
        "User created successfully: " + user.username + " | " + user.email
      );
      res.send(
        "User created successfully: " + user.username + " | " + user.email
      );
    })
    .catch(function (err) {
      console.log(err);
      res.send("Error creating user. \n\n" + err);
    });
};

exports.getDashboard = (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/auth/login");
  }
  res.render("dashboard", { user: req.user });
};

exports.subscribe = async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const user = req.user;
  const userId = req.user._id; // Get the user's ID
  const traderId = req.params.traderId; // Get the trader's ID

  try {
    // Check if the trader exists
    const trader = await Trader.findById(traderId);
    if (!trader) {
      return res.status(404).json({ error: "Trader not found" });
    }

    // Check if the user is already subscribed to this trader
    const isSubscribed = user.subscribedTraders.some((sub) =>
      sub.equals(traderId)
    );
    if (isSubscribed) {
      return res
        .status(400)
        .json({ error: "You are already subscribed to this trader" });
    }

    // Add the trader to the user's list of subscribed traders
    user.subscribedTraders.push(traderId);
    await user.save();

    // Update the trader's list of subscribers
    trader.subscribers.push(userId);
    await trader.save();

    res.status(200).json({ message: "Subscribed to the trader successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while processing your request" });
  }
};
