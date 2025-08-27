const { prisma } = require("../../../config/prisma.config");

const saveNotification = async (userId, title, body, category, actionUrl) => {
    await prisma.notification.create({
        data: {
            userId,
            title,
            body,
            category,
            actionUrl
        }
    });
};

module.exports = { saveNotification };
