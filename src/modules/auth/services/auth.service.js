const { prisma } = require("../../../config/prisma.config");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken
} = require("../../../utils/jwt.util");
const generateCustomId = require("../../../utils/generateCustomId");
const { ROLES } = require("../../../constants/roles.constant");
const ERROR_MESSAGES = require("../../../constants/errorMessages.constant");
const {
    RESPONSE_FLAGS,
    RESPONSE_CODES
} = require("../../../constants/responseCodes.constant");
const SUCCESS_MESSAGES = require("../../../constants/successMessages.constant.js");
const {
    FIRST_NAME,
    LAST_NAME
} = require("../../../constants/general.constant.js");
const generateOtpCode = require("../../../utils/generateOtp.utils.js");
const { sendEmail } = require("../../../utils/email.util.js");
const {
    AUTH,
    CUSTOMER
} = require("../../../constants/emailSubjects.constants.js");
const verifyEmailTemplate = require("../../../email-templates/auth/verifyEmail.template.js");
const welcomeTemplate = require("../../../email-templates/users/welcome.template.js");


const generateEmailOtp = async (email, userId = null) => {
    console.log("In AuthService: Generating Email OTP");

    // Check if email already exists in User table
    const existingUser = await prisma.user.findUnique({
        where: { email }
    });

    if (existingUser) {
        throw {
            success: RESPONSE_FLAGS.FAILURE,
            code: RESPONSE_CODES.CONFLICT,
            message: ERROR_MESSAGES.AUTH.EMAIL_ALREADY_EXISTS
        };
    }

    const otp = generateOtpCode(6);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await saveOtp(email, otp, expiresAt, userId);

    await sendEmail(
        email,
        AUTH.VERIFY_EMAIL,
        verifyEmailTemplate({
            name: "Green Friend",
            email,
            otp,
            requestedAt: new Date().toLocaleString()
        })
    );

    console.log(
        `📩 OTP generated for ${email}: ${otp}, expires at ${expiresAt}`
    );
};

const saveOtp = async (email, otp, expiresAt, userId) => {
    console.log(`➕ Creating new OTP record for ${email}`);
    return prisma.emailVerification.create({
        data: {
            id: uuidv4(),
            email,
            userId,
            token: otp,
            expiresAt
        }
    });
};

const getLatestEmailVerificationRecord = async (email) => {
    console.log(`📂 Fetching latest OTP record for ${email}`);
    return prisma.emailVerification.findFirst({
        where: { email },
        orderBy: { createdAt: "desc" }
    });
};

const verifyEmailOtp = async (email, otp) => {
    console.log("In AuthService: Verifying Email OTP");

    const record = await getLatestEmailVerificationRecord(email);

    validateOtpRecord(record, otp);

    await markOtpVerified(record.id);

    console.log(`✅ Email verified: ${email}`);
};

const validateOtpRecord = (record, otp) => {
    if (!record) {
        console.log("❌ No OTP record found");
        throw {
            success: RESPONSE_FLAGS.FAILURE,
            code: RESPONSE_CODES.NOT_FOUND,
            message: ERROR_MESSAGES.OTP.ERROR
        };
    }

    if (record.verified) {
        console.log("⚠️ OTP already used");
        throw {
            success: RESPONSE_FLAGS.FAILURE,
            code: RESPONSE_CODES.CONFLICT,
            message: ERROR_MESSAGES.OTP.ALREADY_USED
        };
    }

    if (record.token !== otp) {
        console.log("❌ Invalid OTP entered");
        throw {
            success: RESPONSE_FLAGS.FAILURE,
            code: RESPONSE_CODES.BAD_REQUEST,
            message: ERROR_MESSAGES.OTP.INVALID
        };
    }

    if (new Date() > record.expiresAt) {
        console.log("⏰ OTP expired");
        throw {
            success: RESPONSE_FLAGS.FAILURE,
            code: RESPONSE_CODES.GONE,
            message: ERROR_MESSAGES.OTP.EXPIRED
        };
    }
};

const markOtpVerified = async (id) => {
    console.log(`🔒 Marking OTP record as verified: ${id}`);
    return prisma.emailVerification.update({
        where: { id },
        data: {
            verified: true,
            verifiedAt: new Date(),
            updatedAt: new Date()
        }
    });
};

