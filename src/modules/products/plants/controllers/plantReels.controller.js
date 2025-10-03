// src/api/reels/controllers/reels.controller.js
const {
  RESPONSE_CODES,
  RESPONSE_FLAGS,
} = require("../../../../constants/responseCodes.constant.js");
const ERROR_MESSAGES = require("../../../../constants/errorMessages.constant.js");
const SUCCESS_MESSAGES = require("../../../../constants/successMessages.constant.js");
const reelsService = require("../services/plantReels.service");

/**
 * Handler to fetch all active plant reels.
 */
const getAllActiveReelsHandler = async (req, h) => {
  try {
    const reels = await reelsService.getAllActiveReelsService();
    return h.response({
        success: RESPONSE_FLAGS.SUCCESS,
        message: "Plant reels fetched successfully.",
        data: reels,
      }).code(RESPONSE_CODES.SUCCESS);
  } catch (error) {
    console.error("Get Plant Reels Error:", error);
    return h.response({
        success: RESPONSE_FLAGS.FAILURE,
        message: error.message || ERROR_MESSAGES.COMMON.INTERNAL_SERVER_ERROR,
      }).code(RESPONSE_CODES.INTERNAL_SERVER_ERROR);
  }
};

/**
 * Handler to create a new plant reel.
 */
const createReelHandler = async (req, h) => {
  try {
    const newReel = await reelsService.createReelService(req.payload);
    return h.response({
        success: RESPONSE_FLAGS.SUCCESS,
        message: SUCCESS_MESSAGES?.REELS?.CREATED || "Plant Reel created successfully.",
        data: newReel,
      }).code(RESPONSE_CODES.CREATED);
  } catch (error) {
    console.error("Create Plant Reel Error:", error);
    return h.response({
        success: RESPONSE_FLAGS.FAILURE,
        message: error.message || ERROR_MESSAGES.COMMON.INTERNAL_SERVER_ERROR,
      }).code(RESPONSE_CODES.INTERNAL_SERVER_ERROR);
  }
};

module.exports = {
  getAllActiveReelsHandler,
  createReelHandler,
};