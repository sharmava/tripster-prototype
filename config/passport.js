var Users = require('./../app/models/users');
var LocalStrategy   = require('passport-local').Strategy;

module.exports = function (app, passport) {

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function (id, done) {
        Users.findById(id, function (err, user) {
            done(err, user);
        });
    });

    passport.use('user-login', (new LocalStrategy( function (username, password, done) {
        console.log(username);
        process.nextTick(function () {
            Users.findOne({'UserName': username}, function (err, user) {
                if (err)
                    return done(err);

                if (!user)
                    return done(null, false, { message : 'Incorrect Username'});

                if (user.Password != password){
                    //alert("Wrong Password!!");
                    return done(null, false, { message : 'Incorrect Password'});
                }
                return done(null, user);
            });
        });
    })));
};