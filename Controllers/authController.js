const passport = require("passport");
const bcrypt = require("bcrypt");

const User = require("../models/user");

exports.getRegister = (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect("/user/dashboard");
  }
  res.render("register", { error: null });
};

exports.postRegister = (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.render("register", { error: "All fields are required." });
  }

  User.findOne({ $or: [{ username }, { email }] })
    .then(function (existingUser) {
      if (existingUser) {
        return res.render("register", {
          error: "Username or email already in use.",
        });
      }

      // Hash the password before saving it to the database
      bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err && err != undefined) {
          return res.render("register", {
            error: "An error occured while hashing the password.",
          });
        }

        // Create a new user with the hashed password
        const newUser = new User({
          username: username,
          email: email,
          password: hashedPassword,
          // Add other user-related data
        });

        newUser
          .save()
          .then(function () {
            // Redirect to the login page after successful registration
            res.redirect("/auth/login");
          })
          .catch(function (err) {
            return res.render("register", {
              error: "An error occured while trying to save the user.",
            });
          });
      });
    })
    .catch(function (err) {
      return res.render("register", {
        error:
          "An error occurred while checking if the user is already registered.",
      });
    });
};

exports.getLogin = (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect("/user/dashboard");
  }
  res.render("login");
};

exports.postLogin = passport.authenticate("local", {
  successRedirect: "/user/dashboard",
  failureRedirect: "/auth/login",
  failureFlash: true,
});

exports.getLogout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
    }
    res.redirect("/auth/login");
  });
};
