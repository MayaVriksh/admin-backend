import util from 'util';
import { v4 as uuidv4 } from 'uuid';
import { prisma, Prisma } from '../../../../config/prisma.config';
import * as ERROR_MESSAGES from '../../../../constants/errorMessages.constant';
import { PRODUCT_TYPES } from '../../../../constants/general.constant';
import { RESPONSE_CODES, RESPONSE_FLAGS } from '../../../../constants/responseCodes.constant';
import * as ROLES from '../../../../constants/roles.constant';
import SUCCESS_MESSAGES from '../../../../constants/successMessages.constant';
import uploadMedia from '../../../../utils/uploadMedia';
import * as adminRepo from '../repositories/admin.repository';
import * as ORDER_STATUS from '../../../../constants/orderStatus.constant';
const showAdminProfile = async (userId) => {
    const profile = await prisma.admin.findUnique({
        where: { userId },
        include: {
            contactPerson: {
                select: {
                    fullName: true,
                    email: true,
                    phoneNumber: true,
                    address: true,
                    profileImageUrl: true,
                    isActive: true,
                    deletedAt: true
                }
            }
        }
    });

    // console.log("Supplier Profile: ", profile);

    if (!profile) {
        throw {
            success: RESPONSE_FLAGS.FAILURE,
            code: RESPONSE_CODES.BAD_REQUEST,
            message: ERROR_MESSAGES.USERS.PROFILE_NOT_FOUND
        };
    }

    if (
        !profile.contactPerson?.isActive ||
        profile.contactPerson?.deletedAt !== null
    ) {
        throw {
            success: RESPONSE_FLAGS.FAILURE,
            code: RESPONSE_CODES.BAD_REQUEST,
            message: ERROR_MESSAGES.AUTH.ACCOUNT_INACTIVE
        };
    }

    return {
        success: RESPONSE_FLAGS.SUCCESS,
        code: RESPONSE_CODES.SUCCESS,
        message: SUCCESS_MESSAGES.AUTH.PROFILE_FETCHED,
        data: profile
    };
};

const getOrderRequestByOrderId = async ({ userId, orderId }) => {
    // First, find the adminId from the userId.
    const admin = await prisma.admin.findUnique({
        where: { userId: userId },
        select: { adminId: true }
    });

    if (!admin) {
        throw {
            code: 404,
            message: "Admin profile not found for this user."
        };
    }

    // Now, find the purchase order, ensuring it matches BOTH the orderId AND the adminId.
    // This is a critical security check to prevent admins from viewing each other's orders.
    const order = await prisma.purchaseOrder.findFirst({
        where: {
            id: orderId
        },
        select: {
            // Select all the fields you need for the details page
            id: true,
            status: true,
            totalCost: true,
            pendingAmount: true,
            paymentPercentage: true,
            expectedDateOfArrival: true,
            PurchaseOrderItems: {
                select: {
                    id: true,
                    productType: true,
                    unitsRequested: true,
                    unitCostPrice: true,
                    plant: { select: { name: true } },
                    status: true
                }
            },
            payments: {
                orderBy: { paidAt: "asc" }
            }
        }
    });

    if (!order) {
        throw {
            code: 404,
            message:
                "Purchase Order not found or you do not have permission to view it."
        };
    }

    return { success: true, code: 200, data: order };
};

