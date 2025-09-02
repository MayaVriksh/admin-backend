const ERROR_MESSAGES = require("../../../constants/errorMessages.constant");
const {
    RESPONSE_FLAGS,
    RESPONSE_CODES
} = require("../../../constants/responseCodes.constant");
const { ROLES } = require("../../../constants/roles.constant");
const {
    verifyAccessTokenMiddleware,
    requireRole
} = require("../../../middlewares/authenticate.middleware");
const AuthController = require("../controllers/auth.controller");
const AuthValidator = require("../validations/auth.validator");
const {
    handleValidationFailure
} = require("../../../utils/failActionValidation");

module.exports = [
    /** -------------------------- Customer quick Sign In Auth Flow ------------------- */

    // Customer Auth: API for sending OTP to phone number
    {
        method: "POST",
        path: "/auth/customer/send-otp",
        options: {
            tags: ["api", "Customer Auth"],
            description:
                "Send a verification OTP to a customer's phone number.",
            handler: AuthController.sendOtp,
            validate: {
                ...AuthValidator.sendOtpValidation,
                failAction: handleValidationFailure
            },
            plugins: {
                "hapi-swagger": {
                    responses: {
                        200: { description: "Email verified successfully" },
                        400: { description: "Validation or logical error" },
                        403: {
                            description:
                                "Forbidden (e.g., OTP expired or invalid)"
                        },
                        500: { description: "Server error" }
                    }
                }
            }
        }
    },

    // Customer Auth: API for verifying the OTP received
    {
        method: "POST",
        path: "/auth/customer/verify-otp",
        options: {
            tags: ["api", "Customer Auth"],
            description:
                "Verify a phone OTP. Logs in the user if they exist, otherwise signals to register.",
            handler: AuthController.verifyOtp,
            validate: {
                ...AuthValidator.verifyOtpValidation,
                failAction: handleValidationFailure
            }
        }
    },

    // Customer Auth: API for quick customer registration
    {
        method: "POST",
        path: "/auth/customer/quick-register",
        options: {
            tags: ["api", "Customer Auth"],
            description:
                "Complete registration for a new customer after OTP verification.",
            handler: AuthController.quickRegister,
            validate: {
                ...AuthValidator.quickRegisterValidation,
                failAction: handleValidationFailure
            }
        }
    }
];
