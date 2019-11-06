const port = process.env.PORT || 3001;
//const rooturl = "http://localhost:3000";
const rooturl = "http://ec2-54-183-20-181.us-west-1.compute.amazonaws.com:3000";
const multer = require('multer');
const path = require('path');
const fs = require('fs');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var cors = require('cors');
app.set('view engine', 'ejs');
var encrypt = require('./src/helpers/passwordEncryption.js');
const mongoose = require('mongoose');
const db = require('./src/helpers/settings').mongoURI;
var passport = require('passport');
var jwt = require('jsonwebtoken');
 

mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true, poolSize: 100 })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

require('./src/helpers/passport')(passport);


app.use(session({
    secret              : 'cmpe273_homeaway_mysql',
    resave              : false, // Forces the session to be saved back to the session store, even if the session was never modified during the request
    saveUninitialized   : false, // Force to save uninitialized session to db. A session is uninitialized when it is new but not modified.
    duration            : 60 * 60 * 1000,    // Overall duration of Session : 30 minutes : 1800 seconds
    activeDuration      :  5 * 60 * 1000
}));

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', rooturl);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
    res.setHeader('Cache-Control', 'no-cache');
    next();
});

//Routes

var loginsignup = require('./src/routes/loginsignup');
var profileupdate = require('./src/routes/profileupdate');
var userdashboard = require('./src/routes/userdashboard');
var restaurantenu = require('./src/routes/restaurantmenu');
var cartorder = require('./src/routes/cartorder');

app.use(express.static('./uploads'));
var basePath = '/';
app.use(cors({ origin: rooturl, credentials: true }));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
//app.use('/user', passport.authenticate('jwt', {session: false}), user);

app.use(basePath, loginsignup);
app.use(basePath, profileupdate);
app.use(basePath, userdashboard);
app.use(basePath, restaurantenu);
app.use(basePath, cartorder);
app.use('/uploads', express.static(path.join(__dirname, '/uploads/')));


app.listen(port);
console.log("Server Listening on port " + port);