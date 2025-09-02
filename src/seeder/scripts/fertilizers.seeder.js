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

// Seeder for PlantFertilizerSchedule
async function seedPlantFertilizerSchedules() {
    console.log("🌱 Seeding PlantFertilizerSchedules...");

    try {
        const fertilizers = await prisma.fertilizers.findMany();
        const plantSizes = await prisma.plantSizeProfile.findMany();

        if (!fertilizers.length || !plantSizes.length) {
            console.log(
                "⚠️  Missing fertilizers or plant sizes. Seed them first."
            );
            return;
        }

        for (const size of plantSizes) {
            for (const fert of fertilizers) {
                const existingSchedule =
                    await prisma.plantFertilizerSchedule.findFirst({
                        where: {
                            plantSizeId: size.plantSizeId,
                            fertilizerId: fert.fertilizerId,
                            applicationSeason: "Spring"
                        }
                    });

                if (!existingSchedule) {
                    await prisma.plantFertilizerSchedule.create({
                        data: {
                            fertilizerScheduleId: uuidv4(),
                            plantSizeId: size.plantSizeId,
                            fertilizerId: fert.fertilizerId,
                            applicationFrequency: "Monthly",
                            applicationMethod: ["Soil drench", "Foliar spray"],
                            applicationSeason: "Spring",
                            applicationTime: "Morning",
                            benefits: ["Improves growth", "Boosts yield"],
                            dosageAmount: 10.5,
                            safetyNotes: [
                                "Wear gloves",
                                "Keep away from children"
                            ]
                        }
                    });
                    console.log(
                        `✅ Schedule for '${fert.name}' & size '${size.name}' created`
                    );
                } else {
                    console.log(
                        `⚠️  Schedule for '${fert.name}' & size '${size.name}' already exists`
                    );
                }
            }
        }
    } catch (error) {
        console.error(
            "❌ Error seeding PlantFertilizerSchedules:",
            error.message
        );
    }

    console.log("✅ PlantFertilizerSchedule seeding completed.");
}

if (require.main === module) {
    (async () => {
        await seedFertilizers();
        await seedPlantFertilizerSchedules();
        prisma.$disconnect();
    })();
}

module.exports = { seedFertilizers, seedPlantFertilizerSchedules };
