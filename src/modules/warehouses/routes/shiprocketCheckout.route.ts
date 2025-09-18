import { ServerRoute } from "@hapi/hapi";
import CheckoutController from "../controllers/shiprocketCheckout.controller";
import { verifyAccessTokenMiddleware } from "../../../middlewares/authenticate.middleware";
// import { verifyShiprocketWebhook } from "../../../middlewares/verifyShiprocket.middleware"; // A new middleware for security
import CheckoutValidator from "../validations/shiprocketCheckout.validator";
import { handleValidationFailure } from "../../../utils/failActionValidation";

const shiprocketCheckout: ServerRoute[] = [
    {
        method: "POST",
        path: "/checkout/initiate",
        options: {
            tags: ["api", "Checkout"],
            description: "Initiates a Shiprocket checkout by generating a one-time access token.",
            pre: [verifyAccessTokenMiddleware], // Requires a logged-in customer
            validate: {
                ...CheckoutValidator.initiateCheckoutValidation,
                failAction: handleValidationFailure,
            },
            handler: CheckoutController.initiateCheckout,
        }
    },
    {
        method: "POST",
        path: "/webhooks/shiprocket/order-created",
        options: {
            tags: ["api", "Webhooks"],
            description: "Webhook endpoint to receive new order confirmations from Shiprocket.",
            // pre: [verifyShiprocketWebhook], // Secure the webhook with HMAC signature validation
            handler: CheckoutController.handleOrderWebhook,
        }
    }
];

export default shiprocketCheckout;

