const { createConnection } = require('promise-mysql');
//const { createConnection } = require('mysql2/promise.js');

const connection = createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

console.log("DOTENV PORT: " + process.env.DB_PORT);

const getConnection = () => {
    return connection;
};

module.exports = { getConnection };
