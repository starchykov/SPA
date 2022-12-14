const express = require('express')
const SocketController = require('../controllers/socket_controller')
const checkAuthMiddleware = require('../middleware/check_auth')

const router = express.Router();

router.get('/connect', SocketController.connect)

module.exports = router;