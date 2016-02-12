var mongoose = require('mongoose');

var schema = mongoose.Schema({
    FirstName 	: String,
    LastName	: String,
    UserName 	: String,
    Password 	: String,
    DoB 		: { type: Date, default:Date.now },
    Phone 		: Number,
    Address 	: String,
    City 		: String,
    State 		: String,
    Country 	: String,
    Friends     : [String],
    ProfilePictureID: String,
    ProfilePicturePath : String,
    AllProfilePictures : [String],
    CreatedTimeStamp: { type: Date, default:Date.now },
    UpdatedTimeStamp: { type: Date, default:Date.now }
});

module.exports = mongoose.model('Users', schema, 'users');
