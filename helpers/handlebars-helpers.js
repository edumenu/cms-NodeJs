//Created by: Edem Dumenu
//Date: 4/5/2018
//Description: This page is used to create helper functions for the handlebars
const moment = require('moment');

module.exports = {
    //Creating a function called select
    select: function(selected, options){
        //Returning back the option tag with the specific status related to the post (selected)
        // with regular expressions
       return options.fn(this).replace(new RegExp('value=\"'+ selected + '\"'), '$&selected="selected"');
    },

    generateDate: function(date, format){
      return moment(date).format(format);
    }
};