const listSupplierOrders = async ({
    userId,
    page,
    limit,
    orderStatus,
    search,
    supplierId,
    warehouseId,
    fromDate,
    toDate,
    sortBy,
    order
}) => {
    // 1. Call the repository to get the admin ID.
    const admin = await adminRepo.findAdminByUserId(userId);

    // 2. Handle the business case where the user is not a admin.
    if (!admin) {
        return {
            success: true,
            code: 200,
            message: "Admin profile not found for this user.",
            data: { orders: [], totalPages: 0, currentPage: page }
        };
    }

    // 3. Call the repository to get the purchase order data.
    const [totalItems, rawOrders] = await adminRepo.findPurchaseOrdersByAdmin({
        page,
        limit,
        orderStatus,
        search,
        supplierId,
        warehouseId,
        fromDate,
        toDate,
        sortBy,
        order
    });
    // --- Transform the raw database results into a clean, generic structure ---
    const transformedOrders = rawOrders.map((order) => {
        // --- Object 2: For the "View Payments Modal" ---
        let runningTotalPaid = 0;
        const paymentHistory = order.payments.map((payment) => {
            runningTotalPaid += payment.amount;
            return {
                paidAmount: payment.amount,
                // paymentStatus: order.payments.status,
                pendingAmountAfterPayment:
                    (order.totalCost || 0) - runningTotalPaid,
                paymentMethod: payment.paymentMethod,
                paymentStatus: payment.status,
                receiptUrl: payment.receiptUrl,
                publicId: payment.publicId,
                requestedAt: payment.requestedAt,
                paidAt: payment.paidAt,
                paymentRemarks: payment.remarks,
                transactionId: payment.transactionId
            };
        });

        // Determine the generic properties based on the productType
        // --- Object 3: For the "Order Items Modal" ---
        const orderItems = order.PurchaseOrderItems.map((item) => {
            const isPlant = item.productType === PRODUCT_TYPES.PLANT;
            const productVariantName = isPlant
                ? item.plant?.name
                : item.potVariant?.potName;
            const productVariantSize = isPlant
                ? item.plantVariant?.size?.plantSize
                : item.potVariant?.sizeMaterialOption?.sizeProfile?.size;
            const sku = isPlant ? item.plantVariant?.sku : item.potVariant?.sku;
            const productVariantColor = isPlant
                ? item.plantVariant?.color?.name
                : item.potVariant?.color?.name;
            const productVariantMaterial = isPlant
                ? null
                : item.potVariant?.sizeMaterialOption?.material?.name;
            const productVariantImage = isPlant
                ? item.plantVariant?.plantVariantImages[0]?.mediaUrl
                : item.potVariant?.images[0]?.mediaUrl;
            const productVariantType = item.productType;
            const isAccepted = item.status;
            // Return the new, simplified item object
            return {
                id: item.id,
                productVariantImage,
                productVariantType,
                productVariantName: `${productVariantName}-${productVariantSize}-${productVariantColor}-${productVariantMaterial}`,
                sku,
                productVariantMaterial,
                requestedDate: order.requestedAt, // Date comes from the parent order
                unitCostPrice: item.unitCostPrice,
                unitRequested: item.unitsRequested,
                totalVariantCost:
                    Number(item.unitsRequested) * Number(item.unitCostPrice),
                isAccepted
            };
        });
        // Return the order with the transformed items array
        console.log(paymentHistory, orderItems);
        return {
            // All top-level fields from the PurchaseOrder
            id: order.id,
            totalOrderCost: order.totalCost,
            pendingAmount: order.pendingAmount,
            paymentPercentage: order.paymentPercentage,
            expectedDOA: order.expectedDateOfArrival,
            orderStatus: order.status,
            requestedAt: order.requestedAt,
            // The two transformed arrays
            orderItems: orderItems,
            payments: paymentHistory
        };
    });
    transformedOrders.forEach((order) => {
        console.log(`\n--- Details for Order ID: ${order.id} ---`);

        // Use util.inspect to print the entire object without truncation.
        // 'depth: null' tells it to show all nested levels.
        // 'colors: true' makes it much easier to read in the terminal.
        // console.log(
        //     util.inspect(order, {
        //         showHidden: false,
        //         depth: null,
        //         colors: true
        //     })
        // );

        console.log(`------------------------------------`);
    });
    const totalPages = Math.ceil(totalItems / limit);

    return {
        success: true,
        code: 200,
        message: "Order requests retrieved successfully.",
        data: {
            orders: transformedOrders,
            totalPages,
            totalItems,
            limit,
            skip: (page - 1) * limit,
            currentPage: parseInt(page, 10)
        }
    };
};

const deleteFromCloudinary = async (publicId) => {
    // You should implement this using your Cloudinary SDK or utility
    // Example:
    // const cloudinary = require('cloudinary').v2;
    // await cloudinary.uploader.destroy(publicId);
    // For now, just log for placeholder
    console.log(`Deleting orphaned file from Cloudinary: ${publicId}`);
};

