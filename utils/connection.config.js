if (process.env.NODE_ENV !== 'environment'){ // production | testing | staging
	require('dotenv').config();
}

const {
    DB_USER,
    DB_PASSWORD,
    DB_HOST,
    DB_PORT,
    DB_NAME
} = process.env;

const encodeUser = encodeURIComponent(DB_USER);

const encodePassword = encodeURIComponent(DB_PASSWORD);

/* MYSQL */
// const connectionString = `mysql://${encodeUser}:${encodePassword}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;

/* POSTGRES */
const connectionString = `postgres://${encodeUser}:${encodePassword}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;

module.exports = connectionString;