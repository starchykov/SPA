const express = require('express');
const postsController = require('../controllers/post_controller')
const checkAuthMiddleware = require('../middleware/check_auth')

const router = express.Router();

// GET method route
router.get('/', checkAuthMiddleware, postsController.index)
router.get('/:id', checkAuthMiddleware, postsController.show)

// Post (Put)  method route
router.post('/', checkAuthMiddleware, postsController.save)
router.put("/:id", checkAuthMiddleware, postsController.update)

// Delete (Put)  method route
router.delete("/:id", checkAuthMiddleware, postsController.destroy)

module.exports = router;