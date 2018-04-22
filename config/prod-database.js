//Created by: Edem Dumenu
//Date: 4/22/2018
//Description: This page sets up the configuration for the mongodb connection in mlab in the production environment

module.exports = {
    mongoDbUrl: process.env.MONGO_DB_URI    //Url for the database in mlab

};