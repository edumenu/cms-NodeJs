//Created by: Edem Dumenu
//Date: 3/19/2018
//Description: This page handles  routes for admin pages

const express = require('express');
const router = express.Router();  //Creating a router for our endpoints
const Post = require('../../models/Post');  //Requiring a new post instance
const faker = require('faker');
// const {userAthenticated} = require('../../helpers/authentication');

router.all('/*',(req, res, next)=>{ //**Overriding default home page** Handling all routes after the admin in the header
    req.app.locals.layout = 'admin';   //Changing the default layout to admin
    next();    //Next is used ot execute this function and then move to other routes
});

//Route the to root
router.get('/', (req, res)=>{

    res.render('admin/index');
});

//Generating fake posts for the main admin page
router.post('/generate-fake-post', (req, res)=>{
    //Creating fake posts based on the number the user inputs on main admin page
    for(let i = 0; i < req.body.amount; i++){
        //Creating a new instance of post
        let post = new Post();
        //Assigning fake data to the variables to be sent to the database
        post.title = faker.name.title();
        post.status = 'public';
        post.allowComments = faker.random.boolean();
        post.body = faker.lorem.sentence();
        post.slug = faker.name.title();
        post.save(function(err){
            if (err) throw err;
        });
    }
    //Redirecting the main page
    res.redirect('/admin/posts');
});

module.exports = router;