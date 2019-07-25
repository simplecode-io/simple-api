// simplecode-api/utilities/sendEmail.js

const aws = require("aws-sdk");
// use AWS global variables
aws.config.accessKeyId;
aws.config.secretAccessKey;
aws.config.region = "us-east-1"; // Create a registerEmail function
function Email(to, sub, content) {
  let ses = new aws.SES();

  let from = "user@example.com"; // The email address added here must be verified in Amazon SES
  //Amazon SES email format
  ses.sendEmail(
    {
      Source: from,
      Destination: { ToAddresses: to },
      Message: {
        Subject: {
          Data: sub
        },
        Body: {
          Html: {
            Data: content
          }
        }
      }
    },
    function(err, data) {
      if (err) {
        console.log(err);
      } else {
        console.log("Email sent: " + data);
      }
    }
  );
}
// Export the registerEmail function
module.exports = {
  Email
};
