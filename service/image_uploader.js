const multer = require('multer');
const path = require('path');
const ApiError = require('../exceptions/api_error')


const storage = multer.diskStorage({

    destination: (request, file, callback) => {
        callback(null, path.resolve(`./uploads`))
    },
    filename: (request, file, callback) => {
        callback(null, `user_${request.user.id}_image_` + new Date().getTime() + path.extname(file.originalname));
    }
});

const fileFilter = (request, file, callback) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') callback(null, true)
    else callback(ApiError.BadRequest(`Unsupported file type. The file was not uploaded.`), false)
}

const upload = multer({storage: storage, limits: {fileSize: 1024 * 1024 * 10}, fileFilter})

module.exports = upload