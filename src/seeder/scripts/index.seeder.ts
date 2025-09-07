import { prisma } from '../../config/prisma.config';
import seedSerialTrackers from './serialtracker.seeder';
import seedRoles from './roles.seeder';
import seedWarehouses from './warehouses.seeder';
import seedUsers from './users/users.seeder';
import seedTags from './tags.seeder';
import seedColors from './colors.seeder';
import seedPlants from './plants.seeder';
import seedPotMaterials from './potMaterials.seeder';
import seedPots from './pots.seeder';
import seedFertilizers from './fertilizers.seeder';
import seedPurchaseOrders from './purchaseorder.seeder';
import { seedWarehouseInventory } from './warehouseInventory.seeder';
import seedPlantCategories from './plantCategory.seeder';

async function runSeeder() {
    console.log("🌱 Starting full seeding...");

    try {
        await seedSerialTrackers();
        await seedRoles();
        await seedWarehouses();
        await seedUsers();
        await seedTags();
        await seedColors();
        await seedPlants.seedPlants();
        await seedPlants.seedPlantVariantImages();
        await seedPotMaterials();
        await seedPots();
        await seedFertilizers.seedFertilizers();
        await seedFertilizers.seedPlantFertilizerSchedules();
        await seedPurchaseOrders();
        await seedWarehouseInventory();
        await seedPlantCategories.seedPlantCategories();
        await seedPlantCategories.assignCategoriesToPlants();

        console.log("✅ All seeders executed successfully!");
    } catch (error) {
        console.error("❌ Error while seeding:", error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

if (require.main === module) {
    runSeeder();
}
