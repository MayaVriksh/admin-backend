import * as ERROR_MESSAGES from '../../../../constants/errorMessages.constant';
import { RESPONSE_CODES, RESPONSE_FLAGS } from '../../../../constants/responseCodes.constant';
import SUCCESS_MESSAGES from '../../../../constants/successMessages.constant';
import uploadMedia from '../../../../utils/uploadMedia';
import * as SupplierService from '../services/supplier.service';

// Profile
const showSupplierProfile = async (req: any, h: any): Promise<any> => {
    try {
        // const { userId } = req.auth;
        // <--  : Get userId from `req.pre.credentials`.
        // This data comes directly from the verified JWT payload, with no extra DB call.
        const { userId } = req.pre.credentials;
        const result: any = await SupplierService.showSupplierProfile(userId);
        return h
            .response({
                success: result.success,
                message: result.message,
                data: result.data
            })
            .code(result.code);
    } catch (error) {
        console.error("Profile Display Error:", error);

        return h
            .response({
                success: RESPONSE_FLAGS.FAILURE,
                message: ERROR_MESSAGES.AUTH.PROFILE_DISPLAY_FAILED
            })
            .code(RESPONSE_CODES.INTERNAL_SERVER_ERROR);
    }
};

const completeSupplierProfile = async (req: any, h: any): Promise<any> => {
    try {
        // const { userId } = req.auth;
        const { userId } = req.pre.credentials;
        const {
            tradeLicenseImage,
            nurseryImages,
            profileImageUrl,
            ...profileFields
        } = req.payload;

        console.log("Received payload fields:", {
            tradeLicenseImageType: typeof tradeLicenseImage,
            tradeLicenseHeaders: tradeLicenseImage?.hapi?.headers,
            profilePhotoType: typeof profileImageUrl,
            profilePhotoHeaders: profileImageUrl?.hapi?.headers,
            nurseryImagesType: typeof nurseryImages,
            nurseryImagesLength: nurseryImages?.length
        });
        const requiredKeys = [
            "nurseryName",
            "streetAddress",
            "landmark",
            "city",
            "state",
            "country",
            "pinCode",
            "gstin",
            "businessCategory",
            "warehouseId",
            "tradeLicenseImage",
            "nurseryImages",
            "phoneNumber",
            "latitude",
            "longitude"

        ];

        const missingFields = requiredKeys.filter(
            (key) =>
                profileFields[key] === undefined ||
                profileFields[key] === null ||
                profileFields[key] === ""
        );
        // console.log("missingFields: ", missingFields);

        const missingUploads: string[] = [];
        if (!tradeLicenseImage) missingUploads.push("tradeLicenseImage");
        if (!nurseryImages || nurseryImages.length === 0)
            missingUploads.push("nurseryImages");

        const allMissing = [...missingFields, ...missingUploads];

        if (allMissing.length > 0) {
            return h
                .response({
                    success: RESPONSE_FLAGS.FAILURE,
                    message:
                        "Oops! 🌼 Some essential details seem to be missing. Let’s make sure your nursery blossoms fully — please provide nursery name, phone number, full address (street, landmark, city, state, country, pin code, latitude, longitude), GSTIN, business category, warehouse ID, a trade license image, and at least one nursery image 🌿"
                })
                .code(RESPONSE_CODES.BAD_REQUEST)
                .takeover();
        }

        // Trade License Upload
    const licenseUpload: any = await uploadMedia({
            files: tradeLicenseImage,
            folder: "suppliers/trade_licenses",
            publicIdPrefix: "trade_license"
        });
        if (!licenseUpload.success) {
            return h
                .response({
                    success: false,
                    message: licenseUpload.message
                })
                .code(RESPONSE_CODES.BAD_REQUEST)
                .takeover();
        }

        // Nursery Images Upload
    const nurseryUpload: any = await uploadMedia({
            files: nurseryImages,
            folder: "suppliers/nursery_assets",
            publicIdPrefix: "nursery"
        });
        if (!nurseryUpload.success) {
            return h
                .response({
                    success: false,
                    message: nurseryUpload.message
                })
                .code(RESPONSE_CODES.BAD_REQUEST)
                .takeover();
        }

        // Profile Image Upload
    const profileUpload: any = await uploadMedia({
            files: profileImageUrl,
            folder: "suppliers/profile_images",
            publicIdPrefix: "profile"
        });
        if (!profileUpload.success) {
            return h
                .response({
                    success: false,
                    message: profileUpload.message
                })
                .code(RESPONSE_CODES.BAD_REQUEST)
                .takeover();
        }

        // console.log(
        //     userId,
        //     profileFields,
        //     licenseUpload.data,
        //     profileUpload?.data,
        //     nurseryUpload.data
        // );

        await SupplierService.completeSupplierProfile(
            userId,
            profileFields,
            licenseUpload.data,
            profileUpload?.data,
            nurseryUpload.data
        );

        return h
            .response({
                success: RESPONSE_FLAGS.SUCCESS,
                message: SUCCESS_MESSAGES.SUPPLIERS.PROFILE_SUBMITTED_FOR_REVIEW
            })
            .code(RESPONSE_CODES.SUCCESS);
    } catch (error) {
        console.error(
            "Supplier Profile Completion Error:",
            typeof error === "object" && error !== null && "message" in error
                ? (error as { message?: unknown }).message
                : error
        );
        const e: any = error;
        if (e && e.success === RESPONSE_FLAGS.FAILURE && e.code) {
            return h
                .response({
                    success: RESPONSE_FLAGS.FAILURE,
                    message: e.message
                })
                .code(e.code)
                .takeover();
        }

        return h
            .response({
                success: RESPONSE_FLAGS.FAILURE,
                message: ERROR_MESSAGES.SUPPLIERS.PROFILE_UPDATE_FAILED
            })
            .code(RESPONSE_CODES.INTERNAL_SERVER_ERROR);
    }
};

