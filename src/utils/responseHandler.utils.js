const {
    RESPONSE_FLAGS,
    RESPONSE_CODES
} = require("../constants/responseCodes.constant");
const ERROR_MESSAGES = require("../constants/errorMessages.constant");

class ResponseHandler {
    static handleError(h, err, logMessage) {
        console.error(logMessage, err);

        return h
            .response({
                success: err.success || RESPONSE_FLAGS.FAILURE,
                error:
                    err.message || ERROR_MESSAGES.COMMON.INTERNAL_SERVER_ERROR
            })
            .code(err.code || RESPONSE_CODES.INTERNAL_SERVER_ERROR);
    }
}

module.exports = ResponseHandler;
