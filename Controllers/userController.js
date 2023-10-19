const User = require("../models/user");

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

exports.subscribe = (req, res) => {};
