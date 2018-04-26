//Created by: Edem Dumenu
//Date: 4/17/2018
//Description: This page handles routes for comments

const express = require('express');
const router = express.Router();  //Creating a router for our endpoints
const Post = require('../../models/Post');     //Including the Post model
const User = require('../../models/User');     //Including the Post model
const Comment = require('../../models/Comment');    //Including the comment model

router.all('/*',(req, res, next)=>{ //**Overriding default home page** Handling all routes after the admin in the header
    req.app.locals.layout = 'admin';   //Changing the default layout to admin
    next();    //Next is used ot execute this function and then move to other routes
});
//Get request for the root file "index" in the comments directory
router.get('/', (req, res)=>{
    //Using the find function to retrieving all the comments from the database
    Comment.find({user: req.user.id}).populate('user')
        .then(comments=>{
            //Display the comments page with the values from the post database
            //The first comments is an array that is going to contain all the comments
        res.render('admin/comments', {comments: comments});     //Render the comment page
        })
});

//Router for post comments
router.post('/', (req,res)=>{
    //Finding the id for the post being commented on
    Post.findOne({_id: req.body.id}).then(post=>{
        //Creating a new comment instance
       const newComment = new Comment({
           user: req.user.id,        //Obtaining the user id through sessions
           body: req.body.body,      //Obtaining the content of the comment
       });
       post.comments.push(newComment);      //Pushing the comment into the comments array contained in each Post
        post.save().then(savedPost=>{       //Saving the comment into the post collection
            newComment.save().then(savedComment=>{      //Saving the comment in the comment collection
                req.flash('success_message',`Your comment will be reviewed in a second!`);
                res.redirect(`/post/${post.id}`);
            })
        });
    });
});

//Delete request to delete selected comment
router.delete('/:id', (req, res)=>{
    Comment.remove({_id: req.params.id})
        .then(deleteItem=>{
            Post.findOneAndUpdate({comments: req.params.id}, {$pull: {comments: req.params.id}}, (err,data)=>{  //Removing the comment ID from the database. $Pull data from array
                if(err) console.log(err);
                req.flash('success_message',`Comment was successfully deleted!`);
                // req.flash('success_message', 'Post was successfully deleted');
                res.redirect('/admin/comments');
            });
        });
});

//An end point for the approve comment ajax request
router.post('/approve-comment', (req,  res)=>{
    //Find and update the comment selected. Either to true or false
   Comment.findByIdAndUpdate(req.body.id, {$set: {approveComment: req.body.approveComment}}, (err, result)=>{
       if(err) return err;
       res.send(result);
    });
});
//Exporting module
module.exports = router;