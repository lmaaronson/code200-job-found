var controller = require('../controllers/appController.js')
//var axios = require('axios');

module.exports = function (app, passport) {

    app.get('/saved', isLoggedIn, controller.saved);

    app.get('/search', controller.search)

    app.post('/search', controller.submitSearch);

    app.get('/noUserSearch', controller.noUserSearch)

    app.post('/saved', isLoggedIn, controller.saveJob)

    app.post('/tasks', isLoggedIn, controller.addTask)

    app.get('/tasks', isLoggedIn, controller.tasks)

    app.delete('/saved', isLoggedIn, controller.deleteJob)

    app.delete('/tasks', isLoggedIn, controller.removeTask)

    app.get('/logout', isLoggedIn, controller.logout);

    app.get('/isLoggedIn', isLoggedIn, function (req, res) {
        res.send('true')
    })


    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated())
            return next();

        res.redirect('/search');
    }
}