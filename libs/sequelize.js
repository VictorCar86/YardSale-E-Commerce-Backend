// const { Pool } = require('pg');
// const rootPool = new Pool({ connectionString });
// module.exports = rootPool;

const { Sequelize } = require('sequelize');
const setupModels = require('../db/models');
const connectionString = require('../utils/connection.config');

const isProd = process.env.NODE_ENV === 'production';

const sequelize = new Sequelize(connectionString, {
	// dialect: 'mysql',
	dialect: 'postgres',
	logging: isProd ? false : console.log,
	ssl: isProd ? { rejectUnauthorized: false } : undefined,
});

setupModels(sequelize);

// sequelize.sync();

module.exports = sequelize;