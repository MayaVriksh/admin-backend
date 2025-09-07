import { prisma } from '../../../config/prisma.config';

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

export { saveNotification };
