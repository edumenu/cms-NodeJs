//Created by: Edem Dumenu
//Date: 4/16/2018
//Description: This page sets up the configuration for the mongodb connection

//Checking which environment before setting up a connection to the database
if(process.env.NODE_ENV === 'production'){
    module.exports = require('./prod-database');
}else{
    module.exports = require('./dev-database');
}