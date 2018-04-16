//Created by: Edem Dumenu
//Date: 4/2/2018
//Description: This page handles routes for home pages

const express = require('express');
const router = express.Router();  //Creating a router for our endpoints
const Post = require('../../models/Post');   //Including Post model
const Category = require('../../models/Category');   //Including Category model
const User = require('../../models/User');   //Including User model
const bcrypt = require('bcryptjs');     //Including bcrypt. Encryption for passwords

router.all('/*',(req, res, next)=>{ //**Overriding default home page** Handling all routes after the root in the header
    req.app.locals.layout = 'home';    //Changing the default layout variable to home
    next();    //Next is used ot execute this function and then move to other routes
});

//Route the to root
router.get('/', (req, res)=>{
    //Displaying all the posts from the database
    Post.find({}).then(posts=>{
        Category.find({}).then(categories=>{
            res.render('home/index', {posts: posts, categories: categories});
        });
    }).catch(noPost=>{
        alert('There are no posts. Error: ' + noPost);
    });
});
//Route to the about page
router.get('/about', (req, res)=>{
    res.render('home/about');
});
//Route to the login page
router.get('/login', (req, res)=>{
    res.render('home/login');
});
//Route to the register page
router.get('/register', (req, res)=>{
    res.render('home/register');
});
//Post requires fro registration page
router.post('/register', (req, res)=>{
    let errors = [];

    // if(!req.body.firstName) {
    //     errors.push({message: 'please enter your first name'});
    // }
    //
    // if(!req.body.lastName) {
    //     errors.push({message: 'please add a last name'});
    // }
    //
    // if(!req.body.email) {
    //     errors.push({message: 'please add an email'});
    // }
    //
    // if(!req.body.password) {
    //     errors.push({message: 'please enter a password'});
    // }
    //
    // if(!req.body.passwordConfirm) {
    //     errors.push({message: 'This field cannot be blank'});
    // }

    if(req.body.password !== req.body.passwordConfirm) {
        errors.push({message: "Password fields don't match"});
    }
    if(errors.length > 0){
        res.render('home/register', {
            errors: errors,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
        })
    }else{
        const newUser = new User({   //Instantiating a new User
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password,
        });

        //Salt: random string of characters generated with numbers
        //10: the number of rounds to use, defaults to 10 if omitted. The larger the number, the longer the time
        bcrypt.genSalt(10,(err,salt)=>{          //Function generates a salt
            bcrypt.hash(newUser.password, salt, (err, hash)=>{
                newUser.password = hash;
                newUser.save().then(savedUser=>{
                    req.flash('success_message', 'You are not registered, please login');
                    res.redirect('/login');
                });
            });
        });
    }
});
//Route for individual posts when read more is selected
router.get('/post/:id', (req, res)=>{
    //Retrieving the particular post from the database
    Post.findOne({_id: req.params.id}).then(post=>{
        Category.find({}).then(categories=>{
            res.render('home/post', {post: post, categories: categories});
        });
        // res.render('home/post', {post: posts});
    });
});

//Exporting the router to be utilized by the app.js
module.exports = router;