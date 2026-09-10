const mongoose = require("mongoose");

const testCaseSchema = new mongoose.Schema({
    input: { type: String, required: true },
    expectedOutput: { type: String, required: true },
    visible: { type: Boolean, default: false }
});

const questionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        required: true,
    },
    inputFormat: {
        type: String,
        required: true,
    },
    outputFormat: {
        type: String,
        required: true,
    },
    constraints: {
        type: String,
        required: true,
    },
    sampleInput: {
        type: String,
        required: true,
    },
    sampleOutput: {
        type: String,
        required: true,
    },
    testCases: [testCaseSchema],
    timeLimit: {
        type: Number,
        default: 2 // seconds
    },
    memoryLimit: {
        type: Number,
        default: 128000 
    },
    allowedLanguages: {
        type: [String], 
        default: ["cpp", "java", "python"] 
    },
    tags: {
        type: [String],
        default: []
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const questionModel = mongoose.model("question", questionSchema);
module.exports = questionModel;