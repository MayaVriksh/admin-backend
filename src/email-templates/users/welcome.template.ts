import { footerTemplate } from "../common/footer.template";
import { headerTemplate } from "../common/header.template";
import { stylesTemplate } from "../common/styles.template";

export default function welcomeTemplate({ name }) {
  return `
  <!doctype html>
  <html>
    <head>
      <title>Welcome - MayaVriksh</title>
      ${stylesTemplate()}
    </head>
    <body>
      <div class="wrapper">
        <div class="container">
          ${headerTemplate()}
          <div class="body">
            <h2>Welcome to MayaVriksh!</h2>
            <p>Dear ${name},</p>
            <p>We’re excited to have you on board. Explore our collection and enjoy your journey with us.</p>
            <p class="closing">Warm regards,<br /><strong>Team MayaVriksh</strong></p>
          </div>
          ${footerTemplate()}
        </div>
      </div>
    </body>
  </html>
  `;
};
