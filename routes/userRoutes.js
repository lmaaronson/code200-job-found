var controller = require('../controllers/userController.js');

module.exports = function (app, passport) {

    app.get('/register', isntLoggedIn, controller.register);

    app.get('/login', isntLoggedIn, controller.login);

    app.post('/register', isntLoggedIn, passport.authenticate('local-register', {
        successRedirect: '/login',
        failureRedirect: '/register'
    }
    ));

    app.post('/login', isntLoggedIn, passport.authenticate('local-login', {
        successRedirect: '/search',
        failureRedirect: '/login'
    }
    ));

    app.get('/isntLoggedIn', isntLoggedIn, function (req, res) {
        res.send('true')
    })

    function isntLoggedIn(req, res, next) {
        if (!req.isAuthenticated())
            return next();

        res.redirect('/search');
    }
}