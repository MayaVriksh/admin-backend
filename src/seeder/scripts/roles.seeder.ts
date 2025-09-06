import { roles } from '../data/roles.data';
import { prisma } from '../../config/prisma.config';
import { ROLE } from '../../constants/prefix.constant';
import generateCustomId from '../../utils/generateCustomId';

async function seedRoles() {
    console.log("🌱 Seeding Roles...");

    try {
        await prisma.$transaction(
            async (tx) => {
                for (const roleData of roles) {
                    if (!roleData.role) {
                        console.warn(
                            `⚠️  Skipping invalid role data:`,
                            roleData
                        );
                        continue;
                    }

                    const existingRole = await tx.role.findFirst({
                        where: { role: roleData.role }
                    });

                    if (!existingRole) {
                        const roleId = await generateCustomId(tx, ROLE);
                        await tx.role.create({
                            data: {
                                roleId,
                                role: roleData.role,
                                addedByType: roleData.addedByType,
                                addedByUserId: roleData.addedByUserId
                            }
                        });
                        console.log(`✅ Role '${roleData.role}' created`);
                    } else {
                        console.log(
                            `⚠️  Role '${roleData.role}' already exists`
                        );
                    }
                }
            },
            {
                // maxWait: 15000,
                timeout: 15000
            }
        );

        console.log("✅ Role seeding completed.");
    } catch (error) {
        console.error("❌ Error during role seeding:", error);
    }
}

if (require.main === module) {
    seedRoles()
        .catch((error) => {
            console.error("❌ Seeding failed:", error);
        })
        .finally(async () => {
            await prisma.$disconnect();
        });
}

export default seedRoles;
