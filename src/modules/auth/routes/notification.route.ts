import * as ERROR_MESSAGES from '../../../constants/errorMessages.constant';
import { RESPONSE_CODES, RESPONSE_FLAGS } from '../../../constants/responseCodes.constant';
import { verifyAccessTokenMiddleware } from '../../../middlewares/authenticate.middleware';
import * as NotificationController from '../controllers/notification.controller';
import * as NotificationValidator from '../validations/notification.validation';

const handleValidationError = (err, h, routeName) => {
    const customErrorMessages = err.details.map((d) => d.message);
    console.error(`[Validation Error][${routeName}]`, customErrorMessages);

    return h
        .response({
            success: RESPONSE_FLAGS.FAILURE,
            error: ERROR_MESSAGES.COMMON.BAD_REQUEST,
            message: customErrorMessages
        })
        .code(RESPONSE_CODES.BAD_REQUEST)
        .takeover();
};

export default [
    {
        method: "GET",
        path: "/notifications",
        options: {
            tags: ["api", "Notification"],
            description: "Get user notifications",
            notes: [
                "Requires a valid access token.",
                "Fetches all notifications for a given userId.",
                "Returns both read and unread notifications."
            ],
            pre: [verifyAccessTokenMiddleware],
            handler: NotificationController.getUserNotifications,
            validate: {
                ...NotificationValidator.getUserNotificationsValidation,
                failAction: (req, h, err) =>
                    handleValidationError(err, h, "getUserNotifications")
            }
        }
    },
    {
        method: "PATCH",
        path: "/notifications/mark-read",
        options: {
            tags: ["api", "Notification"],
            description: "Mark one or more notifications as read",
            notes: [
                "Requires a valid access token.",
                "Accepts an array of notification IDs in the request body.",
                "If an ID does not exist or belongs to another user, it will be ignored.",
                "Returns a success response with the count of updated records."
            ],
            pre: [verifyAccessTokenMiddleware],
            handler: NotificationController.markNotificationsRead,
            validate: {
                ...NotificationValidator.markNotificationsReadValidation,
                failAction: (req, h, err) =>
                    handleValidationError(err, h, "markNotificationsRead")
            }
        }
    }
];
