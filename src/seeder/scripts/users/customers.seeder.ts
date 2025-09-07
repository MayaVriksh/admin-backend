import { prisma } from '../../../config/prisma.config';
import { customerUsers } from '../../data/users.data';
import { ROLES } from '../../../constants/roles.constant';
import { hashPassword, findRoleId, generateCustomId } from '../../helpers/user.utils';

async function seedCustomerUsers() {
    console.log("🌱 Seeding Customers...");
    const roleId = await findRoleId(ROLES.CUSTOMER);

    for (const entry of customerUsers) {
        await prisma.$transaction(async (tx) => {
            const userId = await generateCustomId(tx, ROLES.USER);
            const hashedPassword = await hashPassword(entry.user.password);

            const user = await tx.user.create({
                data: {
                    userId,
                    ...entry.user,
                    password: hashedPassword
                }
            });

            const customerId = await generateCustomId(tx, ROLES.CUSTOMER);
            await tx.customer.create({
                data: {
                    customerId,
                    userId: user.userId,
                    roleId
                }
            });

            console.log(`✅ Customer ${user.email} created`);
        });
    }
}

if (require.main === module) {
    seedCustomerUsers()
        .catch((err) => {
            console.error("❌ Customer seeding failed:", err);
        })
        .finally(async () => {
            await prisma.$disconnect();
        });
}

export default seedCustomerUsers;
