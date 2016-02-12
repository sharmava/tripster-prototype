/**
 * Created by sharmava on 4/9/15.
 */
var Todo = require('../models/todo');
var Users = require('../models/users');


module.exports = function(app,passport) {

    /**
     * Authentication start ####################################################################################
     * **/
    app.post('/login', passport.authenticate('user-login', {
        successRedirect: '.../public/views/defaultPage.html', // redirect to the secure profile section
        failureRedirect: '/', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));
    /**
     * Authentication end ####################################################################################
     * **/


    /**
     * Users controller Start ####################################################################################
     * **/
    app.get('/api/users', function (req, res) {

        // use mongoose to get all users in the database
        var myQuery = Users.find();

        myQuery.exec(function (err, items) {
            if (!err) {

                return res.send(items); // return all users in JSON format
            }
            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            else {
                res.json(send({status: '500 Server error', error: err}));
            }

        });
    });

// create user and send back all users after creation
    app.post('/api/users', function (req, res) {

        res.set('Access-Control-Allow-Origin', '*');
        // create a user, information comes from AJAX request from Angular
        Users.create({
            FirstName: req.body.FirstName,
            LastName: req.body.LastName,
            UserName: req.body.UserName,
            Password: req.body.Password,
            DoB: req.body.DoB,
            Phone: req.body.Phone,
            Address: req.body.Address,
            City: req.body.City,
            State: req.body.State,
            Country: req.body.Country,
            CreatedTimeStamp: req.body.CreatedTimeStamp
        }, function (err, user) {
            if (err)
                res.send(err);
        });
    });


    /**
     * Users controller End####################################################################################
     * **/


    /**
     * todo controllers start ####################################################################################
     * **/

        // get all todos
    app.get('/api/todos', function (req, res) {

        // use mongoose to get all todos in the database
        Todo.find(function (err, todos) {

            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.send(err)

            res.json(todos); // return all todos in JSON format
        });
    });

// create todo and send back all todos after creation
    app.post('/api/todos', function (req, res) {

        // create a todo, information comes from AJAX request from Angular
        Todo.create({
            text: req.body.text,
            done: false
        }, function (err, todo) {
            if (err)
                res.send(err);

            // get and return all the todos after you create another
            Todo.find(function (err, todos) {
                if (err)
                    res.send(err)
                res.json(todos);
            });
        });

    });

// delete a todo
    app.delete('/api/todos/:todo_id', function (req, res) {
        Todo.remove({
            _id: req.params.todo_id
        }, function (err, todo) {
            if (err)
                res.send(err);

            // get and return all the todos after you create another
            Todo.find(function (err, todos) {
                if (err)
                    res.send(err)
                res.json(todos);
            });
        });
    });

    /**
     * TODO controllers end ####################################################################################
     * **/

    app.get('/', function (req, res) {
        res.sendfile('./././public/views/login.html'); // load the single view file (angular will handle the page changes on the front-end)
    });

    return app;
// listen (start app with node server.js) ======================================

}