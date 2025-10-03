const Joi = require("joi");

// Validation for fetching plants grouped by a specific tag for the homepage
const getPlantsByTagValidation = {
    query: Joi.object({
        tagName: Joi.string().required().description('The name of the tag to filter plants by (e.g., "New Launch", "Featured").'),
        page: Joi.number().integer().min(1).default(1),
        limit: Joi.number().integer().min(1).max(50).default(8)
    })
};

module.exports = {
    getPlantsByTagValidation,
};