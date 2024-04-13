const userService = require('../service/user_service')

class UserController {
    // Sign up function
    async signUp(request, response, next) {
        // Get credentials from the request and call user sign up service
        const {name, email, password} = request.body
        // Call registration with params and await for result or catch errors
        await userService.registration(name, email, password).then(result => {
            // Set cookie max age options
            const cookieOptions = {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true}
            // If successes send response with tokens and cookie
            response.cookie('refreshToken', result.tokens.refreshToken, cookieOptions)
            return response.status(200).json({accessToken: result.tokens.accessToken})
        }).catch(error => next(error));
    }

    // Confirm email and activation user account wia sending link
    async activation(request, response, next) {
        // Get activation link from the request params
        const activationLink = request.params.link
        // Call activate service and await for result or catch errors
        await userService.activate(activationLink).then(result => {
            // If successes redirect user to client URL address
            response.redirect(process.env.CLIENT_URL)
        }).catch(error => next(error))
    }

    // Login user wia credentials from the request
    async logIn(request, response, next) {
        // Get credentials from the request and call user login service
        const {email, password} = request.body;
        // Call login service with params and await for result or catch errors
        await userService.login(email, password).then(result => {
            // Set cookie max age options
            const cookieOptions = {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true}
            // If successes send response with tokens and cookie
            response.cookie('refreshToken', result.tokens.refreshToken, cookieOptions)
            return response.status(200).json({accessToken: result.tokens.accessToken})
        }).catch(error => next(error));
    }

    // Refresh user token
    async refresh(request, response, next) {
        // Get refreshToken from request cookie
        const {refreshToken} = request.cookies;
        // Call refresh service with params and await for result or catch errors
        await userService.refresh(refreshToken).then(result => {
            // Set cookie max age options
            const cookieOptions = {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true}
            // If successes send response with tokens and cookie
            response.cookie('refreshToken', result.tokens.refreshToken, cookieOptions)
            return response.status(200).json({accessToken: result.tokens.accessToken})
        }).catch(error => next(error));
    }

    // Try to logout user
    async logout(request, response, next) {
        // Get refresh token from request cookie
        const {refreshToken} = request.cookies;
        // Call logout service and await for result or catch errors
        await userService.logout(refreshToken).then(result => {
            // Send response Ok 200 and clear cookie. Do redirect to login page.
            response.clearCookie('refreshToken').status(200).json(result)
        }).catch(error => next(error))
    }

    // Get user friends
    async getUserFriends(request, response, next) {
        const userId = request.user.id;

        try {
            const friendsList = await userService.getUserFriends(userId);
            response.json(friendsList);
        } catch (error) {
            next(error);
        }
    }

    // Add to friends
    async addToFriends(request, response, next) {
        const userId = request.user.id;
        const { contactUserEmail } = request.body;
        console.log(contactUserEmail);

        try {
            const newContact = await userService.addToFriends(userId, contactUserEmail);
            response.status(201).json(newContact);
        } catch (error) {
            next(error);
        }
    }

    // Remove from friends
    async removeFromFriends(request, response, next) {
        const userId = request.user.id;
        const {contactUserId} = request.body;

        try {
            const result = await userService.removeFromFriends(userId, contactUserId);
            response.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }
}


module.exports = new UserController();