// Created by: Edem Dumenu
// Date: 4/17/2018
// Description: This page contains schema for user's comments

const mongoose = require('mongoose');
//Schema for the data
const Schema = mongoose.Schema;

//Defining the schema for our data
//Creating a new instance of a schema
const CommentSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    body:{
        type: String,
        required: true
    },
    approveComment:{
        type: Boolean,
        default: false
    },
    date: {
        type: Date,
        default: Date.now()
    }
});

//Defining the name of the model and passing in the schema object
//Exporting the schema to be used by the application
//comments: table name
module.exports = mongoose.model('comments', CommentSchema);
