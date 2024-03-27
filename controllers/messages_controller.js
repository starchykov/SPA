const {Messages} = require('../models/models'); // Adjust the path as necessary

class MessagesController {
    // Send a new message
    async sendMessage(req, res, next) {
        try {
            const {chatId, content} = req.body;
            const userId = req.user.id; // Assuming authentication middleware adds user info
            const message = await Messages.create({chatId, userId, content});
            return res.status(201).json(message);
        } catch (error) {
            next(error);
        }
    }

    // Retrieve all messages for a chat
    async getMessages(req, res, next) {
        try {
            const {chatId} = req.params;
            const messages = await Messages.findAll({where: {chatId}});
            return res.status(200).json(messages);
        } catch (error) {
            next(error);
        }
    }

    // Delete a message
    async deleteMessage(req, res, next) {
        try {
            const {id} = req.params; // Message ID
            const userId = req.user.id; // User ID
            const deletion = await Messages.destroy({where: {id, userId}});
            if (deletion) {
                return res.status(200).json({message: "Message deleted successfully."});
            } else {
                return res.status(404).json({message: "Message not found or user mismatch."});
            }
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new MessagesController();
