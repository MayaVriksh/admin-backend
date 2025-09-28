const Joi = require("joi");

// Validation: Get all plants
const getAllPlantsValidation = {
    query: Joi.object({
        page: Joi.number()
            .integer()
            .min(1)
            .default(1)
            .label("Page Number")
            .description("Page number for pagination (starts from 1)"),

        limit: Joi.number()
            .integer()
            .min(1)
            .max(100)
            .default(10)
            .label("Page Limit")
            .description("Number of records per page"),

        skip: Joi.number()
            .integer()
            .min(0)
            .optional()
            .label("Skip Count")
            .description("Number of records to skip (alternative to page)"),

        plantCategory: Joi.string()
            .trim()
            .min(2)
            .max(50)
            .optional()
            .label("Plant Category")
            .description("Filter plants by category name")
    })
};

// Validation: Get all plant variants
const getAllPlantVariantsValidation = {
    query: Joi.object({
        page: Joi.number()
            .integer()
            .min(1)
            .default(1)
            .label("Page Number")
            .description("Page number for pagination (starts from 1)"),

        limit: Joi.number()
            .integer()
            .min(1)
            .max(100)
            .default(10)
            .label("Page Limit")
            .description("Number of records per page"),

        skip: Joi.number()
            .integer()
            .min(0)
            .optional()
            .label("Skip Count")
            .description("Number of records to skip (alternative to page)"),

        size: Joi.array().items(
            Joi.string().valid("EXTRA_SMALL", "SMALL", "MEDIUM", "LARGE", "EXTRA_LARGE")
        ).optional().description("Filter by one or more sizes."),

        // --- MODIFIED: Validates an array of strings ---
        color: Joi.array().items(Joi.string()).optional()
            .description("Filter by one or more color names."),

        minPrice: Joi.number()
            .min(0)
            .optional()
            .label("Minimum Price")
            .description(
                "Filter variants with selling price greater than or equal to this value"
            ),

        maxPrice: Joi.number()
            .min(0)
            .optional()
            .label("Maximum Price")
            .description(
                "Filter variants with selling price less than or equal to this value"
            ),

        plantCategory: Joi.string()
            .trim()
            .min(2)
            .max(50)
            .optional()
            .label("Plant Category")
            .description("Filter variants by plant category name")
    })
};

// Validation: Get plant by ID
const getPlantByIdValidation = {
    params: Joi.object({
        id: Joi.string()
            .required()
            .label("Plant ID")
            .description("Unique identifier of the plant")
    })
};

// Validation: Search plant or variant by name
const getPlantByNameValidation = {
    params: Joi.object({
        search: Joi.string()
            .trim()
            .min(2)
            .max(50)
            .required()
            .label("Plant or Variant Name")
            .description("Name of the plant or variant to fetch")
    }),
    query: getAllPlantsValidation.query
};

module.exports = {
    getAllPlantsValidation,
    getAllPlantVariantsValidation,
    getPlantByIdValidation,
    getPlantByNameValidation
};
