const PlantController = require("../controllers/plantTag.controller.js");
const getPlantsByTagValidation = require("../validations/plantTag.validation.js");
const {
    handleValidationFailure
} = require("../../../../utils/failActionValidation");
const { ROLES } = require('../../../../constants/roles.constant');

// This would be part of your public/customer-facing routes
module.exports = [
    {
        method: "GET",
        path: "/plants/PlantByTag",
        options: {
            tags: ["api", "Plants by Tag"],
            description: "Get a paginated list of plants associated with a specific tag.",
            notes: "Used to populate dynamic sections on the homepage like 'New Arrivals' by passing the appropriate tagName (e.g., 'New Launch', 'Featured'). Returns plant-level data for product cards.",
            validate: {
                 ...getPlantsByTagValidation.getPlantsByTagValidation,
                failAction: handleValidationFailure,
            },
            handler: PlantController.getPlantsByTag,
            plugins: {
                "hapi-swagger": {
                    responses: {
                        200: {
                            description: "Plant details with Tags fetched successfully.",
                        },
                        400: {
                            description: "Validation error: Invalid input Plant or Tags data.",
                        },
                        404: {
                            description: "Plant with Tags item not found.",
                        },
                        500: {
                            description: "Internal server error.",
                        },
                    },
                },
            },
        }
    }
];
