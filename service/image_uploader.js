const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (request, file, callback) => {
        callback(null, './uploads');
    },
    filename: (request, file, callback) => {
        callback(null, `user_${request.user.id}_image_` + new Date().getTime() + path.extname(file.originalname));
    }
});

const fileFilter = (request, file, callback) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') callback(null, true)
    else callback(new Error('Unsupported type'), false)
}

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 10
    },
    fileFilter: fileFilter
})

module.exports = {
    upload: upload
}