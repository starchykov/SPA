const Sequelize = require('../database/db_connect')
const {DataTypes} = require('sequelize')

const Users = Sequelize.define('Users', {
    id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true, allowNull: false},
    name: {type: DataTypes.STRING},
    email: {type: DataTypes.STRING, unique: true},
    password: {type: DataTypes.STRING,},
    refreshToken: {type: DataTypes.STRING, unique: true},
    activationLink: {type: DataTypes.STRING},
    isActivated: {type: DataTypes.BOOLEAN},
    role: {type: DataTypes.STRING, defaultValue: 'USER'},
    createdAt: {type: DataTypes.DATE},
    updatedAt: {type: DataTypes.DATE},
}, {timestamps: true});

const Posts = Sequelize.define('Posts', {
    id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true, allowNull: false},
    title: {type: DataTypes.STRING, allowNull: true},
    categoryId: {type: DataTypes.INTEGER, allowNull: true},
    content: {type: DataTypes.TEXT, allowNull: true},
    imageUrl: {type: DataTypes.STRING, allowNull: true},
    userId: {type: DataTypes.INTEGER, allowNull: true},
    createdAt: {type: DataTypes.DATE, allowNull: false},
    updatedAt: {type: DataTypes.DATE, allowNull: false},
}, {timestamps: true})

module.exports = {Users, Posts}