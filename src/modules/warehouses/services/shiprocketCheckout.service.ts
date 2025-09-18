import crypto from 'crypto';
import axios from 'axios';
import { prisma } from "../../../config/prisma.config";
import { v4 as uuidv4 } from "uuid";
import generateCustomId from '../../../utils/generateCustomId';
import { ROLES } from '../../../constants/roles.constant';

// Store your Shiprocket credentials securely in .env files
const SHIPROCKET_API_KEY = process.env.SHIPROCKET_API_KEY!;
const SHIPROCKET_SECRET_KEY = process.env.SHIPROCKET_SECRET_KEY!;
const SHIPROCKET_API_URL = "https://checkout-api.shiprocket.com";

class CheckoutService {
    private _calculateHmac(payload: any): string {
        const hmac = crypto.createHmac('sha256', SHIPROCKET_SECRET_KEY);
        hmac.update(JSON.stringify(payload));
        return hmac.digest('base64');
    }

    public async initiateShiprocketCheckout(userId: string, items: { variant_id: string, quantity: number }[]) {
        // In a real app, you would fetch the user's cart from the database
        // and verify the items belong to the user.
        
        const payload = {
            cart_data: { items },
            redirect_url: process.env.SHIPROCKET_REDIRECT_URL, // Your order confirmation page
            timestamp: new Date().toISOString()
        };
        
        const hmac = this._calculateHmac(payload);

        try {
            const response = await axios.post(`${SHIPROCKET_API_URL}/api/v1/access-token/checkout`, payload, {
                headers: {
                    'X-Api-Key': SHIPROCKET_API_KEY,
                    'X-Api-HMAC-SHA256': hmac,
                    'Content-Type': 'application/json'
                }
            });
            
            // Return only the token needed by the frontend
            return { token: response.data.result.token };

        } catch (error: any) {
            console.error("Shiprocket API Error:", error.response?.data || error.message);
            throw { code: 502, message: "Failed to communicate with the checkout service." };
        }
    }

    public async createOrderFromWebhook(payload: any) {
        return await prisma.$transaction(async (tx) => {
            // 1. Re-fetch trusted product data. DO NOT trust prices from the webhook.
            const variantIds = payload.cart_data.items.map((item: any) => item.variant_id);
            const trustedVariants = await tx.plantVariants.findMany({
                where: { variantId: { in: variantIds } },
                select: { variantId: true, mrp: true }
            });
            // You would also query PotVariants here and merge the results

            // 2. Securely recalculate the order total.
            let finalPayableAmount = 0;
            const orderItemsData = payload.cart_data.items.map((item: any) => {
                const trustedVariant = trustedVariants.find(v => v.variantId === item.variant_id);
                if (!trustedVariant) throw new Error(`Variant ${item.variant_id} not found.`);
                const itemTotal = Number(trustedVariant.mrp) * item.quantity;
                finalPayableAmount += itemTotal;
                return {
                    plantVariantId: item.variant_id, // assuming plant for simplicity
                    units: item.quantity,
                    unitSellingPrice: trustedVariant.mrp,
                    totalSellingPrice: itemTotal,
                };
            });

            // 3. Find or create the customer based on email/phone.
            let customer = await tx.customer.findFirst({ where: { user: { email: payload.email } } });
            // ... logic to create a new User and Customer if they don't exist ...

            // 4. Create the Order and related records in your database.
            const newOrder = await tx.order.create({
                data: {
                    orderId: payload.order_id, 
                    invoiceNumber: `INV-${payload.order_id}`,
                    customerId: customer!.customerId,
                    orderDate: new Date(),
                    orderStatus: 'PROCESSING',
                    paymentStatus: payload.status === 'SUCCESS' ? 'PAID' : 'PENDING',
                    paymentMethod: payload.payment_type,
                    finalPayableAmount: finalPayableAmount,
                    // Required fields added below
                    returnEligibilityDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Example: 7 days from now
                    orderAmount: finalPayableAmount, // Or calculate as needed
                    discountApplied: 0, // Set appropriately if discounts are used
                    shippingCharges: 0, // Set appropriately if shipping charges apply
                    taxCollected: 0, // Set appropriately if tax applies
                    PlantOrderItem: { create: orderItemsData },
                    // ... create Payment and Shipping records
                }
            });
            
            // 5. Decrement inventory stock for each item.
            for (const item of payload.cart_data.items) {
                 await tx.plantWarehouseInventory.updateMany({
                     where: { variantId: item.variant_id },
                     data: { currentStock: { decrement: item.quantity } }
                 });
            }
            
            return { success: true, message: "Order created successfully." };
        });
    }
}

export default new CheckoutService();

