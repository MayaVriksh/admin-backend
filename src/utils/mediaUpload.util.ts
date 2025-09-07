import * as fssync from 'fs';
import { promises as fs } from 'fs';
import mime from 'mime-types';
import * as path from 'path';
import * as ERROR_MESSAGES from '../constants/errorMessages.constant';
import { RESPONSE_FLAGS } from '../constants/responseCodes.constant';
import { getCloudinaryTransformation } from '../utils/file.utils';
import { uploadToCloudinary } from './cloudinaryUploader';

const saveTempFile = async (
    buffer,
    prefix = "upload",
    mimeType = "application/octet-stream"
) => {
    const extension = mime.extension(mimeType) || "bin";
    const fileName = `${prefix}_${Date.now()}.${extension}`;
    const uploadsDir = path.join(__dirname, "../../uploads");

    // Check if 'uploads' folder exists, create if not
    if (!fssync.existsSync(uploadsDir))
        await fs.mkdir(uploadsDir, { recursive: true });

    const filePath = path.join(uploadsDir, fileName);
    await fs.writeFile(filePath, buffer);
    return filePath;
};

const uploadBufferToCloudinary = async (
    buffer,
    folder,
    prefix = "media",
    mimeType = "application/octet-stream"
) => {
    if (!buffer || !Buffer.isBuffer(buffer)) {
        return {
            success: RESPONSE_FLAGS.FAILURE,
            error: ERROR_MESSAGES.CLOUDINARY.INVALID_FILE_PATH
        };
    }

    let tempPath;

    try {
        // Save file to temp disk location
        tempPath = await saveTempFile(buffer, prefix, mimeType);
        console.log(tempPath);
        // Get optimized Cloudinary resource type and transformation
        const { resourceType, transformation } =
            getCloudinaryTransformation(mimeType);

        // Upload with optimized options
        const response = await uploadToCloudinary(
            tempPath,
            folder,
            resourceType,
            transformation
        );

        // Cleanup handled inside `uploadToCloudinary`, but you may do extra check if needed
        return response;
    } catch (err) {
        console.log(err);
        // Attempt cleanup
        if (tempPath) {
            try {
                await fs.unlink(tempPath);
            } catch (cleanupErr) {
                console.warn(
                    "Temp file cleanup failed:",
                    (cleanupErr instanceof Error ? cleanupErr.message : String(cleanupErr))
                );
            }
        }

        const e: any = err;
        return {
            success: RESPONSE_FLAGS.FAILURE,
            error: `${ERROR_MESSAGES.CLOUDINARY.UPLOAD_FAILED} (${e.message})`
        };
    }
};

export default uploadBufferToCloudinary;
