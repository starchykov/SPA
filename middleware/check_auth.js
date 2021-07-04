const ApiError = require('../exceptions/api_error')
const tokenService = require('../service/token_service')

//
// This module represents user authentication wia checking access token from request
//

checkAuth = async (request, response, next) => {
    try {
        // Check if the request contains a headers and authorization
        const authorizationHeader = request?.headers?.authorization;
        // If no authorization in the request return error from middleware
        if (!authorizationHeader) return ApiError.UnauthorizedError();
        // If the request contains a authorizationHeader get token value from Bearer str and try to validate it
        const accessToken = authorizationHeader.split(' ')[1];
        const userData = await tokenService.validateAccessToken(accessToken);
        // Throw error if user or token is invalid
        if (!userData) return ApiError.UnauthorizedError();
        // If access token is valid set user information in the request
        request.user = userData;
        // Call next middleware
        next();
    } catch (error) {
        // If error has been occurred call next middleware and throw there ApiError
        next(ApiError.UnauthorizedError())
    }
}

module.exports = checkAuth;