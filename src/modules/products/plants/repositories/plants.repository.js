const { prisma } = require("../../../../config/prisma.config");
const { v4: uuidv4 } = require("uuid");

class PlantRepository {
    // Reusable select schema
    static baseSelect(productCard) {
        return {
            // id: true,
            // plantId: true,
            // variantId: true,

            // currentStock: true,

            // Plant details
            plants: {
                select: {
                    plantId: true,
                    name: true,
                    isFeatured: true,
                    biodiversityBooster: true,
                    carbonAbsorber: true,
                    maintenance: true,
                    bestForEmotion: true,
                    bestGiftFor: true,

                    ...(productCard
                        ? {}
                        : {
                              isProductActive: true,
                              scientificName: true,
                              description: true,
                              plantClass: true,
                              plantSeries: true,
                              placeOfOrigin: true,
                              auraType: true,
                              minimumTemperature: true,
                              maximumTemperature: true,
                              soil: true,
                              repotting: true,
                              insideBox: true,
                              benefits: true,
                              funFacts: true,
                              spiritualUseCase: true,
                              associatedDeity: true,
                              godAligned: true
                          }),

                    // Categories
                    // ...(productCard
                    //     ? {}
                    //     : {
                    //           plantCategories: {
                    //               select: {
                    //                   categoryId: true,
                    //                   name: true,
                    //                   description: true,
                    //                   mediaUrl: true
                    //               }
                    //           }
                    //       }),

                    plantSizeProfile: {
                        select: {
                            ...(productCard
                                ? {
                                      plantSize: true,
                                      PlantVariants: {
                                          select: {
                                              color: {
                                                  select: {
                                                      id: true,
                                                      name: true,
                                                      hexCode: true
                                                  }
                                              },
                                              mrp: true,
                                              plantVariantImages: {
                                                  where: { isPrimary: true },
                                                  select: {
                                                      id: true,
                                                      mediaUrl: true,
                                                      mediaType: true
                                                  }
                                              }
                                          }
                                      }
                                  }
                                : {
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
                                                      id: true,
                                                      name: true,
                                                      hexCode: true
                                                  }
                                              },

                                              plantVariantImages: {
                                                  take: 5,
                                                  select: {
                                                      id: true,
                                                      mediaUrl: true,
                                                      mediaType: true,
                                                      isPrimary: true
                                                  }
                                              }
                                          }
                                      },

                                      // Care & Fertilizer details
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
                                  })
                        }
                    }
                }
            }
        };
    }

    // Reusable select schema for Plant Variants
    static baseSelectVariant() {
        return {
            id: true,
            plantId: true,
            currentStock: true,
            trueCostPrice: true,

            plantVariant: {
                select: {
                    variantId: true,
                    sku: true,
                    mrp: true,

                    plants: {
                        select: {
                            plantId: true,
                            name: true,
                            isFeatured: true,
                            biodiversityBooster: true,
                            carbonAbsorber: true,
                            maintenance: true,
                            bestForEmotion: true,
                            bestGiftFor: true
                        }
                    },

                    color: {
                        select: {
                            id: true,
                            name: true,
                            hexCode: true
                        }
                    },

                    size: {
                        select: {
                            plantSize: true
                        }
                    },

                    plantVariantImages: {
                        take: 4,
                        select: {
                            id: true,
                            mediaUrl: true,
                            mediaType: true,
                            isPrimary: true
                        }
                    }
                }
            }
        };
    }

    // Create new inventory record
    static async create(data) {
        return prisma.plantWarehouseInventory.create({
            data: {
                id: uuidv4(),
                ...data
            },
            select: this.baseSelect()
        });
    }

    // Get inventory by ID
    static async findById(id) {
        return prisma.plantWarehouseInventory.findFirst({
            where: { plantId: id },
            select: this.baseSelect()
        });
    }

    // Search by plant name or variant SKU
    static async findByNameOrVariant({
        search,
        offset = 0,
        limit = 10,
        sortBy = "createdAt",
        order = "asc",
        plantCategory,
        warehouseId
    }) {
        return prisma.plantWarehouseInventory.findMany({
            where: {
                AND: [
                    {
                        OR: [
                            {
                                plants: {
                                    name: {
                                        contains: search,
                                        mode: "insensitive"
                                    }
                                }
                            },
                            {
                                plantVariant: {
                                    sku: {
                                        contains: search,
                                        mode: "insensitive"
                                    }
                                }
                            }
                        ]
                    },
                    ...(plantCategory
                        ? [
                              {
                                  plants: {
                                      plantCategories: {
                                          some: {
                                              name: {
                                                  contains: plantCategory,
                                                  mode: "insensitive"
                                              }
                                          }
                                      }
                                  }
                              }
                          ]
                        : []),
                    ...(warehouseId
                        ? [
                              {
                                  warehouseId: {
                                      equals: warehouseId
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

    // Count for pagination (with filters)
    static async countByNameOrVariant({ search, plantCategory, warehouseId }) {
        return prisma.plantWarehouseInventory.count({
            where: {
                AND: [
                    {
                        OR: [
                            {
                                plants: {
                                    name: {
                                        contains: search,
                                        mode: "insensitive"
                                    }
                                }
                            },
                            {
                                plantVariant: {
                                    sku: {
                                        contains: search,
                                        mode: "insensitive"
                                    }
                                }
                            }
                        ]
                    },
                    ...(plantCategory
                        ? [
                              {
                                  plants: {
                                      plantCategories: {
                                          some: {
                                              name: {
                                                  contains: plantCategory,
                                                  mode: "insensitive"
                                              }
                                          }
                                      }
                                  }
                              }
                          ]
                        : []),
                    ...(warehouseId
                        ? [
                              {
                                  warehouseId: {
                                      equals: warehouseId
                                  }
                              }
                          ]
                        : [])
                ]
            }
        });
    }

    // Get all with pagination
    static async findAll({
        offset = 0,
        limit = 10,
        sortBy = "createdAt",
        order = "asc",
        plantCategory
    }) {
        return prisma.plantWarehouseInventory.findMany({
            skip: offset,
            take: limit,
            orderBy: { [sortBy]: order },
            where: {
                AND: [
                    ...(plantCategory
                        ? [
                              {
                                  plants: {
                                      plantCategories: {
                                          some: {
                                              name: {
                                                  contains: plantCategory,
                                                  mode: "insensitive"
                                              }
                                          }
                                      }
                                  }
                              }
                          ]
                        : [])
                ]
            },
            select: this.baseSelect(true)
        });
    }

    // Count all (for pagination)
    static async countAll({ plantCategory }) {
        return prisma.plantWarehouseInventory.count({
            where: {
                AND: [
                    ...(plantCategory
                        ? [
                              {
                                  plants: {
                                      plantCategories: {
                                          some: {
                                              name: {
                                                  contains: plantCategory,
                                                  mode: "insensitive"
                                              }
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

    // Get all plant variants with pagination & filters (supports orderByPrice)
    static async findAllVariants({
        offset = 0,
        limit = 10,
        sortBy = "createdAt",
        order = "asc",
        size,
        color,
        minPrice,
        maxPrice,
        plantCategory
    }) {
        return prisma.plantWarehouseInventory.findMany({
            skip: offset,
            take: limit,
            orderBy: { [sortBy]: order },
            where: {
                AND: [
                    ...(size
                        ? [
                              {
                                  plantVariant: {
                                      size: {
                                          plantSize: { in: size }
                                      }
                                  }
                              }
                          ]
                        : []),
                    ...(color
                        ? [
                              {
                                  plantVariant: {
                                      color: {
                                          name: {
                                              in: color,
                                              mode: "insensitive"
                                          }
                                      }
                                  }
                              }
                          ]
                        : []),
                    ...(minPrice !== undefined
                        ? [
                              {
                                  plantVariant: {
                                      mrp: { gte: minPrice }
                                  }
                              }
                          ]
                        : []),
                    ...(maxPrice !== undefined
                        ? [
                              {
                                  plantVariant: {
                                      mrp: { lte: maxPrice }
                                  }
                              }
                          ]
                        : []),
                    ...(plantCategory
                        ? [
                              {
                                  plants: {
                                      plantCategories: {
                                          some: {
                                              name: {
                                                  contains: plantCategory,
                                                  mode: "insensitive"
                                              }
                                          }
                                      }
                                  }
                              }
                          ]
                        : [])
                ]
            },
            select: this.baseSelectVariant()
        });
    }

    // Count all plant variants with filters (for pagination)
    static async countAllVariants({
        size,
        color,
        minPrice,
        maxPrice,
        plantCategory
    }) {
        return prisma.plantWarehouseInventory.count({
            where: {
                AND: [
                    ...(size
                        ? [
                              {
                                  plantVariant: {
                                      size: {
                                          plantSize: { in: size }
                                      }
                                  }
                              }
                          ]
                        : []),
                    ...(color
                        ? [
                              {
                                  plantVariant: {
                                      color: {
                                          name: {
                                              in: color,
                                              mode: "insensitive"
                                          }
                                      }
                                  }
                              }
                          ]
                        : []),
                    ...(minPrice !== undefined
                        ? [
                              {
                                  plantVariant: {
                                      mrp: { gte: minPrice }
                                  }
                              }
                          ]
                        : []),
                    ...(maxPrice !== undefined
                        ? [
                              {
                                  plantVariant: {
                                      mrp: { lte: maxPrice }
                                  }
                              }
                          ]
                        : []),
                    ...(plantCategory
                        ? [
                              {
                                  plants: {
                                      plantCategories: {
                                          some: {
                                              name: {
                                                  contains: plantCategory,
                                                  mode: "insensitive"
                                              }
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

    // Update inventory
    static async update(id, updates) {
        return prisma.plantWarehouseInventory.update({
            where: { id },
            data: updates,
            select: this.baseSelect()
        });
    }

    // Delete inventory record
    static async delete(id) {
        return prisma.plantWarehouseInventory.delete({
            where: { id }
        });
    }
}

module.exports = PlantRepository;
