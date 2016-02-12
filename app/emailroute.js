

var express  = require('express');
var app      = express(); 								// create our app w/ express
var mongoose = require('mongoose');

module.exports = function (app, passport) {

    //    Generalized and Parameterized Get URL for the Users collection
    //    Get All Users 			: /tripster/users
    //    Filter by username		: /tripster/users?username=user_1@tripster.com

    var fs = require('fs');


    var sendgrid_username   = 'rohisasi';
    var sendgrid_password   = 'tripster1';

    var sendgrid   = require('sendgrid')(sendgrid_username, sendgrid_password);
    var email      = new sendgrid.Email();

    var srcPath = 'email.txt';


    var data1;

/*fs.readFile('email.txt', "utf8", function(error, data) {
 console.log(data+"DEBUG CHECKKING");
 data1 =data;
 console.log(data1+"DEBUG CHECKKING after Assigning");
 });*/


 fs.exists(srcPath, function (exists) {
  if (exists) {
   fs.stat(srcPath, function (error, stats) {
    fs.open(srcPath, "r", function (error, fd) {
     var buffer = new Buffer(stats.size);

     fs.read(fd, buffer, 0, buffer.length, null, function (error, bytesRead, buffer) {
      var data = buffer.toString("utf8", 0, buffer.length);
      //console.log(data);
      //console.log(data+"DEBUG CHECKKING");

      data1 = data;
      //console.log(data1+"DEBUG CHECKKING after Assigning");
      fs.close(fd);
        });
      });
    });
   }
 });


 app.post('/email', function(req, res) {


 var datatest= 'heheheheheh';
 email.addTo(req.body.to);
 email.setFrom(req.body.from);
 console.log(req.body.from + "is from post in login")
 email.setSubject(req.body.subject);
 console.log(req.body.subject + "In route-debuggin");
 // email.setText(data1);
 email.setText(data1+ '\n' + req.body.content);
 email.addHeader('X-Sent-Using', 'SendGrid-API');
 email.addHeader('X-Transport', 'web');

 sendgrid.send(email, function(err, json) {
 if (err) {
 return res.send("Problem Sending Email!!!!");
         }
   console.log(json);
   res.send("Email Sent OK!!!!");
   });
 });



 };