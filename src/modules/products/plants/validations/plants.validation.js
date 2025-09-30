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
            .description("Page number for pagination (starts from 1)")
            .messages({
                "number.base": "Page number must be a number",
                "number.min": "Page number must be at least 1"
            }),

        limit: Joi.number()
            .integer()
            .min(1)
            .max(100)
            .default(10)
            .label("Page Limit")
            .description("Number of records per page")
            .messages({
                "number.base": "Limit must be a number",
                "number.min": "Limit must be at least 1",
                "number.max": "Limit cannot exceed 100"
            }),

        skip: Joi.number()
            .integer()
            .min(0)
            .optional()
            .label("Skip Count")
            .description("Number of records to skip (alternative to page)")
            .messages({
                "number.base": "Skip must be a number",
                "number.min": "Skip cannot be negative"
            }),

        plantCategory: Joi.string()
            .trim()
            .valid(...categoryKeys)
            .optional()
            .label("Plant Category")
            .description("Filter plants by category key")
            .messages({
                "any.only": "Invalid plant category"
            })
    }).oxor("page", "skip")
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
            .items(
                Joi.string()
                    .trim()
                    .valid(...sizeKeys)
                    .label("Plant Size")
                    .description("Valid plant size")
            )
            .single()
            .unique()
            .optional()
            .label("Plant Sizes")
            .description("Filter by one or more plant size keys."),

        color: Joi.array()
            .items(
                Joi.string()
                    .trim()
                    .valid(...colorKeys)
                    .label("Color")
                    .description("Valid color")
            )
            .single()
            .unique()
            .optional()
            .label("Colors")
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
            .trim()
            .valid(...categoryKeys)
            .optional()
            .label("Plant Category")
            .description("Filter variants by plant category key"),

        orderByPrice: Joi.string()
            .trim()
            .valid("asc", "desc")
            .optional()
            .label("Order By Price")
            .description("Sort variants by price (ascending or descending)")
    })
        .custom((obj, helpers) => {
            if (obj.minPrice !== undefined && obj.maxPrice !== undefined) {
                if (obj.maxPrice < obj.minPrice) {
                    return helpers.error("any.invalid", {
                        message:
                            "Maximum price cannot be less than minimum price"
                    });
                }
            }
            return obj;
        }, "Price Validation")
        .oxor("page", "skip")
};

//
// Validation: Get plant by ID
//
const getPlantByIdValidation = {
    params: Joi.object({
        id: Joi.string()
            .trim()
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
