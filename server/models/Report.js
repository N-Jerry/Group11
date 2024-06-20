const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reportSchema = new Schema({
    generatedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    reportType: {
        type: String,
        enum: ['pdf', 'excell'],
        default: 'pdf',
        required: true
    },
    generatedDate: {
        type: Date,
        default: Date.now
    },
    parameters: {
        type: Map,
        of: String,
        required: true
    },
    data: {
        type: Schema.Types.Mixed,
        required: true
    }
});

const Report = mongoose.model('Report', reportSchema);

module.exports = Report;
