const {Users} = require('../models/models')
const bcrypt = require('bcrypt')
const uuid = require('uuid')
const mailService = require('../service/mail_service')
const tokenService = require('../service/token_service')
const UserDto = require('../dto/user_dto')
const ApiError = require('../exceptions/api_error')

class UserService {
    // Try to sign up user
    async registration(name, email, password) {
        // Search user by email in database
        const candidate = await Users.findOne({where: {email: email}});
        // If user with such mail was founded throw the error
        if (candidate) throw ApiError.BadRequest('User with such email already exist');
        // Create hash password via bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);
        // Create activation link via uuid
        const activationLink = uuid.v4();
        // Set user to database
        const userModel = {name: name, email: email, password: hashedPassword, activationLink: activationLink};
        const user = await Users.create(userModel)
        // Send activation link to user email
        await mailService.sendActivationMail(email, `${process.env.API_URL}/users/activation/${activationLink}`);
        // Set user data from database to data transfer object for generate token
        const userDto = new UserDto(user)
        const tokens = await tokenService.generateTokens({...userDto});
        //Save refresh token to database
        await tokenService.saveToken(userDto.id, tokens.refreshToken.toString());
        // Return tokens and user data to user controller
        return {tokens, user: userDto}
    };

    // Confirm email and activation user account wia sending link
    async activate(activationLink) {
        // Find user with such activation link in database
        const user = await Users.findOne({where: {activationLink: activationLink}})
        // If no user with such link in database call ApiError class with message as params
        if (!user) throw ApiError.BadRequest('Incorrect activation link')
        // If user was founded write to database isActivated: true
        else return await Users.update({isActivated: true}, {where: {activationLink: activationLink}})
    }

    // Try to login user
    async login(email, password) {
        // Search user in database wia email from the request
        const user = await Users.findOne({where: {email: email}});
        // If user doesn't signed up throw error
        if (!user) throw ApiError.BadRequest('There is no user with such email');
        // If user is signed up compare password from the request with database password
        const isPasswordEqual = await bcrypt.compare(password, user.password);
        // If passwords doesn't equal throw error
        if (!isPasswordEqual) throw ApiError.BadRequest('Invalid credentials');
        // If passwords equal create user object and generate access and refresh tokens
        const userDto = new UserDto(user);
        const tokens = await tokenService.generateTokens({...userDto});
        //Save refresh token to database
        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        // Return tokens and user data to user controller
        return {tokens, user: userDto}
    }

    // Try to refresh token
    async refresh(refreshToken) {
        // Check if the request contains a refresh token
        if (!refreshToken) throw ApiError.UnauthorizedError();
        // If the request contains a refresh token try to validate it
        const userData = await tokenService.validateRefreshToken(refreshToken);
        // Check if there is a user with such a token in the database
        const tokenFromDb = await tokenService.findToken(refreshToken);
        // Throw error if user or token is null
        if (!userData || !tokenFromDb) throw ApiError.UnauthorizedError();
        // Get actual user data from database
        const user = await Users.findOne({where: {id: userData.id}})
        // Set actual user data to data transfer object and generate access and refresh tokens
        const userDto = new UserDto(user);
        const tokens = await tokenService.generateTokens({...userDto});
        //Save refresh token to database
        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        // Return tokens and user data to user controller
        return {tokens, user: userDto}
    }

    // Try to logout user
    async logout(refreshToken) {
        // Find user un database
        const user = await Users.findOne({where: {refreshToken: refreshToken}})
        // If user or refresh token is absent throw error
        if (!user) throw ApiError.BadRequest('The user is already logged out')
        // If user was founded set the refresh token value to null
        await Users.update({refreshToken: null}, {where: {refreshToken: refreshToken}});
        // Return deleted token as a result
        return {deletedToken: refreshToken}
    }
}

module.exports = new UserService();