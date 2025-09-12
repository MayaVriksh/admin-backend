import { v4 as uuidv4 } from 'uuid';
import { prisma } from '../../config/prisma.config';

/**
 * Seed Plant Warehouse Inventory
 */
async function seedPlantWarehouseInventory() {
    await prisma.plantWarehouseInventory.deleteMany();
    await prisma.potWarehouseInventory.deleteMany();

    const warehouse = await prisma.warehouse.findFirst({
        where: {
            supplier: {
                some: {
                    contactPerson: {
                        is: {
                            email: "restaurant@gmail.com"
                        }
                    }
                }
            }
        }
    });

    if (!warehouse) throw new Error("❌ No warehouses found.");

    const plantVariants = await prisma.plantVariants.findMany();
    if (!plantVariants.length) {
        console.warn("⚠️ No plant variants found.");
        return;
    }

    for (const variant of plantVariants) {
        const existing = await prisma.plantWarehouseInventory.findUnique({
            where: {
                plantId_variantId_warehouseId: {
                    plantId: variant.plantId,
                    variantId: variant.variantId,
                    warehouseId: warehouse.warehouseId
                }
            }
        });

        if (existing) {
            console.log(
                `⚠️ Plant Inventory exists for PlantId '${variant.plantId}', Variant '${variant.variantName}', Warehouse '${warehouse.name}'`
            );
            continue;
        }

        await prisma.plantWarehouseInventory.create({
            data: {
                id: uuidv4(),
                plantId: variant.plantId,
                variantId: variant.variantId,
                warehouseId: warehouse.warehouseId,
                stockIn: 50, // dummy: total added
                stockOut: 20, // dummy: sold/used
                stockLossCount: 5, // dummy: lost/damaged
                latestQuantityAdded: 10, // dummy: last purchase
                currentStock: 25, // dummy: available now
                reservedUnit: 3, // dummy: reserved for orders
                totalCost: 1250.75, // dummy: total purchase cost
                trueCostPrice: 50.03 // dummy: cost per unit
            }
        });
    }

    console.log("✅ Plant warehouse inventory seeded.");
}

/**
 * Seed Pot Warehouse Inventory
 */
async function seedPotWarehouseInventory() {
    const warehouse = await prisma.warehouse.findFirst({
        where: {
            supplier: {
                some: {
                    contactPerson: {
                        is: {
                            email: "restaurant@gmail.com"
                        }
                    }
                }
            }
        }
    });

    if (!warehouse) throw new Error("❌ No warehouses found.");

    const potVariants = await prisma.potVariants.findMany();
    if (!potVariants.length) {
        console.warn("⚠️ No pot variants found.");
        return;
    }

    for (const variant of potVariants) {
        const existing = await prisma.potWarehouseInventory.findUnique({
            where: {
                    potCategoryId_potVariantId_warehouseId: {
                    potCategoryId: variant.categoryId,
                    potVariantId: variant.potVariantId,
                    warehouseId: warehouse.warehouseId
                }
            }
        });

        if (existing) {
            console.log(
                `⚠️ Pot Inventory exists for Variant '${variant.potName}', Warehouse '${warehouse.name}'`
            );
            continue;
        }

        await prisma.potWarehouseInventory.create({
            data: {
                id: uuidv4(),
                potCategoryId: variant.categoryId,
                potVariantId: variant.potVariantId,
                warehouseId: warehouse.warehouseId,
                stockIn: 80, // dummy: total added
                stockOut: 30, // dummy: sold/used
                stockLossCount: 2, // dummy: lost/damaged
                latestQuantityAdded: 15, // dummy: last purchase
                currentStock: 33, // dummy: available now
                reservedUnit: 6, // dummy: reserved for orders
                totalCost: 2200.5, // dummy: total purchase cost
                trueCostPrice: 66.67 // dummy: cost per unit
            }
        });
    }

    console.log("✅ Pot warehouse inventory seeded.");
}

/**
 * Seed both Plant + Pot Warehouse Inventories
 */
async function seedWarehouseInventory() {
    try {
        console.log("📦 Seeding Warehouse Inventories...");
        await seedPlantWarehouseInventory();
        await seedPotWarehouseInventory();
        console.log("🎉 Warehouse inventory seeded successfully!");
    } catch (error) {
        console.error(
            "❌ Error seeding warehouse inventory:",
            error.stack || error
        );
    } finally {
        await prisma.$disconnect();
    }
}

if (require.main === module) {
    seedWarehouseInventory().catch((e) => {
        console.error("❌ Seeding failed:", e.stack || e);
    });
}

export {
    seedPlantWarehouseInventory,
    seedPotWarehouseInventory, seedWarehouseInventory
};

