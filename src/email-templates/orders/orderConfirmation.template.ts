import { footerTemplate } from '../common/footer.template';
import { headerTemplate } from '../common/header.template';
import { stylesTemplate } from '../common/styles.template';

export default function orderConfirmationTemplate({ name, orderId, items, total }) {
  const itemsList = items.map(i => `<li>${i.name} x ${i.qty} - ₹${i.price}</li>`).join("");
  return `
  <!doctype html>
  <html>
    <head>
      <title>Order Confirmation - MayaVriksh</title>
      ${stylesTemplate()}
    </head>
    <body>
      <div class="wrapper">
        <div class="container">
          ${headerTemplate()}
          <div class="body">
            <h2>Order Confirmed!</h2>
            <p>Hi ${name},</p>
            <p>Your order <strong>#${orderId}</strong> has been confirmed.</p>
            <ul>${itemsList}</ul>
            <p><strong>Total: ₹${total}</strong></p>
            <p class="closing">Thank you for shopping with us!<br /><strong>Team MayaVriksh</strong></p>
          </div>
          ${footerTemplate()}
        </div>
      </div>
    </body>
  </html>
  `;
};
