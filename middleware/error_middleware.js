const ApiError = require('../exceptions/api_error')

errorMiddleware = (error, request, response, next) => {
    if (error instanceof ApiError) return response.status(error.status).json({
        message: error.message,
        errors: error.errors
    });
    return response.status(500).json({message: 'Unhandled error'})
}

module.exports = errorMiddleware;