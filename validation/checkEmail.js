// simple-api/validation/checkEmail.js

const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateResetInput(data) {
  let errors = {};

  data.email = !isEmpty(data.email) ? data.email : "";

  if (Validator.isEmpty(data.email)) {
    errors.email = "Email is required";
  }
  if (!Validator.isEmail(data.email)) {
    errors.email = " Email is invalid";
  }
  return {
    errors,
    isValid: isEmpty(errors)
  };
};
