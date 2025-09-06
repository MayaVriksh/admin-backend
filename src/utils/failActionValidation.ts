import * as ERROR_MESSAGES from '../constants/errorMessages.constant';
import { RESPONSE_CODES, RESPONSE_FLAGS } from '../constants/responseCodes.constant';

/**
 * A reusable Hapi failAction handler for Joi validation errors.
 * It formats the error messages and returns a standard 400 Bad Request response.
 * @param {object} request - The Hapi request object.
 * @param {object} h - The Hapi response toolkit.
 * @param {Error} err - The original error object from Joi.
 * @returns {ResponseObject} A Hapi response object.
 */
const handleValidationFailure = (request, h, err) => {
    // Extract the user-friendly messages from the Joi error details
    const customErrorMessages = err.details.map((detail) => detail.message);

    // Log the error for debugging purposes on the server
    console.error("Joi Validation Error:", customErrorMessages);

    // Return a standardized error response to the client
    return h
        .response({
            success: RESPONSE_FLAGS.FAILURE,
            message: ERROR_MESSAGES.COMMON.BAD_REQUEST
        })
        .code(RESPONSE_CODES.BAD_REQUEST)
        .takeover();
};

export {
    handleValidationFailure
};