const register = async (data) => {
    const {
        firstName,
        lastName,
        email,
        emailVerified,
        phoneNumber,
        phoneVerified,
        password,
        role
    } = data;

    return await prisma.$transaction(async (tx) => {
        const existingUserByPhone = await tx.user.findFirst({
            where: { phoneNumber }
        });
        if (existingUserByPhone) {
            throw {
                success: RESPONSE_FLAGS.FAILURE,
                code: RESPONSE_CODES.BAD_REQUEST,
                message: ERROR_MESSAGES.AUTH.PHONE_ALREADY_EXISTS
            };
        }

        const existingUserByEmail = await tx.user.findFirst({
            where: { email }
        });
        if (existingUserByEmail) {
            throw {
                success: RESPONSE_FLAGS.FAILURE,
                code: RESPONSE_CODES.BAD_REQUEST,
                message: ERROR_MESSAGES.AUTH.EMAIL_ALREADY_REGISTERED
            };
        }

        const roleRecord = await tx.role.findUnique({ where: { role } });
        if (!roleRecord) {
            throw {
                success: RESPONSE_FLAGS.FAILURE,
                code: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
                message: ERROR_MESSAGES.ROLES_PERMISSIONS.ROLE_ASSIGN_FAILED
            };
        }

        const userId = await generateCustomId(tx, ROLES.USER);
        const hashedPassword = await bcrypt.hash(password, 10);

        let roleEntityId;
        switch (role) {
            case ROLES.CUSTOMER:
                roleEntityId = await generateCustomId(tx, ROLES.CUSTOMER);
                break;
            case ROLES.ADMIN:
                roleEntityId = await generateCustomId(tx, ROLES.ADMIN);
                break;
            case ROLES.SUPER_ADMIN:
                roleEntityId = await generateCustomId(tx, ROLES.SUPER_ADMIN);
                break;
            case ROLES.SUPPLIER:
                roleEntityId = await generateCustomId(tx, ROLES.SUPPLIER);
                break;
            case ROLES.KEY_AREA_MANAGER:
            case ROLES.EMPLOYEE:
                roleEntityId = await generateCustomId(tx, ROLES.EMPLOYEE);
                break;
            default:
                throw {
                    success: RESPONSE_FLAGS.FAILURE,
                    code: RESPONSE_CODES.BAD_REQUEST,
                    message: ERROR_MESSAGES.AUTH.INVALID_REGISTRATION
                };
        }

        const createdUser = await tx.user.create({
            data: {
                userId,
                roleId: roleRecord.roleId,
                email,
                emailVerified,
                phoneNumber,
                phoneVerified,
                password: hashedPassword,
                fullName: {
                    firstName,
                    lastName: lastName || ""
                }
            }
        });

        const roleEntityMap = {
            [ROLES.CUSTOMER]: {
                model: tx.customer,
                data: { customerId: roleEntityId, userId: createdUser.userId }
            },
            [ROLES.ADMIN]: {
                model: tx.admin,
                data: { adminId: roleEntityId, userId: createdUser.userId }
            },
            [ROLES.SUPER_ADMIN]: {
                model: tx.superAdmin,
                data: {
                    superAdminId: roleEntityId,
                    userId: createdUser.userId
                }
            },
            [ROLES.SUPPLIER]: {
                model: tx.supplier,
                data: { supplierId: roleEntityId, userId: createdUser.userId }
            },
            [ROLES.KEY_AREA_MANAGER]: {
                model: tx.employee,
                data: { employeeId: roleEntityId, userId: createdUser.userId }
            },
            [ROLES.EMPLOYEE]: {
                model: tx.employee,
                data: { employeeId: roleEntityId, userId: createdUser.userId }
            }
        };

        const handler = roleEntityMap[role];
        if (!handler) {
            throw {
                success: RESPONSE_FLAGS.FAILURE,
                code: RESPONSE_CODES.BAD_REQUEST,
                message: ERROR_MESSAGES.COMMON.ACTION_FAILED
            };
        }

        await handler.model.create({ data: handler.data });
    });
};

/**
 * @private - Internal function to validate a user's password and active status.
 * @param {object} user - The full user object from Prisma and password from UI, for matching passwords.
 */
const _verifyUserCredentials = async (user, password) => {
    if (!user) {
        throw {
            success: RESPONSE_FLAGS.FAILURE,
            code: RESPONSE_CODES.UNAUTHORIZED,
            message: ERROR_MESSAGES.AUTH.EMAIL_NOT_EXISTS
        };
    }

    if (!user.isActive || user.deletedAt) {
        throw {
            success: RESPONSE_FLAGS.FAILURE,
            code: RESPONSE_CODES.BAD_REQUEST,
            message: ERROR_MESSAGES.AUTH.ACCOUNT_INACTIVE
        };
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw {
            success: RESPONSE_FLAGS.FAILURE,
            code: RESPONSE_CODES.UNAUTHORIZED,
            message: ERROR_MESSAGES.AUTH.PASSWORD_WRONG
        };
    }
};

