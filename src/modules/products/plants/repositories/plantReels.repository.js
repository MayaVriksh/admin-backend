const { prisma } = require("../../../../config/prisma.config");
const { v4: uuidv4 } = require("uuid");

/**
 * The set of fields to select when fetching reels for public display.
 */
const selectFields = {
    id: true,
    title: true,
    description: true,
    videoDuration: true,
    youtubeVideoUrl: true,
    cloudinaryVideoUrl: true,
    cloudinaryThumbnailUrl: true,
    reelType: true,
    formatType: true,
    plant: {
        select: {
            plantId: true,
            name: true
        }
    }
};

/**
 * Fetches all active plant reels from the database.
 * @returns {Promise<Array>} A promise that resolves to an array of active reels.
 */
const findAllActive = async () => {
    return await prisma.plantReel.findMany({
        where: {
            isActive: true,
            deletedAt: null
        },
        select: selectFields,
        orderBy: {
            createdAt: "desc"
        }
    });
};

/**
 * Creates a new plant reel in the database.
 * @param {object} reelData - The data for the new reel.
 * @returns {Promise<object>} A promise that resolves to the newly create reel.
 */
const create = async (reelData) => {
    console.log(reelData);
    return await prisma.plantReel.create({
        data: {
            id: uuidv4(),
            ...reelData
        }
    });
};

module.exports = {
    findAllActive,
    create
};