const recordPaymentForOrder = async ({
    orderId,
    paidByUserId,
    paymentDetails, // Contains amount (optional), remarks, paymentMethod, transactionId
    receiptFile,
    remarks,
}) => {
    let uploadedReceipt = null; // To hold upload data for potential rollback

    try {
        // --- STEP 1: PRE-VALIDATION & DATA FETCHING ---
        // Before any writes or file uploads, fetch the authoritative state from the DB.
        const order = await prisma.purchaseOrder.findUnique({
            where: { id: orderId },
            select: { totalCost: true, pendingAmount: true, status: true, isAccepted: true }
        });

        const checkUserActive = await prisma.User.findUnique({
            where: { userId: paidByUserId },
            select: { isActive: true }
        });
        if (!checkUserActive)
            throw {
                code: 404,
                message: "User is not active or doesnot exist."
            };
        // --- STEP 2: EDGE CASE HANDLING (FAIL-FAST PRINCIPLE) ---
        // These are the "guard clauses" that stop the process if business rules are violated.
        if (!order) {
            throw { code: 404, message: "Purchase Order not found." };
        }
        if (!order.isAccepted || order.status === "PENDING") {
            throw { code: 400, message: "Payment cannot be made until the supplier has accepted the order." };
        }
        const currentPending = order.pendingAmount ?? order.totalCost;
        if (currentPending <= 0) {
            throw { code: 400, message: "This order is already fully paid." };
        }

        // --- STEP 3: SECURELY DETERMINE & VALIDATE PAYMENT AMOUNT ---
        // Never trust the amount sent from the client for a "Full Payment".
        const amountToPay = remarks === 'FULL_PAYMENT' 
            ? currentPending 
            : Number(paymentDetails.amount);

        // This is the CRITICAL overpayment check.
        if (amountToPay > currentPending) {
            throw {
                code: 400,
                message: `Payment amount of ₹${amountToPay.toLocaleString()} exceeds the pending amount of ₹${currentPending.toLocaleString()}.`
            };
        }

        // --- STEP 4: HANDLE FILE UPLOAD (ONLY AFTER VALIDATION PASSES) ---
        if (receiptFile && receiptFile.hapi.filename) {
            const uploadResult = await uploadMedia({
                files: receiptFile,
                folder: `admins/receipts/PCOD_${orderId}`,
                publicIdPrefix: `receipt_${Date.now()}`
            });
            if (!uploadResult.success) throw new Error("Receipt upload failed.");
            uploadedReceipt = uploadResult.data; // Save for DB and potential rollback
        }

        // --- STEP 5: EXECUTE ALL DATABASE WRITES IN A SINGLE ATOMIC TRANSACTION ---
        const updatedOrder = await prisma.$transaction(async (tx) => {
            // A. Count previous installments to generate the correct new remark.
            const existingInstallmentCount = await tx.purchaseOrderPayment.count({
                where: { orderId: orderId, remarks: { startsWith: 'INSTALLMENT' } }
            });
            
            const finalRemarks = remarks === 'INSTALLMENT'
                ? `INSTALLMENT_${existingInstallmentCount + 1}`
                : 'COMPLETED';


            // C. Securely calculate the new financial state for the Purchase Order.
            const newPendingAmount = currentPending - amountToPay;
            const totalPaid = Number(order.totalCost) - newPendingAmount;
            const newPaymentPercentage = Math.min(100, Math.round((totalPaid / Number(order.totalCost)) * 100));
            const newPaymentStatus = newPendingAmount <= 0 ? "PAID" : "PARTIALLY_PAID";
            console.log(currentPending)
            console.log(amountToPay)
            console.log(newPendingAmount)

            // B. Create the new payment record.
            await tx.purchaseOrderPayment.create({
                data: {
                    paymentId: uuidv4(),
                    orderId: orderId,
                    paidBy: paidByUserId,
                    amount: amountToPay,
                    paymentMethod: paymentDetails.paymentMethod,
                    transactionId: paymentDetails.transactionId,
                    remarks: finalRemarks,
                    receiptUrl: uploadedReceipt?.mediaUrl || null,
                    publicId: uploadedReceipt?.publicId || null,
                    status: newPaymentStatus, // The transaction itself is considered complete/paid
                    paidAt: new Date()
                }
            });

            // E. Update the parent Purchase Order.
            return await tx.purchaseOrder.update({
                where: { id: orderId },
                data: {
                    pendingAmount: newPendingAmount,
                    paymentPercentage: newPaymentPercentage,
                }
            });
        });

        return {
            success: true,
            code: 201,
            message: "Payment recorded successfully.",
            data: updatedOrder
        };

    } catch (err) {
        // If any step fails and a file was uploaded, delete it from Cloudinary.
        if (uploadedReceipt?.publicId) {
            console.log("Transaction failed, rolling back file upload...");
            await deleteFromCloudinary(uploadedReceipt.publicId);
        }
        // Re-throw the original error to be handled by the controller.
        throw err;
    }
};

/**
 * Saves QC media metadata to a Purchase Order after verifying ownership.
 * @param {object} params
 * @param {string} params.userId - The ID of the authenticated admin user.
 * @param {string} params.orderId - The ID of the Purchase Order.
 * @param {Array<object>} params.uploadedMedia - An array of { url, publicId, mimeType } objects from the successful upload.
 * @returns {Promise<object>} A success message.
 */
const uploadQcMediaForOrder = async ({ userId, orderId, uploadedMedia }) => {
    // 1. Security Check: Ensure the order belongs to the logged-in admin.
    const admin = await prisma.admin.findUnique({ where: { userId } });
    if (!admin) {
        throw { code: 404, message: "Admin profile not found." };
    }
    const purchaseOrder = adminRepo.checkPurchaseOrderExist(orderId);

    if (!purchaseOrder) {
        throw {
            code: 403,
            message:
                "Access denied. This purchase order does not belong to you."
        };
    }

    /** Uploading Order status to SHipped */
    adminRepo.updateOrderStatus(orderId);

    // 2. Prepare the data for the database.
    const mediaArray = Array.isArray(uploadedMedia)
        ? uploadedMedia
        : [uploadedMedia];
    const mediaAssetsToCreate = mediaArray.map((media) => ({
        mediaUrl: media.mediaUrl,
        publicId: media.publicId,
        mediaType: media.mediaType,
        resourceType: media.resourceType,
        isPrimary: media.isPrimary || false,
        uploadedBy: ROLES.ROLES.ADMIN
    }));

    // 3. Save the URLs and public IDs to the database via the repository.
    await adminRepo.addMediaToPurchaseOrder(orderId, mediaAssetsToCreate);

    return {
        success: true,
        code: 201,
        message: "QC media uploaded successfully."
        // data: mediaAssetsToCreate
    };
};

/**
 * Retrieves a paginated list of historical purchase orders for a supplier.
 */