const listWarehouses = async (_req: any, h: any): Promise<any> => {
    try {
        const result: any = await SupplierService.listAllWarehouses();
        return h.response(result).code(result.code);
    } catch (error) {
        const e: any = error;
        console.error("List Warehouses Error:", e?.message || e);
        return h
            .response({
                success: false,
                message: e?.message || "Failed to retrieve warehouses."
            })
            .code(e?.code || 500);
    }
};

const updateSupplierProfile = async (req: any, h: any): Promise<any> => {
    try {
        // const { userId } = req.auth;
        const { userId } = req.pre.credentials;
        const { profileImageUrl, ...updateData } = req.payload;

        console.log("Profile image: ", typeof profileImageUrl);
        console.log("Profile image header: ", profileImageUrl?.hapi?.headers);

        // Profile Image Upload
    let profileUpload: any = null;
        if (profileImageUrl) {
            profileUpload = await uploadMedia({
                files: profileImageUrl,
                folder: "suppliers/profile_images",
                publicIdPrefix: "profile"
            });
            if (!profileUpload.success) {
                return h
                    .response({
                        success: false,
                        message: profileUpload.message
                    })
                    .code(RESPONSE_CODES.BAD_REQUEST)
                    .takeover();
            }
        }

        console.log("profileUpload: ", profileUpload);

        // update supplier profile
        const result: any = await SupplierService.updateSupplierProfile(
            userId,
            updateData,
            profileUpload?.data
        );

        return h
            .response({
                success: result.success,
                message: result.message
            })
            .code(result.code);
    } catch (error) {
        const e: any = error;
        console.error("Update Profile Error:", e?.message || e);
        if (e && e.success === RESPONSE_FLAGS.FAILURE && e.code) {
            return h
                .response({
                    success: RESPONSE_FLAGS.FAILURE,
                    message: e.message
                })
                .code(e.code)
                .takeover();
        }

        return h
            .response({
                success: RESPONSE_FLAGS.FAILURE,
                message: ERROR_MESSAGES.SUPPLIERS.PROFILE_UPDATE_FAILED
            })
            .code(RESPONSE_CODES.INTERNAL_SERVER_ERROR);
    }
};

// Supplier Orders
const listSupplierOrders = async (req: any, h: any): Promise<any> => {
    try {
        const { userId } = req.pre.credentials;
        const { page, limit, orderStatus, search, sortBy, order } = req.query;

        // 1. Call the service. The service does all the complex work.
    const result: any = await SupplierService.listSupplierOrders({
            userId,
            page,
            limit,
            orderStatus,
            search,
            sortBy,
            order
        });
        // 2. Return the entire result object directly.
        //    The controller should not try to access 'purchaseOrderDetails' itself.
        return h.response(result).code(result.code);
    } catch (error) {
        const e: any = error;
        console.error("Error in listSupplierOrders:", e?.message || e);
        return h
            .response({
                success: false,
                message: "An error occurred while fetching order requests.",
                error: e?.message
            })
            .code(e?.code || 500)
            .takeover();
    }
};

