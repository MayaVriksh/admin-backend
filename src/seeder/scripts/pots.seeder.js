const { prisma } = require("../../config/prisma.config");
const generateCustomId = require("../../utils/generateCustomId");
const { PRODUCT_TYPES } = require("../../constants/general.constant");
const potData = require("../data/pots.data");

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

        console.log("🪻 Seeding Pot Categories and Variants...");

        for (const pot of potData) {
            try {
                // Transaction for Category
                const createdCategory = await prisma.$transaction(
                    async (tx) => {
                        if (!pot?.name || !Array.isArray(pot.variants)) {
                            console.warn(`⚠️  Skipping invalid pot data:`, pot);
                            return null;
                        }

                        const existingCategory = await tx.potCategory.findFirst(
                            {
                                where: { name: pot.name }
                            }
                        );

                        if (existingCategory) {
                            console.log(
                                `⚠️  Pot category '${pot.name}' already exists`
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
                                description: pot.description,
                                isActive: pot.isActive
                            }
                        });
                    },
                    { timeout: 15000 }
                );

                if (!createdCategory) continue;

                // Transaction for Variants
                await prisma.$transaction(
                    async (tx) => {
                        for (let i = 0; i < pot.variants.length; i++) {
                            const variant = pot.variants[i];
                            const color = colors[i % colors.length];
                            const material = materials[i % materials.length];

                            const potVariantId = await generateCustomId(
                                tx,
                                PRODUCT_TYPES.POT_VARIANT
                            );

                            await tx.potVariants.create({
                                data: {
                                    potVariantId,
                                    categoryId: createdCategory.categoryId,
                                    colorId: color.id,
                                    materialId: material.materialId,
                                    potName: variant.potName,
                                    size: variant.size,
                                    height: variant.height,
                                    weight: variant.weight,
                                    sku: variant.sku,
                                    mrp: variant.mrp,
                                    isEcoFriendly: variant.isEcoFriendly,
                                    isPremium: variant.isPremium
                                }
                            });
                        }
                    },
                    { timeout: 15000 }
                );

                console.log(
                    `✅ Category '${pot.name}' with ${pot.variants.length} variants created`
                );
            } catch (err) {
                console.error(
                    `❌ Failed seeding pot '${pot.name}':`,
                    err.message
                );
            }
        }

        console.log("🎉 All pot categories and variants seeded successfully.");
    } catch (error) {
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

module.exports = seedPots;
