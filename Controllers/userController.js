const User = require("../models/user");
const Trader = require("../models/trader");

const TraderController = require("./traderController");
const paymentController = require("./paymentController");

const request = require("request");

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

exports.getDashboard = async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/auth/login");
  }
  const subscriptionSuccess = req.query.subscription === "success";
  const traderId = req.query.traderId;

  if (subscriptionSuccess && traderId) {
    // Subscription success: Perform the POST request to the subscribe endpoint
    const subscribeReq = {
      method: "POST",
      url: `http://localhost:3000/user/subscribe/${traderId}`,
    };

    request(subscribeReq, (error, response, body) => {
      if (error) {
        console.log(
          "There was an error making a POST request to the subscribe endpoint.: " + error
        );
        return res.status(500).json({
          error: "Error making POST request to the subscribe endpoint.",
        });
      }

      // Redirect the user to their dashboard or do other handling as needed
      res.redirect("/user/dashboard");
    });
  } else {
    try {
      // Fetch the list of traders
      let traders = await TraderController.getTraders();

      if (!traders) {
        console.error("Traders is empty:", traders);
        traders = [];
      }

      res.render("dashboard", {
        user: req.user,
        traders: traders,
        Trader: Trader,
      });
    } catch (error) {
      res
        .status(500)
        .json({ error: "An error occurred while fetching traders" });
    }
  }
};

exports.subscribe = async (req, res) => {
  console.log(req.user);

  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  console.log("User is authenticated");

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

    res.status(200).json({
      message:
        "Subscribed to the trader successfully. You can now go back to your Dashboard",
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while processing your request" });
  }
};

// Add this route in your TraderController:
exports.unsubscribe = async (req, res) => {
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

    // Check if the user is subscribed to this trader
    const isSubscribed = user.subscribedTraders.some((sub) =>
      sub.equals(traderId)
    );
    if (!isSubscribed) {
      return res
        .status(400)
        .json({ error: "You are not subscribed to this trader" });
    }

    // Remove the trader from the user's list of subscribed traders
    user.subscribedTraders = user.subscribedTraders.filter(
      (sub) => !sub.equals(traderId)
    );
    await user.save();

    // Remove the user from the trader's list of subscribers
    trader.subscribers = trader.subscribers.filter(
      (subscriber) => !subscriber.equals(userId)
    );
    await trader.save();

    res
      .status(200)
      .json({ message: "Unsubscribed from the trader successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while processing your request" });
  }
};