const uploadQcMedia = async (req: any, h: any): Promise<any> => {
    try {
        const { userId } = req.pre.credentials;
        const { orderId } = req.params;
        const { qcMedia } = req.payload;

        // The key 'qcMedia' should match the name attribute of your file input on the frontend.
        // const files = payload.qcMedia;

        if (!qcMedia) {
            return h
                .response({
                    message:
                        "No files uploaded. Please use the 'qcMedia' field."
                })
                .code(400);
        }
    const uploadResult = await uploadMedia({
            files: qcMedia,
            folder: `suppliers/QC_${orderId}`,
            publicIdPrefix: `qc_${Date.now()}`
        });
        console.log(uploadResult)
        if (!uploadResult.success) {
            return h
                .response({ success: false, message: uploadResult.message })
                .code(400)
                .takeover();
        }
        console.log("xx", uploadResult);
        // 2. Controller calls the simplified service with the upload results.
    const result: any = await SupplierService.uploadQcMediaForOrder({
            userId,
            orderId,
            uploadedMedia: uploadResult.data
        });

    return h.response(result).code(result.code);
    } catch (error) {
        const e: any = error;
        console.error("QC Media Upload Controller Error:", e?.message || e);
        return h
            .response({
                success: false,
                message: e?.message || "Failed to upload QC media."
            })
            .code(e?.code || 500);
    }
};

// Add this new function to your supplier controller file

const reviewPurchaseOrder = async (req: any, h: any): Promise<any> => {
    try {
        const { userId } = req.pre.credentials;
        const { orderId } = req.params;
        // The payload now contains the status and the array of rejected IDs
        const reviewData = req.payload;

    const result: any = await SupplierService.reviewPurchaseOrder({
            userId,
            orderId,
            reviewData
        });
        return h.response(result).code(result.code);
    } catch (error) {
        const e: any = error;
        console.error("Review Purchase Order Controller Error:", e?.message || e);

        // Return a standardized error response to the client.
        return h
            .response({
                success: false,
                message: e?.message || "An error occurred while reviewing the order."
            })
            .code(e?.code || 500)
            .takeover();
    }
};

const getOrderRequestByOrderId = async (req: any, h: any): Promise<any> => {
    try {
        const { userId } = req.pre.credentials;
        const { orderId } = req.params; // Get the orderId from the URL parameter

    const result: any = await SupplierService.getOrderRequestByOrderId({
            userId,
            orderId
        });
        return h.response(result).code(result.code);
    } catch (error) {
        const e: any = error;
        console.error("Error in getOrderRequestByOrderId controller:", e?.message || e);
        return h
            .response({
                success: false,
                message: e?.message || "Failed to retrieve order request."
            })
            .code(e?.code || 500);
    }
};

const rejectPurchaseOrder = async (req: any, h: any): Promise<any> => {
    try {
        const { userId } = req.pre.credentials;
        const { orderId } = req.params;

        // Use the generic reviewPurchaseOrder service with REJECTED status
        const result: any = await SupplierService.reviewPurchaseOrder({
            userId,
            orderId,
            reviewData: { status: 'REJECTED', rejectedOrderItemsIdArr: [] }
        });

        return h.response(result).code(result.code);
    } catch (error) {
        const e: any = error;
        console.error("Reject Purchase Order Controller Error:", e?.message || e);
        return h
            .response({
                success: false,
                message: e?.message || "An error occurred while rejecting the order."
            })
            .code(e?.code || 500);
    }
};

const getSupplierOrderHistory = async (req: any, h: any): Promise<any> => {
    try {
        const { userId } = req.pre.credentials;
        const {
            page = 1,
            limit,
            orderStatus,
            search,
            sortBy,
            order
        } = req.query;
        console.log(limit);
    const result: any = await SupplierService.getSupplierOrderHistory({
            userId,
            page,
            limit,
            orderStatus,
            search,
            sortBy,
            order
        });

        return h.response(result).code(result.code);
    } catch (error) {
        // Log the full error for server-side debugging
        const e: any = error;
        console.error("Error in getSupplierOrderHistory controller:", e?.message || e);

        // Return a standardized JSON error response to the client
        return h
            .response({
                success: false,
                message: e?.message || "An error occurred while fetching order history."
            })
            .code(e?.code || 500)
            .takeover();
    }
};

const searchWarehouses = async (req: any, h: any): Promise<any> => {
    try {
        const { search } = req.query;

        const result = await SupplierService.searchWarehousesByName(search);
        // console.log("searchWarehouses: ", result);

        return h
            .response({
                success: result.success,
                message: result.message,
                data: result.data
            })
            .code(result.code);
    } catch (error) {
        const e: any = error;
        console.error("Warehouse Search Error:", e?.message || e);

        return h
            .response({
                success: e?.success || RESPONSE_FLAGS.FAILURE,
                message: e?.message || ERROR_MESSAGES.WAREHOUSES.WAREHOUSE_NOT_FOUND
            })
            .code(e?.code || RESPONSE_CODES.INTERNAL_SERVER_ERROR);
    }
};

export {
    completeSupplierProfile,
    getOrderRequestByOrderId,
    getSupplierOrderHistory,
    listSupplierOrders,
    listWarehouses,
    rejectPurchaseOrder,
    reviewPurchaseOrder,
    showSupplierProfile,
    updateSupplierProfile,
    uploadQcMedia,
    searchWarehouses
};

