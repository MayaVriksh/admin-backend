import Joi from 'joi';
import * as ORDER_STATUSES from '../../../../constants/orderStatus.constant';

// A single, powerful validation schema for the order list endpoint
const orderRequestValidation = {
    query: Joi.object({
        // Pagination
        page: Joi.number()
            .integer()
            .min(1)
            .default(1)
            .label("Page Number")
            .description("Page number to retrieve (minimum 1)"),

        limit: Joi.number()
            .integer()
            .min(1)
            .max(100)
            .default(10)
            .label("Page Limit")
            .description("Number of items per page (1–100)"),

        // Order status filter
        orderStatus: Joi.string()
            .valid(
                ORDER_STATUSES.PENDING,
                ORDER_STATUSES.PROCESSING,
                ORDER_STATUSES.DELIVERED,
                ORDER_STATUSES.SHIPPED,
                ORDER_STATUSES.ALL_ORDERS
            )
            .default(ORDER_STATUSES.ALL_ORDERS)
            .label("Order Status")
            .description("Filter by order status"),

        // Search by supplier ID
        supplierId: Joi.string()
            .trim()
            .allow("")
            .optional()
            .label("Supplier ID Search")
            .description("Search orders by Supplier ID"),

        // Search by warehouse ID
        warehouseId: Joi.string()
            .trim()
            .allow("")
            .optional()
            .label("Warehouse ID Search")
            .description("Search orders by Warehouse ID"),

        // Date range filters
        fromDate: Joi.date()
            .iso()
            .optional()
            .label("From Date")
            .description("Start date (inclusive) in ISO format"),
        toDate: Joi.date()
            .iso()
            .optional()
            .min(Joi.ref("fromDate"))
            .label("To Date")
            .description("End date (inclusive) in ISO format"),

        // For searching
        search: Joi.string()
            .allow("")
            .optional()
            .description("A search term to filter orders by ID")
            .trim(),
            
        // Sorting
        sortBy: Joi.string()
            .valid("requestedAt", "totalCost", "status")
            .default("requestedAt")
            .label("Sort By")
            .description("Field to sort results by"),

        order: Joi.string()
            .lowercase()
            .valid("asc", "desc")
            .default("desc")
            .label("Sort Order")
            .description('Sort order: "asc" or "desc"')
    })
};

const listHistoryValidation = {
    query: Joi.object({
        // Pagination
        page: Joi.number()
            .integer()
            .min(1)
            .default(1)
            .label("Page Number")
            .description("Page number to retrieve (minimum 1)"),

        limit: Joi.number()
            .integer()
            .min(1)
            .max(100)
            .default(10)
            .label("Page Limit")
            .description("Number of items per page (1–100)"),
        search: Joi.string().allow("").optional().trim(),
        // Search by supplier ID
        supplierId: Joi.string()
            .trim()
            .allow("")
            .optional()
            .label("Supplier ID Search")
            .description("Search orders by Supplier ID"),

        // Filter by order status
        orderStatus: Joi.string()
           .valid(
                ORDER_STATUSES.DELIVERED,
                ORDER_STATUSES.REJECTED,
                ORDER_STATUSES.CANCELLED,
                ORDER_STATUSES.ALL_ORDERS
            )
            .default(ORDER_STATUSES.ALL_ORDERS)
            .label("Order Status")
            .description("Filter orders by status"),

        // Search by warehouse ID
        warehouseId: Joi.string()
            .trim()
            .allow("")
            .optional()
            .label("Warehouse ID Search")
            .description("Search orders by specific Warehouse ID"),

        // Date range filters
        fromDate: Joi.date()
            .iso()
            .optional()
            .label("From Date")
            .description("Start date (inclusive) in ISO format"),
        toDate: Joi.date()
            .iso()
            .optional()
            .min(Joi.ref("fromDate"))
            .label("To Date")
            .description("End date (inclusive) in ISO format"),

        // Sorting
        sortBy: Joi.string()
            .valid("requestedAt", "totalCost", "status")
            .default("requestedAt")
            .label("Sort Field")
            .description("Field to sort results by"),

        order: Joi.string()
            .lowercase()
            .valid("asc", "desc")
            .default("desc")
            .label("Sort Order")
            .description('Sort direction: "asc" or "desc"')
    })
};

