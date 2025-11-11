const mongoose = require('mongoose')
const { Schema } = mongoose


const userSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    problemId: {
        type: Schema.Types.ObjectId,
        ref: 'problem',
        required: true
    },
    code: {
        type: String,
        required: true,
        ref: 'user',
    },
    language: {
        type: String,
        required: true,
    },
    language: {
        type: String,
        required: true,
        enum: ['javascript', 'c++', 'Java']
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'wrong', 'error'],
        default: 'pending'
    },
    runtime: {
        type: Number,    // millisecond
        default: 0
    },
    memory: {
        type: Number, // KB
    },
    errorMessage: {
        type: String,
        default: '',
    },
    testCasePassed: {
        type: Number,
        default: 0
    },
    testCaseTotal: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

// submissionSchema.index({ userId: 1, problemId: 1 }, { unique: true });

const submission = mongoose.model("submission", userSchema)
module.exports = submission


