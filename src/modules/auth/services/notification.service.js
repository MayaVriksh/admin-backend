const { prisma } = require("../../../config/prisma.config");
const NotificationRepository = require("../repositories/notification.repository");

const getUserNotifications = async (
    userId,
    { isRead = "all", timeRange = "1m", page = 1, limit = 10 }
) => {
    const where = { userId };

    if (isRead === "read") {
        where.isRead = true;
    } else if (isRead === "unread") {
        where.isRead = false;
    }

    if (timeRange && timeRange !== "all") {
        const now = new Date();
        let fromDate = null;

        switch (timeRange) {
            case "1d":
                fromDate = new Date(now.setDate(now.getDate() - 1));
                break;
            case "1w":
                fromDate = new Date(now.setDate(now.getDate() - 7));
                break;
            case "1m":
                fromDate = new Date(now.setMonth(now.getMonth() - 1));
                break;
            case "6m":
                fromDate = new Date(now.setMonth(now.getMonth() - 6));
                break;
            case "1y":
                fromDate = new Date(now.setFullYear(now.getFullYear() - 1));
                break;
        }

        if (fromDate) {
            where.createdAt = { gte: fromDate };
        }
    }

    const skip = (page - 1) * limit;
    const take = limit;

    console.log(where);

    const [notifications, totalCount] = await Promise.all([
        prisma.notification.findMany({
            where,
            orderBy: { createdAt: "desc" },
            skip,
            take
        }),
        prisma.notification.count({ where })
    ]);

    return {
        notifications,
        pagination: {
            page,
            limit,
            totalCount,
            totalPages: Math.ceil(totalCount / limit)
        }
    };
};

const markNotificationsRead = async (userId, notificationIds) => {
    return prisma.notification.updateMany({
        where: {
            id: { in: notificationIds },
            userId
        },
        data: { isRead: true }
    });
};

const createNotification = async (userId, title, body, category, actionUrl) => {
    await NotificationRepository.saveNotification(
        userId,
        title,
        body,
        category,
        actionUrl
    );
};

module.exports = {
    getUserNotifications,
    markNotificationsRead,
    createNotification
};
