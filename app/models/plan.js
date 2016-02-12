var mongoose = require('mongoose');

var schema = mongoose.Schema({
    Name            : String,
    CreatedBy       : String,
    Destination 	: String,
    Description		: String,
    InvitedPeople 	: [String],
    StartDate		: { type: Date, default:Date.now },
    EndDate		    : { type: Date, default:Date.now },
    CreatedTimeStamp: { type: Date, default:Date.now },
    UpdatedTimeStamp: { type: Date, default:Date.now }
});

module.exports = mongoose.model('Plan', schema, 'plan');
