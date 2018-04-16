//Created by: Edem Dumenu
//Date: 4/7/2018
//Description: This page is used to create and export custom functions
const path = require('path');

module.exports = {
    //Goes to the directory of the file
    uploadDir: path.join(__dirname, '../public/uploads/'),
    isEmpty: function(obj){
        for(let key in obj){
            //hasOwnProperty() method returns a boolean indicating whether the object has the specified property as its own property
            if(obj.hasOwnProperty(key)){
                return false;
            }
        }
        return true;
    }

};