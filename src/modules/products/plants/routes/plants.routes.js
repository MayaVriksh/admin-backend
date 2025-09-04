const {
    handleValidationFailure
} = require("../../../../utils/failActionValidation");
const PlantValidator = require("../validations/plants.validation");
const PlantController = require("../controllers/plants.controller");

module.exports = [
    // Plant: Get all plants
    {
        method: "GET",
        path: "/plants",
        options: {
            tags: ["api", "Plant"],
            description: "Get all plants for the home page 🌿",
            notes: "Fetch a paginated list of plants with optional category filter and skip parameter. The response includes plant name, tags, available sizes, colors, rating, reviews, MRP, and selling price.",
            handler: PlantController.getAllPlants,
            validate: {
                ...PlantValidator.getAllPlantsValidation,
                failAction: handleValidationFailure
            },
            plugins: {
                "hapi-swagger": {
                    responses: {
                        200: {
                            description: "🌸 Plants retrieved successfully"
                        },
                        400: {
                            description: "❌ Invalid request parameters"
                        },
                        500: {
                            description: "💥 Server error while fetching plants"
                        }
                    }
                }
            }
        }
    },

    // Plant: Get all plants' variants
    {
        method: "GET",
        path: "/plant-variants",
        options: {
            tags: ["api", "Plant"],
            description: "Get all plant variants 🌱",
            notes: "Fetch a paginated list of plant variants with optional filters (e.g., size, color, price range, stock). Each variant includes variantId, plantId, size, color, stock, MRP, and selling price.",
            handler: PlantController.getAllPlantVariants,
            validate: {
                ...PlantValidator.getAllPlantVariantsValidation,
                failAction: handleValidationFailure
            },
            plugins: {
                "hapi-swagger": {
                    responses: {
                        200: {
                            description:
                                "🌸 Plant variants retrieved successfully"
                        },
                        400: {
                            description: "❌ Invalid request parameters"
                        },
                        500: {
                            description:
                                "💥 Server error while fetching plant variants"
                        }
                    }
                }
            }
        }
    },

    // Plant: Get plant by ID
    {
        method: "GET",
        path: "/plants/{id}",
        options: {
            tags: ["api", "Plant"],
            description: "Get plant by ID 🎯",
            notes: "Fetch details of a plant using its unique identifier.",
            handler: PlantController.getPlantById,
            validate: {
                ...PlantValidator.getPlantByIdValidation,
                failAction: handleValidationFailure
            },
            plugins: {
                "hapi-swagger": {
                    responses: {
                        200: { description: "🌼 Plant retrieved successfully" },
                        404: { description: "❌ Plant not found" }
                    }
                }
            }
        }
    },

    // Plant: Search by name
    {
        method: "GET",
        path: "/plants/search/{search}",
        options: {
            tags: ["api", "Plant"],
            description: "Search plant or variant 🔍",
            notes: "Search for plants or variants by name, with pagination support.",
            handler: PlantController.getPlantByName,
            validate: {
                ...PlantValidator.getPlantByNameValidation,
                failAction: handleValidationFailure
            },
            plugins: {
                "hapi-swagger": {
                    responses: {
                        200: { description: "🌱 Plant(s) found successfully" },
                        404: {
                            description: "❌ No matching plant or variant found"
                        }
                    }
                }
            }
        }
    }
];