/**
 * @private - Generates a new access token for a validated user. Determine the final 'isVerified' status based on role
 */
const _generateAccessTokenAndPayload = (user) => {
    const isSupplier = user.role.role === "SUPPLIER";
    const finalIsVerified = isSupplier
        ? user.Supplier?.isVerified || false
        : true;

    const accessTokenPayload = {
        userId: user.userId,
        fullName: user.fullName,
        username: user.fullName[FIRST_NAME] || user.fullName[LAST_NAME],
        role: user.role.role,
        profileImageUrl: user.profileImageUrl,
        isVerified: finalIsVerified,
        isActive: user.isActive
    };

    return generateAccessToken(accessTokenPayload);
};

/**
 * @private - Creates a sanitized user profile object from a raw user record.
 */
const _createUserProfile = (user) => {
    const isSupplier = user.role.role === "SUPPLIER";
    const finalIsVerified = isSupplier
        ? user.Supplier?.isVerified || false
        : true;

    const { password: _, deletedAt: __, ...userProfile } = user;
    userProfile.isVerified = finalIsVerified;
    console.log(user, "user");
    console.log(userProfile, "userProfile");
    return userProfile;
    // return {
    //     userId: user.userId,
    //     firstName: user.fullName.FIRST_NAME,
    //     lastName: user.fullName.LAST_NAME,
    //     email: user.email,
    //     role: user.role.role,
    //     profileImageUrl: user.profileImageUrl,
    //     isVerified: finalIsVerified,
    //     isActive: user.isActive
    // };
};

/**
 * @private - Fetches the complete user profile for authentication purposes.
 * @param {object} whereClause - The Prisma where clause (e.g., { email } or { userId }).
 * @param {boolean} [includePassword=false] - Whether to include the password hash in the result.
 * @returns {Promise<object|null>} The user object or null if not found.
 */
const _getAuthenticatedUser = async (whereClause, includePassword = false) => {

    // Start with a base selection of all non-sensitive fields.
    const selectClause = {
        userId: true,
        fullName: true,
        email: true,
        isActive: true,
        profileImageUrl: true,
        deletedAt: true,
        role: {
            select: { role: true }
        },
        Supplier: {
            select: { isVerified: true }
        }
    };

    // Conditionally add the password to the selection only if needed.
    if (includePassword) {
        selectClause.password = true;
    }

    return await prisma.user.findUnique({
        where: whereClause,
        select: selectClause
    });
};

/**
 * Authenticates a user with their email and password, then generates a full session.
 * This is the primary function for user login.
 *
 * The process involves three main steps:
 * 1. Fetches the user's data from the database, including their password hash.
 * 2. Verifies the provided password against the stored hash and checks if the account is active.
 * 3. If credentials are valid, it generates a user profile object, a short-lived access token,
 * and a long-lived refresh token.
 *
 * @param {string} email - The user's email address.
 * @param {string} password - The user's raw password for verification.
 * @returns {Promise<{userProfile: object, accessToken: string, refreshToken: string}>} An object containing the user's profile, a new access token, and a new refresh token.
 * @throws {Error} Throws an error if authentication fails (e.g., invalid credentials, inactive account).
 */
const login = async (email, password) => {
    console.log("In AuthService Page for Logging In");
    const user = await _getAuthenticatedUser({ email }, true);
    await _verifyUserCredentials(user, password);

    // const userProfile = _createUserProfile(user);
    const accessToken = _generateAccessTokenAndPayload(user);
    const refreshToken = generateRefreshToken({ userId: user.userId });

    console.log("Refresh Token:", refreshToken);
    return { accessToken, refreshToken };
};

/**
 * Refreshes a user's session by validating a refresh token and issuing a new access token.
 * This should be called by the /auth/refresh-token endpoint when the short-lived access token expires.
 *
 * This process ensures the user remains logged in without re-entering their password. It performs
 * a critical security check by re-fetching the user from the database to ensure their account
 * is still active and valid before issuing a new token.
 *
 * @param {string} token - The long-lived refresh token sent by the client.
 * @returns {Promise<{userProfile: object, newAccessToken: string}>} An object containing the user's profile and a new short-lived access token.
 * @throws {Error} Throws an error if the refresh token is invalid, expired, or the user is no longer active.
 */
