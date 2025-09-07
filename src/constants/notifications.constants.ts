const NOTIFICATION_CATEGORIES = {
    GENERAL: "GENERAL",
    ORDER: "ORDER",
    PURCHASE_ORDER: "PURCHASE_ORDER",
    SUPPLIER: "SUPPLIER",
    PROMOTION: "PROMOTION",
    ALERT: "ALERT",
    REMINDER: "REMINDER",
    SYSTEM: "SYSTEM",
    SECURITY: "SECURITY",
    INVENTORY: "INVENTORY",
    PAYMENT: "PAYMENT",
    SHIPPING: "SHIPPING"
};

const NOTIFICATIONS = {
    // General
    WELCOME: {
        title: "👋 Welcome",
        body: "Account has been created successfully."
    },

    // Orders by status
    ORDER_PENDING: (orderId) => ({
        title: "⏳ Order Pending",
        body: `Order #${orderId} is waiting for confirmation.`
    }),
    ORDER_APPROVED: (orderId) => ({
        title: "✅ Order Approved",
        body: `Order #${orderId} has been approved.`
    }),
    ORDER_CONFIRMED: (orderId) => ({
        title: "📦 Order Confirmed",
        body: `Order #${orderId} has been confirmed.`
    }),
    ORDER_PROCESSING: (orderId) => ({
        title: "⚙️ Order Processing",
        body: `Order #${orderId} is being processed.`
    }),
    ORDER_SHIPPED: (orderId) => ({
        title: "🚚 Order Shipped",
        body: `Order #${orderId} is on the way.`
    }),
    ORDER_DELIVERED: (orderId) => ({
        title: "📬 Order Delivered",
        body: `Order #${orderId} has been delivered successfully.`
    }),
    ORDER_CANCELLED: (orderId) => ({
        title: "❌ Order Cancelled",
        body: `Order #${orderId} has been cancelled.`
    }),
    ORDER_REJECTED: (orderId) => ({
        title: "⚠️ Order Rejected",
        body: `Order #${orderId} has been rejected.`
    }),
    ORDER_RETURNED: (orderId) => ({
        title: "🔄 Order Returned",
        body: `Order #${orderId} has been returned.`
    }),
    ORDER_UNDER_REVIEW: (orderId) => ({
        title: "🕵️ Order Under Review",
        body: `Order #${orderId} is under review.`
    }),

    // Purchase Orders
    PURCHASE_ORDER_CREATED: (poId) => ({
        title: "📝 Purchase Order Created",
        body: `Purchase order #${poId} has been created.`
    }),
    PURCHASE_ORDER_APPROVED: (poId) => ({
        title: "✅ Purchase Order Approved",
        body: `Purchase order #${poId} has been approved.`
    }),
    PURCHASE_ORDER_REJECTED: (poId) => ({
        title: "❌ Purchase Order Rejected",
        body: `Purchase order #${poId} has been rejected.`
    }),

    // Supplier
    SUPPLIER_PROFILE_SUBMITTED: {
        title: "📨 Profile Submitted",
        body: "Supplier profile has been submitted for review."
    },
    SUPPLIER_PROFILE_APPROVED: {
        title: "🌟 Profile Approved",
        body: "Supplier profile has been approved."
    },
    SUPPLIER_PROFILE_REJECTED: {
        title: "❌ Profile Rejected",
        body: "Supplier profile has been rejected."
    },

    // Inventory
    INVENTORY_LOW: (productName) => ({
        title: "⚠️ Low Stock",
        body: `${productName} stock is running low.`
    }),
    INVENTORY_OUT: (productName) => ({
        title: "🚫 Out of Stock",
        body: `${productName} is currently unavailable.`
    }),

    // Payment
    PAYMENT_RECEIVED: (amount, orderId) => ({
        title: "💰 Payment Received",
        body: `₹${amount} received for order #${orderId}.`
    }),
    PAYMENT_FAILED: (orderId) => ({
        title: "⚠️ Payment Failed",
        body: `Payment for order #${orderId} could not be processed.`
    }),

    // Security
    LOGIN_ALERT: {
        title: "🔐 Login Alert",
        body: "A new login was detected on the account."
    },
    PASSWORD_CHANGED: {
        title: "🔑 Password Updated",
        body: "Account password has been changed successfully."
    }
};

export { NOTIFICATION_CATEGORIES, NOTIFICATIONS };
