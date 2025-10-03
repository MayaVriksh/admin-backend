const { prisma } = require('../../../../config/prisma.config');

// A reusable, optimized select clause for fetching only the data needed for a product card
const _baseSelectForCard = {
    plantId: true,
    name: true,
    // Fetch the lowest MRP among all variants to display as the starting price "₹..."
    variants: {
        orderBy: { mrp: 'asc' },
        take: 1,
        select: { mrp: true }
    },
    // Fetch the primary image of the first variant for the card's display image
    plantSizeProfile: {
        select: {
            PlantVariants: {
                select: {
                    plantVariantImages: {
                        where: { isPrimary: true },
                        take: 1,
                        select: { mediaUrl: true }
                    }
                }
            }
        }
    }
};


/**
 * Fetches a paginated list of plants that have at least one variant
 * associated with a specific tag name.
 */
const findPlantsByTagName = async ({ tagName, page, limit }) => {
    const where = {
        deletedAt: null,
        isProductActive: true,
        // This is the core logic: find plants that have 'some' variant
        // that is linked to 'some' tag with the specified name.
        variants: {
            some: {
                tags: {
                    some: {
                        tagName: {
                            equals: tagName,
                            mode: 'insensitive'
                        }
                    }
                }
            }
        }
    };

    const skip = (page - 1) * limit;

    const [plants, total] = await prisma.$transaction([
        prisma.plants.findMany({
            where,
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
            select: _baseSelectForCard
        }),
        prisma.plants.count({ where })
    ]);

    return { plants, total };
};

module.exports = {
    findPlantsByTagName,
};
