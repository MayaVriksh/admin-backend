const Joi = require("joi");
const {
    PLANT_CATEGORIES,
    PLANT_SIZES
} = require("../../../../constants/plants.constants");
const { COLORS } = require("../../../../constants/colors.constants");

// Extract keys from constants for validation
const categoryKeys = Object.keys(PLANT_CATEGORIES);
const sizeKeys = Object.keys(PLANT_SIZES);
const colorKeys = Object.keys(COLORS);

//
// Validation: Get all plants
//
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
            .valid(...categoryKeys)
            .optional()
            .label("Plant Category")
            .description("Filter plants by category key")
    })
};

//
// Validation: Get all plant variants
//
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

        size: Joi.array()
            .items(Joi.string().valid(...sizeKeys))
            .single()
            .optional()
            .description("Filter by one or more plant size keys."),

        color: Joi.array()
            .items(Joi.string().valid(...colorKeys))
            .optional()
            .description("Filter by one or more color keys."),

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
            .valid(...categoryKeys)
            .optional()
            .label("Plant Category")
            .description("Filter variants by plant category key"),

        orderByPrice: Joi.string()
            .valid("asc", "desc")
            .optional()
            .label("Order By Price")
            .description("Sort variants by price (ascending or descending)")
    })
};

//
// Validation: Get plant by ID
//
const getPlantByIdValidation = {
    params: Joi.object({
        id: Joi.string()
            .required()
            .label("Plant ID")
            .description("Unique identifier of the plant")
    })
};

//
// Validation: Search plant or variant by name
//
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
