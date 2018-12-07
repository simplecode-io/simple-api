// simple-api/api/routes/users.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const database = require("../../database");
// Send email utility
const sendEmail = require("../../utilities/sendEmail");
// Validation
const checkRegistrationFields = require("../../validation/register");

// Register route
router.post("/register", (req, res) => {
  // Ensures that all entries by the user are valid
  const { errors, isValid } = checkRegistrationFields(req.body);

  // If any of the entries made by the user are invalid, a status 400 is returned with the error
  if (!isValid) {
    return res.status(400).json(errors);
  }

  let token;
  crypto.randomBytes(48, (err, buf) => {
    if (err) throw err;
    token = buf
      .toString("base64")
      .replace(/\//g, "") // Because '/' and '+' aren't valid in URLs
      .replace(/\+/g, "-");
    return token;
  });

  bcrypt.genSalt(12, (err, salt) => {
    if (err) throw err;
    bcrypt.hash(req.body.password1, salt, (err, hash) => {
      if (err) throw err;
      database("users")
        .returning(["id", "email", "registered", "token"])
        .insert({
          email: req.body.email,
          password: hash,
          registered: Date.now(),
          token: token,
          createdtime: Date.now(),
          emailverified: "f",
          tokenusedbefore: "f"
        })
        .then(user => {
          let to = [user[0].email]; // Email address must be an array

          // When you set up your front-end you can create a working verification link here
          let link = "https://yourWebsite/v1/users/verify/" + user[0].token;

          // Subject of your email
          let sub = "Confirm Registration";

          // In this email we are sending HTML
          let content =
            "<body><p>Please verify your email.</p> <a href=" +
            link +
            ">Verify email</a></body>";
          // Use the registrationEmail function of our send email utility
          sendEmail.registrationEmail(to, sub, content);

          res.json("Success!");
        })
        .catch(err => {
          console.log(err);
          errors.account = "Email already registered";
          res.status(400).json(errors);
        });
    });
  });
});
module.exports = router;
