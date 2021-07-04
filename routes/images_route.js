const express = require('express')
const imageController = require('../controllers/image_controller')
const imageUploader = require('../service/image_uploader')
const checkAuthMiddleware = require('../middleware/check_auth')

const router = express.Router();

router.post('/uploads', checkAuthMiddleware, imageUploader.upload.single('image'), imageController.imageUpload)

module.exports = router
