// Flag to toggle the Encryption of parameters in the URL of REST service
var encryptionFlag = false;

var Todo = require('./models/todo');
var Users = require('./models/users');
var new_invites = require('./models/new_invites');
var Plan = require('./models/plan');
var Picture = require('./models/picture');
var notifications = require('./models/notifications');

//var fs       = require('fs')
var  fs       = require('fs-extra') /* all the methods of fs are present in this */

var util = require('util');

var   http     = require('http')
    , path     = require('path');


module.exports = function (app, passport) {


    // Route to check if a user name exists
    app.get('/tripster/checkusername', function (req, res) {

        if (encryptionFlag == true){
            var username = rot47(req.query["username"]);
        } else{
            var username = req.query["username"];
        }

        // Get records only for the username provided in the URL
        if (username != null){
            Users.findOne({
                UserName: username
            }, function(err, user){
                if (err){
                    res.json(send({status: '500 Server error', error: err}));
                }
                else if(user==null){
                    res.send({"count":0, "name": "***"});
                }
                else if(user!=null){
                    res.send({"count":1, "name": user.FirstName});
                }
            })

        }
        else{
            res.json(({status: '500 Server error', error: 'Username not specified'}))
        }
    });

    app.get('/tripster/authenticate', function (req, res) {
        if (req.isAuthenticated() == false) {
            res.json({status: '500 Server error', error: "Unauthorized User!"});
        }
        else{
            res.json({status: '200', userObject: req.session.userObject})
        }

    });



    //    Generalized and Parameterized Get URL for the Users collection
    //    Get All Users 			: /tripster/users
    //    Filter by username		: /tripster/users?username=user_1@tripster.com
    app.get('/tripster/users', function (req, res) {

        if (req.isAuthenticated()==false){
            res.json({status: '500 Server error', error: "Unauthorized User!"});
        }

        // var filterSentBy = decodeURIComponent(req.query["username"]);
        if (encryptionFlag == true){
            var filterSentBy = rot47(req.query["username"]);
        } else{
            var filterSentBy = req.query["username"];
        }
        // Get records only for the username provided in the URL
        if(filterSentBy!=null)
        {
            var userQuery = Users.find()
                .where('UserName').equals(filterSentBy);
        }
        else {
            // Else, Get all users in the database if username not provided in the URL
            var userQuery = Users.find();
        }
        userQuery.exec(function (err, items) {
            if (!err) {

                return res.send(items); // return all users in JSON format
            }
            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            else {
                res.json(send({status: '500 Server error', error: err}));
            }

        });

    });


    // Generalized and Parameterized Get URL for the Invites collection
    //   All New Invites sent to register	                : /tripster/new_invites
    //   Filter by Invites Sent By			                : /tripster/new_invites?sent_by=user_1@tripster.com
    //   Filter by Invites Sent To (received by this user)	: /tripster/new_invites?sent_to=user_4@tripster.com

    app.get('/tripster/new_invites', function (req, res) {

        if (req.isAuthenticated()==false){
            res.json({status: '500 Server error', error: "Unauthorized User!"});
        }

        if (encryptionFlag == true){
            var filterSentBy = rot47(req.query["sent_by"]);
            var filterSentTo = rot47(req.query["sent_to"]);
        } else{
            var filterSentBy = req.query["sent_by"];
            var filterSentTo = req.query["sent_to"];
        }



        if(filterSentBy!=null && filterSentTo==null)
        {
            var getInvites = new_invites.find()
                .select('Invites -_id')
                .where('UserName').equals(filterSentBy);
        }
        else if(filterSentTo!=null && filterSentBy==null){
            var getInvites = new_invites.find()
                .select('UserName -_id')
                .where('Invites').equals(filterSentTo);
        }
        else {
            var getInvites = new_invites.find()
                .select('UserName Invites -_id');
        }

        getInvites.exec(function (err, items) {
            if (!err) {

                return res.send(items); // return all users in JSON format
            }
            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            else {
                res.json(send({status: '500 Server error', error: err}));
            }

        });
    });

    // Generalized and Parameterized Get URL for the Invites collection
    //   Filter by Invited & Destination    : /tripster/plan?invited=user_1@tripster.com?destination=India
    //   Filter by Createdby & Destination	: /tripster/plan?created_by=user_1@tripster.com?destination=India
    //   Filter by Createdby	    		: /tripster/plan?created_by=user_1@tripster.com
    //   Filter by Destination 	            : /tripster/plan?destination=brazil
    //   Filter by Invited person 	        : /tripster/plan?invited=brazil
    //   All Plans            	            : /tripster/plan

    app.get('/tripster/plan', function(req, res){


        if (req.isAuthenticated()==false){
            res.json({status: '500 Server error', error: "Unauthorized User!"});
        }

        if (encryptionFlag == true){
            var filterCreatedBy= rot47(req.query["created_by"]);
            var filterDestination= rot47(req.query["destination"]);
            var filterInvited= rot47(req.query["invited"]);

        } else{
            var filterCreatedBy= req.query["created_by"];
            var filterDestination= req.query["destination"];
            var filterInvited= req.query["invited"];
        }


        if (filterDestination != null && filterInvited != null)
        {
            var getPlans = Plan.find()
                //.select('CreatedBy -_id')
                .where('InvitedPeople').equals(filterInvited)
                .where('Destination').equals(filterDestination);
        }
        else if (filterCreatedBy != null && filterDestination != null )
        {
            var getPlans = Plan.find()
                //.select('CreatedBy -_id')
                .where('CreatedBy').equals(filterCreatedBy)
                .where('Destination').equals(filterDestination);
        }
        else if(filterCreatedBy != null)
        {
            var getPlans = Plan.find()
                //.select('CreatedBy -_id')
                .where('CreatedBy').equals(filterCreatedBy);
        }
        else if(filterDestination != null){
            var getPlans = Plan.find()
                //.select('CreatedBy -_id')
                .where('Destination').equals(filterDestination);
        }
        else if(filterInvited != null){
            var getPlans = Plan.find()
                //.select('CreatedBy -_id')
                .where('InvitedPeople').equals(filterInvited);
        }
        else
        {
            var getPlans = Plan.find()
            //.select('CreatedBy -_id')
        }
        getPlans.exec(function (err, items) {
            if (!err) {
                console.log("res: "+res)
                return res.send(items); // return all users in JSON format
            }
            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            else {
                res.json(send({status: '500 Server error', error: err}));
            }

        });
    });


    app.post('/tripster/savePlan', function (req, res) {

        if (req.isAuthenticated()==false){
            res.json({status: '500 Server error', error: "Unauthorized User!"});
        }

        Plan.create({
            Name : req.body.Name,
            CreatedBy : req.body.CreatedBy,
            Destination : req.body.Destination,
            Description : req.body.Description,
            InvitedPeople : req.body.Invites,
            StartDate : req.body.StartDate,
            EndDate : req.body.EndDate

        }, function (err, todo) {
            if (err)
                res.send(err);

            // get and return all the todos after you create another
            Todo.find(function (err, plan) {
                if (err)
                    res.send(err)
                res.json(plan);
            });
        });

    });


    app.post('/tripster/uploadPicture', function(req, res, next) {

        if (req.isAuthenticated()==false){
            res.json({status: '500 Server error', error: "Unauthorized User!"});
        }

        if (encryptionFlag == true){
            var uploadUser= rot47(req.query["uploadUser"]);
        } else{
            var uploadUser= req.query["uploadUser"];
        }

        if (uploadUser==null){
            uploadUser='unowned'
        }

        //console.log(req.body);
        //console.log(req.files);

        var tmp_path = req.files.image.path;
        // set where the file should actually exists

        var target_dir = './public/userdata/'

        target_dir+=uploadUser+'/profile_photo/'
        //console.log("Target dir : "+target_dir)

        fs.ensureDir(target_dir, function (err) {
            if (err){
                console.log(err) // => null
                res.json(send({status: '500 Server error', error: err}));
            }
            // dir has now been created, including the directory it is to be placed in

            var target_path = target_dir + uploadUser +'_'+ req.files.image.name;
            fs.rename(tmp_path, target_path, function(err) {
                if (err) throw err;
                // delete the temporary file, so that the explicitly set temporary upload dir does not get filled with unwanted files
                fs.unlink(tmp_path, function() {
                    if (err) throw err;
                });

                res.set('Access-Control-Allow-Origin', '*');


                var conditions = {'UserName':uploadUser}
                var update = {ProfilePictureID:req.files.image.name, ProfilePicturePath: target_path, $push: {'AllProfilePictures':target_path }, UpdatedTimeStamp:new Date() }
                var options = {safe: true, upsert: false}
                var callback = function(err, model) {
                    if(err){
                        res.json(send({status: '500 Server error', error: err}));
                    }
                    var users = Users.findOne()
                        .select('ProfilePicturePath -_id')
                        .where('UserName').equals(uploadUser);
                    users.exec(function (err, path) {
                        if (!err) {
                            return res.send(path); // return all users in JSON format
                        }
                        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
                        else {
                            res.json(send({status: '500 Server error', error: err}));
                        }
                    });
                }
                Users.findOneAndUpdate(conditions, update, options, callback);

                // Code to be written for Group Picture Upload
                /*                Picture.create({
                 PictureID 	: req.files.image.name,
                 PictureOrigName : req.files.image.originalname,
                 PicturePath : target_path,
                 //img: { data: fs.readFileSync(req.body.imagePath), contentType: req.body.contentType},
                 //img: { data: fs.readFileSync(image_info.path).toString("base64"), contentType: image_info.mimeType},
                 CreatedTimeStamp: new Date(),
                 UpdatedTimeStamp: new Date()

                 }, function (err ) {
                 if (err)
                 res.send(err);
                 else {
                 var picQuery = Picture.find()
                 .where('PictureID').equals(req.files.image.name);
                 picQuery.exec(function (err, picture) {
                 if (!err) {
                 return res.send(picture[0].PicturePath); // return all users in JSON format
                 }
                 // if there is an error retrieving, send the error. nothing after res.send(err) will execute
                 else {
                 res.json(send({status: '500 Server error', error: err}));
                 }

                 });

                 }
                 });*/

            });
        });

    });


    app.get('/tripster/uploadPicture', function (req, res) {
        if (req.isAuthenticated()==false){
            res.json({status: '500 Server error', error: "Unauthorized User!"});
        }

        var getPhoto = Picture.find()
        //.select('UserName Invites -_id');

        getPhoto.exec(function (err, items) {
            if (!err) {

                return res.send(items); // return all users in JSON format
            }
            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            else {
                res.json(send({status: '500 Server error', error: err}));
            }

        });

    });



    app.get('/tripster/notifications', function (req, res) {

//        res.json(JSON.stringify(req.session))
        console.log(req.isAuthenticated())
        if (req.isAuthenticated()==false){
            res.json({status: '500 Server error', error: "Unauthorized User!"});
        }

        if (!req.session.userObject || !req.session.userObject.UserName) {
            res.json({status: '500 Server error', error: "Unauthorized User!"});
        }
        else{
            var username = req.session.userObject.UserName
            console.log("Checking notifications for :"+username)

            var getNotifications = notifications.find()
                .select('-_id')
                .where('UserName').equals(username)
                .limit(20)
                .sort('-CreatedTimeStamp');

            getNotifications.exec(function (err, items) {
                if (!err) {
                    return res.send(items); // return all users in JSON format
                }
                // if there is an error retrieving, send the error. nothing after res.send(err) will execute
                else {
                    res.json(send({status: '500 Server error', error: err}));
                }

            });


        }
    });

    app.post('/tripster/notifications', function (req, res) {

        res.set('Access-Control-Allow-Origin', '*');

        if (req.isAuthenticated()==false){
            res.json({status: '500 Server error', error: "Unauthorized User!"});
        }

        if (req.body.UserName != null) {
            // create a user, information comes from AJAX request from Angular
            notifications.create({
                UserName: req.body.UserName,
                notificationMsg: req.body.notificationMsg,
                CreatedTimeStamp: new Date()
            }, function (err, user) {
                if (err) {
                    res.send(err);
                }
                res.send(true)
            });
        }
        else {
            res.json({status: '500 Server error', error: 'UserName not specified'});
        }

    });

    // create user and send back all users after creation
    app.post('/tripster/users', function (req, res) {

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
            Friends: req.body.Friends,
            CreatedTimeStamp: req.body.CreatedTimeStamp,
            UpdatedTimeStamp: req.body.UpdatedTimeStamp
        }, function (err, user) {
            if (err){
                res.send(err);
            }
            if (inviteSentBy==null){
                res.send(true)
            }
        });

        if (encryptionFlag == true){
            var inviteSentBy = rot47(req.query["invited_by"]);

        } else{
            var inviteSentBy = req.query["invited_by"];
        }

        if(inviteSentBy!=null){
            var conditions = {'UserName':inviteSentBy}
            var update = {$push: {'Friends':req.body.UserName }, UpdatedTimeStamp:new Date() }
            var options = {safe: true, upsert: false}
            var callback = function(err, model) {
                if (err){
                    console.log("Error: "+ err);
                    res.send(err);
                }
                res.send(true)
            }
            Users.findOneAndUpdate(conditions, update, options, callback);

        }



    });


    app.get("/logout",function(req,res){
        req.session.destroy(function(){
            res.redirect("/");
        });
    });

    app.post('/tripster/login',
        passport.authenticate('user-login', {
            failureRedirect: '/views/login.html',
            failureFlash: true // allow flash messages
        }),
        function(req, res) {
            //req.flash('userInfo',res.req.user)
            req.session.userObject = res.req.user;
            res.redirect('/views/profile.html');
        });


    app.get('/flash', function(req, res){
        res.send(JSON.stringify(req.flash()));
    });

    // api DONE---------------------------------------------------------------------
    // get all todos
    app.get('/tripster/todos', function (req, res) {

        if (req.isAuthenticated()==false){
            res.json({status: '500 Server error', error: "Unauthorized User!"});
        }
        // use mongoose to get all todos in the database
        Todo.find(function (err, todos) {

            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.send(err)

            res.json(todos); // return all todos in JSON format
        });
    });

    // create todo and send back all todos after creation --- DONE
    app.post('/tripster/todos', function (req, res) {

        if (req.isAuthenticated()==false){
            res.json({status: '500 Server error', error: "Unauthorized User!"});
        }


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

    // delete a todo  --- DONE
    app.delete('/tripster/todos/:todo_id', function (req, res) {
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
    // application --DONE -------------------------------------------------------------
    app.get('/', function (req, res) {
        res.sendfile('./public/views/login.html'); // load the single view file (angular will handle the page changes on the front-end)
    });

    app.use(function(req, res, next){
        res.status(404);

        // respond with html page
        if (req.accepts('html')) {
            /*          res.sendfile('404', { url: './public/views/404.html' });*/
            res.status(404).sendfile('./public/views/404.html');
            /*res.render('404', { url: req.url });*/
            return;
        }

        // respond with json
        if (req.accepts('json')) {
            res.send({ error: 'Not found' });
            return;
        }

        // default to plain-text. send()
        res.type('txt').send('Not found');
    });

    // Encryption algorithm
    function rot47(x)
    {
        if (x==null){
            return null;
        }
        var s = [];
        for (var i = 0; i < x.length; i ++)
        {
            var j = x.charCodeAt(i);
            if ((j >= 33) && (j <= 126))
            {
                s[i] = String.fromCharCode(33 + ((j + 14) % 94));
            }
            else
            {
                s[i] = String.fromCharCode(j);
            }
        }
        return s.join('');
    }
};