const {Contacts, Users} = require('../models/models')
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
        const tokens = tokenService.generateTokens({...userDto});
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
        if (!email || !password) throw ApiError.BadRequest('Invalid credentials');
        // Search user in database wia email from the request
        const user = await Users.findOne({where: {email: email}}).catch(error => console.log(error));
        // If user doesn't signed up throw error
        if (!user) throw ApiError.BadRequest('There is no user with such email');
        // If user is signed up compare password from the request with database password
        const isPasswordEqual = await bcrypt.compare(password, user.password);
        // If passwords doesn't equal throw error
        if (!isPasswordEqual) throw ApiError.BadRequest('Invalid credentials');
        // If passwords equal create user object and generate access and refresh tokens
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});
        //Save refresh token to database
        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        // Send information to the user email
        await mailService.sendInformationMail(email, `${user.name}`);
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
        const tokens = tokenService.generateTokens({...userDto});
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

    // Get user's friends
    async getUserFriends(userId) {
        try {
            const contacts = await Contacts.findAll({
                where: {userId: userId},
                attributes: ['contactUserId']
            });

            const friendsDetailsPromises = contacts.map(async contact => {
                return await Users.findByPk(contact.contactUserId, {
                    attributes: ['id', 'name', 'email']
                });
            });

            const friendsDetails = await Promise.all(friendsDetailsPromises);

            return friendsDetails.map(friend => ({
                id: friend.id,
                name: friend.name,
                email: friend.email
            }));
        } catch (error) {
            console.error(error);
            throw ApiError.Internal('Failed to retrieve user friends');
        }
    }

    // Add to friends
    async addToFriends(userId, contactUserEmail) {
        try {
            // Find the contact user by email
            const contactUser = await Users.findOne({where: {email: contactUserEmail}});
            if (!contactUser) {
                throw ApiError.NotFound("User with provided email does not exist.");
            }

            // Check if the friendship already exists
            const existingContact = await Contacts.findOne({
                where: {userId, contactUserId: contactUser.id}
            });

            if (existingContact) {
                throw ApiError.BadRequest("This user is already your friend.");
            }

            // Create the new contact entry
            const newContact = await Contacts.create({userId, contactUserId: contactUser.id});
            return newContact;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    // Remove from friends
    async removeFromFriends(userId, contactUserId) {
        try {
            const deleted = await Contacts.destroy({
                where: {userId, contactUserId}
            });

            if (deleted) {
                return {message: "Friend removed successfully."};
            } else {
                throw ApiError.NotFound("Friend not found.");
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

}

module.exports = new UserService();