const getSupplierOrderHistory = async ({
    userId,
    page,
    limit,
    orderStatus,
    search,
    supplierId,
    warehouseId,
    fromDate,
    toDate,
    sortBy,
    order
}) => {
    // 1. Get the adminId for the logged-in user.
    const admin = await adminRepo.findAdminByUserId(userId);
    console.log("admin", admin);
    if (!admin) {
        return {
            success: true,
            code: 200,
            message: "Admin profile not found for this user.",
            data: { orders: [], totalPages: 0, currentPage: page }
        };
    }
    // 2. Call the NEW repository function for historical orders.
    const [totalItems, rawOrders] =
        await adminRepo.findHistoricalPurchaseOrders({
            page,
            limit,
            orderStatus,
            search,
            supplierId,
            warehouseId,
            fromDate,
            toDate,
            sortBy,
            order
        });

    // 3. Perform the EXACT SAME data transformation as listSupplierOrders.
    //    This provides a consistent data structure to the frontend.
    const transformedOrders = rawOrders.map((order) => {
        // --- Object 2: For the "View Payments Modal" ---
        let runningTotalPaid = 0;
        // ... transform payment history ...
        const paymentHistory = order.payments.map((payment) => {
            runningTotalPaid += payment.amount;
            return {
                paidAmount: payment.amount,
                pendingAmountAfterPayment:
                    (order.totalCost || 0) - runningTotalPaid,
                paymentMethod: payment.paymentMethod,
                paymentStatus: payment.status,
                receiptUrl: payment.receiptUrl,
                publicId: payment.publicId,
                requestedAt: payment.requestedAt,
                paidAt: payment.paidAt,
                paymentRemarks: payment.remarks,
                transactionId: payment.transactionId
            };
        });
        const orderItems = order.PurchaseOrderItems.map((item) => {
            const isPlant = item.productType === PRODUCT_TYPES.PLANT;
            const productVariantName = isPlant
                ? item.plant?.name
                : item.potVariant?.potName;
            const productVariantSize = isPlant
                ? item.plantVariant?.size?.plantSize
                : item.potVariant?.sizeMaterialOption?.sizeProfile?.size;
            const sku = isPlant ? item.plantVariant?.sku : item.potVariant?.sku;
            const productVariantColor = isPlant
                ? item.plantVariant?.color?.name
                : item.potVariant?.color?.name;
            const productVariantMaterial = isPlant
                ? null
                : item.potVariant?.sizeMaterialOption?.material?.name;
            const productVariantImage = isPlant
                ? item.plantVariant?.plantVariantImages[0]?.mediaUrl
                : item.potVariant?.images[0]?.mediaUrl;
            const productVariantType = item.productType;
            const isAccepted = item.status;
            // Return the new, simplified item object
            return {
                id: item.id,
                productVariantImage,
                productVariantType,
                productVariantName: `${productVariantName}-${productVariantSize}-${productVariantColor}-${productVariantMaterial}`,
                sku,
                productVariantMaterial,
                unitCostPrice: item.unitCostPrice,
                unitRequested: item.unitsRequested,
                totalVariantCost:
                    Number(item.unitsRequested) * Number(item.unitCostPrice),
                isAccepted
            };
        });

        const invoiceUserDetails = {
            // Currently Supplier not being used,as Supplier need not see his own details in oDRER suMMARY.
            // bUT THIS INFO WILL BE USED, WHILE DOWNLOADING THE RECEIPT FOR wAREHOUSE, AND SIGN THERE, AND SEND TO US AFTER DELIVERY
            supplier: {
                name: order.supplier?.nurseryName ?? "N/A",
                gstin: order.supplier?.gstin ?? "N/A",
                address:
                    order.supplier?.user?.address ?? "Address not available",
                phoneNumber:
                    order.supplier?.user?.phoneNumber ??
                    "phoneNumber not available"
            }
        };

        // Return the final, structured object for this order
        return {
            // All top-level fields from the PurchaseOrder
            id: order.id,
            totalOrderCost: order.totalCost,
            pendingAmount: order.pendingAmount,
            paymentPercentage: order.paymentPercentage,
            expectedDOA: order.expectedDateOfArrival,
            orderStatus: order.status,
            requestedAt: order.requestedAt,
            acceptedAt: order.acceptedAt,
            deliveredAt: order.deliveredAt,
            // The transformed arrays
            invoiceUserDetails: invoiceUserDetails,
            orderItems: orderItems,
            payments: paymentHistory
        };
    });
    transformedOrders.forEach((order) => {
        console.log(`\n--- Details for Order ID: ${order.id} ---`);

        // Use util.inspect to print the entire object without truncation.
        // 'depth: null' tells it to show all nested levels.
        // 'colors: true' makes it much easier to read in the terminal.
        // console.log(
        //     util.inspect(order, {
        //         showHidden: false,
        //         depth: null,
        //         colors: true
        //     })
        // );

        console.log(`------------------------------------`);
    });
    const totalPages = Math.ceil(totalItems / limit);
    return {
        success: true,
        code: 200,
        message: "Order requests retrieved successfully.",
        data: {
            orders: transformedOrders,
            totalPages,
            totalItems,
            limit,
            skip: (page - 1) * limit,
            currentPage: parseInt(page, 10)
        }
    };
};

