import multer from "multer";
import path from "path"
import fs from "fs"

// Get full absolute path to /uploads folder inside your project
const uploadPath = path.join(process.cwd(), 'uploads');

// Make sure the uploads folder exists
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        // generate unique string
        const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const extension = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueName + extension);
    }
})

// file-filtering
const fileFilter = (req, file, cb)=> {
    // const allowedTypes = ['/image/jpeg', 'image/png', 'image/jpg'];
    // if(allowedTypes.includes(file.mimetype)) {`
    if(file.mimetype.startsWith('image/')){
        cb(null, true);
    } else {
        cb(new Error('only jpeg, jpg, png files can be uploaded'), false);
    }
};


// initialize multer 
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 10 * 1024 *1024}
});

export default upload;