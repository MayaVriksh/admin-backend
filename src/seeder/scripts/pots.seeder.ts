import { prisma } from '../../config/prisma.config';
import generateCustomId from '../../utils/generateCustomId';
import { PRODUCT_TYPES } from '../../constants/general.constant';
import potData from '../data/pots.data';
import { v4 as uuidv4 } from 'uuid';

async function seedPots() {
  try {
    console.log("🪴 Fetching colors and materials...");
    const colors = await prisma.color.findMany();
    const materials = await prisma.potMaterial.findMany();

    if (!colors.length || !materials.length) {
      throw new Error("❌ Colors or Materials missing. Please seed them first.");
    }

    console.log("🪻 Seeding Pot Categories, SizeProfiles, and Variants...");

    await prisma.$transaction(
      async (tx) => {
        for (const pot of potData) {
          if (!pot?.name || !Array.isArray(pot.variants)) {
            console.warn(`⚠️ Skipping invalid pot data:`, pot);
            continue;
          }

          const existingCategory = await tx.potCategory.findFirst({
            where: { name: pot.name },
          });

          if (existingCategory) {
            console.log(`⚠️ Pot category '${pot.name}' already exists`);
            continue;
          }

          // 1️⃣ Create Category
          const categoryId = await generateCustomId(tx, PRODUCT_TYPES.POT);
          const createdCategory = await tx.potCategory.create({
            data: {
              categoryId,
              name: pot.name,
              description: pot.description,
            },
          });

          for (let i = 0; i < pot.variants.length; i++) {
            const variant = pot.variants[i];
            const color = colors[i % colors.length];
            const material = materials[i % materials.length];

            // 2️⃣ Create Size Profile (per size per category)
            const sizeProfile = await tx.potSizeProfile.upsert({
              where: {
                categoryId_size: {
                  categoryId: createdCategory.categoryId,
                  size: variant.size,
                },
              },
              update: {},
              create: {
                potSizeProfileId: uuidv4(),
                categoryId: createdCategory.categoryId,
                size: variant.size,
                height: variant.height,
                weight: variant.weight,
              },
            });

            // 3️⃣ Create Size+Material Option
            const sizeMaterialOption = await tx.sizeMaterialOption.upsert({
              where: {
                potSizeProfileId_materialId: {
                  potSizeProfileId: sizeProfile.potSizeProfileId,
                  materialId: material.materialId,
                },
              },
              update: {},
              create: {
                sizeMaterialOptionId: uuidv4(),
                potSizeProfileId: sizeProfile.potSizeProfileId,
                materialId: material.materialId,
              },
            });

            // 4️⃣ Create Pot Variant
            const potVariantId = await generateCustomId(tx, PRODUCT_TYPES.POT_VARIANT);

            await tx.potVariants.create({
              data: {
                potVariantId,
                sizeMaterialOptionId: sizeMaterialOption.sizeMaterialOptionId,
                colorId: color.id,
                potName: variant.potName,
                sku: variant.sku,
                mrp: variant.mrp,
                isEcoFriendly: variant.isEcoFriendly,
                isPremium: variant.isPremium,
              },
            });
          }

          console.log(`✅ Category '${pot.name}' with ${pot.variants.length} variants created`);
        }
      },
      {
        timeout: 15000,
      }
    );

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

export default seedPots;
