
// Created by: Edem Dumenu
// Date: 4/13/2018
// Description: This page contains schema for our categories models


const mongoose = require('mongoose');
//Schema for the data
const Schema = mongoose.Schema;
//Defining the schema for our data
//Creating a new instance of a schema
//title: this is the title of the post
const CategorySchema = new Schema({
    name:{
        type: String,
        required: true
    }
});

//Defining the name of the model and passing in the schema object
//Exporting the schema to be used by the application
//categories: table name
module.exports = mongoose.model('categories', CategorySchema);