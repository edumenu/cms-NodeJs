
// Created by: Edem Dumenu
// Date: 4/15/2018
// Description: This page contains schema for our user models


const mongoose = require('mongoose');
//Schema for the data
const Schema = mongoose.Schema;
//Defining the schema for our data
//Creating a new instance of a schema
//title: this is the title of the post
const UserSchema = new Schema({
    firstName:{
        type: String,
        required: true
    },
    lastName:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    }
});

//Defining the name of the model and passing in the schema object
//Exporting the schema to be used by the application
//users: table name
module.exports = mongoose.model('users', UserSchema);