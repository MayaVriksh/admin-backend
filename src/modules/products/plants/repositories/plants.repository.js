const { prisma } = require("../../../../config/prisma.config");
const { v4: uuidv4 } = require("uuid");

class PlantRepository {
    // Reusable select schema
    static baseSelect(productCard) {
        return {
            plantId: true,

            ...(productCard
                ? {
                      name: true,
                      scientificName: true,
                      description: true,

                      isProductActive: true,
                      isFeatured: true,

                      biodiversityBooster: true,
                      carbonAbsorber: true,

                      maintenance: true,

                      bestForEmotion: true,
                      bestGiftFor: true
                  }
                : {
                      name: true,
                      scientificName: true,
                      description: true,

                      isProductActive: true,
                      isFeatured: true,

                      plantClass: true,
                      plantSeries: true,
                      placeOfOrigin: true,

                      auraType: true,
                      biodiversityBooster: true,
                      carbonAbsorber: true,

                      minimumTemperature: true,
                      maximumTemperature: true,
                      soil: true,
                      repotting: true,
                      maintenance: true,
                      insideBox: true,

                      benefits: true,
                      bestForEmotion: true,
                      bestGiftFor: true,
                      funFacts: true,

                      spiritualUseCase: true,
                      associatedDeity: true,
                      godAligned: true
                  }),

            // Categories
            plantCategories: {
                select: {
                    categoryId: true,
                    name: true,
                    description: true,
                    mediaUrl: true
                }
            },

            // Size Profiles & Variants
            plantSizeProfile: {
                ...(productCard ? { take: 1 } : {}),
                select: {
                    plantSizeId: true,
                    plantSize: true,
                    height: true,
                    weight: true,

                    PlantVariants: {
                        ...(productCard ? { take: 1 } : {}),
                        select: {
                            variantId: true,
                            sku: true,
                            isProductActive: true,
                            mrp: true,
                            notes: true,

                            color: {
                                select: {
                                    id: true,
                                    name: true,
                                    hexCode: true
                                }
                            },

                            plantVariantImages: {
                                ...(productCard ? { take: 4 } : { take: 5 }),
                                select: {
                                    id: true,
                                    mediaUrl: true,
                                    mediaType: true,
                                    isPrimary: true
                                }
                            }
                        }
                    },

                    // Care & Fertilizer details (only when not productCard)
                    ...(!productCard
                        ? {
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
                                              sunlightId: true,
                                              typeName: true,
                                              mediaUrl: true,
                                              publicId: true,
                                              description: true
                                          }
                                      },

                                      humidityLevel: {
                                          select: {
                                              humidityId: true,
                                              level: true,
                                              description: true,
                                              suitableZones: true
                                          }
                                      }
                                  }
                              },

                              PlantFertilizerSchedule: {
                                  select: {
                                      fertilizerScheduleId: true,
                                      applicationFrequency: true,
                                      applicationMethod: true,
                                      applicationSeason: true,
                                      applicationTime: true,
                                      benefits: true,
                                      dosageAmount: true,
                                      safetyNotes: true,
                                      fertilizer: {
                                          select: {
                                              fertilizerId: true,
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
                        : {})
                }
            }
        };
    }

    // Create a new plant
    static async create(data) {
        return prisma.plants.create({
            data: {
                plantId: uuidv4(),
                ...data
            },
            select: this.baseSelect()
        });
    }

    // Get plant by ID
    static async findById(id) {
        return prisma.plants.findFirst({
            where: { plantId: id },
            select: this.baseSelect()
        });
    }

    // ###########  Will be done later

    // // Get selling price by varinat ID
    // static async findSellingPriceById(plantId, variantId) {
    //     return prisma.plantWarehouseInventory.findFirst({
    //         where: { plantId, variantId }
    //     });
    // }

    // // Get selling price
    // static async findSellingPrice() {
    //     return prisma.plantGenericCostComponent.findFirst({
    //         select: {
    //             include: {
    //                 plantSizeCosts: true
    //             }
    //         },
    //         orderBy: {
    //             createdAt: "desc"
    //         }
    //     });
    // }

    // Search plant or variant by name
    static async findByNameOrVariant({
        search,
        offset = 0,
        limit = 10,
        sortBy = "createdAt",
        order = "asc",
        plantCategory
    }) {
        return prisma.plants.findMany({
            where: {
                AND: [
                    {
                        OR: [
                            { name: { contains: search, mode: "insensitive" } },
                            {
                                plantSizeProfile: {
                                    some: {
                                        PlantVariants: {
                                            some: {
                                                sku: {
                                                    contains: search,
                                                    mode: "insensitive"
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        ]
                    },
                    ...(plantCategory
                        ? [
                              {
                                  plantCategories: {
                                      some: {
                                          name: {
                                              equals: plantCategory,
                                              mode: "insensitive"
                                          }
                                      }
                                  }
                              }
                          ]
                        : [])
                ]
            },
            skip: offset,
            take: limit,
            orderBy: { [sortBy]: order },
            select: this.baseSelect(true)
        });
    }

    // Count all (for pagination)
    static async countByNameOrVariant({ search, plantCategory }) {
        return prisma.plants.count({
            where: {
                AND: [
                    {
                        OR: [
                            { name: { contains: search, mode: "insensitive" } },
                            {
                                plantSizeProfile: {
                                    some: {
                                        PlantVariants: {
                                            some: {
                                                sku: {
                                                    contains: search,
                                                    mode: "insensitive"
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        ]
                    },
                    ...(plantCategory
                        ? [
                              {
                                  plantCategories: {
                                      some: {
                                          name: {
                                              equals: plantCategory,
                                              mode: "insensitive"
                                          }
                                      }
                                  }
                              }
                          ]
                        : [])
                ]
            }
        });
    }

    // Get all with pagination & sorting
    static async findAll({
        offset = 0,
        limit = 10,
        sortBy = "createdAt",
        order = "asc",
        plantCategory
    }) {
        return prisma.plants.findMany({
            skip: offset,
            take: limit,
            orderBy: { [sortBy]: order },
            where: plantCategory
                ? {
                      plantCategories: {
                          some: {
                              name: {
                                  equals: plantCategory,
                                  mode: "insensitive"
                              }
                          }
                      }
                  }
                : {},
            select: this.baseSelect(true)
        });
    }

    // Count all (for pagination)
    static async countAll() {
        return prisma.plants.count();
    }

    // Update plant
    static async update(id, updates) {
        return prisma.plants.update({
            where: { plantId: id },
            data: updates,
            select: this.baseSelect()
        });
    }

    // Delete plant
    static async delete(id) {
        return prisma.plants.delete({
            where: { plantId: id }
        });
    }
}

module.exports = PlantRepository;
