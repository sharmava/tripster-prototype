var mongoose = require('mongoose');

var schema = mongoose.Schema({
    UserName 	: String,
    Invites 	: [String],
    CreatedTimeStamp: { type: Date, default:Date.now },
    UpdatedTimeStamp: { type: Date, default:Date.now }
});

module.exports = mongoose.model('new_invites', schema, 'new_invites');
