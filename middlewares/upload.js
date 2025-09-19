import multer from "multer";
import path from "path";
import fs from "fs";

const baseUploadPath = path.join(process.cwd(), 'uploads');

if (!fs.existsSync(baseUploadPath)) {
    fs.mkdirSync(baseUploadPath);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let subfolder = 'others';

        if (file.fieldname === 'logo') {
            subfolder = 'logos';
        } else if (file.fieldname === 'resume') {
            subfolder = 'resumes';
        }

        const finalPath = path.join(baseUploadPath, subfolder);

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

const imageFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files (jpeg, png, etc.) are allowed'), false);
    }
};

const resumeFilter = (req, file, cb) => {
    const allowedMimeTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only PDF, DOC, and DOCX files are allowed'), false);
    }
};

export const uploadLogo = multer({
    storage: storage,
    fileFilter: imageFilter,
    limits: { fileSize: 5 * 1024 * 1024 }
});

export const uploadResume = multer({
    storage: storage,
    fileFilter: resumeFilter,
    limits: { fileSize: 10 * 1024 * 1024 }
});