const orderIdParamValidation = {
    params: Joi.object({
        orderId: Joi.string()
            .required()
            .description("The ID of the purchase order")
    })
};

const restockOrderValidation = {
    params: Joi.object({
        orderId: Joi.string()
            .required()
            .description("The ID of the purchase order to restock")
    }),
    payload: Joi.object({
        warehouseManagerReviewNotes: Joi.string()
            .optional()
            .allow("")
            .description("Overall notes for the delivery"),
        items: Joi.array()
            .items(
                Joi.object({
                    purchaseOrderItemId: Joi.string()
                        .required()
                        .description("The ID of the PurchaseOrderItem"),
                    unitsReceived: Joi.number()
                        .integer()
                        .min(0)
                        .required()
                        .description("Quantity received in good condition"),
                    unitsDamaged: Joi.number()
                        .integer()
                        .min(0)
                        .default(0)
                        .description("Quantity received damaged"),
                    damageReason: Joi.string()
                        .when("unitsDamaged", {
                            is: Joi.number().greater(0),
                            then: Joi.string().required(),
                            otherwise: Joi.optional().allow("")
                        })
                        .description(
                            "Reason for damage (required if unitsDamaged > 0)"
                        )
                    // damagePhoto: Joi.any()
                    //     .meta({ swaggerType: "file" })
                    //     .optional()
                    //     .description("Photo of the damaged item (if any)")
                })
            )
            .min(1)
            .required()
            .description(
                "An array of items with their received/damaged quantities"
            )
    })
};

const qcMediaUploadValidation = {
    // 1. Validate the orderId from the URL parameter
    params: Joi.object({
        orderId: Joi.string()
            .required()
            .description("The ID of the purchase order")
    }),

    payload: Joi.object({
        // The key 'qcMedia' must match what your controller expects.
        // Joi.any().meta({ swaggerType: 'file' }) tells Swagger to render a file input.
        // Using Joi.array().items() allows for multiple file uploads.
        qcMedia: Joi.array()
            .items(Joi.any().meta({ swaggerType: "file" }))
            .required()
            .description("One or more image/video files for QC.")
    })
};

// A schema for a single order SUMMARY in the list
const orderSummarySchema = Joi.object({
    id: Joi.string().required(),
    totalCost: Joi.number().allow(null),
    pendingAmount: Joi.number().allow(null),
    paymentPercentage: Joi.number().integer().required(),
    status: Joi.string().required(),
    expectedDateOfArrival: Joi.date().required(),
    _count: Joi.object({
        media: Joi.number().integer().required()
    })
}).label("OrderSummary");

// The schema for the entire successful response payload
const listOrdersResponseSchema = Joi.object({
    success: Joi.boolean().example(true),
    code: Joi.number().example(200),
    message: Joi.string(),
    data: Joi.object({
        orders: Joi.array().items(orderSummarySchema),
        totalPages: Joi.number().integer().example(10),
        currentPage: Joi.number().integer().example(1)
    })
}).label("ListOrdersResponse");

const orderItemSchema = Joi.object({
    id: Joi.string().required(),
    productType: Joi.string().valid("Plant", "Pot").required(),
    variantImage: Joi.string().uri().allow(null, ""),
    variantName: Joi.string().required(),
    sku: Joi.string().allow(null, ""),
    material: Joi.string().allow(null, ""),
    requestedDate: Joi.date().required(),
    unitCostPrice: Joi.number().required(),
    unitRequested: Joi.number().integer().required(),
    totalVariantCost: Joi.number().required(),
    isAccepted: Joi.boolean() // This may or may not be in the transformed object, so keep it flexible
}).label("TransformedOrderItem");

// --- 2. A reusable schema for a single payment history item ---
const paymentItemSchema = Joi.object({
    paidAmount: Joi.number().required(),
    pendingAmountAfterPayment: Joi.number().required(),
    paymentMethod: Joi.string().required(),
    paymentRemarks: Joi.string().allow(null, ""),
    receiptUrl: Joi.string().uri().allow(null, ""),
    resourceType: Joi.string().required(),
    publicId: Joi.string().required(),
    requestedAt: Joi.date(),
    paidAt: Joi.date().allow(null),
    transactionId: Joi.string().required()
}).label("PaymentHistoryItem");

