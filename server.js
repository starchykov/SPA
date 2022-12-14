require('dotenv').config();
const http = require('http');
const app = require('./app');
const {Server} = require('socket.io');
const {Sequelize, pool} = require('./database/db_connect')

// Define port from environment variable or default value
const port = process.env.PORT || 3001;

const server = http.createServer(app);

// Create socket connection for the server app
const io = new Server(server);

// const messages = []
// io.on('connection', (socket) => {
//     const username = socket.handshake.query.username
//
//     socket.on('message', (data) => {
//         const message = {
//             message: data.message,
//             senderUsername: username,
//             sentAt: Date.now()
//         };
//         messages.push(message)
//         io.emit('message', message)
//
//     });
//
//     socket.on("audioMessage", (msg) => {
//         io.emit("audioMessage", msg);
//         console.log(msg)
//     });
//
// });

/// Define service data for new connections
let userCounter = 0;
let usersOnline = [];
let username = '';

//  Listen new socket connections
io.on('connection', (socket) => {

    userCounter = userCounter + 1;
    username = socket.handshake.query.username
    usersOnline.push(username)

    io.emit('user', userCounter);
    console.log(`a ${username} user is connected`);

    socket.on("disconnect", () => {
        userCounter = userCounter - 1;
        io.emit('user', userCounter);
        console.log('user disconnected');
    });

    socket.on("audioMessage", (msg) => {
        io.emit("audioMessage", msg);
        console.log(msg)
    });

});

connectToDatabase = async () => {
    //Connect to database wia sequelize
    await Sequelize.authenticate().then(() => console.log('Database is connected')).catch(e => console.log(e));
    await Sequelize.sync().then(() => console.log('Models have been synced')).catch(error => console.log(error));

    // Connect to database wia PostgreSQL
    await pool.connect().then(() => console.log('PostgreSQL is connected')).catch(e => console.log(e));
}

// Start listening requests to server on  selected port
server.listen(port, async () => {
    await connectToDatabase();
    console.debug(`Server is working on port ${port}`)
});


