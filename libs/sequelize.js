// const { Pool } = require('pg');


const { Sequelize } = require('sequelize');
const setupModels = require('../db/models');
const connectionString = require('../utils/connection.config');

const sequelize = new Sequelize(connectionString, {
	// dialect: 'mysql',
	dialect: 'postgres',
	logging: console.log
});

setupModels(sequelize);

// sequelize.sync();

module.exports = sequelize;


// const rootPool = new Pool({ connectionString });

// module.exports = rootPool;