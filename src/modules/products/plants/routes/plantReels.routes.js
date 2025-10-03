// src/api/reels/routes/reels.routes.js
const reelsController = require("../controllers/plantReels.controller");
const reelsValidator = require("../validations/plantReels.validation");
const {
    handleValidationFailure
} = require("../../../../utils/failActionValidation");

module.exports = [
  {
    method: "GET",
    path: "/plant-reels",
    options: {
      description: "Get all active plant reels",
      notes: "Returns a list of all active reels (from YouTube or Cloudinary) for display on the website.",
      tags: ["api", "Plant Reels"],
      handler: reelsController.getAllActiveReelsHandler,
      plugins: {
        "hapi-swagger": {
          responses: {
            200: { description: "Reels fetched successfully." },
            500: { description: "Internal server error." },
          },
        },
      },
    },
  },
  {
    method: "POST",
    path: "/plant-reels",
    options: {
      description: "Create a new plant reel",
      notes: "Adds a new reel to the database. Provide either a YouTube URL or a Cloudinary URL.",
      tags: ["api", "Plant Reels", "Admin"],
      handler: reelsController.createReelHandler,
      validate: {
        ...reelsValidator.createReelValidation,
        failAction: handleValidationFailure
      },
      plugins: {
        "hapi-swagger": {
          responses: {
            201: { description: "Reel created successfully." },
            400: { description: "Validation error: Missing URL or invalid data." },
            500: { description: "Internal server error." },
          },
        },
      },
    },
  },
];