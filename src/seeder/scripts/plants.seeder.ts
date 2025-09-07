import { v4 as uuid } from 'uuid';
import { prisma } from '../../config/prisma.config';
import { PRODUCT_TYPES } from '../../constants/general.constant';
import generateCustomId from '../../utils/generateCustomId';
import { mediaUrls, plants, plantSizeProfiles, plantVariants } from '../data/plants.data';

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

                        const createdPlant = await tx.plants.create({
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
                                createdAt: plant.createdAt,
                                updatedAt: plant.updatedAt
                            }
                        });

                        console.log(`🌱 Created Plant '${plant.name}'`);

                        // Size Profiles
                        const sizesForPlant = plantSizeProfiles.filter(
                            (s) => s.plantId === plant.plantId
                        );
                        const sizeIdMap = {};

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

                        // Variants
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
                            `✅ Plant '${plant.name}' seeded with ${sizesForPlant.length} sizes & ${variantsForPlant.length} variants`
                        );
                    },
                    { timeout: 15000 } // max timeout
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
                            publicId: "Yo",
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

export { seedPlants, seedPlantVariantImages };
