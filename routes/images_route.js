const express = require('express')
const imageController = require('../controllers/image_controller')
const upload = require('../service/image_uploader')
const checkAuthMiddleware = require('../middleware/check_auth')

const router = express.Router();

// Post (Put)  method route
router.post('/uploads', checkAuthMiddleware, upload.single('image'), imageController.imageUpload)

module.exports = router
