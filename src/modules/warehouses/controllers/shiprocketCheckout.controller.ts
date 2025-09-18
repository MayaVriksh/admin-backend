import { Request, ResponseToolkit } from "@hapi/hapi";
import CheckoutService from "../services/shiprocketCheckout.service";

class CheckoutController {
    public async initiateCheckout(req: Request, h: ResponseToolkit) {
        try {
            const { userId } = req.pre.credentials as any;
            const { items } = req.payload as any;
            const result = await CheckoutService.initiateShiprocketCheckout(userId, items);
            return h.response(result).code(200);
        } catch (error: any) {
            return h.response({ message: error.message }).code(error.code || 500);
        }
    }

    public async handleOrderWebhook(req: Request, h: ResponseToolkit) {
        try {
            const result = await CheckoutService.createOrderFromWebhook(req.payload);
            return h.response(result).code(201);
        } catch (error: any) {
            console.error("Shiprocket Webhook Error:", error);
            // Return 500 to signal to Shiprocket that the webhook failed and should be retried
            return h.response({ message: error.message }).code(error.code || 500);
        }
    }
}

export default new CheckoutController();

