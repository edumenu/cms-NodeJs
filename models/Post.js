
// Created by: Edem Dumenu
// Date: 4/2/2018
// Description: This page contains schema for our Post models

const mongoose = require('mongoose');
//Including slugs for pretty urls
const URLSlugs = require('mongoose-url-slugs');
//Schema for the data
const Schema = mongoose.Schema;
//Defining the schema for our data
//Creating a new instance of a schema
//title: this is the title of the post
const PostSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    category: {
        type: Schema.Types.ObjectId,    //This allows us to enter the ID of that specific model/document
        ref: 'categories'      //referencing the categories collection
    },
    title:{
        type: String,
        required: true
    },
    slug: {      //Representation of some data
        type: String
    },
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
    },
    comments: [{                   //An array of comments IDs
        type: Schema.Types.ObjectId,
        ref: 'comments'
    }]
}, {usePushEach: true});   //This is a workaround for pushAll

//Plugins are used to add last modified functionality
PostSchema.plugin(URLSlugs('title', {field: 'slug'}));

//Defining the name of the model and passing in the schema object
//Exporting the schema to be used by the application
module.exports = mongoose.model('posts', PostSchema);