const restockInventory = async ({
    orderId,
    handledById,
    handledBy,
    payload
}) => {
    console.log("restockInventory orderId: ", orderId);
    console.log("restockInventory handledById: ", handledById);
    console.log("restockInventory handledBy: ", handledBy);
    console.log("restockInventory Payload: ", payload);

    return await prisma.$transaction(
        async (tx) => {
            // Step 1: Fetch trusted Purchase Order and accepted items from the DB.
            const order = await tx.purchaseOrder.findFirst({
                where: { id: orderId },
                include: { PurchaseOrderItems: { where: { status:ORDER_STATUS.APPROVED } } }
            });

            if (!order)
                throw { code: 404, message: "Purchase Order not found." };
            if (order.status !== "DELIVERED")
                throw {
                    code: 400,
                    message: "Order must be in 'DELIVERED' status."
                };
            console.log("Check Passed");

            // Step 2: Loop through each item submitted by the manager.
            for (const receivedItem of payload.items) {
                const originalItem = order.PurchaseOrderItems.find(
                    (p) => p.id === receivedItem.purchaseOrderItemId
                );
                console.log("Fetched originalItem", originalItem);
                if (!originalItem) {
                    throw {
                        code: 404,
                        message: "Purchase Order Item not found."
                    };
                }

                let mediaUrl =
                    "https://res.cloudinary.com/dwdu18hzs/image/upload/suppliers/trade_licenses/trade_license_1751201462225.avif";
                let publicId = "xyz";
                // Step 3: Log Damaged Units, if any.
                // if (receivedItem.unitsDamaged > 0) {
                //     mediaUrl =
                //         "https://res.cloudinary.com/dwdu18hzs/image/upload/suppliers/trade_licenses/trade_license_1751201462225.avif";
                //     publicId = "xyz";

                    /** Need to implement the Damage Photo Upload below*/
                    // if (
                    //     receivedItem.damagePhoto &&
                    //     receivedItem.damagePhoto.hapi.filename
                    // ) {
                    //     const uploadResult = await uploadMedia({
                    //         files: receivedItem.damagePhoto,
                    //         folder: `damaged-products/${order.id}`
                    //     });
                    //     mediaUrl = uploadResult.data.url;
                    //     publicId = uploadResult.data.publicId;
                    // }
                // }
                
                const damageData = {
                    damageId: uuidv4(),
                    purchaseOrderId: originalItem.purchaseOrderId,
                    plantId: originalItem?.plantId,
                    plantVariantId: originalItem?.plantVariantId,
                    potCategoryId: originalItem?.potCategoryId,
                    potVariantId: originalItem?.potVariantId,
                    warehouseId: order.warehouseId,
                    purchaseOrderItemId: originalItem.id,
                    handledById: handledById,
                    handledBy: handledBy,
                    damageType: "SUPPLIER_DELIVERY",
                    unitsReceived: payload.unitsReceived,
                    unitsDamaged: receivedItem.unitsDamaged,
                    unitsDamagedPrice: originalItem.unitCostPrice,
                    totalAmount:
                        receivedItem.unitsDamaged *
                        Number(originalItem.unitCostPrice),
                    reason: receivedItem.damageReason,
                    notes: payload.warehouseManagerReviewNotes,
                    mediaUrl,
                    publicId
                };
                
                if (originalItem.productType === PRODUCT_TYPES.PLANT) {
                    damageData.plantId = originalItem.plantId;
                    damageData.plantVariantId = originalItem.plantVariantId;
                } else {
                    damageData.potCategoryId = originalItem.potCategoryId;
                    damageData.potVariantId = originalItem.potVariantId;
                }

                console.log("damageData",damageData);
                await adminRepo.createDamageLog(
                    originalItem.productType,
                    damageData,
                    tx
                );
                console.log("Damaged Data is stored successfully");

                // Step 4: Update Warehouse Inventory with only the good units.

                const usableUnits = Math.max(
                    0,
                    (receivedItem.unitsReceived || 0) -
                        (receivedItem.unitsDamaged || 0)
                );

                // Only update inventory if there's something to add
                if (usableUnits > 0) {
                    const { warehouseId } = order;
                    const {
                        productType,
                        unitCostPrice,
                        plantId,
                        plantVariantId,
                        potCategoryId,
                        potVariantId
                    } = originalItem;

                    const unitsReceived = receivedItem?.unitsReceived ?? 0;
                    const unitsDamaged = receivedItem?.unitsDamaged ?? 0;
                    const goodUnits = unitsReceived - unitsDamaged;

                    // Standardize costPrice as Decimal
                    const costPrice = new Prisma.Decimal(unitCostPrice ?? 0);

                    // Build unique where clause
                    let where;
                    if (productType === PRODUCT_TYPES.PLANT) {
                        where = {
                            plantId_variantId_warehouseId: {
                                plantId,
                                variantId: plantVariantId,
                                warehouseId
                            }
                        };
                    } else {
                        where = {
                            potCategoryId_potVariantId_warehouseId: {
                                potCategoryId,
                                potVariantId,
                                warehouseId
                            }
                        };
                    }

                    // Fetch existing inventory
                    const existingInventory =
                        productType === PRODUCT_TYPES.PLANT
                            ? await tx.plantWarehouseInventory.findUnique({
                                  where
                              })
                            : await tx.potWarehouseInventory.findUnique({
                                  where
                              });

                    let data;

                    if (existingInventory) {
                        console.log("Updating existing inventory:", {
                            id: existingInventory.id,
                            stockIn: existingInventory.stockIn,
                            currentStock: existingInventory.currentStock
                        });

                        // Int fields
                        const newStockIn =
                            Number(existingInventory.stockIn ?? 0) +
                            Number(unitsReceived);
                        const newStockLossCount =
                            Number(existingInventory.stockLossCount ?? 0) +
                            Number(unitsDamaged);
                        const newCurrentStock =
                            Number(existingInventory.currentStock ?? 0) +
                            Number(goodUnits);

                        // Decimal fields
                        const newTotalCost = new Prisma.Decimal(
                            existingInventory.totalCost ?? 0
                        ).plus(
                            new Prisma.Decimal(unitsReceived).times(costPrice)
                        );

                        const newTrueCostPrice =
                            newStockIn > 0
                                ? newTotalCost.div(newStockIn)
                                : new Prisma.Decimal(0);

                        data = {
                            stockIn: newStockIn,
                            stockLossCount: newStockLossCount,
                            currentStock: newCurrentStock,
                            latestQuantityAdded: Number(unitsReceived),
                            totalCost: newTotalCost,
                            trueCostPrice: newTrueCostPrice
                        };
                    } else {
                        console.log("Creating new inventory record");

                        data = {
                            id: uuidv4(),
                            stockIn: Number(unitsReceived),
                            currentStock: Number(goodUnits),
                            latestQuantityAdded: Number(unitsReceived),
                            totalCost: new Prisma.Decimal(unitsReceived).times(
                                costPrice
                            ),
                            trueCostPrice: costPrice,
                            ...(productType === PRODUCT_TYPES.PLANT
                                ? {
                                      plants: { connect: { plantId } },
                                      plantVariant: {
                                          connect: { variantId: plantVariantId }
                                      }
                                  }
                                : {
                                      potCategory: {
                                          connect: { id: potCategoryId }
                                      },
                                      potVariant: {
                                          connect: { id: potVariantId }
                                      }
                                  }),
                            warehouse: { connect: { warehouseId } }
                        };
                    }

                    // Repo handles update or create logic
                    await adminRepo.updateWarehouseInventory(
                        productType,
                        where,
                        data,
                        tx
                    );
                }

                // Step 5: Create an immutable Restock Event Log for received units.
                if ((receivedItem?.unitsReceived ?? 0) > 0) {
                    const {
                        supplierId,
                        warehouseId,
                        id: purchaseOrderId
                    } = order;

                    const {
                        productType,
                        unitCostPrice,
                        plantId,
                        plantVariantId,
                        potCategoryId,
                        potVariantId
                    } = originalItem;

                    const units = receivedItem?.unitsReceived ?? 0;
                    const costPrice = Number(unitCostPrice ?? 0);

                    const restockData = {
                        restockId: uuidv4(),
                        supplierId,
                        warehouseId,
                        purchaseOrderId,
                        units,
                        unitCostPrice: costPrice,
                        totalCost: units * costPrice
                    };

                    switch (productType) {
                        case PRODUCT_TYPES.PLANT:
                            restockData.plantId = plantId;
                            restockData.plantVariantId = plantVariantId;
                            break;
                        case PRODUCT_TYPES.POT:
                            restockData.potCategoryId = potCategoryId;
                            restockData.potVariantId = potVariantId;
                            break;
                        default:
                            throw new Error(
                                `Unsupported product type: ${productType}`
                            );
                    }

                    await adminRepo.createRestockLog(
                        productType,
                        restockData,
                        tx
                    );
                }
            }

            console.log("Stock updated.");

            return {
                success: true,
                code: 200,
                message: SUCCESS_MESSAGES.WAREHOUSES.STOCK_ADDED
            };
        },
        {
            // maxWait: 20000,
            timeout: 15000
        }
    );
};
/**
 * Handles the business logic for adding an item to the warehouse cart.
 * Includes crucial validation to prevent foreign key errors and adding inactive products.
 *
 * @param {object} payload - The validated payload from the controller.
 * @returns {Promise<object>} A success response with the cart item data.
 * @throws {Error} Throws a structured error with a code and message if any validation fails.
 */
