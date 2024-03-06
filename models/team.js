const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true

    },
    number: {
        type: Number,
        required: true,
        unique: true  
    }

});

teamSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

teamSchema.set('toJSON', {
    virtuals: true,
});

exports.Team = mongoose.model('Team', teamSchema);
exports.teamSchema = teamSchema;