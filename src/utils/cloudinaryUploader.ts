import { promises as fs } from 'fs';
import * as path from 'path';
import cloudinary from '../config/cloudinary.config';
import * as ERROR_MESSAGES from '../constants/errorMessages.constant';
import SUCCESS_MESSAGES from '../constants/successMessages.constant';
import { getCloudinaryTransformation } from '../utils/file.utils';

const MAX_RETRIES = 2;

const uploadToCloudinary = async (
    localFilePath,
    folder = "uploads",
    resourceType = "auto",
    transformation = null,
    mimeType = null
) => {
    if (!localFilePath || typeof localFilePath !== "string") {
        return {
            success: false,
            error: ERROR_MESSAGES.CLOUDINARY.INVALID_FILE_PATH
        };
    }

    const fileName = path.basename(localFilePath);

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
            const options: any = {
                folder,
                use_filename: true,
                unique_filename: false
            };

            // Auto-determine transformation if not passed manually
            if (mimeType) {
                const { resourceType: autoType, transformation: autoTrans } =
                    getCloudinaryTransformation(mimeType);

                options.resource_type = autoType || resourceType;
                options.transformation = transformation || autoTrans;
            } else {
                options.resource_type = resourceType;
                if (transformation) {
                    options.transformation = transformation;
                }
            }

            const result = await cloudinary.uploader.upload(
                localFilePath,
                options
            );

            try {
                await fs.unlink(localFilePath);
            } catch (unlinkError) {
                const ue: any = unlinkError;
                console.warn(
                    `File uploaded but failed to delete local file "${fileName}":`,
                    ue?.message
                );
            }

            return {
                success: true,
                message: SUCCESS_MESSAGES.CLOUDINARY.UPLOAD_SUCCESS,
                data: {
                    url: result.secure_url,
                    public_id: result.public_id,
                    resource_type: result.resource_type,
                    original_filename: result.original_filename
                }
            };
        } catch (error) {
            if (attempt === MAX_RETRIES) {
                const e: any = error;
                return {
                    success: false,
                    error: `${ERROR_MESSAGES.CLOUDINARY.UPLOAD_FAILED} (${e?.message})`
                };
            }

            const e: any = error;
            console.warn(
                `Upload attempt ${attempt} failed. Retrying...`,
                e?.message
            );
        }
    }
};

const deleteFromCloudinary = async (publicId, resourceType = "image") => {
    if (!publicId) {
        return {
            success: false,
            error: ERROR_MESSAGES.CLOUDINARY.PUBLIC_ID_MISSING
        };
    }

    try {
        const result = await cloudinary.uploader.destroy(publicId, {
            resource_type: resourceType
        });

        const isDeleted =
            result.result === "ok" || result.result === "not found";

        return {
            success: isDeleted,
            message: isDeleted
                ? SUCCESS_MESSAGES.CLOUDINARY.DELETE_SUCCESS
                : ERROR_MESSAGES.CLOUDINARY.DELETE_FAILED
        };
        } catch (error) {
            const e: any = error;
            return {
                success: false,
                error: `${ERROR_MESSAGES.CLOUDINARY.DELETE_FAILED} (${e?.message})`
            };
        }
};

export {
    deleteFromCloudinary, uploadToCloudinary
};

