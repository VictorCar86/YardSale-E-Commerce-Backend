const connectionString = require('../utils/connection.config');

module.exports = {
    development: {
        url: connectionString,
        dialect: 'postgres',
        // dialect: 'mysql',
    },
    production: {
        url: connectionString,
        dialect: 'postgres',
        // dialect: 'mysql',
    }
};