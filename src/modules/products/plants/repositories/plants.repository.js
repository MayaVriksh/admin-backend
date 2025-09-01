const { prisma } = require("../../../config/prisma.config");
const { v4: uuidv4 } = require("uuid");

class PlantSizeProfileRepository {
    // Reusable select schema
    static baseSelect() {
        return {
            plantId: true,
            name: true,
            description: true,
            scientificName: true,
            isProductActive: true,
            isFeatured: true,
            auraType: true,
            bestForEmotion: true,
            bestGiftFor: true,
            biodiversityBooster: true,
            carbonAbsorber: true,
            funFacts: true,
            godAligned: true,
            insideBox: true,
            maintenance: true,
            plantSeries: true,
            placeOfOrigin: true,
            repotting: true,
            soil: true,
            spiritualUseCase: true,

            plantCategories: {
                select: {
                    categoryId: true,
                    name: true,
                    description: true,
                    mediaUrl: true
                }
            },

            PlantSizeProfile: {
                select: {
                    plantSizeId: true,
                    plantSize: true,
                    height: true,
                    weight: true,

                    PlantVariants: {
                        select: {
                            variantId: true,
                            sku: true,
                            isProductActive: true,
                            mrp: true,
                            notes: true,

                            color: {
                                select: {
                                    name: true,
                                    hexCode: true
                                }
                            },

                            plantVariantImages: {
                                select: {
                                    id: true,
                                    mediaUrl: true,
                                    mediaType: true,
                                    isPrimary: true
                                }
                            }
                        }
                    },

                    PlantCareGuidelines: {
                        select: {
                            plantCareId: true,
                            season: true,
                            wateringFrequency: true,
                            waterAmountMl: true,
                            wateringMethod: true,
                            recommendedTime: true,
                            soilTypes: true,
                            preferredSeasons: true,
                            careNotes: true,

                            sunlightType: {
                                select: {
                                    typeName: true,
                                    mediaUrl: true,
                                    publicId: true,
                                    description: true
                                }
                            },

                            humidityLevel: {
                                select: {
                                    level: true,
                                    description: true,
                                    suitableZones: true
                                }
                            }
                        }
                    },

                    PlantFertilizerSchedule: {
                        select: {
                            applicationFrequency: true,
                            applicationMethod: true,
                            applicationSeason: true,
                            applicationTime: true,
                            benefits: true,
                            dosageAmount: true,
                            safetyNotes: true,
                            fertilizer: {
                                select: {
                                    name: true,
                                    type: true,
                                    composition: true,
                                    description: true,
                                    caution: true,
                                    isEcoFriendly: true
                                }
                            }
                        }
                    }
                }
            }
        };
    }

    // Create a new PlantSizeProfile
    static async create({ plantId, plantSize, height, weight }) {
        return prisma.plantSizeProfile.create({
            data: {
                plantSizeId: uuidv4(),
                plantId,
                plantSize,
                height,
                weight
            },
            select: this.baseSelect()
        });
    }

    // Find by ID
    static async findById(id) {
        return prisma.plantSizeProfile.findFirst({
            where: { plantSizeId: id },
            select: this.baseSelect()
        });
    }

    // Find all by PlantId
    static async findByPlantId(plantId) {
        return prisma.plantSizeProfile.findMany({
            where: { plantId },
            select: this.baseSelect()
        });
    }

    // Get all with pagination & sorting
    static async findAll({
        offset = 0,
        limit = 10,
        sortBy = "createdAt",
        order = "asc"
    }) {
        return prisma.plantSizeProfile.findMany({
            skip: offset,
            take: limit,
            orderBy: { [sortBy]: order },
            select: this.baseSelect()
        });
    }

    // Update profile
    static async update(id, { plantSize, height, weight }) {
        return prisma.plantSizeProfile.update({
            where: { plantSizeId: id },
            data: {
                ...(plantSize && { plantSize }),
                ...(height && { height }),
                ...(weight && { weight })
            },
            select: this.baseSelect()
        });
    }

    // Delete profile
    static async delete(id) {
        return prisma.plantSizeProfile.delete({
            where: { plantSizeId: id },
            select: this.baseSelect()
        });
    }
}

module.exports = PlantSizeProfileRepository;
