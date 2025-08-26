const NotificationController = require("../controllers/notification.controller");
const NotificationValidator = require("../validations/notification.validation");
const ERROR_MESSAGES = require("../../../constants/errorMessages.constant");
const {
    RESPONSE_FLAGS,
    RESPONSE_CODES
} = require("../../../constants/responseCodes.constant");
const {
    verifyAccessTokenMiddleware
} = require("../../../middlewares/authenticate.middleware");

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

module.exports = [
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
