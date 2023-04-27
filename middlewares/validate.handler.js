const boom = require('@hapi/boom');

function validatorHandler(schema, property) {
    return (req, res, next) => {
        const data = req[property];
        const { error } = schema.validate(data);
        if (error){
            next(boom.badRequest(error));
            return;
        }
        next();
    }
}

function adminCheckHandler() {
    return (req, res, next) => {
        const { role } = req.user;

        if (role !== 'admin'){
            next(boom.forbidden('You have not privileges to to perform this action'));
            return;
        }
        next();
    }
}

function roleCheckHandler(roles = []) {
    if (!Array.isArray(roles)) {
        throw new Error('Provide only an array to verify privileges');
    }

    return (req, res, next) => {
        const { role } = req.user;

        if (!roles.includes(role)){
            next(boom.forbidden('You have not privileges to to perform this action'));
            return;
        }
        next();
    }
}

module.exports = { validatorHandler, adminCheckHandler, roleCheckHandler };