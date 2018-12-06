// simple-api/api/routes/users.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const database = require("../../database");

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
          // This is where the api returns json to the /register route
          // Return the id, email, registered on date and token here
          // Sending the user's token as a response here is insecure,
          // but it is useful to check if our code is working properly
          res.json(user[0]);
        })
        .catch(err => {
          errors.account = "Email already registered";
          res.status(400).json(errors);
        });
    });
  });
});
module.exports = router;
