const {Chats, ChatsParticipants} = require('../models/models') // Adjust as necessary
const Validator = require('fastest-validator')

const index = async (req, res) => {
    try {
        const userId = req.user.id;
        const chats = await Chats.findAll({
            include: [{
                model: ChatsParticipants,
                as: 'Participants',
                where: { userId: userId },
                attributes: ['id', 'userId', 'createdAt']
            }]
        });

        res.status(200).json(chats);
    } catch (err) {
        console.error("Error fetching chats:", err);
        res.status(500).json({
            message: "Unable to retrieve chats due to internal server error"
        });
    }
};

const show = (req, res) => {
    const id = req.params.id
    Chats.findByPk(id).then(result => {
        res.status(200).json(result)
    }).catch(err => {
        res.status(500).json(err)
    })
}

const save = async (req, res) => {
    const newChat = {
        userId: req.user.id,
        title: req.body.title,
        description: req.body.description
    };

    const scheme = {
        title: {type: 'string', optional: false, max: '50'},
        description: {type: 'string', optional: true, max: '200'},
    };

    const validator = new Validator();
    const validationResult = validator.validate(newChat, scheme);
    if (validationResult !== true) {
        return res.status(400).json({
            message: 'Validation failed',
            errors: validationResult
        });
    }

    try {
        // Create the chat
        const chat = await Chats.create(newChat);

        // Add current user as a participant of the newly created chat
        await ChatsParticipants.create({
            chatId: chat.id,
            userId: req.user.id
        });

        res.status(201).json({
            message: "Chat created successfully and user added to chat",
            chat: chat
        });
    } catch (err) {
        console.error("Error during chat creation or adding participant:", err);
        res.status(500).json({
            message: "Unable to complete operation due to internal server error"
        });
    }
};

const update = (req, res) => {
    const id = req.params.id
    const updatedChat = {
        message: req.body.message,
        chatRoomId: Number(req.body.chatRoomId) // If applicable
    }

    const scheme = {
        message: {type: 'string', optional: false, max: '500'},
        chatRoomId: {type: 'number', optional: true},
    }

    const validator = new Validator();

    if (validator.validate(updatedChat, scheme) !== true) {
        return res.status(400).json({
            message: 'Validation failed',
            errors: validator.validate(updatedChat, scheme)
        })
    }

    Chats.update(updatedChat, {where: {id: id}}).then(result => {
        res.status(201).json({
            message: "Chat updated successfully",
            chat: updatedChat
        })
    }).catch(err => {
        res.status(500).json({
            message: "Something went wrong",
            error: err
        })
    })
}

const destroy = (req, res) => {
    const id = req.params.id
    Chats.destroy({where: {id: id}}).then(result => {
        res.status(201).json({
            message: "Chat deleted successfully",
            chat: result
        })
    }).catch(err => {
        res.status(500).json({
            message: "Something went wrong",
            error: err
        })
    })
}

const joinChat = (req, res) => {
    const chatId = req.params.chatId;
    const userId = req.user.id; // Assuming you have user information in request

    // Check if the user is already a participant
    ChatsParticipants.findOne({where: {chatId: chatId, userId: userId}})
        .then(participant => {
            if (participant) {
                return res.status(409).json({
                    message: "User already joined the chat",
                });
            }

            ChatsParticipants.create({chatId: chatId, userId: userId})
                .then(() => {
                    res.status(201).json({
                        message: "User joined chat successfully",
                    });
                })
                .catch(err => {
                    res.status(500).json({
                        message: "Something went wrong",
                        error: err,
                    });
                });
        });
};

const leaveChat = (req, res) => {
    const chatId = req.params.chatId;
    const userId = req.user.id;

    // Remove the user from the chat
    ChatsParticipants.destroy({where: {chatId: chatId, userId: userId}})
        .then(deletedCount => {
            if (deletedCount === 0) {
                return res.status(404).json({
                    message: "User not found in the chat",
                });
            }

            res.status(200).json({
                message: "User left the chat successfully",
            });
        })
        .catch(err => {
            res.status(500).json({
                message: "Something went wrong",
                error: err,
            });
        });
};

module.exports = {
    index,
    show,
    save,
    update,
    destroy,
    joinChat,
    leaveChat
};