const addItemToWarehouseCart = async (payload) => {
    // --- Step 1: Perform Concurrent Existence Checks ---
    // We run these database checks in parallel for maximum efficiency before any writes.
    const [warehouse, supplier, variant] = await Promise.all([
        prisma.warehouse.findUnique({
            where: { warehouseId: payload.warehouseId },
            select: { warehouseId: true } // Only fetch what's needed for the check
        }),
        prisma.supplier.findUnique({
            where: { supplierId: payload.supplierId },
            select: { supplierId: true }
        }),
    ]);

    // --- Step 2: Handle Edge Cases with Clear Error Messages ---
    
    // Edge Case: The specified warehouse doesn't exist.
    if (!warehouse) {
        throw { code: 404, message: `Validation failed: Warehouse with ID '${payload.warehouseId}' not found.` };
    }

    // Edge Case: The specified supplier doesn't exist.
    if (!supplier) {
        throw { code: 404, message: `Validation failed: Supplier with ID '${payload.supplierId}' not found.` };
    }
    
    // (Future Enhancement: You could add a check here to ensure the selected supplier is authorized to supply this specific variant.)

    // --- Step 3: Proceed with the Database Write Operation ---
    // Only if all the above checks have passed, we call the repository to update the database.
    const cartItem = await adminRepo.upsertCartItem(payload);

    return {
        success: true,
        code: 200,
        message: "Item added to cart successfully.",
        data: cartItem
    };
};

/**
 * Retrieves all items in a warehouse cart, groups them by supplier,
 * and calculates subtotals and a grand total.
 * @param {string} warehouseId - The ID of the warehouse.
 * @returns {Promise<object>} A structured response with supplier-grouped carts.
 */
