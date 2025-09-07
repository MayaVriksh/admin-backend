import { v4 as uuidv4 } from 'uuid';
import { prisma } from '../../config/prisma.config';
import { humidityData, sunlightData } from '../data/plantCareGuidelines.data';

async function seedSunlightTypes() {
    console.log("☀️ Seeding SunlightTypes...");

    for (const sun of sunlightData) {
        try {
            const existing = await prisma.sunlightTypes.findFirst({
                where: { typeName: sun.typeName }
            });

            if (!existing) {
                await prisma.sunlightTypes.create({
                    data: { sunlightId: uuidv4(), ...sun }
                });
                console.log(`✅ SunlightType '${sun.typeName}' created`);
            } else {
                console.log(
                    `⚠️  SunlightType '${sun.typeName}' already exists`
                );
            }
        } catch (error) {
            console.error(
                `❌ Error with SunlightType '${sun.typeName}':`,
                error.message
            );
        }
    }

    console.log("✅ SunlightTypes seeding completed.");
}

async function seedHumidityLevels() {
    console.log("💧 Seeding HumidityLevels...");

    for (const hum of humidityData) {
        try {
            const existing = await prisma.humidityLevel.findFirst({
                where: { level: hum.level }
            });

            if (!existing) {
                await prisma.humidityLevel.create({
                    data: { humidityId: uuidv4(), ...hum }
                });
                console.log(`✅ HumidityLevel '${hum.level}' created`);
            } else {
                console.log(`⚠️  HumidityLevel '${hum.level}' already exists`);
            }
        } catch (error) {
            console.error(
                `❌ Error with HumidityLevel '${hum.level}':`,
                error.message
            );
        }
    }

    console.log("✅ HumidityLevels seeding completed.");
}

async function seedPlantCareGuidelines() {
    console.log("🌱 Seeding PlantCareGuidelines...");

    try {
        const plantSizes = await prisma.plantSizeProfile.findMany();
        const sunlightTypes = await prisma.sunlightTypes.findMany();
        const humidityLevels = await prisma.humidityLevel.findMany();

        if (
            !plantSizes.length ||
            !sunlightTypes.length ||
            !humidityLevels.length
        ) {
            console.log(
                "⚠️ Missing dependencies. Seed PlantSizeProfile, SunlightTypes, and HumidityLevels first."
            );
            return;
        }

        for (const size of plantSizes) {
            for (const sun of sunlightTypes) {
                for (const hum of humidityLevels) {
                    const existing = await prisma.plantCareGuidelines.findFirst(
                        {
                            where: {
                                plantSizeId: size.plantSizeId,
                                season: "Spring"
                            }
                        }
                    );

                    if (!existing) {
                        await prisma.plantCareGuidelines.create({
                            data: {
                                plantCareId: uuidv4(),
                                plantSizeId: size.plantSizeId,
                                sunlightTypeId: sun.sunlightId,
                                humidityLevelId: hum.humidityId,
                                season: "Spring",
                                wateringFrequency: "2 times/week",
                                waterAmountMl: 500,
                                wateringMethod: "Soil drench",
                                recommendedTime: "Morning",
                                soilTypes: "Loamy, Sandy",
                                preferredSeasons: "Spring, Summer",
                                careNotes: "Avoid direct harsh sunlight"
                            }
                        });
                        console.log(
                            `✅ PlantCareGuidelines for size '${size.name}', sunlight '${sun.typeName}' & humidity '${hum.level}' created`
                        );
                    } else {
                        console.log(
                            `⚠️ PlantCareGuidelines for size '${size.name}' already exists`
                        );
                    }
                }
            }
        }
    } catch (error) {
        console.error("❌ Error seeding PlantCareGuidelines:", error.message);
    }

    console.log("✅ PlantCareGuidelines seeding completed.");
}

if (require.main === module) {
    (async () => {
        await seedSunlightTypes();
        await seedHumidityLevels();
        await seedPlantCareGuidelines();
        prisma.$disconnect();
    })();
}

export {
    seedHumidityLevels,
    seedPlantCareGuidelines, seedSunlightTypes
};