const refreshUserToken = async (token) => {
    try {
        const decoded = verifyRefreshToken(token);
        console.log("Refresh Token being Generated", decoded);

        const user = await _getAuthenticatedUser({ userId: decoded.userId });
        console.log(
            "User Detail In AuthService Page for Refresh User Token:",
            user
        );

        if (!user || !user.isActive || user.deletedAt) {
            throw new Error("User account is no longer active.");
        }

        // const userProfile = _createUserProfile(user);
        const accessToken = _generateAccessTokenAndPayload(user);

        return { newAccessToken: accessToken };
    } catch (error) {
        console.error("Refresh token validation failed:", error.message);
        throw new Error("Invalid refresh token. Please log in again.");
    }
};

const deactivateUser = async (userId) => {
    const user = await prisma.user.findUnique({
        where: { userId }
    });

    if (!user) {
        throw {
            success: RESPONSE_FLAGS.FAILURE,
            code: RESPONSE_CODES.NOT_FOUND,
            message: ERROR_MESSAGES.USERS.PROFILE_NOT_FOUND
        };
    }

    if (!user.isActive || user.deletedAt) {
        throw {
            success: RESPONSE_FLAGS.FAILURE,
            code: RESPONSE_CODES.BAD_REQUEST,
            message: ERROR_MESSAGES.AUTH.ACCOUNT_ALREADY_DEACTIVATED
        };
    }

    await prisma.user.update({
        where: { userId },
        data: {
            isActive: false,
            deletedAt: new Date()
        }
    });
};

/**
 * Re-activates a user account that was previously deactivated.
 * Sets isActive to true and deletedAt to null.
 * @param {string} userId - The ID of the user to reactivate.
 * @returns {object} A success message.
 */
const reactivateUserProfile = async (userId) => {
    // First, find the user to ensure they exist.
    const user = await prisma.user.findUnique({
        where: { userId }
    });

    if (!user) {
        throw {
            code: RESPONSE_CODES.NOT_FOUND,
            message: ERROR_MESSAGES.USERS.PROFILE_NOT_FOUND
        };
    }

    // Check if the account is already active to prevent redundant updates.
    if (user.isActive && user.deletedAt === null) {
        throw {
            code: RESPONSE_CODES.BAD_REQUEST,
            message: ERROR_MESSAGES.AUTH.ACCOUNT_ALREADY_ACTIVE
        };
    }

    // Update the user record to reactivate the account.
    await prisma.user.update({
        where: { userId },
        data: {
            isActive: true,
            deletedAt: null, // This is crucial to "un-delete" the user.
            deactivationReason: null // Optional: Clear the reason for deactivation.
        }
    });
};

const changePassword = async (userId, oldPassword, newPassword) => {
    const user = await prisma.user.findUnique({
        where: { userId },
        select: {
            password: true,
            isActive: true,
            deletedAt: true
        }
    });

    if (!user) {
        throw {
            success: RESPONSE_FLAGS.FAILURE,
            code: RESPONSE_CODES.UNAUTHORIZED,
            message: ERROR_MESSAGES.USERS.PROFILE_NOT_FOUND
        };
    }

    if (!user.isActive || user.deletedAt) {
        throw {
            success: RESPONSE_FLAGS.FAILURE,
            code: RESPONSE_CODES.BAD_REQUEST,
            message: ERROR_MESSAGES.AUTH.ACCOUNT_INACTIVE
        };
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
        throw {
            success: RESPONSE_FLAGS.FAILURE,
            code: RESPONSE_CODES.UNAUTHORIZED,
            message: ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS
        };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
        where: { userId },
        data: {
            password: hashedPassword
        }
    });

    return {
        success: RESPONSE_FLAGS.SUCCESS,
        code: RESPONSE_CODES.SUCCESS,
        message: SUCCESS_MESSAGES.AUTH.PASSWORD_CHANGED
    };
};

// This helper function should be moved to a shared utility or base auth service for reusability
const _generateCustomerSession = (user) => {
    console.log(user)
    const isVerified = user.phoneVerified;
    const userProfile = {
        userId: user.userId,
        firstName: user.fullName[FIRST_NAME],
        lastName: user.fullName[LAST_NAME],
        email: user.email,
        role: user.role.role,
        isVerified: isVerified
    };
    const accessTokenPayload = {
        userId: user.userId,
        username: user.fullName[FIRST_NAME],
        role: user.role.role,
        isVerified: isVerified
    };
    const accessToken = generateAccessToken(accessTokenPayload);
    const refreshToken = generateRefreshToken({ userId: user.userId });
    return { userProfile, accessToken, refreshToken };
};

