const PlantRepository = require("../repositories/plants.repository");
const ERROR_MESSAGES = require("../../../../constants/errorMessages.constant");
const {
    RESPONSE_CODES,
    RESPONSE_FLAGS
} = require("../../../../constants/responseCodes.constant");
const getPotData = require("../../../../constants/pots.constants");
const potData = require("../../../../constants/pot.constant");
const { COLORS } = require("../../../../constants/colors.constants");

// Helper function to transform plants for cards
const transformPlantsForCards = (servicePlants) => {
    const sizeOrder = [
        "EXTRA_SMALL",
        "SMALL",
        "MEDIUM",
        "LARGE",
        "EXTRA_LARGE"
    ];

    return servicePlants.map((item) => {
        const plant = item.plants;
        const allMrps = plant.plantSizeProfile.flatMap((size) =>
            size.PlantVariants.map((variant) =>
                variant.mrp
                    ? Number(variant.mrp)
                    : Math.floor(Math.random() * (500 - 200 + 1)) + 200
            )
        );

        const sellingPrice = allMrps.length > 0 ? Math.min(...allMrps) : 0;
        const mrp =
            sellingPrice + (Math.floor(Math.random() * (250 - 100 + 1)) + 100);

        const tags = [
            plant.isFeatured ? { label: "Featured", type: "status" } : null,
            plant.biodiversityBooster
                ? { label: "Biodiversity Booster", type: "feature" }
                : null,
            plant.carbonAbsorber
                ? { label: "Carbon Absorber", type: "feature" }
                : null,
            { label: `Maintenance: ${plant.maintenance}`, type: "maintenance" },
            ...(plant.bestForEmotion || []).map((e) => ({
                label: e,
                type: "emotion"
            })),
            ...(plant.bestGiftFor || []).map((g) => ({
                label: g,
                type: "gift"
            }))
        ].filter(Boolean);

        const availableSizes = plant.plantSizeProfile
            .map((s) => s.plantSize)
            .sort((a, b) => sizeOrder.indexOf(a) - sizeOrder.indexOf(b));

        const colorMap = new Map();
        const imageMap = new Map();

        plant.plantSizeProfile.forEach((size) => {
            size.PlantVariants.forEach((variant) => {
                if (variant.color && !colorMap.has(variant.color.id)) {
                    colorMap.set(variant.color.id, {
                        id: variant.color.id,
                        name: variant.color.name,
                        hexCode: variant.color.hexCode
                    });
                }

                if (variant.plantVariantImages?.length) {
                    variant.plantVariantImages.forEach((img) => {
                        if (!imageMap.has(img.id)) {
                            imageMap.set(img.id, {
                                id: img.id,
                                mediaUrl: img.mediaUrl,
                                mediaType: img.mediaType
                            });
                        }
                    });
                }
            });
        });

        const availableColors = Array.from(colorMap.values());
        const images = Array.from(imageMap.values()).slice(0, 5);

        return {
            id: item.id,
            plantId: plant.plantId,
            name: plant.name,
            sellingPrice,
            mrp,
            currentStock: item.currentStock,
            tags,
            availableSizes,
            availableColors,
            images,
            rating: 4.6,
            totalRatings: 46
        };
    });
};

