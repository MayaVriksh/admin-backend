const PlantRepository = require("../repositories/plants.repository");
const ERROR_MESSAGES = require("../../../../constants/errorMessages.constant");
const {
    RESPONSE_CODES,
    RESPONSE_FLAGS
} = require("../../../../constants/responseCodes.constant");

class PlantService {
    // Get all plants with pagination & filtering
    static async getAllPlants({
        page = 1,
        limit = 10,
        skip,
        sortBy = "createdAt",
        order = "asc",
        plantCategory
    }) {
        const offset = skip !== undefined ? skip : (page - 1) * limit;

        const [plants, total] = await Promise.all([
            PlantRepository.findAll({
                offset,
                limit,
                sortBy,
                order,
                plantCategory
            }),
            PlantRepository.countAll(plantCategory)
        ]);

        return {
            success: RESPONSE_FLAGS.SUCCESS,
            code: RESPONSE_CODES.SUCCESS,
            data: {
                total,
                page,
                limit,
                skip: offset,
                plants
            }
        };
    }

    // Get plant by ID
    static async getPlantById(id) {
        const plant = await PlantRepository.findById(id);
        if (!plant) {
            throw {
                success: RESPONSE_FLAGS.FAILURE,
                code: RESPONSE_CODES.NOT_FOUND,
                message: ERROR_MESSAGES.PLANTS?.NOT_FOUND || "Plant not found"
            };
        }

        return {
            success: RESPONSE_FLAGS.SUCCESS,
            code: RESPONSE_CODES.SUCCESS,
            data: plant
        };
    }

    // Search plants or variants by name
    static async getPlantByName({
        search,
        page = 1,
        limit = 10,
        skip,
        sortBy = "createdAt",
        order = "asc",
        plantCategory
    }) {
        const offset = skip !== undefined ? skip : (page - 1) * limit;

        const [plants, total] = await Promise.all([
            PlantRepository.findByNameOrVariant({
                search,
                offset,
                limit,
                sortBy,
                order,
                plantCategory
            }),
            PlantRepository.countByNameOrVariant(search, plantCategory)
        ]);

        if (!plants || plants.length === 0) {
            throw {
                success: RESPONSE_FLAGS.FAILURE,
                code: RESPONSE_CODES.NOT_FOUND,
                message:
                    ERROR_MESSAGES.PLANTS?.NOT_FOUND ||
                    "No matching plants found"
            };
        }

        return {
            success: RESPONSE_FLAGS.SUCCESS,
            code: RESPONSE_CODES.SUCCESS,
            data: {
                total,
                page,
                limit,
                skip: offset,
                plants
            }
        };
    }
}

module.exports = PlantService;
