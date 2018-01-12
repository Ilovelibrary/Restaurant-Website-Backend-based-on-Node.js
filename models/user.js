var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
    admin:   {
        type: Boolean,
        default: false
    }
}, {
    usePushEach: true
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);