import multer from "multer";
import path from "path";
import fs from "fs";

// Base uploads folder
const baseUploadPath = path.join(process.cwd(), 'uploads');

// Ensure base folder exists
if (!fs.existsSync(baseUploadPath)) {
    fs.mkdirSync(baseUploadPath);
}

// Multer disk storage config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let subfolder = 'others';

        if (file.fieldname === 'logo') {
            subfolder = 'logos';
        } else if (file.fieldname === 'resume') {
            subfolder = 'resumes';
        }

        const finalPath = path.join(baseUploadPath, subfolder);

        // Ensure subfolder exists
        if (!fs.existsSync(finalPath)) {
            fs.mkdirSync(finalPath, { recursive: true });
        }

        cb(null, finalPath);
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const extension = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueName + extension);
    }
});

// File filter for images (logos)
const imageFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files (jpeg, png, etc.) are allowed'), false);
    }
};

// File filter for resumes
const resumeFilter = (req, file, cb) => {
    const allowedMimeTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document' // .docx
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only PDF, DOC, and DOCX files are allowed'), false);
    }
};

// Exported upload handlers
export const uploadLogo = multer({
    storage: storage,
    fileFilter: imageFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5 MB
});

export const uploadResume = multer({
    storage: storage,
    fileFilter: resumeFilter,
    limits: { fileSize: 10 * 1024 * 1024 } // 10 MB
});
