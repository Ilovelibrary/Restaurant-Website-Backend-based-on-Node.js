const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var leaderSchema = new Schema ({
    name: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String,
        required: true
    },
    designation: {
        type: String,
        required: true
    },
    abbr: {
        type: String,
        requied: true
    },
    description: {
        type: String,
        requied: true
    },
    featured: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
    usePushEach: true
});

var Leaders = mongoose.model('Leader', leaderSchema);

module.exports = Leaders;