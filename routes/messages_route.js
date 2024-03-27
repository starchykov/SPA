const express = require('express');
const MessagesController = require('../controllers/messages_controller');
const checkAuthMiddleware = require('../middleware/check_auth');

const router = express.Router();

router.post('/send', checkAuthMiddleware, MessagesController.sendMessage);
router.get('/chat/:chatId', checkAuthMiddleware, MessagesController.getMessages);
router.delete('/:id', checkAuthMiddleware, MessagesController.deleteMessage);

module.exports = router;