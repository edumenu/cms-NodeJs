//Created by: Edem Dumenu
//Date: 4/2/2018
//Description: This page handles routes for home pages

const express = require('express');
const router = express.Router();  //Creating a router for our endpoints
const Post = require('../../models/Post');   //Including Post model
const Category = require('../../models/Category');   //Including Category model
const Comment = require('../../models/Comment');   //Including Category model
const User = require('../../models/User');   //Including User model
const bcrypt = require('bcryptjs');     //Including bcrypt. Encryption for passwords
const passport = require('passport');     //User authentication using passport.
const LocalStrategy = require('passport-local').Strategy;    //Strategy: passport-local for accessing local database

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

//Configuring a new LocalStrategy
//UsernameField: parameter used to find credentials. In this case, username is being override to use email instead
passport.use(new LocalStrategy({usernameField: 'email'}, (email, password, done)=>{
    User.findOne({email: email}).then(user=>{
        //Return message if user is not found
        if(!user) return done(null, false, {message: 'No user found'});
        //Comparing the user's password
        bcrypt.compare(password, user.password, (err, matched)=>{
            if(err) return err;

            if(matched){
                return done(null, user);
            }else{
                return done(null, false, {message: 'Incorrect password!'});
            }
        });
    });
}));
//SerializeUser: determines which data of the user object should be stored in the session
passport.serializeUser(function(user, done) {
    done(null, user.id);
});
//Retrieve the saved user id in the session
passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

//Route to log user into admin
//Passport: user authentication for users
router.post('/login', (req, res, next)=>{
    //Passport authentication
    passport.authenticate('local', {     //local: strategy

        successRedirect: '/admin',       //Redirect when user succeeds
        failureRedirect: '/login',      //Redirect when user fails to login
        failureFlash: true              //flash message

    })(req, res, next);

});

router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/login');
});

//Route to the register page
router.get('/register', (req, res)=>{
    res.render('home/register');
});
//Post requires fro registration page
router.post('/register', (req, res)=>{
        User.findOne({email: req.body.email}).then(user=>{
        if(!user){
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
                        req.flash('success_message', 'You are now registered, please login');
                        res.redirect('/login');
                    });
                });
            });
        }else{
            req.flash('error_message', 'That email already exists! Please login');
            res.redirect('/login');
        }
    });
});
//Route for individual posts when read more is selected
router.get('/post/:id', (req, res)=>{
    //Retrieving the particular post from the database
    Post.findOne({_id: req.params.id})
        .populate('user')
        .populate({path: 'comments', populate: {path: 'user', model: 'users'}})       //Obtaining comments and user from database
        .then(post=>{
       //Obtaining categories
        Category.find({}).then(categories=>{
            res.render('home/post', {post: post, categories: categories});
        });
    });
});

//Exporting the router to be utilized by the app.js
module.exports = router;