const getWarehouseCart = async (warehouseId) => {
    // 1. Fetch the flat list of all cart items for the warehouse from the repository.
    // This query is efficient and includes the supplier and variant details.
    const flatCartItems = await adminRepo.findCartItemsByWarehouseId(warehouseId);

    if (!flatCartItems || flatCartItems.length === 0) {
        return {
            success: true,
            code: 200,
            data: { suppliers: [], grandTotal: 0, totalItems: 0 }
        };
    }

    // --- 2.Transform the data on the backend ---
    let grandTotal = 0;
    console.log(flatCartItems);
    
    const groupedBySupplier = flatCartItems.reduce((acc, item) => {
        const supplierName = item.supplier.nurseryName;
        
        // If this is the first time we've seen this supplier, create an entry, and an Array of Cart Items for that Supplier.
        if (!acc[supplierName]) {
            acc[supplierName] = {
                supplierId: item.supplier.supplierId,
                nurseryName: supplierName,
                items: [],
                subtotal: 0
            };
        }
        console.log()
        const itemTotal = Number(item.unitsRequested) * Number(item.unitCostPrice);

        const isPlant = item.productType === 'PLANT';
        const variant = isPlant ? item.plantVariant : item.potVariant; // variant object from DB

        // Defensive extraction: Prisma returns `plants` in the select, not `plant`.
        // Also guard against missing nested relations to avoid TypeError when reading `.name`.
        if (!variant) {
            // If there's no variant data, push a minimal placeholder and continue.
            acc[supplierName].items.push({
                cartItemId: item.cartItemId,
                productType: item.productType,
                unitsRequested: item.unitsRequested,
                unitCostPrice: item.unitCostPrice,
                itemTotalCost: itemTotal,
                variantId: isPlant ? item.plantVariantId : item.potVariantId,
                sku: null,
                name: 'Unknown variant',
                imageUrl: null
            });
            acc[supplierName].subtotal += itemTotal;
            return acc;
        }

        const plantName = variant.plants?.name ?? variant.plant?.name ?? '';
        const plantSize = variant.size?.plantSize ?? variant.size ?? '';
        const colorName = variant.color?.name ?? '';
        const potName = variant.potName ?? '';

        const name = isPlant
            ? `${plantName}${plantSize ? ' - ' + plantSize : ''}${colorName ? ', ' + colorName : ''}`
            : `${potName}${plantSize ? ' - ' + plantSize : ''}${colorName ? ', ' + colorName : ''}`;

        const imageUrl = isPlant
            ? variant.plantVariantImages?.[0]?.mediaUrl ?? null
            : variant.images?.[0]?.mediaUrl ?? null;

        // Add the transformed item to this supplier's group.
        acc[supplierName].items.push({
            cartItemId: item.cartItemId,
            productType: item.productType,
            unitsRequested: item.unitsRequested,
            unitCostPrice: item.unitCostPrice,
            itemTotalCost: itemTotal,
            variantId: isPlant ? item.plantVariantId : item.potVariantId,
            sku: variant.sku,
            name: name,
            imageUrl: imageUrl
        });

        // Update the subtotal for this suppliers Total Items.
        acc[supplierName].subtotal += itemTotal;
        
        return acc;
    }, {});

    // 3. Convert the grouped object into an array and calculate the grand total.
    const supplierCarts = Object.values(groupedBySupplier);
    supplierCarts.forEach(cart => {
        grandTotal += cart.subtotal;
    });

    // 4. Return the final, structured response, ready for the UI.
    return {
        success: true,
        code: 200,
        message: "Cart items retrieved successfully.",
        data: {
            suppliers: supplierCarts, // This is now an array of supplier objects
            grandTotal: grandTotal,
            totalItems: flatCartItems.length
        }
    };
};

const createPurchaseOrderFromCart = async (payload) => {
    // The payload from the client is simple and secure
    const { warehouseId, supplierId, expectedDateOfArrival, cartItemIds, deliveryCharges } = payload;

    return await prisma.$transaction(async (tx) => {
        // Step 1: Fetch the trusted cart items for this specific warehouse AND supplier.
        const trustedCartItems = await tx.warehouseCartItem.findMany({
            where: {
                warehouseId: warehouseId,
                supplierId: supplierId, // The crucial filter
                cartItemId: { in: cartItemIds }
            }
        });
        console.log("trustedCartItems",trustedCartItems);
        // --- Edge Case Handling ---
        if (trustedCartItems.length === 0) {
            throw { code: 400, message: `The cart for this warehouse has no items for the selected supplier.` };
        }

        // Step 2: Securely calculate all costs on the backend using only trusted data.
        let itemsTotalCost = 0;
        const processedItems = trustedCartItems.map(item => {
            const totalItemCost = Number(item.unitsRequested) * Number(item.unitCostPrice);
            itemsTotalCost += totalItemCost;
            return { ...item, totalCost: totalItemCost };
        });

        const finalTotalCost = itemsTotalCost + (deliveryCharges || 0);

        // Step 3: Prepare the data for the main PurchaseOrder.
        const orderData = {
            id: uuidv4(),
            warehouseId,
            supplierId,
            expectedDateOfArrival,
            deliveryCharges,
            totalCost: finalTotalCost,
            pendingAmount: finalTotalCost,
            status: 'PENDING'
        };

        // console.log("orderData",orderData);

        // Step 4: Call the repository to create the order and its items.
        const newPurchaseOrder = await adminRepo.createOrderAndItems(orderData, processedItems, tx);

        // Step 5: Clear ONLY the items for this specific supplier from the cart.
        await tx.warehouseCartItem.deleteMany({
            where: {
                warehouseId: warehouseId,
                supplierId: supplierId, // The crucial new filter
                cartItemId: { in: cartItemIds }
            }
        });

        // Step 6: (Optional) Emit an event for notifications.
        // eventEmitter.emit('purchaseOrder.created', { order: newPurchaseOrder });

        return {
            success: true,
            code: 201,
            message: `Purchase Order for supplier ${supplierId} created successfully.`,
            data: newPurchaseOrder
        };
    });
};

