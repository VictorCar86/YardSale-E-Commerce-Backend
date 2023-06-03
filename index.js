const cors = require('cors');
const express = require('express');
const routerApi = require('./routes/index');
const app = express();
const boom = require('@hapi/boom');
const cookieParser = require('cookie-parser');
const port = process.env.PORT || 8080;

const { logErrors, errorHandler, boomErrorHandler } = require('./middlewares/error.handler')

const whiteList = [process.env.FRONTEND_URL];

const corsOptions = {
    origin: (origin, callback) => {
        if (whiteList.includes(origin) || origin === undefined){
            callback(null, true);
        } else {
            callback(boom.unauthorized());
        }
    },
    credentials: true,
};

app.use(express.static(__dirname + '/public'));

require('./auth');
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

routerApi(app);

app.use(logErrors);
app.use(boomErrorHandler);
app.use(errorHandler);

app.listen(port, () => {
    console.info(`Listening at port ${port}`);
});