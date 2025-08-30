const { prisma } = require("../../config/prisma.config");
const {
    generatePlantPurchaseOrderData,
    generatePotPurchaseOrderData
} = require("../data/purchaseorder.data");
const generateCustomId = require("../../utils/generateCustomId");

async function seedPurchaseOrders() {
    console.log("📦 Seeding Purchase Orders...");

    const plants = await prisma.plants.findMany();
    const plantVariants = await prisma.plantVariants.findMany();
    const potCategories = await prisma.potCategory.findMany();
    const potVariants = await prisma.potVariants.findMany();
    const warehouses = await prisma.warehouse.findMany();
    const supplier = await prisma.supplier.findFirst({
        where: { contactPerson: { email: "restaurant@gmail.com" } }
    });
    if (!supplier) throw new Error("❌ Supplier not found.");
    const { supplierId } = supplier;

    // await prisma.purchaseOrderPayment.deleteMany();
    // await prisma.purchaseOrderItems.deleteMany();
    // await prisma.purchaseOrder.deleteMany();

    if (
        !plants.length ||
        !plantVariants.length ||
        !potCategories.length ||
        !potVariants.length ||
        !warehouses.length
    ) {
        throw new Error("❌ Required data missing in DB.");
    }

    const plantOrders = generatePlantPurchaseOrderData(
        plants,
        plantVariants,
        warehouses,
        supplierId
    );
    const potOrders = generatePotPurchaseOrderData(
        potCategories,
        potVariants,
        warehouses,
        supplierId
    );

    const allOrders = [...plantOrders, ...potOrders];

    for (const order of allOrders) {
        try {
            await prisma.$transaction(
                async (tx) => {
                    const purchaseOrderId = await generateCustomId(
                        tx,
                        "PURCHASE_ORDER"
                    );

                    // Save purchase order
                    await tx.purchaseOrder.create({
                        data: {
                            id: purchaseOrderId,
                            warehouseId: order.warehouseId,
                            supplierId: order.supplierId,
                            deliveryCharges: order.deliveryCharges,
                            totalCost: order.totalCost,
                            pendingAmount: order.pendingAmount ?? null,
                            paymentPercentage: order.paymentPercentage,
                            status: order.status,
                            isAccepted: order.isAccepted,
                            invoiceUrl: order.invoiceUrl,
                            expectedDateOfArrival: order.expectedDateOfArrival,
                            requestedAt: order.requestedAt,
                            acceptedAt: order.acceptedAt,
                            deliveredAt: order.deliveredAt,
                            supplierReviewNotes: order.supplierReviewNotes,
                            warehouseManagerReviewNotes:
                                order.warehouseManagerReviewNotes
                        }
                    });

                    // Save items
                    if (order.items?.length) {
                        await tx.purchaseOrderItems.createMany({
                            data: order.items.map((item) => ({
                                ...item,
                                purchaseOrderId
                            })),
                            skipDuplicates: true
                        });
                    }

                    // Save payments
                    if (order.payments?.length) {
                        for (const payment of order.payments) {
                            const paymentId = await generateCustomId(
                                tx,
                                "PURCHASE_ORDER_PAYMENT"
                            );
                            await tx.purchaseOrderPayment.create({
                                data: {
                                    paymentId,
                                    orderId: purchaseOrderId,
                                    paidBy: payment.paidBy,
                                    amount: payment.amount,
                                    status: payment.status,
                                    paymentMethod: payment.paymentMethod,
                                    transactionId: payment.transactionId,
                                    remarks: payment.remarks,
                                    publicId:
                                        "suppliers/trade_licenses/trade_license_1751201462225",
                                    receiptUrl:
                                        "https://res.cloudinary.com/dwdu18hzs/image/upload/suppliers/trade_licenses/trade_license_1751201462225.avif",
                                    resourceType: "img",
                                    requestedAt: payment.requestedAt,
                                    paidAt: payment.paidAt
                                }
                            });
                        }
                    }

                    console.log(
                        `✅ Seeded Purchase Order ${purchaseOrderId} (${order.status})`
                    );
                },
                { timeout: 15000 }
            );
        } catch (err) {
            console.error(`❌ Error seeding purchase order:`, err.message);
        }
    }

    console.log("✅ All purchase orders seeded.");
}

if (require.main === module) {
    seedPurchaseOrders()
        .catch((err) => console.error("❌ Purchase Order Seeding failed:", err))
        .finally(() => prisma.$disconnect());
}

module.exports = seedPurchaseOrders;
