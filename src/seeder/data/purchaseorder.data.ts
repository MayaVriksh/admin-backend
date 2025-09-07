import { v4 as uuidv4 } from 'uuid';
import { PRODUCT_TYPES } from '../../constants/general.constant';
import * as ORDER_STATUSES from '../../constants/orderStatus.constant';

function getRandomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function buildPayments(totalCost, status, requestedAt) {
    const payments = [];
    let remaining = totalCost;

    if (
        status === ORDER_STATUSES.PROCESSING ||
        status === ORDER_STATUSES.PENDING
    ) {
        return payments;
    }

    const paymentCount =
        status === ORDER_STATUSES.DELIVERED
            ? 1
            : Math.floor(Math.random() * 3) + 1;

    for (let i = 0; i < paymentCount; i++) {
        const isLast = i === paymentCount - 1;
        const amount = isLast
            ? remaining
            : parseFloat((Math.random() * (remaining / 2)).toFixed(2));

        let paymentStatus = "PENDING";
        if (status === ORDER_STATUSES.DELIVERED) paymentStatus = "PAID";
        else if (Math.random() > 0.5) paymentStatus = "PAID";

        // Payment timestamps
        const requestedAtPayment = new Date(
            requestedAt.getTime() + Math.floor(Math.random() * 2) * 86400000
        );
        const paidAt =
            paymentStatus === "PAID"
                ? new Date(
                      requestedAtPayment.getTime() +
                          Math.floor(Math.random() * 3) * 3600000
                  )
                : null;

        payments.push({
            paymentId: uuidv4(),
            paidBy: getRandomElement(["ADMIN", "SYSTEM"]),
            amount,
            status: paymentStatus,
            paymentMethod: getRandomElement(["CASH", "ONLINE", "UPI", "NEFT"]),
            transactionId:
                paymentStatus === "PAID" ? `TXN-${uuidv4().slice(0, 8)}` : null,
            remarks:
                paymentCount === 1
                    ? "Full Payment"
                    : i === 0
                      ? "Initial Payment"
                      : `Installment ${i + 1}`,
            receiptUrl: null,
            requestedAt: requestedAtPayment,
            paidAt
        });

        remaining -= amount;
    }

    return payments;
}

function getRequestedAt() {
    // Order requested 1–15 days ago
    const daysAgo = Math.floor(Math.random() * 15) + 1;
    return new Date(Date.now() - daysAgo * 86400000);
}

function getTimestampsByStatus(status, requestedAt) {
    let acceptedAt = null;
    let deliveredAt = null;

    switch (status) {
        case ORDER_STATUSES.PROCESSING:
        case ORDER_STATUSES.PENDING:
            break;

        case ORDER_STATUSES.SHIPPED:
            acceptedAt = new Date(
                requestedAt.getTime() +
                    (Math.floor(Math.random() * 3) + 1) * 86400000
            );
            break;

        case ORDER_STATUSES.DELIVERED:
            acceptedAt = new Date(
                requestedAt.getTime() +
                    (Math.floor(Math.random() * 3) + 1) * 86400000
            );
            deliveredAt = new Date(
                acceptedAt.getTime() +
                    (Math.floor(Math.random() * 2) + 1) * 86400000
            );
            break;

        case ORDER_STATUSES.REJECTED:
        case ORDER_STATUSES.CANCELLED:
            if (Math.random() > 0.5) {
                acceptedAt = new Date(
                    requestedAt.getTime() +
                        (Math.floor(Math.random() * 2) + 1) * 86400000
                );
            }
            break;
    }

    return { acceptedAt, deliveredAt };
}