// --- 3. The main schema for the entire API response ---
// This combines the pieces above to validate the full structure.
const getOrderByIdResponseSchema = Joi.object({
    success: Joi.boolean().example(true).required(),
    code: Joi.number().example(200).required(),
    data: Joi.object({
        // Top-level PurchaseOrder fields
        id: Joi.string().required(),
        status: Joi.string().required(),
        totalCost: Joi.number().allow(null),
        pendingAmount: Joi.number().allow(null),
        paymentPercentage: Joi.number().integer().required(),
        expectedDateOfArrival: Joi.date().required(),
        requestedAt: Joi.date().required(),
        isAccepted: Joi.boolean().required(),

        // The nested array of transformed items
        PurchaseOrderItems: Joi.array().items(orderItemSchema).required(),

        // The nested array of transformed payments
        payments: Joi.array().items(paymentItemSchema).required()
    })
}).label("GetOrderByIdSuccessResponse");

const recordPaymentValidation = {
    params: Joi.object({
        orderId: Joi.string()
            .required()
            .description("The ID of the purchase order")
    }),
    payload: Joi.object({
        // ---: 'remarks' is now the 'Payment Type' selector ---
        remarks: Joi.string()
            .valid("FULL_PAYMENT", "INSTALLMENT")
            .required()
            .description("Select 'FULL_PAYMENT' or 'INSTALLMENT'."),

        // ---: 'amount' is conditional ---
        amount: Joi.number()
            .when("remarks", {
                is: "INSTALLMENT",
                // If remarks is 'INSTALLMENT', then 'amount' is required and must be positive.
                then: Joi.number().positive().required(),
                // Otherwise (if it's 'FULL_PAYMENT'), 'amount' is optional. The backend will calculate it.
                otherwise: Joi.optional()
            })
            .description(
                "Required for 'INSTALLMENT'. For 'FULL_PAYMENT', this is calculated on the backend."
            ),
        paymentMethod: Joi.string()
            .required()
            .description("e.g., NEFT, UPI, Cash"),
        transactionId: Joi.string()
            .optional()
            .allow("")
            .description("Reference ID for the transaction"),
        receipt: Joi.any()
            .meta({ swaggerType: "file" })
            .optional()
            .description("The payment receipt image or PDF")
    })
};


const addToWarehouseCartValidation = {
    payload: Joi.object({
        warehouseId: Joi.string().required(),
        productType: Joi.string().valid('PLANT', 'POT').required(),
        supplierId: Joi.string().required().description("The ID of the supplier for this cart item."),
        plantId: Joi.string().when('productType', {
            is: 'PLANT',
            // If it's a PLANT, it's required and cannot be empty.
            then: Joi.string().required(),
            // Otherwise (if it's a POT), it's optional AND can be an empty string or null.
            otherwise: Joi.string().optional().allow('', null)
        }),
        plantVariantId: Joi.string().when('productType', {
            is: 'PLANT',
            then: Joi.string().required(),
            otherwise: Joi.string().optional().allow('', null)
        }),

    
        potCategoryId: Joi.string().when('productType', {
            is: 'POT',
            then: Joi.string().required(),
            otherwise: Joi.string().optional().allow('', null)
        }),
        potVariantId: Joi.string().when('productType', {
            is: 'POT',
            then: Joi.string().required(),
            otherwise: Joi.string().optional().allow('', null)
        }),

        unitsRequested: Joi.number().integer().min(1).required(),
        unitCostPrice: Joi.number().positive().required()
    })
};

const getWarehouseCartValidation = {
    params: Joi.object({
        warehouseId: Joi.string().required().description("The ID of the warehouse whose cart is being fetched")
    })
};

const createPurchaseOrderFromCartValidation = {
    payload: Joi.object({
        warehouseId: Joi.string().required().description("The ID of the warehouse whose cart is being converted to an order."),
        supplierId: Joi.string().required().description("The ID of the supplier for this order."),
        expectedDateOfArrival: Joi.date().iso().required().description("The expected delivery date in ISO format."),
        deliveryCharges: Joi.number().min(0).optional().default(0).description("Optional delivery charges for the order.")
    })
};

export {
    addToWarehouseCartValidation, createPurchaseOrderFromCartValidation, getOrderByIdResponseSchema, getWarehouseCartValidation, listHistoryValidation,
    listOrdersResponseSchema, orderIdParamValidation, orderRequestValidation, qcMediaUploadValidation, recordPaymentValidation, restockOrderValidation
};

