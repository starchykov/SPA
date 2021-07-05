const ApiError = require('../exceptions/api_error')

imageUpload = (request, response) => {
    if (request.file.filename) response.status(200).json({
        message: 'Image uploaded successfully',
        url: request.file.filename
    })

    else throw ApiError.BadRequest(`File wasn't uploaded`)
}

module.exports = imageUpload