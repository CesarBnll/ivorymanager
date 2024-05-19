const { config } = require('dotenv');
config();

var cfg = {
    host: process.env.HOST || "",
    user: process.env.USERNAME || "",
    password: process.env.PASSWORD || "",
    database: process.env.DATABASE || ""
};

module.exports = { cfg }
