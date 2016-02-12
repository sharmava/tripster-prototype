var mongoose = require('mongoose');

var schema = mongoose.Schema({
    UserName 	: String,
    notificationMsg : String,
    CreatedTimeStamp: { type: Date, default:Date.now }
});

module.exports = mongoose.model('notifications', schema, 'notifications');
