import { prisma } from "../../../config/prisma.config";

class WarehouseInventoryRepository {
    /**
     * Fetches a paginated and filtered list of plant inventory for a specific warehouse.
     */
    static async findAll({ warehouseId, page = 1, limit = 10, search, plantId, size, colorId, stockLevel }) {
        const where = {
            warehouseId: warehouseId,
            deletedAt: null
        };

        // --- Dynamic Filter Construction ---
        if (search) {
            where.OR = [
                { plantVariant: { sku: { contains: search, mode: "insensitive" } } },
                { plants: { name: { contains: search, mode: "insensitive" } } }
            ];
        }
        if (plantId) {
            where.plantId = plantId;
        }
        if (size) {
            where.plantVariant = { ...where.plantVariant, size: { plantSize: size } };
        }
        if (colorId) {
            where.plantVariant = { ...where.plantVariant, colorId: colorId };
        }
        if (stockLevel) {
            if (stockLevel === 'low') where.currentStock = { lte: 10 };
            if (stockLevel === 'medium') where.currentStock = { gt: 10, lt: 100 };
            if (stockLevel === 'high') where.currentStock = { gte: 100 };
        }

        const skip = (page - 1) * limit;

        const [inventoryItems, total] = await prisma.$transaction([
            prisma.plantWarehouseInventory.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    currentStock: true,
                    plants: {
                        select: { name: true }
                    },
                    plantVariant: {
                        select: {
                            sku: true,
                            size: { select: { plantSize: true } },
                            color: { select: { name: true } }
                        }
                    }
                }
            }),
            prisma.plantWarehouseInventory.count({ where })
        ]);

        return { inventoryItems, total };
    }
}

export default WarehouseInventoryRepository;