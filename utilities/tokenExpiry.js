// simple-api/utilities/tokenExpiry.js

const database = require("../database");

// Function runs every 4 seconds
setInterval(async function checkRegistrationTokenValidity() {
  await database
    .select("id", "createdtime")
    .from("users")
    .then(timeOfTokenCreation => {
      timeOfTokenCreation.map(entryTime => {
        // Convert UTC time to an integer to compare with current time
        let timeInInt = parseInt(entryTime.createdtime);

        // Check if an hour has passed since the token was generated
        if (Date.now() > timeInInt + 60000 * 60) {
          database
            .table("users")
            .where("id", entryTime.id)
            .update({ token: null }) //updates old tokens to null
            .then(res => res)
            .catch(err => err);
        }
      });
    })
    .catch(err => console.log(err));
}, 4000);

// Remove reset password tokens older than one hour
setInterval(async function checkPasswordTokenValidity() {
  await database
    .select("id", "reset_password_expires")
    .from("users")
    .then(tokenExpiry => {
      if (tokenExpiry) {
        tokenExpiry.map(resetTime => {
          let timeInInt = parseInt(resetTime.reset_password_expires);
          if (Date.now() > timeInInt + 60000 * 60) {
            database
              .table("users")
              .where("id", resetTime.id)
              .update({ reset_password_token: null })
              .then(res => res)
              .catch(err => err);
          }
        });
      }
    })
    .catch(err => console.log(err));
}, 6000);
