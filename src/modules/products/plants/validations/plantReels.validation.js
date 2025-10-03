// src/api/reels/validations/reels.validator.js
const Joi = require("joi");
const handleValidationFailure = require("../../../../utils/failActionValidation");

const createReelValidation = {
  payload: Joi.object({
    title: Joi.string().trim().required().messages({
      "any.required": "Reel title is required.",
    }),
    description: Joi.string().trim().optional().allow("", null),
    plantId: Joi.string().trim().optional().allow("", null),
    videoDuration: Joi.number().integer().positive().optional(),

    // URLs: Must have at least one of these
    youtubeVideoUrl: Joi.string().uri().optional().allow("", null),
    cloudinaryVideoUrl: Joi.string().uri().optional().allow("", null),
    
    // Other Cloudinary fields (optional)
    cloudinaryThumbnailUrl: Joi.string().uri().optional().allow("", null),
    cloudinaryPublicId: Joi.string().optional().allow("", null),
    cloudinaryResourceType: Joi.string().optional().allow("", null),
    cloudinaryFormat: Joi.string().optional().allow("", null),
    cloudinaryBytes: Joi.number().integer().optional(),

    // Enums
    reelType: Joi.string().valid(
        'GENERAL', 'PLANT_CARE', 'FERTILIZER_GUIDE', 'PEST_CONTROL', 
        'PROPAGATION', 'REPOTTING', 'SEASONAL_TIPS'
    ).default('GENERAL'),
    formatType: Joi.string().valid('REEL', 'VIDEO').default('REEL'),

    isActive: Joi.boolean().default(true),
  }).or('youtubeVideoUrl', 'cloudinaryVideoUrl').messages({
      'object.missing': 'You must provide either a YouTube URL or a Cloudinary URL.'
  }),
  failAction: handleValidationFailure,
};

module.exports = {
  createReelValidation,
};