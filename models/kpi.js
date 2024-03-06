const mongoose = require('mongoose');

const kpiSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true

    },
    attribute: {
        type: String,
        required: true,
        unique: true  
    }

});

kpiSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

kpiSchema.set('toJSON', {
    virtuals: true,
});

exports.Kpi = mongoose.model('Kpi', kpiSchema);
exports.kpiSchema = kpiSchema;