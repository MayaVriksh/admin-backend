const { prisma } = require("../../config/prisma.config");
const { PRODUCT_TYPES } = require("../../constants/general.constant");
const generateCustomId = require("../../utils/generateCustomId");
const {
    plants,
    plantSizeProfiles,
    plantVariants,
    mediaUrls
} = require("../data/plants.data");
const { v4: uuid } = require("uuid");

async function seedPlants() {
    try {
        console.log("🌿 Fetching colors from DB...");
        const colors = await prisma.color.findMany();

        if (!colors.length) {
            throw new Error("❌ No colors found. Please seed colors first.");
        }

        console.log("🌱 Seeding Plants, Size Profiles and Variants...");

        for (const plant of plants) {
            try {
                // --- Transaction 1: Seed plant + sizes ---
                let createdPlant;
                let sizeIdMap = {};

                await prisma.$transaction(
                    async (tx) => {
                        const existingPlant = await tx.plants.findFirst({
                            where: { name: plant.name }
                        });

                        if (existingPlant) {
                            console.log(
                                `⚠️ Plant '${plant.name}' already exists`
                            );
                            return;
                        }

                        const plantId = await generateCustomId(
                            tx,
                            PRODUCT_TYPES.PLANT
                        );

                        createdPlant = await tx.plants.create({
                            data: {
                                plantId,
                                name: plant.name,
                                description: plant.description,
                                isProductActive: plant.isProductActive,
                                isFeatured: plant.isFeatured,
                                scientificName: plant.scientificName,
                                maintenance: plant.maintenance,
                                placeOfOrigin: plant.placeOfOrigin,
                                auraType: plant.auraType,
                                bestForEmotion: plant.bestForEmotion,
                                bestGiftFor: plant.bestGiftFor,
                                biodiversityBooster: plant.biodiversityBooster,
                                carbonAbsorber: plant.carbonAbsorber,
                                funFacts: plant.funFacts,
                                godAligned: plant.godAligned,
                                associatedDeity: plant.associatedDeity,
                                insideBox: plant.insideBox,
                                plantClass: plant.plantClass,
                                plantSeries: plant.plantSeries,
                                repotting: plant.repotting,
                                soil: plant.soil,
                                spiritualUseCase: plant.spiritualUseCase,
                                minimumTemperature: plant.minimumTemperature,
                                maximumTemperature: plant.maximumTemperature,
                                benefits: plant.benefits,
                                createdAt: plant.createdAt,
                                updatedAt: plant.updatedAt
                            }
                        });

                        console.log(`🌱 Created Plant '${plant.name}'`);

                        const sizesForPlant = plantSizeProfiles.filter(
                            (s) => s.plantId === plant.plantId
                        );

                        for (const sizeProfile of sizesForPlant) {
                            const plantSizeId = await generateCustomId(
                                tx,
                                PRODUCT_TYPES.PLANT_SIZE
                            );

                            await tx.plantSizeProfile.create({
                                data: {
                                    plantSizeId,
                                    plantId: createdPlant.plantId,
                                    plantSize: sizeProfile.plantSize,
                                    height: sizeProfile.height,
                                    weight: sizeProfile.weight
                                }
                            });

                            sizeIdMap[sizeProfile.plantSizeId] = plantSizeId;

                            console.log(
                                `   ➕ Size Profile (${sizeProfile.plantSize}) added for '${plant.name}'`
                            );
                        }
                    },
                    { timeout: 15000 }
                );

                // If plant wasn't created (duplicate), skip variants
                if (!createdPlant) continue;

                // --- Transaction 2: Insert variants ---
                await prisma.$transaction(
                    async (tx) => {
                        const variantsForPlant = plantVariants.filter(
                            (v) => v.plantId === plant.plantId
                        );

                        for (let i = 0; i < variantsForPlant.length; i++) {
                            const variant = variantsForPlant[i];

                            const numColors = Math.min(4, colors.length);
                            for (let j = 0; j < numColors; j++) {
                                const color = colors[(i + j) % colors.length];

                                const variantId = await generateCustomId(
                                    tx,
                                    PRODUCT_TYPES.PLANT_VARIANT
                                );

                                await tx.plantVariants.create({
                                    data: {
                                        variantId,
                                        plantId: createdPlant.plantId,
                                        plantSizeId:
                                            sizeIdMap[variant.plantSizeId],
                                        colorId: color.id,
                                        sku: `${variant.sku}-${color.name.toUpperCase()}`,
                                        mrp: variant.mrp,
                                        isProductActive:
                                            variant.isProductActive,
                                        createdAt: variant.createdAt,
                                        updatedAt: variant.updatedAt
                                    }
                                });

                                console.log(
                                    `   🌿 Variant ${variant.sku} with color ${color.name} added for '${plant.name}'`
                                );
                            }
                        }

                        console.log(
                            `✅ Plant '${plant.name}' seeded with variants`
                        );
                    },
                    { timeout: 15000 }
                );
            } catch (error) {
                console.error(
                    `❌ Failed seeding '${plant.name}':`,
                    error.message
                );
            }
        }

        console.log(
            "🎉 All plants, size profiles and variants seeding completed."
        );
    } catch (error) {
        console.error("❌ Error seeding plants:", error.stack || error);
    }
}

// Separate function for PlantVariantImages
async function seedPlantVariantImages() {
    try {
        console.log("🖼️ Seeding Plant Variant Images...");

        const plantVariants = await prisma.plantVariants.findMany();

        for (const variant of plantVariants) {
            try {
                for (let i = 0; i < mediaUrls.length; i++) {
                    await prisma.plantVariantImage.create({
                        data: {
                            id: uuid(),
                            plantVariantId: variant.variantId,
                            mediaUrl: mediaUrls[i],
                            isPrimary: i === 4,
                            publicId: "Yo Yo",
                            mediaType: "image",
                            resourceType: "image",
                            createdAt: new Date(),
                            updatedAt: new Date()
                        }
                    });
                }

                console.log(`✅ Seeded images for variant ${variant.sku}`);
            } catch (err) {
                console.error(
                    `❌ Failed to seed images for variant ${variant.sku}:`,
                    err.message
                );
            }
        }

        console.log("🎉 All Plant Variant Images seeded.");
    } catch (err) {
        console.error(
            "❌ Error seeding Plant Variant Images:",
            err.stack || err
        );
    } finally {
        await prisma.$disconnect();
    }
}

// Run seeders if called directly
if (require.main === module) {
    (async () => {
        await seedPlants();
        await seedPlantVariantImages();
    })();
}

module.exports = { seedPlants, seedPlantVariantImages };
