const { v4: uuidv4 } = require("uuid");
const { PRODUCT_TYPES } = require("../../constants/general.constant");
const ORDER_STATUSES = require("../../constants/orderStatus.constant");

function getRandomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function buildPayments(totalCost, status) {
    const payments = [];
    let remaining = totalCost;

    if (status === "PROCESSING") {
        return payments;
    }

    const paymentCount =
        status === "DELIVERED" ? 1 : Math.floor(Math.random() * 3) + 1;

    for (let i = 0; i < paymentCount; i++) {
        const isLast = i === paymentCount - 1;
        const amount = isLast
            ? remaining
            : parseFloat((Math.random() * (remaining / 2)).toFixed(2));

        let paymentStatus = "PENDING";
        if (status === "DELIVERED") paymentStatus = "PAID";
        else if (Math.random() > 0.5) paymentStatus = "PAID";

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
            requestedAt: new Date(),
            paidAt: paymentStatus === "PAID" ? new Date() : null
        });

        remaining -= amount;
    }

    return payments;
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
        (s) => s !== "ALL_ORDERS"
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
                        plantId: plant.plantId,
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
                        potCategoryId: category.categoryId,
                        potVariantId: variant.potVariantId,
                        unitsRequested: 3 + j,
                        unitCostPrice: 60 + j * 4
                    };
                }
                item.totalCost = item.unitCostPrice * item.unitsRequested;
                item.isAccepted = Math.random() > 0.2;
                item.createdAt = new Date();
                item.updatedAt = new Date();
                items.push(item);
            }

            const totalItemCost = items
                .filter((item) => item.isAccepted)
                .reduce((sum, item) => sum + item.totalCost, 0);
            const totalCost = totalItemCost + deliveryCharge;

            const payments = buildPayments(totalCost, status);

            let acceptedAt = null;
            let deliveredAt = null;
            if (status !== "PROCESSING") {
                acceptedAt = new Date(
                    Date.now() - Math.floor(Math.random() * 5) * 86400000
                );
            }
            if (status === "DELIVERED") {
                deliveredAt = new Date();
            }

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
                isAccepted: status !== "PROCESSING" ? true : false,
                invoiceUrl: null,
                expectedDateOfArrival: new Date(
                    Date.now() + (i + 3) * 86400000
                ),
                requestedAt: new Date(),
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

module.exports = {
    generatePlantPurchaseOrderData,
    generatePotPurchaseOrderData
};
