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

/// Define service data for new connections
let userCounter = 0;
let usersOnline = [];
let user = {userName: '', userCode: ''};

//  Listen new socket connections
io.on('connection', (socket) => {

    /// Update service information when new connection detected
    user = socket.handshake.query;
    usersOnline.push(user);
    userCounter = usersOnline.length;

    io.emit('socketUpdates', {'userCounter': userCounter, 'usersOnline': usersOnline});
    console.log(`a ${user.userName} user is connected`);

    socket.on('disconnect', () => {
        user = socket.handshake.query;
        usersOnline = usersOnline.filter((onlineUser) => onlineUser.userCode !== user.userCode);
        userCounter = usersOnline.length;
        io.emit('socketUpdates', {'userCounter': userCounter, 'usersOnline': usersOnline});
        console.log(`user ${user.userName} disconnected`);
    });

    socket.on('message', (data) => {
        user = socket.handshake.query;
        const message = {
            message: data.message,
            senderUsername: user.userName,
            sentAt: Date.now()
        };
        // messages.push(message)
        io.emit('message', message)
    });

    socket.on('audioMessage', (msg) => {
        user = socket.handshake.query;
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


