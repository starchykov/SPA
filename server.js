require('dotenv').config();
const http = require('http');
const app = require('./app');
const {Sequelize, pool} = require('./database/db_connect')

// Define port from environment variable or default value
const port = process.env.PORT || 3001;

const server = http.createServer(app);

connectToDatabase = async () => {
    //Connect to database wia sequelize
    await Sequelize.authenticate().then(() => console.log('Database is connected')).catch(e => console.log(e));
    await Sequelize.sync().then(() => console.log('Models have been synced')).catch(error => console.log(error));

    // Connect to database wia PostgreSQL
    await pool.connect().then(()=> console.log('PostgreSQL is connected')).catch(e=> console.log(e));
}

// Start listening requests to server on  selected port
server.listen(port, async () => {
    await connectToDatabase();
    console.debug(`Server is working on port ${port}`)
});


