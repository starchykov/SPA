const express = require('express');
const chatsController = require('../controllers/chat_controller');
const checkAuthMiddleware = require('../middleware/check_auth');

const router = express.Router();

router.get('/', checkAuthMiddleware, chatsController.index);
router.get('/:id', checkAuthMiddleware, chatsController.show);
router.post('/', checkAuthMiddleware, chatsController.save);
router.put("/:id", checkAuthMiddleware, chatsController.update);
router.delete("/:id", checkAuthMiddleware, chatsController.destroy);
router.post('/join/:chatId', checkAuthMiddleware, chatsController.joinChat);
router.post('/leave/:chatId', checkAuthMiddleware, chatsController.leaveChat);

module.exports = router;
