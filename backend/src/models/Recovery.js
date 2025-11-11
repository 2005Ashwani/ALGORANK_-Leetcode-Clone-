const mongoose = require('mongoose')
const { Schema } = mongoose


const userSchema = new Schema({

    oldPassword: {
        type: String,
        required: true,
    },

    newPassword: {
        type: String,
        required: true,
    },




}, { timestamps: true })

const Recovery = mongoose.model("Recovery", userSchema)
module.exports = Recovery