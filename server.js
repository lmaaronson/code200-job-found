const path = require("path");
const express = require('express')
const app = express()
const passport = require('passport')
const session = require('express-session')
const bodyParser = require('body-parser')
const env = require('dotenv').load()
//const apiRoutes = require("./routes/apiRoutes");
const PORT = process.env.PORT || 3001;

app.use('/', express.static(path.join(__dirname, 'public')))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(session({ secret: 'keyboard cat', resave: true, saveUninitialized: true })); // session secret
app.use(passport.initialize());
app.use(passport.session());


var models = require("./models");
var userRoute = require('./routes/userRoutes.js')
userRoute(app, passport);
var appRoute = require('./routes/appRoutes.js')
appRoute(app, passport);


//load passport strategies
require('./controllers/passportController.js')(passport, models.user);


//Sync Database
models.sequelize.sync().then(function () {
  console.log('Nice! Database looks fine')

}).catch(function (err) {
  console.log(err, "Something went wrong with the Database Update!")
});



app.listen(PORT, function () {
  console.log(`🌎 ==> Server now on port ${PORT}!`);
});