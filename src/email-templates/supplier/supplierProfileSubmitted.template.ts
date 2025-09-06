import { footerTemplate } from "../common/footer.template";
import { headerTemplate } from "../common/header.template";
import { stylesTemplate } from "../common/styles.template";

export default function supplierProfileSubmittedTemplate({ contactName, nurseryName }) {
  return `
  <!doctype html>
  <html>
    <head>
      <title>Supplier Profile Submitted Successfully - MayaVriksh</title>
      ${stylesTemplate()}
    </head>
    <body>
      <div class="wrapper">
        <div class="container">
          ${headerTemplate()}
          <div class="body">
            <h2>Supplier Profile Submitted Successfully</h2>
            <p>Dear ${contactName},</p>
            <p>We have received the profile for your nursery, <strong>${nurseryName}</strong>. Your submission is being reviewed by our team.</p>
            <p>Our administrators may contact you if any additional information or clarification is required during the verification process.</p>
            <p>Thank you for providing your details. We look forward to collaborating with you.</p>
            <p class="closing">Sincerely,<br /><strong>Team MayaVriksh</strong></p>
          </div>
          ${footerTemplate()}
        </div>
      </div>
    </body>
  </html>
  `;
};
