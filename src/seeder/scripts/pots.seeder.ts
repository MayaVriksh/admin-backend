import { prisma } from "../../config/prisma.config";
import generateCustomId from "../../utils/generateCustomId";
import { PRODUCT_TYPES } from "../../constants/general.constant";
import potData from "../data/pots.data";
import { v4 as uuidv4 } from "uuid";

async function seedPots() {
    try {
        console.log("🪴 Fetching colors and materials...");
        const colors = await prisma.color.findMany();
        const materials = await prisma.potMaterial.findMany();

        if (!colors.length || !materials.length) {
            throw new Error(
                "❌ Colors or Materials missing. Please seed them first."
            );
        }

        console.log("🪻 Seeding Pot Categories, SizeProfiles, and Variants...");

        for (const pot of potData) {
            try {
                if (!pot?.name || !Array.isArray(pot.variants)) {
                    console.warn(`⚠️ Skipping invalid pot data:`, pot);
                    continue;
                }

                // Transaction: create category
                const createdCategory = await prisma.$transaction(
                    async (tx) => {
                        const existingCategory = await tx.potCategory.findFirst(
                            {
                                where: { name: pot.name }
                            }
                        );

                        if (existingCategory) {
                            console.log(
                                `⚠️ Pot category '${pot.name}' already exists, skipping...`
                            );
                            return null;
                        }

                        const categoryId = await generateCustomId(
                            tx,
                            PRODUCT_TYPES.POT
                        );

                        return tx.potCategory.create({
                            data: {
                                categoryId,
                                name: pot.name,
                                description: pot.description
                            }
                        });
                    },
                    { timeout: 15000 }
                );

                if (!createdCategory) continue;

                console.log(`🌱 Created category '${pot.name}'`);

                // Seed each variant in its own transaction
                let successCount = 0;

                for (let i = 0; i < pot.variants.length; i++) {
                    const variant = pot.variants[i];

                    if (!variant?.size || !variant?.potName) {
                        console.warn(
                            `⚠️ Skipping invalid variant in '${pot.name}':`,
                            variant
                        );
                        continue;
                    }

                    try {
                        await prisma.$transaction(
                            async (tx) => {
                                const color = colors[i % colors.length];
                                const material =
                                    materials[i % materials.length];

                                // Size Profile (Upsert)
                                const sizeProfile =
                                    await tx.potSizeProfile.upsert({
                                        where: {
                                            categoryId_size: {
                                                categoryId:
                                                    createdCategory.categoryId,
                                                size: variant.size
                                            }
                                        },
                                        update: {
                                            height: variant.height,
                                            weight: variant.weight
                                        },
                                        create: {
                                            potSizeProfileId: uuidv4(),
                                            categoryId:
                                                createdCategory.categoryId,
                                            size: variant.size,
                                            height: variant.height,
                                            weight: variant.weight
                                        }
                                    });

                                // Size + Material Option (Upsert)
                                const sizeMaterialOption =
                                    await tx.sizeMaterialOption.upsert({
                                        where: {
                                            potSizeProfileId_materialId: {
                                                potSizeProfileId:
                                                    sizeProfile.potSizeProfileId,
                                                materialId: material.materialId
                                            }
                                        },
                                        update: {},
                                        create: {
                                            sizeMaterialOptionId: uuidv4(),
                                            potSizeProfileId:
                                                sizeProfile.potSizeProfileId,
                                            materialId: material.materialId
                                        }
                                    });

                                // Pot Variant
                                const potVariantId = await generateCustomId(
                                    tx,
                                    PRODUCT_TYPES.POT_VARIANT
                                );

                                await tx.potVariants.create({
                                    data: {
                                        potVariantId,
                                        categoryId: createdCategory.categoryId,
                                        sizeMaterialOptionId:
                                            sizeMaterialOption.sizeMaterialOptionId,
                                        colorId: color.id,
                                        potName: variant.potName,
                                        sku: variant.sku,
                                        mrp: variant.mrp,
                                        isEcoFriendly: variant.isEcoFriendly,
                                        isPremium: variant.isPremium
                                    }
                                });
                            },
                            { timeout: 15000 }
                        );

                        console.log(
                            `✅ Variant '${variant.potName}' created in '${pot.name}'`
                        );
                        successCount++;
                    } catch (err: any) {
                        console.error(
                            `❌ Failed to create variant '${variant.potName}' in '${pot.name}':`,
                            err.message
                        );
                    }
                }

                console.log(
                    `🎯 Category '${pot.name}' seeded with ${successCount}/${pot.variants.length} variants`
                );
            } catch (err: any) {
                console.error(
                    `❌ Failed seeding pot '${pot.name}':`,
                    err.message
                );
            }
        }

        console.log("🎉 All pot categories and variants seeded successfully.");
    } catch (error: any) {
        console.error("❌ Error seeding pots:", error.stack || error);
    } finally {
        await prisma.$disconnect();
    }
}

if (require.main === module) {
    seedPots().catch((e) => {
        console.error("❌ Seeding failed:", e.stack || e);
    });
}

export default seedPots;
