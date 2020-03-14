'use strict';

const path = require('path');
const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const app = express();
const port = process.env.PORT || 3000;
const routes = require('./routes');

app.set('view engine', 'ejs');

app.disable('x-powered-by');

app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(helmet());
app.use(cookieSession({
    name: 'express-aR87b7ttMDLx',
    keys: ['fP2c4mIAvouO', 'eiemqqrg3o0G']
}));
app.use(bodyParser.urlencoded( { extended: true } ) );
app.use('/', routes);

app.listen(port);