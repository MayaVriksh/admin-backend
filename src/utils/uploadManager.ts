import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { uploadToCloudinary } from './cloudinaryUploader';

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage config
const storage = multer.diskStorage({
    destination: function (_req, _file, cb) {
        cb(null, uploadDir);
    },
    filename: function (_req, file, cb) {
        const ext = path.extname(file.originalname);
        const baseName = path.basename(file.originalname, ext);
        const finalName = `${baseName}-${Date.now()}${ext}`;
        cb(null, finalName);
    }
});

const upload = multer({ storage });

const uploadMultipleImagesToCloudinary = async (req: any, res: any, next: any) => {
    try {
        const files = (req.files as any[]) || [];
        if (!files || files.length === 0) {
            return res.status(400).json({ error: 'No files uploaded' });
        }

        const uploadResults: any[] = [];

        for (const file of files) {
            const result = await uploadToCloudinary(file.path, 'plants');
            if (!result || !result.success) {
                return res.status(500).json({ error: result?.error || 'Upload failed' });
            }
            uploadResults.push(result);
        }

        // Attach results to request
        (req as any).cloudinaryUploads = uploadResults;
        next();
    } catch (err: any) {
        return res.status(500).json({ error: err?.message || 'Internal server error' });
    }
};

const uploadMultiple = upload.array('images', 10); // max 10 files

export { upload, uploadMultiple, uploadMultipleImagesToCloudinary };
