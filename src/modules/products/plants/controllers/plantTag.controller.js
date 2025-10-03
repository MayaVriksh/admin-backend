const PlantService = require('../services/plantTag.service.js');

const getPlantsByTag = async (req, h) => {
    try {
        const result = await PlantService.findPlantsByTag(req.query);
        return h.response(result).code(result.code);
    } catch (error) {
        console.error("Get Plants by Tag Controller Error:", error);
        return h.response({
            success: false, message: error.message
        }).code(error.code || 500);
    }
};

module.exports = {
    getPlantsByTag,
};