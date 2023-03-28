function logErrors(error, req, res, next) {
    // console.error(error);
    next(error);
}

function boomErrorHandler(error, req, res, next) {
    if (error.isBoom){
        const { output } = error;
        res.status(output.statusCode).json(output.payload)
    }
    next(error);
}

function errorHandler(error, req, res, next) {
    // res.status(420).json({
    //     status: error.message,
    //     stack: error.stack
    // });
    next()
}

module.exports = { logErrors, errorHandler, boomErrorHandler };