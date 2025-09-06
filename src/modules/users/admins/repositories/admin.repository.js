const { prisma } = require("../../../../config/prisma.config.js");
const { v4: uuidv4 } = require("uuid");
const ORDER_STATUSES = require("../../../../constants/orderStatus.constant.js");
const { PRODUCT_TYPES } = require("../../../../constants/general.constant.js");

/**
 * Finds a admin's ID based on their user ID.
 * @param {string} userId - The user's unique ID.
 * @returns {Promise<object|null>} The admin object with their ID, or null if not found.
 */
const findAdminByUserId = async (userId) => {
    return await prisma.admin.findUnique({
        where: { userId: userId },
        select: { adminId: true }
    });
};

/**
 * Fetches a paginated list of purchase orders for a given admin.
 * @param {string} adminId - The ID of the admin.
 * @param {object} options - An object containing pagination and filtering options.
 * @returns {Promise<[number, object[]]>} A tuple containing the total count and the list of orders.
 */

const findPurchaseOrdersByAdmin = async ({
    page,
    limit,
    orderStatus,
    supplierId,
    warehouseId,
    fromDate,
    toDate,
    sortBy,
    order
}) => {
    console.log(
        "findPurchaseOrdersByAdmin:",
        page,
        limit,
        orderStatus,
        supplierId,
        warehouseId,
        fromDate,
        toDate,
        order
    );

    const whereClause = {
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
        ...(warehouseId && { warehouseId }),
        ...(supplierId && { supplierId }),
        ...(fromDate &&
            toDate && {
                requestedAt: {
                    gte: new Date(fromDate),
                    lte: new Date(toDate)
                }
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
                                potName: true,
                                size: true,
                                sku: true,
                                // --- ADDED: Include the nested material name for pots ---
                                material: {
                                    select: { name: true }
                                },
                                color: {
                                    select: {
                                        name: true,
                                        hexCode: true
                                    }
                                },
                                images: {
                                    // This is the relation name for pot variant images
                                    where: { isPrimary: true },
                                    take: 1,
                                    select: { mediaUrl: true }
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

const statusFiltersForActivePurchaseOrders = {
    PENDING: { status: ORDER_STATUSES.PENDING },
    PROCESSING: { status: ORDER_STATUSES.PROCESSING },
    SHIPPED: { status: ORDER_STATUSES.SHIPPED },
    DELIVERED: { status: ORDER_STATUSES.DELIVERED },
    ALL_ORDERS: {}
};

/**
 * Creates a payment record and updates the parent Purchase Order's financial status.
 * @param {object} params
 * @param {object} params.tx - The Prisma transaction client.
 * @param {string} params.orderId - The ID of the parent order.
 * @param {object} params.paymentData - Data for the new payment record.
 * @param {object} params.newTotals - Calculated totals { newTotalPaid, newRemainingAmount, newPaymentPercentage, newPaymentStatus }.
 */
const createPaymentAndUpdateOrder = async ({
    tx,
    orderId,
    paymentData,
    newTotals
}) => {
    // Step 1: Create the new payment record.
    await tx.purchaseOrderPayment.create({
        data: {
            paymentId: uuidv4(),
            orderId: orderId,
            ...paymentData
        }
    });

    // Step 2: Update the parent Purchase Order with the new aggregate status.
    return await tx.purchaseOrder.update({
        where: { id: orderId },
        data: {
            totalPaid: newTotals.newTotalPaid,
            remainingAmount: newTotals.newRemainingAmount,
            paymentPercentage: newTotals.newPaymentPercentage,
            paymentStatus: newTotals.newPaymentStatus
        }
    });
};

const checkPurchaseOrderExist = async (orderId) => {
    return await prisma.purchaseOrder.findFirst({
        where: { id: orderId }
    });
};

const updateOrderStatus = async (orderId) => {
    return await prisma.purchaseOrder.update({
        where: { id: orderId },
        data: {
            status: ORDER_STATUSES.DELIVERED
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
    console.log(purchaseOrderId);
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

    console.log(dataToCreate);
    // Use createMany for an efficient bulk-insert into the database.
    return await prisma.purchaseOrderMedia.createMany({
        data: dataToCreate
    });
};

/**
 * Creates a log entry for a plant restock event.
 * @param {object} logData - The data for the log entry.
 * @param {object} tx - The Prisma transaction client.
 */
const createPlantRestockLog = async (logData, tx) => {
    return await tx.plantRestockEventLog.create({ data: logData });
};

/**
 * Fetches historical (completed or rejected) purchase orders for a given admin.
 * @param {string} adminId - The ID of the admin.
 * @param {object} options - Pagination and search options.
 * @returns {Promise<[number, object[]]>} A tuple with the total count and the list of orders.
 */

const findHistoricalPurchaseOrders = async ({
    page,
    limit,
    orderStatus,
    supplierId,
    warehouseId,
    fromDate,
    toDate,
    sortBy,
    order
}) => {
    const statusFilter =
        statusFiltersForPurchaseOrderHistory[orderStatus] ||
        statusFiltersForPurchaseOrderHistory.ALL_ORDERS;

    const whereClause = {
        ...statusFilter,
        ...(supplierId && { supplierId }),
        ...(warehouseId && { warehouseId }),
        ...(fromDate &&
            toDate && {
                requestedAt: {
                    gte: new Date(fromDate),
                    lte: new Date(toDate)
                }
            })
    };

    const orderBy = {};
    if (sortBy && order) {
        orderBy[sortBy] = order;
    } else {
        orderBy["requestedAt"] = "desc";
    }

    console.log("Admin Repository --> findHistoricalPurchaseOrders --> ");

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
                                address: true,
                                phoneNumber: true
                            }
                        }
                    }
                },
                warehouse: {
                    select: {
                        name: true,
                        officeEmail: true,
                        officeAddress: true,
                        officePhone: true
                    }
                },
                PurchaseOrderItems: {
                    where: { status: ORDER_STATUSES.APPROVED },
                    select: {
                        id: true,
                        productType: true,
                        unitsRequested: true,
                        unitCostPrice: true,
                        status: true,
                        plant: { select: { name: true } },
                        plantVariant: {
                            select: {
                                size: { select: { plantSize: true } },
                                sku: true,
                                color: {
                                    select: { name: true, hexCode: true }
                                },
                                plantVariantImages: {
                                    where: { isPrimary: true },
                                    take: 1,
                                    select: { mediaUrl: true }
                                }
                            }
                        },
                        potCategory: { select: { name: true } },
                        potVariant: {
                            select: {
                                potName: true,
                                size: true,
                                sku: true,
                                material: { select: { name: true } },
                                color: {
                                    select: { name: true, hexCode: true }
                                },
                                images: {
                                    where: { isPrimary: true },
                                    take: 1,
                                    select: { mediaUrl: true }
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

// Universal function to create a damage log
const createDamageLog = async (productType, data, tx) => {
    const model =
        productType === PRODUCT_TYPES.PLANT
            ? tx.plantDamagedProduct
            : tx.potDamagedProduct;

    // Build the base createData
    const createData = {
        damageId: data.damageId,
        unitsDamaged: data.unitsDamaged,
        unitsDamagedPrice: data.unitsDamagedPrice,
        totalAmount: data.totalAmount,
        reason: data.reason,
        notes: data.notes,
        handledById: data.handledById,
        handledBy: data.handledBy,
        damageType: data.damageType,
        mediaUrl: data.mediaUrl,
        publicId: data.publicId,

        // Always connect warehouse & orders
        warehouse: {
            connect: { warehouseId: data.warehouseId }
        },
        purchaseOrder: {
            connect: { id: data.purchaseOrderId }
        },
        purchaseOrderItem: {
            connect: { id: data.purchaseOrderItemId }
        }
    };

    // Add plant-specific relations
    if (productType === PRODUCT_TYPES.PLANT) {
        Object.assign(createData, {
            plants: {
                connect: { plantId: data.plantId }
            },
            plantVariant: {
                connect: { variantId: data.plantVariantId }
            }
        });
    } else {
        // Add pot-specific relations
        Object.assign(createData, {
            potCategory: {
                connect: { categoryId: data.potCategoryId }
            },
            potVariant: {
                connect: { potVariantId: data.potVariantId }
            }
        });
    }

    return await model.create({
        data: createData
    });
};

// Universal function to create a restock log
const createRestockLog = async (productType, data, tx) => {
    const model =
        productType === PRODUCT_TYPES.PLANT
            ? tx.plantRestockEventLog
            : tx.potRestockEventLog;
    return await model.create({ data });
};

// Universal function to update warehouse inventory
const updateWarehouseInventory = async (productType, where, data, tx) => {
    console.log("Admin repository payload:", { where, data });

    const model =
        productType === PRODUCT_TYPES.PLANT
            ? tx.plantWarehouseInventory
            : tx.potWarehouseInventory;

    return await model.update({ where, data });
};

/**
 * Atomically adds an item to the cart or updates its quantity if it already exists.
 * @param {object} itemData - The fully validated data for the cart item.
 * @returns {Promise<object>} The created or updated cart item.
 */
const upsertCartItem = async (itemData) => {
    const {
        warehouseId,
        supplierId,
        productType,
        plantId,
        plantVariantId,
        potCategoryId,
        potVariantId,
        unitsRequested,
        unitCostPrice
    } = itemData;

    // --- MODIFIED: The whereClause now uses the new 4-part unique key ---
    // Prisma generates this key name by joining the fields from your @@unique constraint.
    const whereClause =
        productType === "PLANT"
            ? {
                  warehouseId_supplierId_plantId_plantVariantId: {
                      warehouseId,
                      supplierId,
                      plantId,
                      plantVariantId
                  }
              }
            : {
                  warehouseId_supplierId_potCategoryId_potVariantId: {
                      warehouseId,
                      supplierId,
                      potCategoryId,
                      potVariantId
                  }
              };

    // ---: The createData object now includes the supplierId ---
    const createData = {
        cartItemId: uuidv4(),
        warehouseId,
        supplierId,
        productType,
        unitsRequested,
        unitCostPrice,
        plantId: productType === "PLANT" ? plantId : null,
        plantVariantId: productType === "PLANT" ? plantVariantId : null,
        potCategoryId: productType === "POT" ? potCategoryId : null,
        potVariantId: productType === "POT" ? potVariantId : null
    };

    return await prisma.warehouseCartItem.upsert({
        where: whereClause,
        update: {
            unitsRequested: { increment: unitsRequested },
            unitCostPrice: unitCostPrice,
            updatedAt: new Date()
        },
        create: createData
    });
};

/**
 * Fetches all cart items for a specific warehouse, including related
 * supplier and product variant details needed for display and calculations.
 * @param {string} warehouseId - The ID of the warehouse.
 * @returns {Promise<Array<object>>} A flat list of cart items.
 */
const findCartItemsByWarehouseId = async (warehouseId) => {
    return await prisma.warehouseCartItem.findMany({
        where: {
            warehouseId: warehouseId
        },
        select: {
            cartItemId: true,
            productType: true,
            unitsRequested: true,
            unitCostPrice: true,
            plantId: true,
            plantVariantId: true,
            potCategoryId: true,
            potVariantId: true,
            supplier: {
                select: {
                    supplierId: true,
                    nurseryName: true
                }
            },
            plantVariant: {
                select: {
                    sku: true,
                    plants: { select: { name: true } },
                    size: { select: { plantSize: true } },
                    color: { select: { name: true } },
                    plantVariantImages: {
                        where: { isPrimary: true },
                        select: { mediaUrl: true }
                    }
                }
            },
            potVariant: {
                select: {
                    sku: true,
                    potName: true,
                    size: true,
                    color: { select: { name: true } },
                    images: {
                        where: { isPrimary: true },
                        select: { mediaUrl: true }
                    }
                }
            }
        }
    });
};

/**
 * Creates a PurchaseOrder and its associated PurchaseOrderItems within a transaction.
 * @param {object} orderData - The prepared data for the PurchaseOrder.
 * @param {Array<object>} itemsData - The prepared data for the PurchaseOrderItems.
 * @param {object} tx - The Prisma transaction client.
 * @returns {Promise<object>} The newly created PurchaseOrder.
 */
const createOrderAndItems = async (orderData, itemsData, tx) => {
    // Step 1: Create the parent PurchaseOrder record.
    const purchaseOrder = await tx.purchaseOrder.create({
        data: orderData
    });

    // Step 2: Prepare all PurchaseOrderItems, linking them to the new purchaseOrderId.
    const itemsToCreate = itemsData.map((item) => ({
        id: uuidv4(),
        purchaseOrderId: purchaseOrder.id,
        productType: item.productType,
        plantId: item.plantId,
        plantVariantId: item.plantVariantId,
        potCategoryId: item.potCategoryId,
        potVariantId: item.potVariantId,
        unitsRequested: item.unitsRequested,
        unitCostPrice: item.unitCostPrice,
        totalCost: item.totalCost
    }));

    // Step 3: Create all item records in a single, efficient batch operation.
    await tx.purchaseOrderItems.createMany({
        data: itemsToCreate
    });

    return purchaseOrder;
};

module.exports = {
    findAdminByUserId,
    findPurchaseOrdersByAdmin,
    createPaymentAndUpdateOrder,
    checkPurchaseOrderExist,
    updateOrderStatus,
    addMediaToPurchaseOrder,
    createPlantRestockLog,
    findHistoricalPurchaseOrders,
    createDamageLog,
    createRestockLog,
    updateWarehouseInventory,
    upsertCartItem,
    findCartItemsByWarehouseId,
    createOrderAndItems
};
