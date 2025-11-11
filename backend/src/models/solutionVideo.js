const mongoose = require('mongoose')
const { Schema } = mongoose;

const videoSchema = new Schema({
    problemId: {
        type: Schema.Types.ObjectId,
        ref: 'problem',
        required: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    cloudinaryPublicId: {
        type: String,
        required: true,
        unique: true,
    },

    secureUrl: {
        type: String,
        required: true,
    },
    thumbnailUrl: {
        type: String,
    },
    duration: {
        type: Number,
        required: true,
    },


    likes: {
        type: Number,
        default: 0,
    },
    dislikes: {
        type: Number,
        default: 0,
    },
    comments: [
        { type: String ,
        default: [],
         minLength: 2,
        maxLength: 200
        }
    ]



}, { timestamps: true })



const SolutionVideo = mongoose.model("solutionVideo", videoSchema)
module.exports = SolutionVideo
