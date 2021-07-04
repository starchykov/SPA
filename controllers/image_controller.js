imageUpload = (request, response) => {
    if (request.file.filename) {
        response.status(200).json({
            message: 'Image uploaded successfully',
            url: request.file.filename
        })
    } else {
        response.status(500).json({
            'message': 'something went wrong',
        })
    }
}

module.exports = {
    imageUpload: imageUpload
}