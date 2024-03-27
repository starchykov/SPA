const {Posts} = require('../models/models')
const Validator = require('fastest-validator')

index = (req, response) => {
    const post = 'Send post'
    response.send(post)
}

save = (req, res) => {
    const newPost = {
        title: req.body.title,
        content: req.body.content,
        imageUrl: req.body.imageUrl,
        categoryId: Number(req.body.categoryId),
        userId: req.user.id
    }

    const scheme = {
        title: {type: 'string', optional: false, max: '100'},
        content: {type: 'string', optional: false, max: '500'},
        imageUrl: {type: 'string', optional: false, max: '100'},
        categoryId: {type: 'number', optional: false},
    }

    const validator = new Validator();

    if (validator.validate(newPost, scheme) !== true) {
        return res.status(400).json({
            message: 'Validation failed',
            errors: validator.validate(newPost, scheme)
        })
    }

    Posts.create(newPost).then(result => {
        res.status(201).json({
            message: "Post created successful",
            post: result
        })
    }).catch(err => {
        res.status(500).json({
            message: "Something went wrong",
            error: err
        })
    })
}

show = (req, res) => {
    const id = req.params.id
    Posts.findByPk(id).then(result => {
        res.status(200).json(result)
    }).catch(err => {
        req.status(500).json(err)
    })
}

index = (req, res) => {
    Posts.findAll().then(result => {
        res.status(200).json(result)
    }).catch(err => {
        req.status(500).json(err)
    })
}

update = (req, res) => {
    const id = req.params.id
    const userId = 1;
    const updatedPost = {
        title: req.body.title,
        content: req.body.content,
        imageUrl: req.body.imageUrl,
        categoryId: Number(req.body.categoryId)
    }

    const scheme = {
        title: {type: 'string', optional: false, max: '100'},
        content: {type: 'string', optional: false, max: '500'},
        imageUrl: {type: 'string', optional: false, max: '100'},
        categoryId: {type: 'number', optional: false},
    }

    const validator = new Validator();

    if (validator.validate(updatedPost, scheme) !== true) {
        return res.status(400).json({
            message: 'Validation failed',
            errors: validator.validate(updatedPost, scheme)
        })
    }

    Posts.update(updatedPost, {where: {id: id, userId: userId}}).then(result => {
        res.status(201).json({
            message: "Post updated successful",
            post: updatedPost
        })
    }).catch(err => {
        res.status(500).json({
            message: "Something went wrong",
            error: err
        })
    })
}

destroy = (req, res) => {
    const id = req.params.id
    const userId = 1;
    Posts.destroy({where: {id: id, userId: userId}}).then(result => {
        res.status(201).json({
            message: "Post deleted successful",
            post: result
        })
    }).catch(err => {
        res.status(500).json({
            message: "Something went wrong",
            error: err
        })
    })
}

module.exports = {
    index: index,
    show: show,
    save: save,
    update: update,
    destroy: destroy
};