// Transform plant variants
const transformPlantVariants = (serviceVariants) => {
    return serviceVariants.map((item) => {
        const variant = item.plantVariant;
        const plant = variant.plants;

        // Prices
        const sellingPrice = variant.mrp ? Number(variant.mrp) : 0;
        const mrp =
            sellingPrice + (Math.floor(Math.random() * (250 - 100 + 1)) + 100);

        // Tags
        const tags = [
            plant.isFeatured ? { label: "Featured", type: "status" } : null,
            plant.biodiversityBooster
                ? { label: "Biodiversity Booster", type: "feature" }
                : null,
            plant.carbonAbsorber
                ? { label: "Carbon Absorber", type: "feature" }
                : null,
            { label: `Maintenance: ${plant.maintenance}`, type: "maintenance" },
            ...(plant.bestForEmotion || []).map((e) => ({
                label: e,
                type: "emotion"
            })),
            ...(plant.bestGiftFor || []).map((g) => ({
                label: g,
                type: "gift"
            }))
        ].filter(Boolean);

        // Colors
        const availableColors = variant.color
            ? [
                  {
                      id: variant.color.id,
                      name: variant.color.name,
                      hexCode: variant.color.hexCode
                  }
              ]
            : [];

        // Images
        const images = (variant.plantVariantImages || []).map((img) => ({
            id: img.id,
            mediaUrl: img.mediaUrl,
            mediaType: img.mediaType,
            isPrimary: img.isPrimary
        }));

        return {
            id: item.id,
            plantId: plant.plantId,
            variantId: variant.variantId,
            name: plant.name,
            sku: variant.sku,
            sellingPrice,
            mrp,
            currentStock: item.currentStock,
            tags,
            availableSizes: [variant.size?.plantSize || null].filter(Boolean),
            availableColors,
            images,
            rating: 4.6,
            totalRatings: 46
        };
    });
};

