import { v4 as uuidv4 } from 'uuid';
import { prisma } from '../../config/prisma.config';

async function seedPlantWarehouseInventory() {
    const warehouses = await prisma.warehouse.findMany();
    const plants = await prisma.plants.findMany();
    const plantVariants = await prisma.plantVariants.findMany();

    if (!warehouses.length) throw new Error("❌ No warehouses found.");
    if (!plants.length) {
        console.warn("⚠️ No plants found.");
        return;
    }
    if (!plantVariants.length) {
        console.warn("⚠️ No plant variants found.");
        return;
    }

    for (const warehouse of warehouses) {
        const tasks = plantVariants.map(async (variant) => {
            const plant = plants.find((p) => p.plantId === variant.plantId);
            if (!plant) return;

            const existing = await prisma.plantWarehouseInventory.findUnique({
                where: {
                    plantId_variantId_warehouseId: {
                        plantId: plant.plantId,
                        variantId: variant.variantId,
                        warehouseId: warehouse.warehouseId
                    }
                }
            });

            if (existing) {
                console.log(
                    `⚠️ Plant Inventory exists for Plant '${plant.name}', Variant '${variant.variantName}', Warehouse '${warehouse.name}'`
                );
                return;
            }

            await prisma.plantWarehouseInventory.create({
                data: {
                    id: uuidv4(),
                    plantId: plant.plantId,
                    variantId: variant.variantId,
                    warehouseId: warehouse.warehouseId,
                    stockIn: 0,
                    stockOut: 0,
                    stockLossCount: 0,
                    latestQuantityAdded: 0,
                    currentStock: 0,
                    reservedUnit: 0,
                    totalCost: 0.0,
                    trueCostPrice: 0.0
                }
            });
        });

        await Promise.all(tasks);
    }

    console.log("✅ Plant warehouse inventory seeded.");
}

async function seedPotWarehouseInventory() {
    const warehouses = await prisma.warehouse.findMany();
    const potCategories = await prisma.potCategory.findMany();
    const potVariants = await prisma.potVariants.findMany();

    if (!warehouses.length) throw new Error("❌ No warehouses found.");
    if (!potCategories.length) {
        console.warn("⚠️ No pot categories found.");
        return;
    }
    if (!potVariants.length) {
        console.warn("⚠️ No pot variants found.");
        return;
    }

    for (const warehouse of warehouses) {
        const tasks = potVariants.map(async (variant) => {
            const category = potCategories.find(
                (c) => c.categoryId === variant.categoryId
            );
            if (!category) return;

            const existing = await prisma.potWarehouseInventory.findUnique({
                where: {
                    potCategoryId_potVariantId_warehouseId: {
                        potCategoryId: category.categoryId,
                        potVariantId: variant.potVariantId,
                        warehouseId: warehouse.warehouseId
                    }
                }
            });

            if (existing) {
                console.log(
                    `⚠️ Pot Inventory exists for Category '${category.name}', Variant '${variant.potName}', Warehouse '${warehouse.name}'`
                );
                return;
            }

            await prisma.potWarehouseInventory.create({
                data: {
                    id: uuidv4(),
                    potCategoryId: category.categoryId,
                    potVariantId: variant.potVariantId,
                    warehouseId: warehouse.warehouseId,
                    stockIn: 0,
                    stockOut: 0,
                    stockLossCount: 0,
                    latestQuantityAdded: 0,
                    currentStock: 0,
                    reservedUnit: 0,
                    totalCost: 0.0,
                    trueCostPrice: 0.0
                }
            });
        });

        await Promise.all(tasks);
    }

    console.log("✅ Pot warehouse inventory seeded.");
}

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

