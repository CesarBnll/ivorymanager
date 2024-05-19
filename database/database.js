const { createConnection } = require('promise-mysql');

const connection = createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'ivoryhomes'
});

const getConnection = () => {
    return connection;
};

module.exports = { getConnection };
