import { footerTemplate } from "../common/footer.template";
import { headerTemplate } from "../common/header.template";
import { stylesTemplate } from "../common/styles.template";

export default function orderShippedTemplate({ name, orderId, trackingLink }) {
  return `
  <!doctype html>
  <html>
    <head>
      <title>Order Shipped - MayaVriksh</title>
      ${stylesTemplate()}
    </head>
    <body>
      <div class="wrapper">
        <div class="container">
          ${headerTemplate()}
          <div class="body">
            <h2>Your Order is on the Way!</h2>
            <p>Hi ${name},</p>
            <p>Your order <strong>#${orderId}</strong> has been shipped.</p>
            <p>Track your shipment here: <a href="${trackingLink}">${trackingLink}</a></p>
            <p class="closing">Happy shopping!<br /><strong>Team MayaVriksh</strong></p>
          </div>
          ${footerTemplate()}
        </div>
      </div>
    </body>
  </html>
  `;
};
