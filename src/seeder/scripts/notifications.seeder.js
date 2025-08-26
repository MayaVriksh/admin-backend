const { prisma } = require("../../config/prisma.config");
const notifications = require("../data/notifications.data");

async function seedNotifications() {
    console.log("🔔 Seeding Notifications...");

    const users = await prisma.user.findMany({
        select: { userId: true, email: true },
    });

    if (!users.length) {
        console.log("⚠️ No users found. Please seed users first.");
        return;
    }

    for (const user of users) {
        for (const notification of notifications) {
            try {
                const existingNotification = await prisma.notification.findFirst({
                    where: {
                        userId: user.userId,
                        title: notification.title,
                    },
                });

                if (!existingNotification) {
                    await prisma.notification.create({
                        data: {
                            userId: user.userId,
                            title: notification.title,
                            body: notification.body,
                            category: notification.category, 
                            isRead: false,
                        },
                    });
                    console.log(`✅ Notification '${notification.title}' created for ${user.email}`);
                } else {
                    console.log(`⚠️ Notification '${notification.title}' already exists for ${user.email}`);
                }
            } catch (error) {
                console.error(
                    `❌ Error with notification '${notification.title}' for ${user.email}:`,
                    error.message
                );
            }
        }
    }

    console.log("✅ Notifications seeding completed.");
}

if (require.main === module) {
    seedNotifications()
        .catch((error) => {
            console.error("❌ Seeding failed:", error);
        })
        .finally(() => {
            prisma.$disconnect();
        });
}

module.exports = seedNotifications;
