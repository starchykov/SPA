const {Sequelize} = require('../database/db_connect')
const {DataTypes} = require('sequelize')

const Users = Sequelize.define('Users', {
    id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true, allowNull: false},
    name: {type: DataTypes.STRING},
    email: {type: DataTypes.STRING, unique: true},
    password: {type: DataTypes.STRING},
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
}, {timestamps: true});

const Contacts = Sequelize.define('Contacts', {
    id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true, allowNull: false},
    userId: {type: DataTypes.INTEGER, allowNull: false},
    contactUserId: {type: DataTypes.INTEGER, allowNull: false},
    createdAt: {type: DataTypes.DATE, allowNull: false},
    updatedAt: {type: DataTypes.DATE, allowNull: false},
}, {timestamps: true});

const Chats = Sequelize.define('Chats', {
    id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true, allowNull: false},
    userId: {type: DataTypes.INTEGER, allowNull: false},
    title: {type: DataTypes.STRING, allowNull: false},
    description: {type: DataTypes.STRING, allowNull: true},
    createdAt: {type: DataTypes.DATE, allowNull: false},
    updatedAt: {type: DataTypes.DATE, allowNull: false},
}, {timestamps: true});

const ChatsParticipants = Sequelize.define('ChatsParticipants', {
    id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true, allowNull: false},
    chatId: {type: DataTypes.INTEGER, allowNull: false},
    userId: {type: DataTypes.INTEGER, allowNull: false},
    createdAt: {type: DataTypes.DATE, allowNull: false},
    updatedAt: {type: DataTypes.DATE, allowNull: false},
}, {timestamps: true});

const Messages = Sequelize.define('Messages', {
    id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true, allowNull: false},
    chatId: {type: DataTypes.INTEGER, allowNull: false},
    userId: {type: DataTypes.INTEGER, allowNull: false},
    content: {type: DataTypes.STRING, allowNull: false},
    createdAt: {type: DataTypes.DATE, allowNull: false},
    updatedAt: {type: DataTypes.DATE, allowNull: false},
}, {timestamps: true});

// Chats can have many Users through ChatsParticipants
Chats.belongsToMany(Users, {
    through: ChatsParticipants,
    foreignKey: 'chatId',
    otherKey: 'userId'
});

// Users can have many Chats through ChatsParticipants
Users.belongsToMany(Chats, {
    through: ChatsParticipants,
    foreignKey: 'userId',
    otherKey: 'chatId'
});

// Additionally, define the inverse of these many-to-many relations
// which are technically optional but useful for bidirectional access:

ChatsParticipants.belongsTo(Chats, {
    foreignKey: 'chatId',
    as: 'Chat'
});

ChatsParticipants.belongsTo(Users, {
    foreignKey: 'userId',
    as: 'User'
});

Chats.hasMany(ChatsParticipants, {
    foreignKey: 'chatId',
    as: 'Participants'
});

Users.hasMany(ChatsParticipants, {
    foreignKey: 'userId',
    as: 'Participations'
});


module.exports = {Users, Posts, Contacts, Chats, ChatsParticipants, Messages};