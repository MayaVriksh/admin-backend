import { prisma } from "../../../config/prisma.config";

interface FetchProductsParams {
    collection_id?: string;
    page: number;
    limit: number;
}

interface FetchCollectionsParams {
    page: number;
    limit: number;
}

const ShipRocketRepository = {
    // Fetch products with minimal required fields
    async fetchProducts({ collection_id, page, limit }: FetchProductsParams) {
        const skip = (page - 1) * limit;

        const total = await prisma.plants.count({
            where: {
                isProductActive: true,
                ...(collection_id && {
                    plantCategories: { some: { categoryId: collection_id } }
                })
            }
        });

        const plants = await prisma.plants.findMany({
            where: {
                isProductActive: true,
                ...(collection_id && {
                    plantCategories: { some: { categoryId: collection_id } }
                })
            },
            select: {
                plantId: true,
                name: true,
                description: true,
                plantClass: true,
                isProductActive: true,
                createdAt: true,
                updatedAt: true,
                variants: {
                    where: { isProductActive: true },
                    select: {
                        variantId: true,
                        sku: true,
                        mrp: true,
                        createdAt: true,
                        updatedAt: true,
                        color: { select: { id: true, name: true } },
                        size: { select: { plantSize: true, weight: true } },
                        plantVariantImages: {
                            select: { mediaUrl: true, isPrimary: true }
                        },
                        plantWarehouseInventory: {
                            select: { currentStock: true, trueCostPrice: true }
                        }
                    }
                }
            },
            skip,
            take: limit,
            orderBy: { createdAt: "desc" }
        });

        return { total, plants };
    },

    // Fetch collections with minimal required fields
    async fetchCollections({ page, limit }: FetchCollectionsParams) {
        const skip = (page - 1) * limit;

        const total = await prisma.plantCategory.count();

        const collections = await prisma.plantCategory.findMany({
            select: {
                categoryId: true,
                name: true,
                description: true,
                mediaUrl: true,
                createdAt: true,
                updatedAt: true
            },
            skip,
            take: limit,
            orderBy: { createdAt: "desc" }
        });

        return { total, collections };
    }
};

export default ShipRocketRepository;
