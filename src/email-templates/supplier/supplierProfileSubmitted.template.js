const header = require("../common/header.template");
const footer = require("../common/footer.template");
const styles = require("../common/styles.template");

module.exports = function supplierProfileSubmittedTemplate({ contactName, nurseryName }) {
  return `
  <!doctype html>
  <html>
    <head>
      <title>Supplier Profile Submitted Successfully - MayaVriksh</title>
      ${styles()}
    </head>
    <body>
      <div class="wrapper">
        <div class="container">
          ${header()}
          <div class="body">
            <h2>Supplier Profile Submitted Successfully</h2>
            <p>Dear ${contactName},</p>
            <p>We have received the profile for your nursery, <strong>${nurseryName}</strong>. Your submission will be reviewed by our team.</p>
            <p>Our administrators may contact you if any additional information or clarification is required during the verification process.</p>
            <p>Thank you for providing your details. We look forward to collaborating with you.</p>
            <p class="closing">Sincerely,<br /><strong>Team MayaVriksh</strong></p>
          </div>
          ${footer()}
        </div>
      </div>
    </body>
  </html>
  `;
};
