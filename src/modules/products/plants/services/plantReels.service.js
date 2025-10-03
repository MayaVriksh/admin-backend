// src/api/reels/services/reels.service.js
const { RESPONSE_FLAGS } = require("../../../../constants/responseCodes.constant");
const reelsRepository = require("../repositories/plantReels.repository.js");

/**
 * Service to fetch all active plant reels.
 * @returns {Promise<Array>} A promise that resolves to an array of plant reels.
 */
const getAllActiveReelsService = async () => {
  const reels = await reelsRepository.findAllActive();
  if (!reels) {
    throw {
      success: RESPONSE_FLAGS.FAILURE,
      message: "Could not fetch plant reels.",
    };
  }
  return reels;
};

/**
 * Service to create a new plant reel.
 * @param {object} payload - The reel data from the controller.
 * @returns {Promise<object>} A promise that resolves to the created reel.
 */
const createReelService = async (payload) => {
console.log(payload)
  const newReel = await reelsRepository.created(payload);
  if (!newReel) {
    throw {
      success: RESPONSE_FLAGS.FAILURE,
      message: "Failed to create new plant reel.",
    };
  }
  return newReel;
};

module.exports = {
  getAllActiveReelsService,
  createReelService,
};