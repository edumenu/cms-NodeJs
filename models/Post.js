
// Created by: Edem Dumenu
// Date: 4/2/2018
// Description: This page contains schema for our Post models


const mongoose = require('mongoose');
//Schema for the data
const Schema = mongoose.Schema;
//Defining the schema for our data
//Creating a new instance of a schema
//title: this is the title of the post
const PostSchema = new Schema({
    // user: {
    //
    // },
    category: {
        type: Schema.Types.ObjectId,    //This allows us to enter the ID of that specific model/document
        ref: 'categories'      //referencing the categories collection
    },
    title:{
        type: String,
        required: true
    },
    // slug: {
    //     type: String
    // },
    status:{
        type: String,
        default: 'public'
    },
    allowComments:{
        type: Boolean,
        require: true
    },
    body:{
        type: String,
        require: true
    },
    file:{
        type: String,
    },
    date: {
        type: Date,
        default: Date.now()
    }
    // comments: [{
    //     type: Schema.Types.ObjectId,
    //     ref: 'comments'
    // }]
});

//Defining the name of the model and passing in the schema object
//Exporting the schema to be used by the application
module.exports = mongoose.model('posts', PostSchema);