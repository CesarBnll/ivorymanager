const { createConnection } = require('promise-mysql');
//const { createConnection } = require('mysql2/promise.js');

const connection = createConnection({
    host: process.env.HOST,
    port: 3306,
    user: process.env.USERNAME,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});

const getConnection = () => {
    return connection;
};

module.exports = { getConnection };
