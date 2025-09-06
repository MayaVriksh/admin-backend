import * as ERROR_MESSAGES from '../../../constants/errorMessages.constant';
import { RESPONSE_CODES, RESPONSE_FLAGS } from '../../../constants/responseCodes.constant';
import SUCCESS_MESSAGES from '../../../constants/successMessages.constant';
import * as NotificationService from '../services/notification.service';

const getUserNotifications = async (req, h) => {
    const { userId } = req.pre.credentials;
    const { isRead, timeRange, page, limit } = req.query;

    try {
        const notifications = await NotificationService.getUserNotifications(
            userId,
            {
                isRead,
                timeRange,
                page,
                limit
            }
        );

        return h
            .response({
                success: RESPONSE_FLAGS.SUCCESS,
                message: SUCCESS_MESSAGES.NOTIFICATIONS.FETCHED,
                data: notifications
            })
            .code(RESPONSE_CODES.SUCCESS);
    } catch (error) {
        console.error("Error fetching notifications:", error);

        return h
            .response({
                success: RESPONSE_FLAGS.FAILURE,
                message: ERROR_MESSAGES.NOTIFICATIONS.FETCH_FAILED
            })
            .code(RESPONSE_CODES.INTERNAL_SERVER_ERROR);
    }
};

const markNotificationsRead = async (req, h) => {
    const { userId } = req.pre.credentials;
    const { notificationIds } = req.payload;

    try {
        await NotificationService.markNotificationsRead(
            userId,
            notificationIds
        );

        return h
            .response({
                success: RESPONSE_FLAGS.SUCCESS,
                message: SUCCESS_MESSAGES.NOTIFICATIONS.NOTIFICATION_READ
            })
            .code(RESPONSE_CODES.SUCCESS);
    } catch (error) {
        console.error("Error marking notifications as read:", error);

        return h
            .response({
                success: RESPONSE_FLAGS.FAILURE,
                message: ERROR_MESSAGES.NOTIFICATIONS.MARK_AS_READ_FAILED
            })
            .code(RESPONSE_CODES.INTERNAL_SERVER_ERROR);
    }
};

export {
    getUserNotifications,
    markNotificationsRead
};
