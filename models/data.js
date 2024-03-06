const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    currentDate: {
        type: Date,
        required: true,
    },
    selectedDate: {
        type: Date,
        required: true,
    },
    formattedDate: {
        type: String,
        required: true,
    },
    addedBy: {
        type: String,
        required: true,
    },
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

dataSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

dataSchema.set('toJSON', {
    virtuals: true,
});

exports.Data = mongoose.model('Data', dataSchema);
exports.dataSchema = dataSchema;