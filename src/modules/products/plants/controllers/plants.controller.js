const {
    RESPONSE_FLAGS,
    RESPONSE_CODES
} = require("../../../../constants/responseCodes.constant");
const SUCCESS_MESSAGES = require("../../../../constants/successMessages.constant.js");
const PlantService = require("../services/plants.service.js");
const ResponseHandler = require("../../../../utils/responseHandler.utils.js");

class PlantController {
    // Get all plants
    static async getAllPlants(req, h) {
        try {
            const { page, limit, skip, plantCategory } = req.query;

            const result = await PlantService.getAllPlants({
                page,
                limit,
                skip,
                plantCategory
            });

            return h
                .response({
                    success: result.success || RESPONSE_FLAGS.SUCCESS,
                    message: SUCCESS_MESSAGES.PLANTS.FETCHED,
                    data: result.data
                })
                .code(result.code || RESPONSE_CODES.SUCCESS);
        } catch (err) {
            return ResponseHandler.handleError(h, err, "Get All Plants Error:");
        }
    }

    // Get all plant variants
    static async getAllPlantVariants(req, h) {
        try {
            const {
                page,
                limit,
                skip,
                size,
                color,
                minPrice,
                maxPrice,
                plantCategory,
                orderByPrice
            } = req.query;

            const result = await PlantService.getAllPlantVariants({
                page,
                limit,
                skip,
                size,
                color,
                minPrice,
                maxPrice,
                plantCategory,
                orderByPrice
            });
            // console.log("getAllPlantVariants: ", result.data);

            return h
                .response({
                    success: result.success || RESPONSE_FLAGS.SUCCESS,
                    message: SUCCESS_MESSAGES.PLANTS.FETCHED,
                    data: result.data
                })
                .code(result.code || RESPONSE_CODES.SUCCESS);
        } catch (err) {
            return ResponseHandler.handleError(
                h,
                err,
                "Get All Plant Variants Error:"
            );
        }
    }

    // Get a single plant by ID
    static async getPlantById(req, h) {
        try {
            const { id } = req.params;
            const result = await PlantService.getPlantById(id);

            return h
                .response({
                    success: result.success || RESPONSE_FLAGS.SUCCESS,
                    message: SUCCESS_MESSAGES.PLANTS.FETCHED,
                    data: result.data
                })
                .code(result.code || RESPONSE_CODES.SUCCESS);
        } catch (err) {
            return ResponseHandler.handleError(
                h,
                err,
                "Get Plant By ID Error:"
            );
        }
    }

    // Search plants or variants by name
    static async getPlantByName(req, h) {
        try {
            const { search } = req.params;
            const { page, limit, skip, plantCategory } = req.query;

            const result = await PlantService.getPlantByName({
                search,
                page,
                limit,
                skip,
                plantCategory
            });

            return h
                .response({
                    success: result.success || RESPONSE_FLAGS.SUCCESS,
                    message: SUCCESS_MESSAGES.PLANTS.FETCHED,
                    data: result.data
                })
                .code(result.code || RESPONSE_CODES.SUCCESS);
        } catch (err) {
            return ResponseHandler.handleError(
                h,
                err,
                "Get Plant By Name Error:"
            );
        }
    }

    // Get all compatible pots
    static async getAllCompatiblePots(req, h) {
        try {
            const result = await PlantService.getAllCompatiblePots();

            return h
                .response({
                    success: result.success || RESPONSE_FLAGS.SUCCESS,
                    message:
                        SUCCESS_MESSAGES.POTS?.FETCHED ||
                        "Compatible pots fetched successfully",
                    data: result.data
                })
                .code(result.code || RESPONSE_CODES.SUCCESS);
        } catch (err) {
            return ResponseHandler.handleError(
                h,
                err,
                "Get All Compatible Pots Error:"
            );
        }
    }
}

module.exports = PlantController;
