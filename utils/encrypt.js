const bcrypt = require('bcrypt');

async function encryptPassword(password = ''){
    return await bcrypt.hash(password, 10);
}

async function comparePassword(password = '', hash = ''){
    return await bcrypt.compare(password, hash);
}

module.exports = { encryptPassword, comparePassword };