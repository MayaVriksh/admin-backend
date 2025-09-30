const {
    RESPONSE_FLAGS,
    RESPONSE_CODES
} = require("../constants/responseCodes.constant");
const ERROR_MESSAGES = require("../constants/errorMessages.constant");

class ResponseHandler {
    static handleError(h, err, logMessage = "Error occurred") {
        // Default to 500 if code not provided
        const statusCode = err.code || RESPONSE_CODES.INTERNAL_SERVER_ERROR;

        console.error(logMessage, err);

        const errorMessage =
            statusCode !== RESPONSE_CODES.INTERNAL_SERVER_ERROR
                ? err.message || ERROR_MESSAGES.COMMON.BAD_REQUEST
                : ERROR_MESSAGES.COMMON.INTERNAL_SERVER_ERROR;

        const errorResponse = {
            success: RESPONSE_FLAGS.FAILURE,
            error: errorMessage
        };

        if (err.details) {
            errorResponse.details = err.details;
        }

        return h.response(errorResponse).code(statusCode);
    }
}

module.exports = ResponseHandler;
