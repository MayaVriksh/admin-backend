import { v4 as uuidv4 } from 'uuid';
import { prisma } from '../../config/prisma.config';
import generateFertilizers from '../data/fertilizers.data';

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
        const seasons = ["Spring", "Summer", "Autumn", "Winter"];

        for (const size of plantSizes) {
            for (const season of seasons) {
                // Pick a random fertilizer
                const randomFertilizer =
                    fertilizers[Math.floor(Math.random() * fertilizers.length)];

                // Check if schedule already exists
                const existingSchedule =
                    await prisma.plantFertilizerSchedule.findFirst({
                        where: {
                            plantSizeId: size.plantSizeId,
                            fertilizerId: randomFertilizer.fertilizerId,
                            applicationSeason: season
                        }
                    });

                if (!existingSchedule) {
                    await prisma.plantFertilizerSchedule.create({
                        data: {
                            fertilizerScheduleId: uuidv4(),
                            plantSizeId: size.plantSizeId,
                            fertilizerId: randomFertilizer.fertilizerId,
                            applicationFrequency: "Monthly",
                            applicationMethod: ["Soil drench", "Foliar spray"],
                            applicationSeason: season,
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
                        `✅ Schedule for '${randomFertilizer.name}' & size '${size.plantSize}' created for ${season}`
                    );
                } else {
                    console.log(
                        `⚠️ Schedule for '${randomFertilizer.name}' & size '${size.plantSize}' already exists for ${season}`
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

export { seedFertilizers, seedPlantFertilizerSchedules };
