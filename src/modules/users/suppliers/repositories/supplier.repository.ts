import { v4 as uuidv4 } from 'uuid';
import { prisma } from '../../../../config/prisma.config';
import * as ORDER_STATUSES from '../../../../constants/orderStatus.constant';

/**
 * Finds a supplier's ID based on their user ID.
 * @param {string} userId - The user's unique ID.
 * @returns {Promise<object|null>} The supplier object with their ID, or null if not found.
 */
const findSupplierByUserId = async (userId) => {
    return await prisma.supplier.findUnique({
        where: { userId: userId },
        select: { supplierId: true }
    });
};

const findSupplierDetailsForEmailByUserId = async (userId) => {
    return await prisma.supplier.findUnique({
        where: { userId: userId },
        select: {
            nurseryName: true,
            contactPerson: {
                select: {
                    fullName: true,
                    email: true
                }
            }
        }
    });
};

/**
 * Fetches a paginated list of purchase orders for a given supplier.
 * @param {string} supplierId - The ID of the supplier.
 * @param {object} options - An object containing pagination and filtering options.
 * @returns {Promise<[number, object[]]>} A tuple containing the total count and the list of orders.
 */
const findPurchaseOrdersBySupplier = async (
    supplierId,
    { page, limit, orderStatus, search, sortBy, order }
) => {
    console.log(
        "findPurchaseOrdersBySupplier: ",
        page,
        limit,
        orderStatus,
        order,
        search
    );

    const whereClause = {
        supplierId,
        // Exclude historical orders (DELIVERED && COMPLETELY PAID Purchase Orders)
        NOT: [
            {
                status: {
                    in: [ORDER_STATUSES.REJECTED, ORDER_STATUSES.CANCELLED]
                }
            },
            {
                AND: [
                    { status: ORDER_STATUSES.DELIVERED },
                    { paymentPercentage: 100 },
                    { pendingAmount: 0 }
                ]
            }
        ],
        // Add the active filter if given
        ...statusFiltersForActivePurchaseOrders[
            orderStatus || ORDER_STATUSES.ALL_ORDERS
        ],
        ...(search && {
            id: { contains: search, mode: "insensitive" }
        })
    };

    const orderBy = {};
    if (sortBy && order) {
        orderBy[sortBy] = order;
    } else {
        // Default sort if none is provided
        orderBy["requestedAt"] = "desc";
    }
    // Use a transaction to run both queries at the same time for efficiency.
    return await prisma.$transaction([
        prisma.purchaseOrder.count({ where: whereClause }),
        prisma.purchaseOrder.findMany({
            where: whereClause,
            skip: (page - 1) * limit,
            take: limit,
            orderBy: orderBy,
            select: {
                // This is the complete select statement from our previous discussion
                id: true,
                totalCost: true,
                pendingAmount: true,
                paymentPercentage: true,
                status: true,
                isAccepted: true,
                requestedAt: true,
                expectedDateOfArrival: true,
                supplierReviewNotes: true,
                warehouseManagerReviewNotes: true,
                // Now, fetch all related items for the details modal
                PurchaseOrderItems: {
                    select: {
                        id: true,
                        productType: true,
                        unitsRequested: true,
                        unitCostPrice: true,
                        status: true,
                        // Include Plant details if the item is a Plant
                        plant: {
                            select: { name: true }
                        },
                        plantVariant: {
                            select: {
                                size: {
                                    select: {
                                        plantSize: true
                                    }
                                },
                                sku: true,
                                /** mediaUrl:true */
                                color: {
                                    select: {
                                        name: true,
                                        hexCode: true
                                    }
                                },
                                plantVariantImages: {
                                    // This is the relation name
                                    where: { isPrimary: true }, // Filter for the primary image
                                    take: 1, // We only need one
                                    select: { mediaUrl: true } // Select just the URL
                                }
                            }
                        },
                        potVariant: {
                            select: {
                                potVariantId: true,
                                potName: true,
                                sku: true,
                                color: { // Color is still a direct relation
                                    select: {
                                        name: true,
                                        hexCode: true
                                    }
                                },
                                images: { // Images are still a direct relation
                                    where: { isPrimary: true },
                                    take: 1,
                                    select: { mediaUrl: true }
                                },
                                // Now, we fetch the physical details through the new nested relations
                                sizeMaterialOption: {
                                    select: {
                                        material: {
                                            select: {
                                                name: true
                                            }
                                        },
                                        sizeProfile: {
                                            select: {
                                                size: true,
                                                height: true,
                                                weight: true,
                                                category: {
                                                    select: {
                                                        name: true
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                payments: {
                    select: {
                        paymentId: true,
                        amount: true,
                        paymentMethod: true,
                        status: true,
                        receiptUrl: true,
                        publicId: true,
                        requestedAt: true,
                        paidAt: true,
                        remarks: true,
                        transactionId: true
                    },
                    orderBy: {
                        // Show the payments in chronological order
                        requestedAt: "asc"
                    }
                }
            }
        })
    ]);
};

const checkPurchaseOrderExist = async (orderId, supplierId) => {
    return await prisma.purchaseOrder.findFirst({
        where: { id: orderId, supplierId: supplierId }
    });
};

const updateOrderStatus = async (orderId) => {
    return await prisma.purchaseOrder.update({
        where: { id: orderId },
        data: {
            status: ORDER_STATUSES.SHIPPED
        }
    });
};
/**
 * Creates multiple PurchaseOrderMedia records and links them to a PurchaseOrder.
 * @param {string} purchaseOrderId - The ID of the parent order.
 * @returns {Promise<object>} The result of the Prisma createMany operation.
 */
const addMediaToPurchaseOrder = async (
    purchaseOrderId,
    mediaAssetsToCreate
) => {
    // Prepare the data for Prisma by adding the required IDs to each asset.
    const dataToCreate = mediaAssetsToCreate.map((asset) => ({
        id: uuidv4(),
        purchaseOrderId: purchaseOrderId,
        mediaUrl: asset.mediaUrl,
        publicId: asset.publicId,
        mediaType: asset.mediaType,
        resourceType: asset.resourceType,
        isPrimary: asset.isPrimary,
        uploadedBy: asset.uploadedBy
    }));

    // Use createMany for an efficient bulk-insert into the database.
    return await prisma.purchaseOrderMedia.createMany({
        data: dataToCreate
    });
};

/**
 * Fetches multiple PurchaseOrderItems by their IDs.
 * @param {string[]} itemIds - An array of PurchaseOrderItem IDs.
 * @returns {Promise<Array<object>>} A list of purchase order items with their cost and quantity.
 */
const findOrderItemsByIds = async (itemIds) => {
    return await prisma.purchaseOrderItems.findMany({
        where: {
            id: { in: itemIds }
        },
        select: {
            unitCostPrice: true,
            unitsRequested: true
        }
    });
};
const orderToReview = async ({ orderId, supplierId }) => {
    return await prisma.purchaseOrder.findFirst({
        where: {
            id: orderId,
            supplierId: supplierId
        },
        select: { id: true, status: true, totalCost: true }
    });
};

const updateOrderAfterReview = async ({
    orderId,
    rejectedItemIds,
    newTotalCost,
    tx
}) => {
    // Mark rejected items as not accepted
    await tx.purchaseOrderItems.updateMany({
        where: { id: { in: rejectedItemIds }, purchaseOrderId: orderId },
        data: { status: ORDER_STATUSES.REJECTED }
    });

    // Mark all other items as accepted. Can be removed, as in DB they all will be marked as accepted by default
    await tx.purchaseOrderItems.updateMany({
        where: { id: { notIn: rejectedItemIds }, purchaseOrderId: orderId },
        data: { status: ORDER_STATUSES.APPROVED }
    });

    // Update the parent order's total cost and status
    return await tx.purchaseOrder.update({
        where: { id: orderId },
        data: {
            totalCost: newTotalCost,
            pendingAmount: newTotalCost,
            status: ORDER_STATUSES.PROCESSING,
            isAccepted: true,
            acceptedAt: new Date()
        }
    });
};

/**
 * Updates an order and all its items to a REJECTED status.
 */
const rejectEntireOrder = async (orderId, tx) => {
    // Update all items to be not accepted.
    await tx.purchaseOrderItems.updateMany({
        where: { purchaseOrderId: orderId },
        data: { status: ORDER_STATUSES.REJECTED }
    });
    // Update the parent order status.
    return await tx.purchaseOrder.update({
        where: { id: orderId },
        data: { status: ORDER_STATUSES.REJECTED, isAccepted: false }
    });
};

const statusFiltersForActivePurchaseOrders = {
    PENDING: { status: ORDER_STATUSES.PENDING },
    PROCESSING: { status: ORDER_STATUSES.PROCESSING },
    SHIPPED: { status: ORDER_STATUSES.SHIPPED },
    DELIVERED: { status: ORDER_STATUSES.DELIVERED }, // This is "active" delivered, not yet fully paid
    ALL_ORDERS: {} // no extra filter → includes all active ones
};

const statusFiltersForPurchaseOrderHistory = {
    REJECTED: { status: ORDER_STATUSES.REJECTED },
    CANCELLED: { status: ORDER_STATUSES.CANCELLED },
    DELIVERED: {
        AND: [
            { status: ORDER_STATUSES.DELIVERED },
            { paymentPercentage: 100 },
            { pendingAmount: 0 }
        ]
    },
    ALL_ORDERS: {
        OR: [
            { status: ORDER_STATUSES.REJECTED },
            {
                AND: [
                    { status: ORDER_STATUSES.DELIVERED },
                    { paymentPercentage: 100 },
                    { pendingAmount: 0 }
                ]
            }
        ]
    }
};

/**
 * Fetches historical (completed or rejected) purchase orders for a given supplier.
 * @param {string} supplierId - The ID of the supplier.
 * @param {object} options - Pagination and search options.
 * @returns {Promise<[number, object[]]>} A tuple with the total count and the list of orders.
 */
const findHistoricalPurchaseOrders = async (
    supplierId,
    { page, limit, orderStatus, search, sortBy, order }
) => {
    const statusFilter =
        statusFiltersForPurchaseOrderHistory[orderStatus] ||
        statusFiltersForPurchaseOrderHistory.ALL_ORDERS;

    const whereClause = {
        supplierId,
        ...statusFilter,
        ...(search && {
            id: { contains: search, mode: "insensitive" }
        })
    };

    const orderBy = {};
    if (sortBy && order) {
        orderBy[sortBy] = order;
    } else {
        // Default sort if none is provided
        orderBy["requestedAt"] = "desc";
    }

    console.log("Supplier Repository --> findHistoricalPurchaseOrders --> ");
    // The data fetching transaction is identical to the active orders one.
    return await prisma.$transaction([
        prisma.purchaseOrder.count({ where: whereClause }),
        prisma.purchaseOrder.findMany({
            where: whereClause,
            skip: (page - 1) * limit,
            take: limit,
            orderBy: orderBy,
            // We select all the same detailed information as before.
            select: {
                id: true,
                totalCost: true,
                pendingAmount: true,
                paymentPercentage: true,
                status: true,
                isAccepted: true,
                expectedDateOfArrival: true,
                requestedAt: true,
                acceptedAt: true,
                deliveredAt: true,
                supplierReviewNotes: true,
                warehouseManagerReviewNotes: true,
                supplier: {
                    select: {
                        nurseryName: true,
                        gstin: true,
                        contactPerson: {
                            // Following the relation from Supplier to User
                            select: {
                                address: true, // Assuming 'address' is a field on the User model
                                phoneNumber: true
                            }
                        }
                    }
                },
                warehouse: {
                    select: {
                        name: true, // Also fetching the warehouse name
                        officeEmail: true,
                        officeAddress: true, // Assuming 'address' is a field on the Warehouse model
                        officePhone: true
                    }
                },
                PurchaseOrderItems: {
                    where: {
                        status: ORDER_STATUSES.APPROVED
                    },
                    select: {
                        id: true,
                        productType: true,
                        unitsRequested: true,
                        unitCostPrice: true,
                        status: true,
                        plant: { select: { name: true } },
                        plantVariant: {
                            select: {
                                size: {
                                    select: {
                                        plantSize: true
                                    }
                                },
                                sku: true,
                                /** mediaUrl:true */
                                color: {
                                    select: {
                                        name: true,
                                        hexCode: true
                                    }
                                },
                                plantVariantImages: {
                                    // This is the relation name
                                    where: { isPrimary: true }, // Filter for the primary image
                                    take: 1, // We only need one
                                    select: { mediaUrl: true } // Select just the URL
                                }
                            }
                        },
                        potCategory: { select: { name: true } },
                        potVariant: {
                            select: {
                                potVariantId: true,
                                potName: true,
                                sku: true,
                                color: { // Color is still a direct relation
                                    select: {
                                        name: true,
                                        hexCode: true
                                    }
                                },
                                images: { // Images are still a direct relation
                                    where: { isPrimary: true },
                                    take: 1,
                                    select: { mediaUrl: true }
                                },
                                // Now, we fetch the physical details through the new nested relations
                                sizeMaterialOption: {
                                    select: {
                                        material: {
                                            select: {
                                                name: true
                                            }
                                        },
                                        sizeProfile: {
                                            select: {
                                                size: true,
                                                height: true,
                                                weight: true,
                                                category: {
                                                    select: {
                                                        name: true
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                payments: {
                    select: {
                        paymentId: true,
                        amount: true,
                        paymentMethod: true,
                        status: true,
                        receiptUrl: true,
                        publicId: true,
                        requestedAt: true,
                        paidAt: true,
                        remarks: true,
                        transactionId: true
                    },
                    orderBy: {
                        // Show the payments in chronological order
                        requestedAt: "asc"
                    }
                }
            }
        })
    ]);
};
/**
 * Fetches a list of all verified suppliers, optionally filtered by name.
 * Selects only the ID and nursery name for efficiency.
 * @param {string} [searchTerm] - Optional search term for the nursery name.
 */
const findAllVerified = async (searchTerm) => {
    const where = {
        isVerified: true, // Crucial business rule: only fetch verified suppliers
        deletedAt: null
    };

    if (searchTerm) {
        where.nurseryName = {
            contains: searchTerm,
            mode: "insensitive"
        };
    }

    return await prisma.supplier.findMany({
        where,
        orderBy: {
            nurseryName: 'asc'
        },
        // Optimize the payload by selecting only the fields needed for the dropdown
        select: {
            supplierId: true,
            nurseryName: true
        }
    });
};

export {
    addMediaToPurchaseOrder,
    checkPurchaseOrderExist, findHistoricalPurchaseOrders, findOrderItemsByIds, findPurchaseOrdersBySupplier, findSupplierByUserId, findSupplierDetailsForEmailByUserId, orderToReview, rejectEntireOrder, updateOrderAfterReview, updateOrderStatus,
    findAllVerified
};

