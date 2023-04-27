const express = require('express');
const usersRouter = require('./users.router');
const customersRouter = require('./customers.router');
const productsRouter = require('./products.router');
const categoriesRouter = require('./categories.router');
const ordersRouter = require('./orders.router');
const authRouter = require('./auth.router');

function routerApi(app){
    const routerV1 = express.Router();
    app.use('/api/v1', routerV1);
    routerV1.use('/users', usersRouter);
    routerV1.use('/customers', customersRouter);
    routerV1.use('/categories', categoriesRouter);
    routerV1.use('/products', productsRouter);
    routerV1.use('/orders', ordersRouter);
    routerV1.use('/auth', authRouter);
}

module.exports = routerApi;