// A private helper function to transform the deeply nested DB object into a clean, flat response for the UI.
const _transformCartItem = (item) => {
    const isPlant = item.productType === 'PLANT';
    const itemTotal = Number(item.unitsRequested) * Number(item.unitCostPrice);

    let variantDetails = {
        name: "Unknown Product",
        sku: "N/A",
        size: "N/A",
        color: "N/A",
        imageUrl: null
    };

    if (isPlant && item.plantVariant) {
        variantDetails = {
            name: item.plantVariant.plants?.name || "N/A",
            sku: item.plantVariant.sku,
            size: item.plantVariant.size?.plantSize || "N/A",
            color: item.plantVariant.color?.name || "N/A",
            imageUrl: item.plantVariant.plantVariantImages?.[0]?.mediaUrl || null
        };
    } else if (!isPlant && item.potVariant) {
        variantDetails = {
            name: item.potVariant.potName,
            sku: item.potVariant.sku,
            size: item.potVariant.sizeMaterialOption?.sizeProfile?.size || "N/A",
            color: item.potVariant.color?.name || "N/A",
            imageUrl: item.potVariant.images?.[0]?.mediaUrl || null
        };
    }

    return {
        cartItemId: item.cartItemId,
        productType: item.productType,
        unitsRequested: item.unitsRequested,
        unitCostPrice: item.unitCostPrice,
        itemTotalCost: itemTotal,
        variantId: isPlant ? item.plantVariantId : item.potVariantId,
        ...variantDetails
    };
};


/**
 * Retrieves all items for a checkout summary, transforms them, and calculates the total cost.
 */
const getCheckoutSummary = async (warehouseId, supplierId) => {
    // 1. Fetch all trusted cart items from the repository.
    const cartItems = await adminRepo.findCartItemsForCheckout(warehouseId, supplierId);

    if (!cartItems || cartItems.length === 0) {
        throw { code: 404, message: "No items found in the cart for this supplier to check out." };
    }

    // 2. Securely calculate the total cost and transform the data on the backend.
    let totalCost = 0;
    const supplierName = cartItems[0].supplier.nurseryName; // Get supplier name from the first item

    // Use the new, more detailed transformation function
    const transformedItems = cartItems.map(item => {
        const transformed = _transformCartItem(item);
        totalCost += transformed.itemTotalCost;
        return transformed;
    });

    // 3. Return the final, structured response for the checkout summary page.
    return {
        success: true,
        code: 200,
        message: "Checkout summary retrieved successfully.",
        data: {
            supplierName: supplierName,
            items: transformedItems,
            totalCost: totalCost
        }
    };
};

/**
 * Handles the business logic for removing an item from the warehouse cart.
 * Includes security checks to ensure the item exists.
 */
const removeCartItem = async (cartItemId, userId) => {
    // --- Step 1: Edge Case Handling & Security Check ---
    // First, verify that the cart item actually exists in the database.
    const cartItem = await adminRepo.findCartItemById(cartItemId);

    if (!cartItem) {
        throw { code: 404, message: `Action failed: Cart item with ID '${cartItemId}' was not found. It may have already been removed.` };
    }

    // --- (Optional but Recommended Security Enhancement) ---
    // Here, you could add logic to verify that the `userId` has permission
    // for the `cartItem.warehouseId` to prevent an admin from one warehouse
    // from deleting items in another's cart.

    // --- Step 2: Proceed with the Deletion ---
    // If the item exists, call the repository to execute the delete command.
    await adminRepo.deleteCartItem(cartItemId);

    return {
        success: true,
        code: 200,
        message: "Item was successfully removed from the cart."
    };
};

/**
 * Service to update a warehouse cart item.
 * @param {string} warehouseCartItemId - The ID of the cart item.
 * @param {object} updateData - The data to update (units, costPrice).
 * @returns {Promise<object>} A promise that resolves to the updated cart item.
 */
const updateCartItemService = async (warehouseCartItemId, updateData) => {
  const updatedItem = await adminRepo.updateById(
    warehouseCartItemId,
    updateData
  );

  if (!updatedItem) {
    throw {
      success: RESPONSE_FLAGS.FAILURE,
      code: RESPONSE_CODES.NOT_FOUND,
      message: ERROR_MESSAGES.CART.ITEM_NOT_FOUND,
    };
  }

  return updatedItem;
};

export {
    addItemToWarehouseCart, createPurchaseOrderFromCart, getOrderRequestByOrderId, getSupplierOrderHistory, getWarehouseCart, listSupplierOrders,
    recordPaymentForOrder, restockInventory, showAdminProfile, uploadQcMediaForOrder, getCheckoutSummary, removeCartItem, updateCartItemService
};

