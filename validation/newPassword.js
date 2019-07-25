// simple-api/validation/newPassword.js

const Validator = require("validator");
const ifEmpty = require("./checkForEmpty");

module.exports = function validateResetInput(data) {
  let errors = {};

  data.password1 = !ifEmpty(data.password1) ? data.password1 : "";
  data.password2 = !ifEmpty(data.password2) ? data.password2 : "";

  if (Validator.isEmpty(data.password1)) {
    errors.password1 = "Password is required";
  }
  if (!Validator.isLength(data.password1, { min: 8, max: 120 })) {
    errors.password1 = "Passwords must be at least 8 characters";
  }
  if (Validator.isEmpty(data.password2)) {
    errors.password2 = "Confirm password is required";
  }
  if (!Validator.equals(data.password1, data.password2)) {
    errors.password2 = "Passwords must match";
  }
  return {
    errors,
    isValid: ifEmpty(errors)
  };
};
