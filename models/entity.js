const mongoose = require('mongoose');

const entitySchema = new mongoose.Schema({
    teamName: {
        type: String,
        required: true,

    },
    teamNumber: {
        type: Number,
        required: true,
    },
    kpiAttribute: {
        type: String,
        required: true,
    },
    kpiName: {
        type: String,
        required: true,
    },
    value: {
        type: String,
        required: true,
    }

});

entitySchema.virtual('id').get(function () {
    return this._id.toHexString();
});

entitySchema.set('toJSON', {
    virtuals: true,
});

exports.Kpi = mongoose.model('Entity', entitySchema);
exports.entitySchema = entitySchema;