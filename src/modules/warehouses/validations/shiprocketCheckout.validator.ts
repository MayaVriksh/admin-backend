import Joi from "joi";

// A schema for a single item in the checkout cart
const cartItemSchema = Joi.object({
    variant_id: Joi.string().required().description("The unique ID of the plant or pot variant."),
    quantity: Joi.number().integer().min(1).required().description("The quantity of the variant being ordered.")
}).label('CartItem');

// Validation for the POST /checkout/initiate endpoint
const initiateCheckoutValidation = {
    payload: Joi.object({
        items: Joi.array().items(cartItemSchema).min(1).required()
            .description("An array of items from the customer's cart to be checked out.")
    })
};

// We don't need a Joi validation for the incoming webhook from Shiprocket
// as its integrity is verified by the HMAC signature in the `verifyShiprocketWebhook` middleware.

export default {
    initiateCheckoutValidation
};
