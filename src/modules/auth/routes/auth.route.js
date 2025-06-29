const ERROR_MESSAGES = require("../../../constants/errorMessages.constant");
const {
    RESPONSE_FLAGS,
    RESPONSE_CODES
} = require("../../../constants/responseCodes.constant");
const {
    verifyAccessTokenMiddleware
} = require("../../../middlewares/authenticate.middleware");
const AuthController = require("../controllers/auth.controller");
const AuthValidator = require("../validations/auth.validator");

module.exports = [
    {
        method: "POST",
        path: "/auth/register",
        options: {
            tags: ["api", "Auth"],
            description: "Register a new user",
            notes: "Creates a new user account in the system with role-based mapping.",
            handler: AuthController.signup,
            validate: {
                ...AuthValidator.registerUserValidation,
                failAction: (_, h, err) => {
                    const customErrorMessages = err.details.map(
                        detail => detail.message
                    );
                    console.log("Validation Error: ", customErrorMessages);
                    return h
                        .response({
                            success: RESPONSE_FLAGS.FAILURE,
                            error: ERROR_MESSAGES.COMMON.BAD_REQUEST,
                            message: customErrorMessages
                        })
                        .code(RESPONSE_CODES.BAD_REQUEST)
                        .takeover();
                }
            },
            payload: {
                parse: true,
                allow: ["application/json"]
            },
            plugins: {
                "hapi-swagger": {
                    payloadType: "json",
                    responses: {
                        201: {
                            description: "User registered successfully"
                        },
                        400: {
                            description: "Validation error"
                        },
                        409: {
                            description: "User already exists"
                        }
                    }
                }
            }
        }
    },

    {
        method: "POST",
        path: "/auth/login",
        options: {
            tags: ["api", "Auth"],
            description: "Login to your account",
            notes: "Allows a user to log in using email/username and password.",
            handler: AuthController.signin,
            validate: {
                ...AuthValidator.loginUserValidation,
                failAction: (_, h, err) => {
                    const customErrorMessages = err.details.map(
                        detail => detail.message
                    );
                    console.log("Validation Error: ", customErrorMessages);
                    return h
                        .response({
                            success: RESPONSE_FLAGS.FAILURE,
                            error: ERROR_MESSAGES.COMMON.BAD_REQUEST,
                            message: customErrorMessages
                        })
                        .code(RESPONSE_CODES.BAD_REQUEST)
                        .takeover();
                }
            },
            payload: {
                parse: true,
                allow: ["application/json"]
            },
            plugins: {
                "hapi-swagger": {
                    payloadType: "json",
                    responses: {
                        200: {
                            description: "Login successful"
                        },
                        400: {
                            description: "Validation error"
                        },
                        401: {
                            description: "Unauthorized"
                        }
                    }
                }
            }
        }
    },
    // --- NEW REFRESH TOKEN ROUTE ---
    {
        method: "POST",
        path: "/auth/refresh-token",
        options: {
            tags: ["api", "Auth"],
            description: "Obtain a new access token using the refresh token cookie.",
            handler: AuthController.refreshToken
        }
    },
    // ----- LOG OUT Route ------
    {
        method: "POST",
        path: "/auth/logout",
        options: {
            tags: ["api", "Auth"],
            description: "Logout the user",
            notes: "Clears the authentication cookies and logs the user out.",
            handler: AuthController.logout,
            plugins: {
                "hapi-swagger": {
                    responses: {
                        200: {
                            description: "Logout successful"
                        },
                        500: {
                            description: "Logout failed due to server error"
                        }
                    }
                }
            }
        }
    },

    {
        method: "GET",
        path: "/auth/verify-profile",
        options: {
            tags: ["api", "Auth"],
            description: "Verify User Profile",
            notes: "Verify the current user's Access Token and return their profile.",
            pre: [verifyAccessTokenMiddleware],
            // handler: AuthController.verifyUser,
            handler: (req, h) => {
                // The user data is now available from the middleware without a DB call
                const userCredentials = req.auth.credentials;
                return h.response({
                    success: RESPONSE_FLAGS.SUCCESS,
                    message: "User profile verified successfully 🌿",
                    data: { user: userCredentials }
                }).code(RESPONSE_CODES.SUCCESS);
            },
            plugins: {
                "hapi-swagger": {
                    responses: {
                        200: {
                            description: "User profile verified successfully 🌿"
                        },
                        401: {
                            description:
                                "Unauthorized - Invalid or expired token 🌱"
                        },
                        500: {
                            description:
                                "Internal Server Error while verifying profile 🌾"
                        }
                    }
                }
            }
        }
    },

    {
        method: "PUT",
        path: "/auth/deactivate-profile",
        options: {
            tags: ["api", "Auth"],
            description: "Deactivate the currently authenticated user's profile.",
            notes: "This action will also clear the user's refresh token, effectively logging them out.",
            // <-- MODIFIED: Switched from the old `authenticate` to the new `verifyAccessTokenMiddleware`.
            // This makes the initial check fast and stateless.
            pre: [verifyAccessTokenMiddleware],
            // Your controller will need a minor update to get the userId from `req.auth.credentials.userId`.
            handler: AuthController.deactivateProfile, 
            validate: {
                // You might not even need validation here if there's no payload.
                // If there is (e.g., password confirmation), it would go here.
                // ...AuthValidator.deactivateProfileValidation,
                failAction: (_, h, err) => {
                    const customErrorMessages = err.details.map(
                        detail => detail.message
                    );
                    console.log("Validation Error: ", customErrorMessages);
                    return h
                        .response({
                            success: RESPONSE_FLAGS.FAILURE,
                            error: ERROR_MESSAGES.COMMON.BAD_REQUEST,
                            message: customErrorMessages
                        })
                        .code(RESPONSE_CODES.BAD_REQUEST)
                        .takeover();
                }
            },
            plugins: {
                "hapi-swagger": {
                    responses: {
                        200: {
                            description: "Profile deactivated successfully"
                        },
                        500: {
                            description: "Internal server error"
                        }
                    }
                }
            }
        }
    },

    //  ----------------- Change Password Route -------------
    {
        method: "PUT",
        path: "/auth/change-password",
        options: {
            tags: ["api", "Auth"],
            description: "Change the currently authenticated user's password.",
            notes: "Requires the user's old password and a new password.",
            // <-- MODIFIED: Switched from the old `authenticate` to the new `verifyAccessTokenMiddleware`.
            pre: [verifyAccessTokenMiddleware],
            // Your controller gets the userId from `req.auth.credentials.userId` and passwords from `req.payload`.
            handler: AuthController.changePassword,
            // pre: [authenticate],
            validate: {
                ...AuthValidator.changePasswordValidation,
                failAction: (_, h, err) => {
                    const customErrorMessages = err.details.map(
                        detail => detail.message
                    );
                    console.log("Validation Error: ", customErrorMessages);
                    return h
                        .response({
                            success: RESPONSE_FLAGS.FAILURE,
                            error: ERROR_MESSAGES.COMMON.BAD_REQUEST,
                            message: customErrorMessages
                        })
                        .code(RESPONSE_CODES.BAD_REQUEST)
                        .takeover();
                }
            },
            plugins: {
                "hapi-swagger": {
                    responses: {
                        200: {
                            description: "Password updated successfully"
                        },
                        400: {
                            description: "Validation or logical error"
                        },
                        403: { description: "Forbidden (e.g., old password incorrect)" },
                        500: { description: "Server error" }
                    }
                }
            }
        }
    }
];
