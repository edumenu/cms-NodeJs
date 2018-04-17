//Created by: Edem Dumenu
//Date: 4/2/2018
//Description: This page handles routes for posts


const express = require('express');
const router = express.Router();  //Creating a router for our endpoints
const Post = require('../../models/Post');   //Importing the post schema to be used
const Category = require('../../models/Category');   //Importing Category schema/model
const {isEmpty, uploadDir} = require('../../helpers/upload-helper');
const fs = require('fs');
// const {userAthenticated} = require('../../helpers/authentication');
// const path = require('path');

router.all('/*',(req, res, next)=>{ //**Overriding default home page** Handling all routes after the admin in the header
    req.app.locals.layout = 'admin';   //Changing the default layout to admin
    next();    //Next is used ot execute this function and then move to other routes
});
//Get request for user accessing the page
router.get('/',(req, res)=>{
    //Using the find function to retrieving all the posts from the database
    Post.find({})
        .populate('category')
        .then(posts=>{
        //Display the admin post page with the values from the post database
        //The first posts is an array that is going to contain all the posts
        res.render('admin/posts', {posts: posts});
    }).catch(error=>{
        console.log('Could not find any posts');
    });
});
//Get request for user accessing the create post page
router.get('/create',(req, res)=>{
    //Displaying all categories in the database to be displayed when creating a post
    Category.find({}).then(categories=>{
        res.render('admin/posts/create', {categories: categories}); //Passing in the vale when rendering the page
    });
});
//Post request for sending data with the form
router.post('/create',(req, res)=>{
    //Default image when image is not selected
    let filename = 'default.png';

    if(!isEmpty(req.files)){
        //Obtaining file object from the form
        let file = req.files.file;
        //Accessing the name property and concatenating it with the current time
        filename = Date.now() + '-' + file.name;
        //Function allows us to move file
        file.mv('./public/uploads/'+ filename, (err)=>{
            if(err) throw err;
        });
    }

    let allowComments = true;
    if(req.body.allowComments){
        allowComments = true;
    }else{
        allowComments = false;
    }
    //Obtaining data from each field of the form
    const newPost = new Post({
        title: req.body.title,
        status: req.body.status,
        allowComments: allowComments,
        body: req.body.body,
        category: req.body.category,
        file: filename
    });
    // console.log(req.body);

    //Redirect user when the post is saved
    newPost.save().then(savedPost=>{
        req.flash('success_message', `${savedPost.title} was successfully created!`);
        console.log(savedPost);
        res.redirect('/admin/posts')
    }).catch(error=>{
        console.log('could not save post');
    });
});
//Making a get request for edit to display the selected post's data
//:id = placeholder for data
router.get('/edit/:id', (req,res)=>{
    //Using the findOne function to retrieving the selected post id
    Post.findOne({_id: req.params.id}).then(post=>{
        //Display the post's data in the fields
        //The first posts is an array that is going to contain the posts
        //Displaying all categories in the database to be displayed when editing a post
        Category.find({}).then(categories=>{
            res.render('admin/posts/edit', {post: post, categories: categories}); //Passing in the vale when rendering the page
        });
        console.log(post);
    }).catch(error=>{
        console.log('Could not find the posts');
    });

});
//Put request to edit post with new data
router.put('/edit/:id', (req,res)=>{
    //Using the findOne function to search for the particular post
    Post.findOne({_id: req.params.id}).then(post=>{
        //Default image when image is not selected
        let filename = 'default.png';

        //Assigning the value of allowComments
        if(req.body.allowComments){
            allowComments = true;
        }else{
            allowComments = false;
        }
        //Storing the values
        post.title = req.body.title;
        post.status = req.body.status;
        post.allowComments = allowComments;
        post.body = req.body.body;
        post.category = req.body.category;

        if(!isEmpty(req.files)){
            //Obtaining file object from the form
            let file = req.files.file;
            //Accessing the name property and concatenating it with the current time
            filename = Date.now() + '-' + file.name;
            post.file = filename;
            //Function allows us to move file
            file.mv('./public/uploads/'+ filename, (err)=>{
                if(err) throw err;
            });
        }

        //Sending the new data to the database
        post.save().then(updatedPost=>{
            req.flash('success_message', `${updatedPost.title} was successfully updated!`);
            res.redirect('/admin/posts');
            console.log(updatedPost);
        });
    }).catch(error=>{
        console.log('Could not find the posts');
    });
});

//Delete request to delete selected Post
router.delete('/:id', (req, res)=>{
    Post.findOne({_id: req.params.id})
        .then(post=>{
            //Removes the deleted file from the directory
            fs.unlink(uploadDir + post.file, (err)=>{
                req.flash('success_message', `${post.title} was successfully deleted!`);
                post.remove();
                // req.flash('success_message', 'Post was successfully deleted');
                res.redirect('/admin/posts');
            });
        });
});

//Exporting the router to be utilized by the app.js
module.exports = router;
