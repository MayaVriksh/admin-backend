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
    getPlantByIdValidation,
    getPlantByNameValidation
};
