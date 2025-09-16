import Joi from "joi";

export const listWarehouseInventoryValidation = {
    params: Joi.object({
        warehouseId: Joi.string().required().description("The ID of the warehouse to fetch inventory for.")
    }),
    query: Joi.object({
        page: Joi.number().integer().min(1).default(1),
        limit: Joi.number().integer().min(1).max(100).default(10),
        search: Joi.string().allow('').optional().description("Search by SKU or variant name."),
        plantId: Joi.string().allow('').optional().description("Filter by a specific Plant ID."),
        size: Joi.string().valid('SMALL', 'MEDIUM', 'LARGE').allow('').optional().description("Filter by size (e.g., 'Small', 'Medium')."),
        colorId: Joi.string().allow('').optional().description("Filter by a specific Color ID."),
        stockLevel: Joi.string().valid('low', 'medium', 'high').allow('').optional().description("Filter by stock level.")
    })
};