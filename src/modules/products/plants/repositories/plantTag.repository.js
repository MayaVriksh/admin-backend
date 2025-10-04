const { prisma } = require('../../../../config/prisma.config');

/**
 * Fetches a paginated list of SPECIFIC PLANT VARIANTS that are
 * associated with a given tag name.
 *
 * This is a variant-centric query, designed to return individual variants
 * (e.g., "Small, Green Peace Lily") that have a specific tag.
 */
const findPlantsByTagName = async ({ tagName, page, limit }) => {
    const where = {
        isProductActive: true,
        deletedAt: null,
        // The core logic is now simpler: find variants that have
        // 'some' tag with the specified name.
        tags: {
            some: {
                tagName: {
                    equals: tagName,
                    mode: 'insensitive'
                }
            }
        }
    };

    const skip = (page - 1) * limit;

    const [variants, total] = await prisma.$transaction([
        prisma.plantVariants.findMany({
            where,
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
            // This select clause is now on the PlantVariants model
            select: {
                variantId: true,
                sku: true,
                mrp: true,
                // Include details from related models
                color: {
                    select: {
                        name: true
                    }
                },
                size: {
                    select: {
                        // Assuming your PlantSizeProfile has these fields
                        height: true,
                        weight: true,
                        plantSize: true // e.g., "Small", "Medium"
                    }
                },
                plantVariantImages: {
                    where: { isPrimary: true },
                    take: 1,
                    select: { mediaUrl: true }
                },
                // Include the parent plant's name
                plants: {
                    select: {
                        plantId: true,
                        name: true
                    }
                },
                Review: {
                    select: {
                        rating: true // Fetches an array of all ratings for the variant
                    }
                },
                _count: {
                    select: {
                        Review: true // Counts the total number of reviews for the variant
                    }
                }
            }
        }),
        // The count is also now on the PlantVariants model
        prisma.plantVariants.count({ where })
    ]);

    // NOTE: The service layer will now receive an array of VARIANTS, not plants.
    // It will need to be adjusted to handle this richer data.
    // e.g., renaming the returned object property from 'plants' to 'variants'
    return { plants: variants, total };
};

module.exports = {
    findPlantsByTagName,
};

