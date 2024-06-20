// multerConfig.js
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'assets/images'); // Set the destination folder
    },
    filename: (req, file, cb) => {
        const originalname = path.parse(file.originalname).name;
        const filename = Date.now() + '-' + originalname + path.extname(file.originalname);
        cb(null, filename);
    },
});

const fileFilter = (req, file, cb) => {
    // Add your file type filtering logic here
    if (file.mimetype.startsWith('image/') && /\.(jpg|jpeg|png)$/.test(file.originalname)) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
});

module.exports = upload
