const mongoose = require('mongoose')
const { Schema } = mongoose


const userSchema = new Schema({

    tittle: {
        type: String,
        required: true,
    },

    description: {
        type: String,
        required: true,
    },
    difficulty: {
        type: String,
        enum: ["easy", 'medium', 'hard'],
        required: true,
    },
    tags: {
        type: String,
        enum: ["array", 'LinkedList', 'graph', 'dp'],
        required: true,
    },
    visibleTestCases: [
        {
            input: {
                type: String,
                required: true,
            },
            output: {
                type: String,
                required: true,
            },
            explanation: {
                type: String,
                required: true,
            },
        }
    ]
    ,
    hiddenTestCases: [
        {
            input: {
                type: String,
                required: true,
            },
            output: {
                type: String,
                required: true,
            },

        }
    ]
    ,
    startCode: [
        {
            language: {
                type: String,
                required: true,
            },
            initialCode: {
                type: String,
                required: true,
            },

        }
    ]
    ,
    problemCreator: {
        type: Schema.Types.ObjectId,  // to give the user ID
        ref: "user",
        required: true,
    },
  
    referenceSolution: [{
        language: {
            type: String,
            required: true,
        },
        completeCode: {
            type: String,
            required: true,
        },

    }]




}, { timestamps: true })

const problem = mongoose.model("problem", userSchema)
module.exports = problem

