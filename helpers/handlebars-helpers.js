//Created by: Edem Dumenu
//Date: 4/5/2018
//Description: This page is used to create helper functions for the handlebars
const moment = require('moment');

module.exports = {
    //Function selects an option obtain from the database
    select: function(selected, options){
        //Returning back the option tag with the specific status related to the post (selected)
        // with regular expressions
       return options.fn(this).replace(new RegExp('value=\"'+ selected + '\"'), '$&selected="selected"');
    },
    //generateDate formats the date
    generateDate: function(date, format){
      return moment(date).format(format);
    },
    //commentCounter return the number of comments
    commentCounter: function(comments){
      return comments.length;
    },
    //Function for pagination
    paginate: function (options) {
        let output = '';

        //First button for pagination
        //Checking to see if the current page is 1 to determine whether to disable the button  or not
        if(options.hash.current === 1){
            output += `<li class="page-item disabled"><a class="page-link">First</a></li>`;
        }else {
            output += `<li class="page-item"><a href="?page=1" class="page-link">First</a></li>`;
        }

        //Displaying dots when current page is more than 5
        //Returning a value when current page is greater or less than 5
        let i = (Number(options.hash.current) > 5 ? Number(options.hash.current) - 4 : 1);
        //Display the dots when i is over 5
        if(i !== 1){
            output += `<li class="page-item"><a class="page-link">...</a></li>`;
        }

        //Displaying the rest of the buttons with their page numbers
        //Number is a function
        for(; i <= (Number(options.hash.current) + 4) && i <= options.hash.pages; i++){
            //Make link active if it is the current page
            if(i === options.hash.current){
                output += `<li class="page-item active"><a class="page-link">${i}</a></li>`;
            }else{
                //If not equal to current, create links to each page
                output += `<li class="page-item"><a href="?page=${i}" class="page-link">${i}</a></li>`;
            }
            if(i === Number(options.hash.current) + 4 && i < options.hash.pages){
                output += `<li class="page-item"><a class="page-link">...</a></li>`;
            }
        }
        //Last button for pagination
        if(options.hash.current === options.hash.pages){
            output += `<li class="page-item disabled"><a class="page-link">Last</a></li>`;
        }else{
            output += `<li class="page-item"><a href="?page=${options.hash.pages}" class="page-link">Last</a></li>`;
        }
        return output;
    }
};