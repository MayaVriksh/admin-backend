import Joi from "joi";

const ShipRocketValidator = {
    // Validation for fetching products (all or by collection_id)
    fetchProductsValidation: {
        query: Joi.object({
            collection_id: Joi.string()
                .optional()
                .description("Collection ID to filter products"),
            page: Joi.number()
                .integer()
                .min(1)
                .default(1)
                .description("Page number for pagination"),
            limit: Joi.number()
                .integer()
                .min(1)
                .max(100)
                .default(20)
                .description("Number of products to fetch per page")
        })
    },

    // Validation for fetching collections
    fetchCollectionsValidation: {
        query: Joi.object({
            page: Joi.number()
                .integer()
                .min(1)
                .default(1)
                .description("Page number for pagination"),
            limit: Joi.number()
                .integer()
                .min(1)
                .max(100)
                .default(20)
                .description("Number of collections to fetch per page")
        })
    }
};

export default ShipRocketValidator;
