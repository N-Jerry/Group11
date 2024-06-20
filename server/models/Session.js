const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const recordSchema = new Schema({
    status: {
        type: String,
        enum: ['present', 'absent'],
        required: true
    },
    student: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

const sessionSchema = new Schema({
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    deadline: {
        type: Date,
        required: true,
        default: function() {
            return new Date(Date.now() + 5 * 60 * 1000); // 5 minutes after the current date
        }
    },
    location: {
        type: String,
        required: true
    },
    course: {
        type: Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    records: {
        type: [recordSchema],
        default: []
    }
});

sessionSchema.pre('save', function(next) {
    if (this.isModified('date')) {
        this.deadline = new Date(this.date.getTime() + 5 * 60 * 1000);
    }
    next();
});

const Session = mongoose.model('Session', sessionSchema);

module.exports = Session;