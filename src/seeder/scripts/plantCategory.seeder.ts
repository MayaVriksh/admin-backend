import { v4 as uuidv4 } from 'uuid';
import { prisma } from '../../config/prisma.config';
import categoriesData from '../data/plantCategory.data';

async function seedPlantCategories() {
    console.log("🌿 Seeding PlantCategories...");

    for (const category of categoriesData) {
        try {
            const existing = await prisma.plantCategory.findFirst({
                where: { name: category.name }
            });

            if (!existing) {
                await prisma.plantCategory.create({
                    data: {
                        categoryId: uuidv4(),
                        ...category
                    }
                });
                console.log(`✅ PlantCategory '${category.name}' created`);
            } else {
                console.log(
                    `⚠️  PlantCategory '${category.name}' already exists`
                );
            }
        } catch (error) {
            console.error(
                `❌ Error with PlantCategory '${category.name}':`,
                error.message
            );
        }
    }

    console.log("✅ PlantCategory seeding completed.");
}

async function assignCategoriesToPlants() {
    try {
        const plants = await prisma.plants.findMany();
        if (!plants.length) {
            console.log("⚠️ No plants found in the database.");
            return;
        }

        const categories = await prisma.plantCategory.findMany();
        if (!categories.length) {
            console.log("⚠️ No categories found. Seed PlantCategory first.");
            return;
        }

        for (const plant of plants) {
            // Pick 1 or 2 random categories
            const shuffled = categories.sort(() => 0.5 - Math.random());
            const selectedCategories = shuffled.slice(
                0,
                Math.floor(Math.random() * 2) + 1
            );

            // Connect categories, avoid duplicates
            await prisma.plants.update({
                where: { plantId: plant.plantId },
                data: {
                    plantCategories: {
                        connect: selectedCategories.map((c) => ({
                            categoryId: c.categoryId
                        }))
                    }
                }
            });

            console.log(
                `✅ Plant '${plant.name}' assigned ${selectedCategories.length} category(s)`
            );
        }

        console.log("✅ All plants updated with categories.");
    } catch (error) {
        console.error(
            "❌ Error assigning categories to plants:",
            error.message
        );
    }
}

// Run both functions in sequence
if (require.main === module) {
    (async () => {
        try {
            await seedPlantCategories();
            await assignCategoriesToPlants();
        } catch (error) {
            console.error("❌ Seeding failed:", error);
        } finally {
            await prisma.$disconnect();
        }
    })();
}

export { assignCategoriesToPlants, seedPlantCategories };

