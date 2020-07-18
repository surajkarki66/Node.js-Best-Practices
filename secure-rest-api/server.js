const config = require('./common/config/env.config');

const express = require('express');
const morgan = require("morgan");
const app = express();

const UsersRouter = require('./users/routes.config');
const AuthorizationRouter = require('./auth/routesConfig');
const handleErrors = require('./common/middlewares/handleErrors');

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    res.header('Access-Control-Expose-Headers', 'Content-Length');
    res.header('Access-Control-Allow-Headers', 'Accept, Authorization, Content-Type, X-Requested-With, Range');
    if (req.method === 'OPTIONS') {
        return res.send(200);
    } else {
        return next();
    }
});

app.use(morgan("dev"));
app.use(express.json());
UsersRouter.routesConfig(app);
AuthorizationRouter.routesConfig(app);
app.use(handleErrors);


app.listen(config.port, function () {
    console.log('app listening at port %s', config.port);
});
