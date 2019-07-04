const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const log = require('log');
const mongoose = require('mongoose');
const passport = require('passport');
const router = require('./routes/User');


require('./PassportConfig')(passport);
require('dotenv').config();

const app = express();
const port = process.env.PORT;
const dbPort = process.env.DB_PORT;
const dbUrl = process.env.DB_URL;
const dbCollection = process.env.DB_COLLECTION;

mongoose.set('useCreateIndex', true);

//Connect to Database
mongoose.connect(`mongodb://${dbUrl}:${dbPort}/${dbCollection}`, {
    useNewUrlParser: true
})
.then(_ => console.log('Connected Successfully to MongoDB'))
.catch(err => console.error(err));

//initializes the passport configuration.
app.use(passport.initialize());

//imports our configuration file which holds our verification callbacks and things like the secret for signing.
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


app.use((req,res, next) => {
      if (req.body) log.info(req.body);
      if (req.params) log.info(req.params);
      if(req.query) log.info(req.query);
      log.info(`Received a ${req.method} request from ${req.ip} for ${req.url}`);
    next();
});
app.use('/users', router);

//registers our authentication routes with Express.
app.listen(port, err => {
    if(err) console.error(err);
    console.log(`Listening for Requests on port: ${port}`);
});