const { prisma } = require("../../config/prisma.config");
const generateFertilizers = require("../data/fertilizers.data");

async function seedFertilizers() {
    console.log("🌱 Seeding Fertilizers...");

    const fertilizers = generateFertilizers(30);

    for (const fertilizer of fertilizers) {
        try {
            const existing = await prisma.fertilizers.findFirst({
                where: { name: fertilizer.name }
            });

            if (!existing) {
                await prisma.fertilizers.create({
                    data: fertilizer
                });
                console.log(`✅ Fertilizer '${fertilizer.name}' created`);
            } else {
                console.log(
                    `⚠️  Fertilizer '${fertilizer.name}' already exists`
                );
            }
        } catch (error) {
            console.error(
                `❌ Error with fertilizer '${fertilizer.name}':`,
                error.message
            );
        }
    }

    console.log("✅ Fertilizer seeding completed.");
}

if (require.main === module) {
    seedFertilizers()
        .catch((error) => {
            console.error("❌ Seeding failed:", error);
        })
        .finally(() => {
            prisma.$disconnect();
        });
}

module.exports = seedFertilizers;
