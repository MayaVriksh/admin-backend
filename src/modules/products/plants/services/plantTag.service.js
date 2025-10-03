const { findPlantsByTagName } = require("../repositories/plantTag.repository.js");

// A private helper to transform the DB data into a clean product card object
const _transformPlantForCard = (plant) => {
    // Safely extract the lowest price and the primary image from the nested structure
    const lowestMrp = plant.variants[0]?.mrp || 0;
    const primaryImage = plant.plantSizeProfile[0]?.PlantVariants[0]?.plantVariantImages[0]?.mediaUrl || null;

    return {
        plantId: plant.plantId,
        name: plant.name,
        startingPrice: Number(lowestMrp),
        imageUrl: primaryImage,
        // Add other necessary card data like rating if available
        rating: 4.5, 
        reviewCount: Math.floor(Math.random() * 100) + 20 // Dummy data
    };
};

/**
 * Retrieves a paginated list of plants filtered by a tag.
 */
const findPlantsByTag = async (filters) => {
    const { tagName, page, limit } = filters;

    const { plants, total } = await findPlantsByTagName({ tagName, page, limit });

    if (!plants || plants.length === 0) {
        return {
            success: true,
            code: 200,
            message: `No plants found for tag '${tagName}'.`,
            data: { plants: [], pagination: {} }
        };
    }

    const transformedPlants = plants.map(_transformPlantForCard);
    const totalPages = Math.ceil(total / limit);

    return {
        success: true,
        code: 200,
        message: `Plants for tag '${tagName}' retrieved successfully.`,
        data: {
            plants: transformedPlants,
            pagination: {
                totalItems: total,
                totalPages,
                currentPage: page,
                itemsPerPage: limit
            }
        }
    };
};

module.exports = {
    findPlantsByTag,
};