// Shuffle utility
const shuffleArray = (arr) => {
    const newArr = [...arr];
    for (let i = newArr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
};

class PlantService {
    // Get all plants with pagination & filtering
    static async getAllPlants({
        page = 1,
        limit = 10,
        skip,
        sortBy = "createdAt",
        order = "asc",
        plantCategory
    }) {
        // console.log({ page, limit, skip, sortBy, order, plantCategory });

        const offset = skip !== undefined ? skip : (page - 1) * limit;

        const [plants, total] = await Promise.all([
            PlantRepository.findAll({
                offset,
                limit,
                sortBy,
                order,
                plantCategory
            }),
            PlantRepository.countByNameOrVariant({ plantCategory })
        ]);

        // console.log(plants);

        const transformedPlants = transformPlantsForCards(plants);

        return {
            success: RESPONSE_FLAGS.SUCCESS,
            code: RESPONSE_CODES.SUCCESS,
            data: {
                total,
                page,
                limit,
                skip: offset,
                plants: transformedPlants
            }
        };
    }

    // Get all plant variants (with optional orderByPrice)
    static async getAllPlantVariants({
        page = 1,
        limit = 10,
        skip,
        size,
        color,
        minPrice,
        maxPrice,
        plantCategory,
        orderByPrice
    }) {
        const offset = skip !== undefined ? skip : (page - 1) * limit;

        let mappedColors;
        if (Array.isArray(color)) {
            mappedColors = color.map((c) => COLORS[c]).filter(Boolean);
        }

        // Determine sorting
        let sortBy = "createdAt";
        let order = "asc";
        if (orderByPrice) {
            sortBy = "mrp"; // or sellingPrice depending on your DB
            order = orderByPrice;
        }

        const [variants, total] = await Promise.all([
            PlantRepository.findAllVariants({
                offset,
                limit,
                sortBy,
                order,
                size,
                color: mappedColors,
                minPrice,
                maxPrice,
                plantCategory
            }),
            PlantRepository.countAllVariants({
                size,
                color: mappedColors,
                minPrice,
                maxPrice,
                plantCategory
            })
        ]);

        if (!variants || variants.length === 0) {
            throw {
                success: RESPONSE_FLAGS.FAILURE,
                code: RESPONSE_CODES.NOT_FOUND,
                message:
                    ERROR_MESSAGES.PLANTS?.NOT_FOUND ||
                    "No matching plant variants found"
            };
        }

        const transformedVariants = transformPlantVariants(variants);

        // Shuffle after transform
        const shuffledVariants = shuffleArray(transformedVariants);

        return {
            success: RESPONSE_FLAGS.SUCCESS,
            code: RESPONSE_CODES.SUCCESS,
            data: {
                total,
                page,
                limit,
                skip: offset,
                plantVariants: shuffledVariants
            }
        };
    }

    // Get plant by ID
    static async getPlantById(id) {
        // Step 1: Fetch the core plant data from the database via the repository.
        const plantFromDb = await PlantRepository.findById(id);

        // console.log("plantFromDb",plantFromDb);

        if (!plantFromDb) {
            throw {
                success: RESPONSE_FLAGS.FAILURE,
                code: RESPONSE_CODES.NOT_FOUND,
                message: ERROR_MESSAGES.PLANTS?.NOT_FOUND || "Plant not found."
            };
        }

        // Step 2: Augment the database response with the static compatible pots data.
        const allCompatiblePots = potData();

        const sizeOrder = [
            "EXTRA_SMALL",
            "SMALL",
            "MEDIUM",
            "LARGE",
            "EXTRA_LARGE"
        ];

        const potTypeOrder = [
            "General",
            "Basic",
            "Eco Friendly",
            "Standard",
            "Premium",
            "Exclusive"
        ];

        // Map over the size profiles fetched from the DB, find matching potData by size, sort potTypes
        const augmentedSizeProfiles = plantFromDb.plants.plantSizeProfile
            .map((sizeProfile) => {
                const compatiblePotsForSize = allCompatiblePots.find(
                    (p) => p.size === sizeProfile.plantSize
                );

                const compatiblePots = compatiblePotsForSize
                    ? [
                          {
                              size: compatiblePotsForSize.size,
                              potTypes: compatiblePotsForSize.potTypes.sort(
                                  (a, b) =>
                                      potTypeOrder.indexOf(a.potTypeName) -
                                      potTypeOrder.indexOf(b.potTypeName)
                              )
                          }
                      ]
                    : [
                          {
                              size: sizeProfile.plantSize,
                              potTypes: []
                          }
                      ];

                return {
                    ...sizeProfile,
                    compatiblePots
                };
            })
            .sort(
                (a, b) =>
                    sizeOrder.indexOf(a.plantSize) -
                    sizeOrder.indexOf(b.plantSize)
            );

        // Step 3: Construct the final response object with the augmented data.
        const finalPlantData = {
            ...plantFromDb,
            plants: {
                ...plantFromDb.plants,
                plantSizeProfile: augmentedSizeProfiles
            }
        };

        return {
            success: RESPONSE_FLAGS.SUCCESS,
            code: RESPONSE_CODES.SUCCESS,
            data: finalPlantData
        };
    }

    // Search plants or variants by name
    static async getPlantByName({
        search,
        page = 1,
        limit = 10,
        skip,
        sortBy = "createdAt",
        order = "asc",
        plantCategory
    }) {
        const offset = skip !== undefined ? skip : (page - 1) * limit;

        const [plants, total] = await Promise.all([
            PlantRepository.findByNameOrVariant({
                search,
                offset,
                limit,
                sortBy,
                order,
                plantCategory
            }),
            PlantRepository.countByNameOrVariant({ search, plantCategory })
        ]);

        if (!plants || plants.length === 0) {
            throw {
                success: RESPONSE_FLAGS.FAILURE,
                code: RESPONSE_CODES.NOT_FOUND,
                message:
                    ERROR_MESSAGES.PLANTS?.NOT_FOUND ||
                    "No matching plants found"
            };
        }

        return {
            success: RESPONSE_FLAGS.SUCCESS,
            code: RESPONSE_CODES.SUCCESS,
            data: { total, page, limit, skip: offset, plants }
        };
    }

    // Get all compatible pots
    static async getAllCompatiblePots() {
        const potsData = getPotData();
        return {
            success: RESPONSE_FLAGS.SUCCESS,
            code: RESPONSE_CODES.SUCCESS,
            data: potsData
        };
    }
}

module.exports = PlantService;