function generatePurchaseOrderData(
    productType,
    productList,
    variantList,
    warehouses,
    supplierId,
    ordersPerStatus = 5
) {
    const data = [];
    const statuses = Object.values(ORDER_STATUSES).filter(
        (s) =>
            s !== ORDER_STATUSES.ALL_ORDERS &&
            s !== ORDER_STATUSES.CONFIRMED &&
            s !== ORDER_STATUSES.APPROVED &&
            s !== ORDER_STATUSES.RETURNED &&
            s !== ORDER_STATUSES.UNDER_REVIEW
    );

    for (const status of statuses) {
        for (let n = 0; n < ordersPerStatus; n++) {
            const i = n;
            const warehouse = warehouses[i % warehouses.length];
            const deliveryCharge =
                productType === PRODUCT_TYPES.PLANT
                    ? 100 + i * 20
                    : 120 + i * 15;

            const items = [];
            for (let j = 0; j < 5; j++) {
                let item;
                if (productType === PRODUCT_TYPES.PLANT) {
                    const plant = productList[j % productList.length];
                    const variant = variantList[j % variantList.length];
                    item = {
                        id: uuidv4(),
                        productType: PRODUCT_TYPES.PLANT,
                        plantId: variant.plantId,
                        plantVariantId: variant.variantId,
                        potCategoryId: null,
                        potVariantId: null,
                        unitsRequested: 5 + j,
                        unitCostPrice: 80 + j * 5
                    };
                } else {
                    const category = productList[j % productList.length];
                    const variant = variantList[j % variantList.length];
                    item = {
                        id: uuidv4(),
                        productType: PRODUCT_TYPES.POT,
                        plantId: null,
                        plantVariantId: null,
                        potCategoryId: variant.categoryId,
                        potVariantId: variant.potVariantId,
                        unitsRequested: 3 + j,
                        unitCostPrice: 60 + j * 4
                    };
                }
                item.totalCost = item.unitCostPrice * item.unitsRequested;
                item.status =
                    Math.random() > 0.46
                        ? ORDER_STATUSES.APPROVED
                        : Math.random() > 0.46
                          ? ORDER_STATUSES.CANCELLED
                          : ORDER_STATUSES.REJECTED;
                item.createdAt = new Date();
                item.updatedAt = new Date();
                items.push(item);
            }

            const totalItemCost = items
                .filter((item) => item.status === ORDER_STATUSES.APPROVED)
                .reduce((sum, item) => sum + item.totalCost, 0);
            const totalCost = totalItemCost + deliveryCharge;

            const requestedAt = getRequestedAt();
            const { acceptedAt, deliveredAt } = getTimestampsByStatus(
                status,
                requestedAt
            );

            const payments = buildPayments(totalCost, status, requestedAt);

            data.push({
                warehouseId: warehouse.warehouseId,
                supplierId,
                deliveryCharges: deliveryCharge,
                totalCost,
                pendingAmount:
                    totalCost -
                    payments
                        .filter((p) => p.status === "PAID")
                        .reduce((sum, p) => sum + p.amount, 0),
                paymentPercentage:
                    totalCost === 0
                        ? 0
                        : Math.round(
                              (payments
                                  .filter((p) => p.status === "PAID")
                                  .reduce((sum, p) => sum + p.amount, 0) /
                                  totalCost) *
                                  100
                          ),
                status,
                isAccepted: ![
                    ORDER_STATUSES.PROCESSING,
                    ORDER_STATUSES.PENDING
                ].includes(status),
                invoiceUrl: null,
                expectedDateOfArrival: new Date(
                    requestedAt.getTime() +
                        (Math.floor(Math.random() * 5) + 3) * 86400000
                ),
                requestedAt,
                acceptedAt,
                deliveredAt,
                supplierReviewNotes: null,
                warehouseManagerReviewNotes: null,
                items,
                payments
            });
        }
    }

    return data;
}

function generatePlantPurchaseOrderData(
    plants,
    variants,
    warehouses,
    supplierId,
    ordersPerStatus = 5
) {
    return generatePurchaseOrderData(
        PRODUCT_TYPES.PLANT,
        plants,
        variants,
        warehouses,
        supplierId,
        ordersPerStatus
    );
}

function generatePotPurchaseOrderData(
    potCategories,
    potVariants,
    warehouses,
    supplierId,
    ordersPerStatus = 5
) {
    return generatePurchaseOrderData(
        PRODUCT_TYPES.POT,
        potCategories,
        potVariants,
        warehouses,
        supplierId,
        ordersPerStatus
    );
}

export {
    generatePlantPurchaseOrderData,
    generatePotPurchaseOrderData
};