const sendOtpToCustomer = async (phoneNumber) => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    const hashedOtp = await bcrypt.hash(otp, 10);
    console.log(otp);
    console.log(phoneNumber);
    console.log(hashedOtp);
    console.log(expiresAt);

    await prisma.phoneVerification.create({
        data: { id: uuidv4(), phoneNumber, otp: hashedOtp, expiresAt }
    });
    // In a real application, you would integrate an SMS gateway here to send the OTP
    console.log(`[For Testing] OTP for ${phoneNumber} is: ${otp}`);

    return { success: true, code: 200, message: `OTP sent to ${phoneNumber}.` };
};

const verifyOtpAndCheckUser = async (phoneNumber, otp) => {
    console.log(phoneNumber)
    const verificationRecord = await prisma.phoneVerification.findFirst({
        where: { phoneNumber },
        orderBy: { createdAt: 'desc' }
    });
    console.log(verificationRecord)
    // --- Edge Case Handling ---
    if (!verificationRecord) throw { code: 400, message: "No OTP was sent to this number. Please request one first." };
    if (verificationRecord.verified) throw { code: 400, message: "This OTP has already been used." };
    if (verificationRecord.expiresAt < new Date()) throw { code: 400, message: "The OTP has expired. Please request a new one." };
    
    const isMatch = await bcrypt.compare(otp, verificationRecord.otp);
    if (!isMatch) throw { code: 400, message: "The OTP you entered is incorrect." };

    console.log(isMatch)
    await prisma.phoneVerification.update({
        where: { id: verificationRecord.id },
        data: { verified: true, verifiedAt: new Date() }
    });

    console.log(isMatch)
    const user = await prisma.user.findUnique({
        where: { phoneNumber },
        include: { role: true, customer: true }
    });
    console.log(user)
    if (user) {
        if (!user.isActive) throw { code: 403, message: "Your account has been deactivated. Please contact support." };
        
        // User exists: Log them in and return the session
        const session = _generateCustomerSession(user);
        return {
            success: true, code: 200, message: "OTP verified. Welcome back!",
            data: { userExists: true, ...session }
        };
    } else {
        // User does not exist: Signal the frontend to show the registration form
        return {
            success: true, code: 200,
            data: { userExists: false, message: "Phone number verified. Please complete your registration." }
        };
    }
};

const quickRegisterCustomer = async (payload) => {
    const { phoneNumber, email, firstName, lastName } = payload;
    
    // --- Crucial Pre-Checks for Existing Data ---
    const phoneExists = await prisma.user.findUnique({ where: { phoneNumber } });
    if (phoneExists) throw { code: 409, message: "This phone number is already registered to another account." };
    
    const emailExists = await prisma.user.findUnique({ where: { email } });
    if (emailExists) throw { code: 409, message: "This email address is already registered. Please log in or use a different email." };

    const randomPassword = require('crypto').randomBytes(16).toString('hex');
    const hashedPassword = await bcrypt.hash(randomPassword, 10);
    const customerRole = await prisma.role.findUnique({ where: { role: ROLES.CUSTOMER } });
    if (!customerRole) throw { code: 500, message: "Customer role not configured in the system." };

    const newUser = await prisma.$transaction(async (tx) => {
        const user = await tx.user.create({
            data: {
                userId: await generateCustomId(tx, ROLES.USER),
                roleId: customerRole.roleId,
                email,
                phoneNumber,
                password: hashedPassword,
                fullName: { [FIRST_NAME]: firstName, [LAST_NAME]: lastName },
                phoneVerified: true,
                emailVerified: true,
            }
        });
        await tx.customer.create({
            data: {
                customerId: await generateCustomId(tx, ROLES.CUSTOMER),
                userId: user.userId,
            }
        });
        return await tx.user.findUnique({ where: { userId: user.userId }, include: { role: true, customer: true }});
    });

    // Automatically log the newly created user in
    const session = _generateCustomerSession(newUser);
    return {
        success: true, code: 201, message: "Registration successful. Welcome to MayaVriksh!",
        data: { ...session }
    };
};

// module.exports = {  };


module.exports = {
    generateEmailOtp,
    verifyEmailOtp,
    login,
    register,
    refreshUserToken,
    deactivateUser,
    reactivateUserProfile,
    changePassword,
    sendOtpToCustomer,
    verifyOtpAndCheckUser,
    quickRegisterCustomer
};
