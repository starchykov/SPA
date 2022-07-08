const {Sequelize} = require('sequelize');
const {Pool} = require('pg');

const sequelize = new Sequelize({
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,

    logging: false,
    protocol: "postgres",
    dialectOptions: {"ssl": {"require": true, "rejectUnauthorized": false}}, "operatorsAliases": 0
})

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {rejectUnauthorized: false}
});

module.exports = {Sequelize: sequelize, pool: pool}
