if (process.env.NODE_ENV !== 'environment'){ // production | testing | staging
	require('dotenv').config();
}

const {
    DB_USER,
    DB_PASSWORD,
    DB_HOST,
    DB_PORT,
    DB_NAME,
    DB_CONFIG,
} = process.env;

let connectionString = "";

if (DB_CONFIG) connectionString = DB_CONFIG;
else {
    const encodeUser = encodeURIComponent(DB_USER);
    const encodePassword = encodeURIComponent(DB_PASSWORD);

    /* MYSQL */
    // connectionString = `mysql://${encodeUser}:${encodePassword}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;

    /* POSTGRES */
    connectionString = `postgres://${encodeUser}:${encodePassword}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;
}

module.exports = connectionString;
