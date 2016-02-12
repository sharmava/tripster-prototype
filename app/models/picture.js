var mongoose = require('mongoose');

var schema = mongoose.Schema({
    PictureID 	: String,
    PictureOrigName : String,
    PicturePath : String,
    //img: { data: Buffer, contentType: String},
    CreatedTimeStamp: { type: Date, default:Date.now },
    UpdatedTimeStamp: { type: Date, default:Date.now }
});

module.exports = mongoose.model('Picture', schema, 'pictures');
