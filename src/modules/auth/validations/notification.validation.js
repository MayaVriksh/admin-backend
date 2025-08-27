const Joi = require("joi");

const getUserNotificationsValidation = {
    query: Joi.object({
        isRead: Joi.string()
            .valid("read", "unread", "all")
            .optional()
            .default("all"),
        timeRange: Joi.string()
            .valid("1d", "1w", "1m", "6m", "1y")
            .optional()
            .default("1m"),
        page: Joi.number().integer().min(1).optional().default(1),
        limit: Joi.number().integer().min(1).max(100).optional().default(10)
    })
};

const markNotificationsReadValidation = {
    payload: Joi.object({
        notificationIds: Joi.array()
            .items(Joi.string().required())
            .required()
            .min(1)
    })
};

module.exports = {
    getUserNotificationsValidation,
    markNotificationsReadValidation
};
