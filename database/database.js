const { createConnection } = require('promise-mysql');
//const { createConnection } = require('mysql2/promise.js');

const connection = createConnection({
    host: process.env.HOST,
    port: process.env.PORT,
    user: process.env.USERNAME,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});

console.log("DOTENV PORT: " + process.env.PORT);

const getConnection = () => {
    return connection;
};

module.exports = { getConnection };
