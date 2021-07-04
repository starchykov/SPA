const jwt = require('jsonwebtoken')
const {Users} = require('../models/models')

class TokenService {
    // Generate tokens with user data as params
    generateTokens(payload) {
        // Generate access token with expiration in 30 min
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_TOKEN, {expiresIn: '30m'})
        // Generate refresh token with expiration in 30 min
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_TOKEN, {expiresIn: '30d'})
        return {accessToken, refreshToken}
    }

    // Delete refresh token from database when user do logout
    async saveToken(id, refreshToken) {
        const user = await Users.findOne({where: {id: id}});
        if (user) await Users.update({refreshToken: refreshToken}, {where: {id: id}})
        return refreshToken
    }

    // Validate access token wia incoming params
    async validateAccessToken(accessToken) {
        // Return data about user from token
        return await jwt.verify(accessToken, process.env.JWT_ACCESS_TOKEN);
    }

    // Validate refresh token wia incoming credentials
    async validateRefreshToken(refreshToken) {
        // Return data about user from token
        return await jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN);
    }

    // Find user with common token from incoming params
    async findToken(refreshToken) {
        const usersData = await Users.findOne({where: {refreshToken: refreshToken}});
        // Return refreshToken value from founded user instance
        return usersData?.getDataValue('refreshToken') || null
    }
}

module.exports = new TokenService();